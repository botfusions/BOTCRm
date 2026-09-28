import { createClient } from '@supabase/supabase-js';

// Ortam değişkenleri: sabit (hardcoded) proje adresi YOK — .env içinde tanımlanmalı.
// Not: VITE_ ile başlayan her değer tarayıcı paketine gömülür; buraya yalnızca
// herkese açık (anon) anahtar konabilir.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Yapılandırma kontrolü
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    '❌ Supabase yapılandırması eksik: VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY .env dosyasında tanımlanmalı (bkz. .env.example).'
  );
}

// createClient boş URL ile hata fırlatır; uygulamanın (ör. demo modu) yine de açılabilmesi için
// geçersiz ama zararsız bir yer tutucu kullanılır. Bu adrese istek gitmez (.invalid TLD).
export const supabase = createClient(
  SUPABASE_URL || 'https://supabase-yapilandirilmamis.invalid',
  SUPABASE_KEY || 'yapilandirilmamis'
);

// Demo modu: sessionStorage bayrağı. Demo modunda servisler veritabanına hiç gitmez.
export const isDemoMode = (): boolean => {
  try {
    return sessionStorage.getItem('botscrm_demo_mode') === 'true';
  } catch {
    return false;
  }
};

// Demo bayrağını temizle (çıkışta çağrılır)
export const clearDemoMode = (): void => {
  try {
    sessionStorage.removeItem('botscrm_demo_mode');
  } catch {
    // sessionStorage erişilemiyorsa yapılacak bir şey yok
  }
};

// Demo modunda yazma işlemleri için sahte kimlik
export const demoId = (): string => 'demo-' + Date.now();

// Bağlantı durumu yardımcısı
export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (isDemoMode()) return false;
  try {
    const { error } = await supabase.from('bots_settings').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};

// Airtable Helper (Fallback/Placeholder)
export const airtableFetch = async (endpoint: string = '', method: string = 'GET', body: any = null) => {
  return { records: [] };
};
