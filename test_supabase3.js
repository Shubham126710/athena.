import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ethharrjgjxwgxgwzxzt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0aGhhcnJqZ2p4d2d4Z3d6eHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTQ5NDgsImV4cCI6MjA3MjQ5MDk0OH0.Z-UjozQDiVQ-KjtSo5L5EhNDuAPXVoaD3QY3GtMc_6U');
async function test() {
  const { data, error } = await supabase.from('notes').insert([
    { title: 'session_hit', subject: 'site_analytics', unit: 'pageview', file_url: 'none', file_path: 'local' }
  ]);
  const { count } = await supabase.from('notes').select('*', { count: 'exact', head: true }).eq('subject', 'site_analytics');
  console.log("Count:", count, error);
}
test();
