# 💎 Lumina CRM (Internal Codename: GlassFlow)

<div align="center">
  <img src="https://qlcbobvbircjhlglhfhr.supabase.co/storage/v1/object/public/image/cmr%20logo.png" width="140" alt="Lumina CRM Logo" />
  
  <h3>🚀 Revenue Automation Engine for Modern Teams</h3>

  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

</div>

---

## ✨ Genel Bakış
Lumina CRM, trafikten gelire giden yolu otomatize eden, **Glassmorphism** tasarım diline sahip, yüksek estetikli bir işletim sistemidir. Google Gemini AI desteği ile mesajları analiz eder, n8n ile dış dünya ile konuşur ve Supabase ile gerçek zamanlı veri senkronizasyonu sağlar.

## 🛠️ Hızlı Kurulum (Sıfırdan Başlayanlar İçin)

### 1. Projeyi Klonlayın ve Bağımlılıkları Kurun
```bash
git clone https://github.com/botfusions/BOTCRm.git
cd BOTCRm
npm install
```

### 2. Veritabanı Hazırlığı (Supabase)
Aşağıdaki SQL kodunu Supabase **SQL Editor** kısmına yapıştırın ve çalıştırın. Bu işlem tüm sistemi aktif eder:

<details>
<summary>🔥 Master SQL Setup (Tıklayın ve Kopyalayın)</summary>

```sql
-- 1. Adaylar (Leads)
CREATE TABLE IF NOT EXISTS bots_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  source TEXT,
  status TEXT DEFAULT 'New Lead',
  value NUMERIC DEFAULT 0,
  tags TEXT[],
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  avatar_url TEXT
);

-- 2. Görevler (Tasks)
CREATE TABLE IF NOT EXISTS bots_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  due_date DATE,
  assigned_to TEXT,
  lead_id UUID REFERENCES bots_leads(id) ON DELETE SET NULL
);

-- 3. Kişiler (Contacts)
CREATE TABLE IF NOT EXISTS bots_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  full_name TEXT NOT NULL,
  title TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'Active',
  company_id TEXT
);

-- 4. Ayarlar (Settings)
CREATE TABLE IF NOT EXISTS bots_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT,
  openai_key TEXT,
  supabase_url TEXT,
  supabase_key TEXT,
  n8n_webhook_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```
</details>

### 3. Uygulamayı Başlatın
```bash
npm start
```

## 🤖 AI & Otomasyon Gücü
- **AI Lead Parsing:** Gelen karmaşık metinleri Gemini AI ile saniyeler içinde yapılandırılmış aday verisine dönüştürür.
- **n8n Bridge:** CRM'inizi Telegram, WhatsApp ve Gmail botlarınıza bağlar.
- **Real-time Engine:** Veritabanındaki her değişiklik tüm panellerde anında (refreşsiz) güncellenir.

## 🎨 Tasarım Felsefesi
- **Glassmorphism:** Şeffaf katmanlar, bulanık arka planlar (backdrop-blur) ve neon ışık detayları.
- **Dark-First:** Göz yormayan, profesyonel karanlık mod odaklı arayüz.
- **Responsive:** Masaüstünden mobil cihazlara tam uyum.

---
<div align="center">
  <sub>Developed with ❤️ by <b>botsCRM Team</b>. 2024</sub>
</div>
