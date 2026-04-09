import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  if (import.meta?.env?.[key]) return import.meta.env[key];
  if (typeof process !== 'undefined' && process.env?.[key]) return process.env[key];
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') 
                     || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
                     || getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  isValidUrl(supabaseUrl)
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      message: 'Supabase chưa được cấu hình. Vui lòng kiểm tra biến môi trường.'
    };
  }

  try {
    // Test thực sự bằng một query nhẹ
    const { error } = await supabase.from('pg_tables').select('tablename').limit(1).single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      throw error;
    }

    return { success: true, message: 'Kết nối Supabase thành công!' };
  } catch (err: any) {
    console.error('Supabase connection error:', err);
    return {
      success: false,
      message: `Lỗi kết nối: ${err.message || 'Không xác định'}`
    };
  }
}
