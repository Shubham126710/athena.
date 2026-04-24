import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { count } = await supabase.from('notes').select('*', { count: 'exact', head: true }).eq('subject', 'site_hits');
  console.log("Count:", count);
  
  const { data, error } = await supabase.from('notes').insert([
    { title: 'hit', subject: 'site_hits', unit: 'v1', file_url: 'na', file_path: 'na' }
  ]);
  console.log("Insert ok?", !error, error);
}
test();
