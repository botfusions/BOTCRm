
import { supabase } from './client';

export interface BOTS_Settings {
  user_id?: string;
  full_name: string;
  email: string;
  openai_key: string;
  supabase_url: string;
  supabase_key: string;
  telegram_bot_token: string;
  telegram_chat_id: string;
  instagram_token: string;
  phone: string;
  whatsapp_id: string;
  smtp_host: string;
  smtp_port: string;
  sender_name: string;
  sender_email: string;
  welcome_subject: string;
  welcome_body: string;
  n8n_webhook_url?: string; // Yeni alan
}

export const fetchSettings = async (): Promise<BOTS_Settings | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('bots_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST205') throw new Error('SETTINGS_TABLE_NOT_FOUND');
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return {
      full_name: data.full_name,
      email: data.email,
      openai_key: data.openai_key,
      supabase_url: data.supabase_url,
      supabase_key: data.supabase_key,
      telegram_bot_token: data.telegram_bot_token,
      telegram_chat_id: data.telegram_chat_id,
      instagram_token: data.instagram_token,
      phone: data.phone,
      whatsapp_id: data.whatsapp_id,
      smtp_host: data.smtp_host,
      smtp_port: data.smtp_port,
      sender_name: data.sender_name,
      sender_email: data.sender_email,
      welcome_subject: data.welcome_subject,
      welcome_body: data.welcome_body,
      n8n_webhook_url: data.n8n_webhook_url
    };
  } catch (error: any) {
    if (error.message === 'SETTINGS_TABLE_NOT_FOUND') throw error;
    return null;
  }
};

export const saveSettings = async (settings: BOTS_Settings): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const payload = {
      user_id: user.id,
      ...settings,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('bots_settings')
      .upsert(payload, { onConflict: 'user_id' });

    return !error;
  } catch (error) {
    return false;
  }
};
