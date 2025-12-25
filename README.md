# 💎 BOTSCRM - AI-Powered Revenue Engine

<div align="center">
  <img src="https://qlcbobvbircjhlglhfhr.supabase.co/storage/v1/object/public/image/cmr%20logo.png" width="140" alt="BOTSCRM Logo" />
  
  <h3>🚀 İşinizi Otomatize Eden Akıllı CRM Sistemi</h3>

  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-DB-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)

</div>

---

## ✨ Genel Bakış

BOTSCRM, trafikten gelire giden yolu otomatize eden, **Glassmorphism** tasarım diline sahip, yüksek estetikli bir CRM işletim sistemidir. Google Gemini AI desteği ile mesajları analiz eder, n8n ile dış dünya ile konuşur ve Supabase ile gerçek zamanlı veri senkronizasyonu sağlar.

### 🎯 Özellikler
- **AI Lead Parsing:** Gelen karmaşık metinleri Gemini AI ile saniyeler içinde yapılandırılmış aday verisine dönüştürür
- **n8n Bridge:** CRM'inizi Telegram, WhatsApp ve Gmail botlarınıza bağlar
- **Real-time Engine:** Veritabanındaki her değişiklik tüm panellerde anında güncellenir
- **Multi-Industry:** E-ticaret, Klinik, Emlak ve daha fazla sektör için hazır şablonlar

---

## 🛠️ Hızlı Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı (ücretsiz)

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/botfusions/BOTCRm.git
cd BOTCRm
```

### 2. Bağımlılıkları Kurun
```bash
npm install
```

### 3. Environment Değişkenlerini Ayarlayın
```bash
# .env.example dosyasını .env olarak kopyalayın
cp .env.example .env

# .env dosyasını düzenleyip gerçek değerleri girin:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - GEMINI_API_KEY
```

> ⚠️ **Önemli:** `.env` dosyası Git'e **asla** eklenmez. Gizli bilgileriniz güvendedir.

### 4. Uygulamayı Başlatın
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

---

## 📁 Proje Yapısı

```
BotCRm25122025/
├── 📄 App.tsx                 # Ana uygulama bileşeni
├── 📄 index.html              # HTML giriş noktası
├── 📄 index.tsx               # React giriş noktası
├── 📂 components/             # UI Bileşenleri
│   ├── Dashboard.tsx          # Ana gösterge paneli
│   ├── Sidebar.tsx            # Yan menü
│   ├── Pipeline.tsx           # Satış pipeline'ı
│   ├── Leads.tsx              # Müşteri adayları
│   ├── Contacts.tsx           # Kişiler
│   ├── Companies.tsx          # Şirketler
│   ├── Tasks.tsx              # Görevler
│   ├── Settings.tsx           # Ayarlar
│   └── 📂 landing/            # Landing page bileşenleri
│       ├── Hero.tsx
│       ├── AuthForm.tsx
│       ├── Pricing.tsx
│       └── ...
├── 📂 services/               # API Servisleri
│   ├── client.ts              # Supabase client
│   ├── leadService.ts         # Lead CRUD işlemleri
│   ├── contactService.ts      # Contact CRUD işlemleri
│   ├── companyService.ts      # Company CRUD işlemleri
│   ├── taskService.ts         # Task CRUD işlemleri
│   └── settingsService.ts     # Ayarlar servisi
├── 📄 types.ts                # TypeScript tip tanımları
├── 📄 constants.ts            # Sabit değerler
├── 📄 vite.config.ts          # Vite yapılandırması
├── 📄 tailwind.config.js      # Tailwind CSS yapılandırması
├── 📄 .env.example            # Environment değişkenleri örneği
└── 📄 .gitignore              # Git ignore kuralları
```

---

## 🗄️ Veritabanı Şeması (Supabase)

| Tablo | Açıklama |
|-------|----------|
| `bots_leads` | Müşteri adayları |
| `bots_contacts` | Kişi bilgileri |
| `bots_companies` | Şirket bilgileri |
| `bots_tasks` | Görev ve iş takibi |
| `bots_settings` | Kullanıcı ayarları (API keys, SMTP) |
| `user` | Uygulama kullanıcıları |
| `account` | Hesap bağlantıları |
| `session` | Oturum yönetimi |

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

---

## 🎨 Tasarım Felsefesi

- **Glassmorphism:** Şeffaf katmanlar, bulanık arka planlar (backdrop-blur) ve neon ışık detayları
- **Dark-First:** Göz yormayan, profesyonel karanlık mod odaklı arayüz
- **Responsive:** Masaüstünden mobil cihazlara tam uyum
- **Amber/Gold Accent:** Premium hissi veren altın renk tonları

---

## 🔒 Güvenlik

- ✅ Supabase credentials `.env` dosyasında saklanır
- ✅ `.env` dosyası `.gitignore` ile korunur (GitHub'a **ASLA** gitmez)
- ✅ Anon key ile Row Level Security (RLS) kullanılır
- ✅ HTTPS üzerinden güvenli iletişim
- ✅ **Şifre güçlülük kontrolü:** Min 8 karakter, 1 büyük, 1 küçük, 1 rakam
- ✅ **Demo mode tracking:** Oturum izleme ve güvenlik denetimi
- ✅ TypeScript strict mode ile tip güvenliği

---

## 📜 Scripts

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusunu başlatır (port 3000) |
| `npm run build` | Production build oluşturur |
| `npm run preview` | Production build'i önizler |

---

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

---

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

<div align="center">
  <sub>Developed with ❤️ by <b>BotFusions Team</b> | 2024-2025</sub>
  <br/>
  <a href="https://github.com/botfusions/BOTCRm">⭐ Star us on GitHub</a>
</div>
