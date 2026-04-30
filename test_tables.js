import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ethharrjgjxwgxgwzxzt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0aGhhcnJqZ2p4d2d4Z3d6eHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTQ5NDgsImV4cCI6MjA3MjQ5MDk0OH0.Z-UjozQDiVQ-KjtSo5L5EhNDuAPXVoaD3QY3GtMc_6U');
async function test() {
  const p = await supabase.from('profiles').select('*').limit(1);
  const n = await supabase.from('notes').select('*').limit(1);
  const m = await supabase.from('notifications').select('*').limit(1);
  const a = await supabase.from('analytics').select('*').limit(1);
  const c = await supabase.from('counters').select('*').limit(1);
  console.log("profiles:", !p.error);
  console.log("notes:", !n.error);
  console.log("notifications:", !m.error);
  console.log("analytics:", !a.error);
  console.log("counters:", !c.error);
}
test();
