# 🚀 BOTSCRM Geliştirme Yol Haritası

> Bu dosya, projenin gelecek geliştirme planlarını ve yapılacak işleri takip eder.
> Son Güncelleme: 25 Aralık 2024

---

## 📊 Mevcut Durum

### ✅ Tamamlanan İşler

| Tarih | İş | Durum |
|-------|-----|-------|
| 25.12.2024 | Git repository oluşturuldu | ✅ |
| 25.12.2024 | Supabase bağlantısı doğrulandı | ✅ |
| 25.12.2024 | Credentials `.env` dosyasına taşındı | ✅ |
| 25.12.2024 | README güncellendi | ✅ |
| 25.12.2024 | `.env.example` oluşturuldu | ✅ |

---

## 🎯 Öncelikli Geliştirmeler

### 1. 🔐 API Key Yönetimi (Supabase'den Dinamik)

**Amaç:** Kullanıcıların kendi API keylerini Supabase'de saklaması ve uygulamanın bunları dinamik olarak kullanması.

#### Yapılacaklar:

- [ ] `bots_settings` tablosuna yeni alanlar ekle:
  ```sql
  ALTER TABLE bots_settings ADD COLUMN gemini_api_key TEXT;
  ALTER TABLE bots_settings ADD COLUMN telegram_bot_token TEXT;
  ALTER TABLE bots_settings ADD COLUMN whatsapp_api_key TEXT;
  ALTER TABLE bots_settings ADD COLUMN smtp_host TEXT;
  ALTER TABLE bots_settings ADD COLUMN smtp_port INTEGER;
  ALTER TABLE bots_settings ADD COLUMN smtp_user TEXT;
  ALTER TABLE bots_settings ADD COLUMN smtp_password TEXT;
  ```

- [ ] Settings sayfasında API key giriş formları oluştur
- [ ] Login sonrası settings'i çeken servis yaz
- [ ] API keylerini uygulama genelinde kullanılabilir yap (Context/Store)

#### Mimari:
```
.env (sadece Supabase credentials)
    │
    ▼
Kullanıcı Login
    │
    ▼
bots_settings tablosundan API keyleri çek
    │
    ▼
Uygulama genelinde kullan (Gemini, Telegram, vb.)
```

---

### 2. 🔔 Supabase Database Triggers + n8n Entegrasyonu

**Amaç:** Veritabanı olaylarında otomatik olarak n8n webhook'larını tetiklemek.

#### Senaryo Listesi:

| # | Olay | Tetikleme | n8n Aksiyon |
|---|------|-----------|-------------|
| 1 | Yeni lead eklendi | `AFTER INSERT ON bots_leads` | Telegram bildirimi |
| 2 | Lead durumu "Won" oldu | `AFTER UPDATE ON bots_leads` | Fatura oluştur + Email |
| 3 | Lead durumu "Lost" oldu | `AFTER UPDATE ON bots_leads` | Takip emaili gönder |
| 4 | Task tamamlandı | `AFTER UPDATE ON bots_tasks` | Müşteriye bildirim |
| 5 | Yeni contact eklendi | `AFTER INSERT ON bots_contacts` | Hoş geldin emaili |

#### SQL Kurulumu:

