
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dzuzjnltwomyrggfecra.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_CeLgkLp3k1O1aJzlJxk41g_jBOA-0v_';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials using hardcoded fallback. Restart server to use .env values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
