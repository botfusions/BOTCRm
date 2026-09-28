// Ortak CORS ve JSON yanıt yardımcıları (parse-lead, submit-lead).
//
// ALLOWED_ORIGINS secret'ı virgülle ayrılmış kaynak listesidir, ör.:
//   https://crm.botfusions.com,https://botfusions.com
// Boşsa '*' KULLANILMAZ; yalnızca yerel geliştirme kaynağına izin verilir.

const DEFAULT_ORIGINS = ["http://localhost:3000"];

function allowedOrigins(): string[] {
  const raw = Deno.env.get("ALLOWED_ORIGINS") ?? "";
  const list = raw
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, ""))
    .filter((s) => s.length > 0 && s !== "*");
  return list.length > 0 ? list : DEFAULT_ORIGINS;
}

/** İsteğin Origin başlığı izinliyse o kaynağı, değilse listedeki ilk kaynağı döndürür. */
export function corsHeaders(req: Request): Record<string, string> {
  const origins = allowedOrigins();
  const origin = (req.headers.get("Origin") ?? "").replace(/\/+$/, "");
  const allow = origins.includes(origin) ? origin : origins[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export function jsonResponse(
  req: Request,
  status: number,
  body: unknown,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(req),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * OPTIONS ön-uçuşunu ve POST dışı metotları ele alır.
 * null dönerse istek işlenmeye devam eder.
 */
export function handlePreflightAndMethod(
  req: Request,
  methodNotAllowedBody: unknown,
): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  if (req.method !== "POST") {
    const res = jsonResponse(req, 405, methodNotAllowedBody);
    res.headers.set("Allow", "POST, OPTIONS");
    return res;
  }
  return null;
}

/** Gövdeyi en fazla maxBytes kadar okuyup JSON olarak ayrıştırır; hata olursa null. */
export async function readJsonBody(
  req: Request,
  maxBytes: number,
): Promise<unknown | null> {
  try {
    const len = Number(req.headers.get("Content-Length") ?? "0");
    if (Number.isFinite(len) && len > maxBytes) return null;
    const text = await req.text();
    if (new TextEncoder().encode(text).length > maxBytes) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}