```sql
-- ============================================
-- 1. pg_net Extension (HTTP Request için)
-- ============================================
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================
-- 2. Webhook URL'lerini Saklayan Tablo
-- ============================================
ALTER TABLE bots_settings ADD COLUMN IF NOT EXISTS webhook_new_lead TEXT;
ALTER TABLE bots_settings ADD COLUMN IF NOT EXISTS webhook_lead_won TEXT;
ALTER TABLE bots_settings ADD COLUMN IF NOT EXISTS webhook_lead_lost TEXT;
ALTER TABLE bots_settings ADD COLUMN IF NOT EXISTS webhook_task_completed TEXT;
ALTER TABLE bots_settings ADD COLUMN IF NOT EXISTS webhook_new_contact TEXT;

-- ============================================
-- 3. Yeni Lead Trigger Fonksiyonu
-- ============================================
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
BEGIN
  -- bots_settings'den webhook URL'ini al
  SELECT webhook_new_lead INTO webhook_url 
  FROM bots_settings 
  WHERE webhook_new_lead IS NOT NULL
  LIMIT 1;
  
  -- n8n'e HTTP POST gönder
  IF webhook_url IS NOT NULL AND webhook_url != '' THEN
    PERFORM net.http_post(
      url := webhook_url,
      body := jsonb_build_object(
        'event', 'new_lead',
        'timestamp', NOW(),
        'data', jsonb_build_object(
          'id', NEW.id,
          'full_name', NEW.full_name,
          'email', NEW.email,
          'phone', NEW.phone,
          'source', NEW.source,
          'value', NEW.value,
          'created_at', NEW.created_at
        )
      ),
      headers := '{"Content-Type": "application/json"}'::jsonb
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı oluştur
DROP TRIGGER IF EXISTS on_new_lead_created ON bots_leads;
CREATE TRIGGER on_new_lead_created
  AFTER INSERT ON bots_leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_lead();

-- ============================================
-- 4. Lead Durumu Değişti Trigger
-- ============================================
CREATE OR REPLACE FUNCTION notify_lead_status_change()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
BEGIN
  -- Sadece status değiştiyse
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    
    -- Won durumu için
    IF NEW.status = 'Won' THEN
      SELECT webhook_lead_won INTO webhook_url 
      FROM bots_settings 
      WHERE webhook_lead_won IS NOT NULL
      LIMIT 1;
    
    -- Lost durumu için
    ELSIF NEW.status = 'Lost' THEN
      SELECT webhook_lead_lost INTO webhook_url 
      FROM bots_settings 
      WHERE webhook_lead_lost IS NOT NULL
      LIMIT 1;
    END IF;
    
    -- Webhook gönder
    IF webhook_url IS NOT NULL AND webhook_url != '' THEN
      PERFORM net.http_post(
        url := webhook_url,
        body := jsonb_build_object(
          'event', 'lead_status_changed',
          'timestamp', NOW(),
          'data', jsonb_build_object(
            'id', NEW.id,
            'full_name', NEW.full_name,
            'email', NEW.email,
            'old_status', OLD.status,
            'new_status', NEW.status,
            'value', NEW.value
          )
        ),
        headers := '{"Content-Type": "application/json"}'::jsonb
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı oluştur
DROP TRIGGER IF EXISTS on_lead_status_change ON bots_leads;
CREATE TRIGGER on_lead_status_change
  AFTER UPDATE ON bots_leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_lead_status_change();

-- ============================================
-- 5. Task Tamamlandı Trigger
-- ============================================
CREATE OR REPLACE FUNCTION notify_task_completed()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
BEGIN
  -- Sadece completed durumu değiştiyse ve true olduysa
  IF OLD.completed = false AND NEW.completed = true THEN
    
    SELECT webhook_task_completed INTO webhook_url 
    FROM bots_settings 
    WHERE webhook_task_completed IS NOT NULL
    LIMIT 1;
    
    IF webhook_url IS NOT NULL AND webhook_url != '' THEN
      PERFORM net.http_post(
        url := webhook_url,
        body := jsonb_build_object(
          'event', 'task_completed',
          'timestamp', NOW(),
          'data', jsonb_build_object(
            'id', NEW.id,
            'title', NEW.title,
            'assigned_to', NEW.assigned_to,
            'lead_id', NEW.lead_id,
            'completed_at', NOW()
          )
        ),
        headers := '{"Content-Type": "application/json"}'::jsonb
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı oluştur
DROP TRIGGER IF EXISTS on_task_completed ON bots_tasks;
CREATE TRIGGER on_task_completed
  AFTER UPDATE ON bots_tasks
  FOR EACH ROW
  EXECUTE FUNCTION notify_task_completed();
```

#### n8n Workflow Örnekleri:

1. **Yeni Lead → Telegram Bildirimi**
   ```
   Webhook Node → Telegram Bot Node
   ```

2. **Lead Won → Fatura + Email**
   ```
   Webhook Node → Google Sheets (Fatura) → Gmail Node
   ```

3. **Task Completed → WhatsApp**
   ```
   Webhook Node → WhatsApp Business API Node
   ```

---

### 3. 🔒 Güvenlik İyileştirmeleri

- [ ] Row Level Security (RLS) politikaları ekle
- [ ] Service Role Key ile admin işlemleri
- [ ] API rate limiting
- [ ] Input sanitization

---

### 4. 📱 UI/UX İyileştirmeleri

- [ ] Settings sayfasına webhook URL giriş alanları ekle
- [ ] Trigger test butonu (manuel webhook tetikleme)
- [ ] Webhook log görüntüleme
- [ ] Real-time notification (Supabase Realtime)

---

## 📋 Öncelik Sırası

| Öncelik | Görev | Tahmini Süre |
|---------|-------|--------------|
| 🔴 Yüksek | API Key Yönetimi | 2-3 saat |
| 🔴 Yüksek | Database Triggers | 1-2 saat |
| 🟡 Orta | n8n Workflow Şablonları | 2-3 saat |
| 🟡 Orta | Settings UI Güncellemesi | 2 saat |
| 🟢 Düşük | RLS Politikaları | 1 saat |

---

## 🔗 İlgili Linkler

- [Supabase Database Webhooks](https://supabase.com/docs/guides/database/webhooks)
- [pg_net Extension](https://supabase.com/docs/guides/database/extensions/pg_net)
- [n8n Webhook Node](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Supabase Triggers](https://supabase.com/docs/guides/database/postgres/triggers)

---

## 📝 Notlar

> Bu dosyayı her geliştirme oturumunda güncelleyin.
> Tamamlanan işleri ✅ ile işaretleyin.
> Yeni fikirler için bu dosyayı kullanın.

---

<div align="center">
  <sub>📌 Bu dosya proje köküne kaydedilmiştir: <code>DEVELOPMENT.md</code></sub>
</div>
