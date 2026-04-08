import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  // Try import.meta.env (Vite standard)
  if (import.meta.env[key]) return import.meta.env[key];
  // Try process.env (Defined in vite.config.ts)
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY');

// Robust validation for URL
const isValidUrl = (url: string) => {
  try {
    return url.startsWith('http');
  } catch {
    return false;
  }
};

// Only initialize if URL is provided and valid to avoid crash
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl));

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any); // Fallback for development/preview without config

/**
 * Checks if the Supabase connection is active and the keys are valid.
 * Returns true if connected, false otherwise.
 */
export async function checkSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured) {
    return { 
      success: false, 
      message: 'Thiếu biến môi trường NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.' 
    };
  }

  try {
    // Try to get the session as a simple connectivity test
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
    
    return { success: true, message: 'Kết nối Supabase thành công!' };
  } catch (err: any) {
    console.error('Supabase connection error:', err);
    return { 
      success: false, 
      message: `Lỗi kết nối: ${err.message || 'Không thể kết nối tới Supabase.'}` 
    };
  }
}
