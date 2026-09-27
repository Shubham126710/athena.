import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://ethharrjgjxwgxgwzxzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0aGhhcnJqZ2p4d2d4Z3d6eHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTQ5NDgsImV4cCI6MjA3MjQ5MDk0OH0.Z-UjozQDiVQ-KjtSo5L5EhNDuAPXVoaD3QY3GtMc_6U";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit for Cloudinary
const EXPORT_DIR = path.join(process.cwd(), 'large_pdfs_to_compress');

async function run() {
  console.log("Fetching notes metadata from Supabase...");
  
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }

  const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/notes?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!supaRes.ok) {
    console.error("Failed to fetch from Supabase:", await supaRes.text());
    return;
  }
  
  const notes = await supaRes.json();
  console.log(`Found ${notes.length} notes. Checking file sizes...`);
  
  let largeFilesCount = 0;
  
  for (const note of notes) {
    if (!note.file_url || !note.file_url.includes('supabase')) continue;
    
    try {
      // Use HEAD request to get Content-Length without downloading
      const headRes = await fetch(note.file_url, { method: 'HEAD' });
      const sizeStr = headRes.headers.get('content-length');
      
      if (sizeStr) {
        const size = parseInt(sizeStr, 10);
        if (size > MAX_SIZE) {
          largeFilesCount++;
          console.log(`Found large file: ${note.title} (${(size / 1024 / 1024).toFixed(2)} MB)`);
          
          // Download the file
          console.log(`  -> Downloading...`);
          const fileRes = await fetch(note.file_url);
          const buffer = await fileRes.arrayBuffer();
          
          // Sanitize filename
          const safeTitle = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          const ext = note.file_url.split('.').pop().split('?')[0] || 'pdf';
          const filePath = path.join(EXPORT_DIR, `${safeTitle}.${ext}`);
          
          fs.writeFileSync(filePath, Buffer.from(buffer));
          console.log(`  -> Saved to ${filePath}`);
        }
      }
    } catch (err) {
      console.error(`Error checking ${note.title}:`, err.message);
    }
  }
  
  console.log(`\nExport complete! Downloaded ${largeFilesCount} files larger than 10MB to the 'large_pdfs_to_compress' folder.`);
}

run();
