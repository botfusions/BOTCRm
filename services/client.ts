
import { createClient } from '@supabase/supabase-js';

// Environment variables with development fallback
// ⚠️ NOTE: Fallback values for private development only
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rfwwntmaktyunbbqdtkq.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase configuration missing! Check your .env file.');
}

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Connection status helper
export const checkSupabaseConnection = async (): Promise<boolean> => {
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
