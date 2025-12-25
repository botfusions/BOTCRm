
import { createClient } from '@supabase/supabase-js';

// Configuration provided by user
const SUPABASE_URL = 'https://rfwwntmaktyunbbqdtkq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmd3dudG1ha3R5dW5iYnFkdGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2ODE5MTUsImV4cCI6MjA3NTI1NzkxNX0.aXr6zeQz1q6lF099FaQzp-3nvYq4UhvscPKB-2N5liw';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Airtable Helper (Fallback/Placeholder)
export const airtableFetch = async (endpoint: string = '', method: string = 'GET', body: any = null) => {
  return { records: [] };
};
