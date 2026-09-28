// submit-lead — Herkese açık landing page formundan lead kaydı (verify_jwt = false).
//
// Sözleşme: supabase/SECURITY_CONTRACT.md
//   POST { fullName, email, phone, website (honeypot, boş olmalı) }
//   200 { ok: true }  — yeni kayıt, mükerrer e-posta ve dolu honeypot için AYNI yanıt
//   400 { ok: false, error: "invalid_input" }
//   429 { ok: false, error: "rate_limited" }
//   500 { ok: false, error: "server_error" }
//
// Güvenlik notları:
//   * anon rolünün bots_leads'e doğrudan erişimi YOKTUR; yazma yalnızca buradan,
//     service role ile yapılır. Service role anahtarı Edge Runtime'da otomatik
//     tanımlı SUPABASE_SERVICE_ROLE_KEY ortam değişkenindedir; asla loglanmaz.
//   * Mükerrer kontrolü sunucuda yapılır ve yanıt farklılaşmaz (e-posta var/yok sızmaz).
//   * Hız sınırı: IP (x-forwarded-for ilk değer) SHA-256 özeti ile 10 dakikada 5 gönderim.

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  handlePreflightAndMethod,
  jsonResponse,
  readJsonBody,
} from "../_shared/cors.ts";

const RATE_WINDOW_SECONDS = 600; // 10 dakika
const RATE_MAX = 5;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface LeadInput {
  fullName: string;
  email: string;
  phone: string;
  honeypot: boolean;
}

function validate(raw: unknown): LeadInput | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;

  if (
    typeof r.fullName !== "string" || typeof r.email !== "string" ||
    typeof r.phone !== "string"
  ) return null;
  if (r.website !== undefined && r.website !== null && typeof r.website !== "string") {
    return null;
  }

  // deno-lint-ignore no-control-regex
  const fullName = r.fullName.replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ").trim();
  if (fullName.length < 2 || fullName.length > 100) return null;

  const email = r.email.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return null;

  const phoneRaw = r.phone.trim();
  // Yalnızca rakam, boşluk, +, -, (, ) ve nokta kabul edilir.
  if (phoneRaw.length > 40 || !/^[0-9+\-().\s]+$/.test(phoneRaw)) return null;
  const digits = phoneRaw.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 20) return null;
  const phone = (phoneRaw.startsWith("+") ? "+" : "") + digits;

  const honeypot = typeof r.website === "string" && r.website.trim().length > 0;

  return { fullName, email, phone, honeypot };
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const first = xff.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip")?.trim() || "unknown";
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** ILIKE desenindeki özel karakterleri kaçırır (tam eşleşme, büyük/küçük harf duyarsız). */
function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, (c) => "\\" + c);
}

const OK = { ok: true } as const;

Deno.serve(async (req: Request): Promise<Response> => {
  const early = handlePreflightAndMethod(req, {
    ok: false,
    error: "method_not_allowed",
  });
  if (early) return early;

  // 1) Girdi doğrulama
  const payload = await readJsonBody(req, 8 * 1024);
  const input = validate(payload);
  if (!input) {
    return jsonResponse(req, 400, { ok: false, error: "invalid_input" });
  }

  // 2) Honeypot doluysa: kaydetme, ama normal başarı yanıtı ver.
  if (input.honeypot) return jsonResponse(req, 200, OK);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("submit-lead: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY eksik");
    return jsonResponse(req, 500, { ok: false, error: "server_error" });
  }
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    // 3) Hız sınırı (atomik sayaç RPC'si; bkz. migration)
    const key = "submit-lead:" + (await sha256Hex(clientIp(req)));
    const { data: count, error: rlErr } = await admin.rpc("bots_rate_limit_hit", {
      p_key: key,
      p_window_seconds: RATE_WINDOW_SECONDS,
    });
    if (rlErr || typeof count !== "number") {
      console.error("submit-lead: hız sınırı hatası", rlErr?.code ?? "");
      return jsonResponse(req, 500, { ok: false, error: "server_error" });
    }
    if (count > RATE_MAX) {
      return jsonResponse(req, 429, { ok: false, error: "rate_limited" });
    }

    // Ara sıra eski hız sınırı kayıtlarını temizle (hata olsa da akışı bozmaz).
    if (Math.random() < 0.02) {
      const { error: cleanErr } = await admin.rpc("bots_rate_limits_cleanup");
      if (cleanErr) console.error("submit-lead: temizlik hatası", cleanErr.code ?? "");
    }

    // 4) Mükerrer e-posta kontrolü (büyük/küçük harf duyarsız)
    const { data: existing, error: dupErr } = await admin
      .from("bots_leads")
      .select("id")
      .ilike("email", escapeLike(input.email))
      .limit(1);
    if (dupErr) {
      console.error("submit-lead: mükerrer kontrol hatası", dupErr.code ?? "");
      return jsonResponse(req, 500, { ok: false, error: "server_error" });
    }
    if (existing && existing.length > 0) {
      // Aynı yanıt: e-postanın kayıtlı olup olmadığı sızdırılmaz.
      return jsonResponse(req, 200, OK);
    }

    // 5) Kayıt
    const { error: insErr } = await admin.from("bots_leads").insert({
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      source: "Manual",
      status: "New Lead",
      value: 0,
      tags: ["LANDING-PAGE-FORM"],
      last_activity: new Date().toISOString(),
    });
    if (insErr) {
      // Eşzamanlı çift gönderimde benzersizlik ihlali → yine aynı yanıt.
      if (insErr.code === "23505") return jsonResponse(req, 200, OK);
      console.error("submit-lead: kayıt hatası", insErr.code ?? "");
      return jsonResponse(req, 500, { ok: false, error: "server_error" });
    }

    return jsonResponse(req, 200, OK);
  } catch (e) {
    console.error("submit-lead: beklenmeyen hata", (e as Error)?.name ?? "Error");
    return jsonResponse(req, 500, { ok: false, error: "server_error" });
  }
});
