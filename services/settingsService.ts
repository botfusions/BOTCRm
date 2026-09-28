import { supabase, isDemoMode } from './client';

// Not: Gizli anahtarlar (openai_key, supabase_key, telegram_bot_token, instagram_token)
// bilinçli olarak bu arayüzde YOK. Tarayıcıya okunmaz, tarayıcıdan yazılmaz;
// sunucu ortam değişkenlerinde / Supabase secret'larında tutulur. Tablodaki mevcut
// değerler silinmez, çünkü upsert yalnızca payload'daki sütunları günceller.
export interface BOTS_Settings {
  user_id?: string;
  full_name: string;
  email: string;
  supabase_url: string;
  telegram_chat_id: string;
  phone: string;
  whatsapp_id: string;
  smtp_host: string;
  smtp_port: string;
  sender_name: string;
  sender_email: string;
  welcome_subject: string;
  welcome_body: string;
  n8n_webhook_url?: string;
}

// Tarayıcıdan okunup yazılabilecek (gizli olmayan) sütunlar — beyaz liste
const PUBLIC_SETTINGS_COLUMNS = [
  'full_name',
  'email',
  'supabase_url',
  'telegram_chat_id',
  'phone',
  'whatsapp_id',
  'smtp_host',
  'smtp_port',
  'sender_name',
  'sender_email',
  'welcome_subject',
  'welcome_body',
  'n8n_webhook_url',
] as const;

// Demo modu için makul varsayılan ayarlar
const DEMO_SETTINGS: BOTS_Settings = {
  full_name: 'Demo Kullanıcı',
  email: 'demo@botscrm.com',
  supabase_url: '',
  telegram_chat_id: '',
  phone: '+90 ',
  whatsapp_id: '',
  smtp_host: 'smtp.gmail.com',
  smtp_port: '587',
  sender_name: 'BOTSCRm Team',
  sender_email: 'no-reply@botscrm.com',
  welcome_subject: 'Hoş Geldin {{name}}!',
  welcome_body: 'Merhaba {{name}}, BOTSCRm dünyasına hoş geldin!',
  n8n_webhook_url: ''
};

export const fetchSettings = async (): Promise<BOTS_Settings | null> => {
  if (isDemoMode()) return { ...DEMO_SETTINGS };
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Yalnızca gizli olmayan sütunları seç (select('*') gizli anahtarları da getirirdi)
    const { data, error } = await supabase
      .from('bots_settings')
      .select(PUBLIC_SETTINGS_COLUMNS.join(','))
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST205') throw new Error('SETTINGS_TABLE_NOT_FOUND');
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    const row = data as any;
    return {
      full_name: row.full_name,
      email: row.email,
      supabase_url: row.supabase_url,
      telegram_chat_id: row.telegram_chat_id,
      phone: row.phone,
      whatsapp_id: row.whatsapp_id,
      smtp_host: row.smtp_host,
      smtp_port: row.smtp_port,
      sender_name: row.sender_name,
      sender_email: row.sender_email,
      welcome_subject: row.welcome_subject,
      welcome_body: row.welcome_body,
      n8n_webhook_url: row.n8n_webhook_url
    };
  } catch (error: any) {
    if (error.message === 'SETTINGS_TABLE_NOT_FOUND') throw error;
    return null;
  }
};

export const saveSettings = async (settings: BOTS_Settings): Promise<boolean> => {
  // Demo modunda veritabanına yazılmaz; başarılı sayılır
  if (isDemoMode()) return true;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Beyaz liste: yalnızca gizli olmayan alanlar gönderilir. Gizli anahtar sütunları
    // payload'da hiç yer almadığı için tablodaki mevcut değerleri korunur (null yazılmaz).
    const payload: Record<string, unknown> = {
      user_id: user.id,
      updated_at: new Date().toISOString()
    };
    for (const key of PUBLIC_SETTINGS_COLUMNS) {
      const value = (settings as any)[key];
      if (value !== undefined) payload[key] = value;
    }

    const { error } = await supabase
      .from('bots_settings')
      .upsert(payload, { onConflict: 'user_id' });

    return !error;
  } catch (error) {
    return false;
  }
};
