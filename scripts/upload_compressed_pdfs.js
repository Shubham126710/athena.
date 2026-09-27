import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://ethharrjgjxwgxgwzxzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0aGhhcnJqZ2p4d2d4Z3d6eHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTQ5NDgsImV4cCI6MjA3MjQ5MDk0OH0.Z-UjozQDiVQ-KjtSo5L5EhNDuAPXVoaD3QY3GtMc_6U";
const CLOUD_NAME = "dhdyooirr";
const UPLOAD_PRESET = "athena_notes";
const FIREBASE_PROJECT = "athena-56f24";
const COMPRESSED_DIR = path.join(process.cwd(), 'Compressed_Notes');

async function run() {
  console.log("Fetching notes metadata from Supabase...");
  
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
  const noteMap = new Map();
  for (const n of notes) {
    const safeTitle = n.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    noteMap.set(safeTitle, n);
  }

  const files = fs.readdirSync(COMPRESSED_DIR).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${files.length} compressed files.`);

  for (const file of files) {
    // Strip suffixes _compressed or -compressed
    const baseName = file.replace(/(_compressed|-compressed)\.pdf$/, '');
    const note = noteMap.get(baseName);
    
    if (!note) {
      console.warn(`Could not find matching note for file: ${file} (base: ${baseName})`);
      continue;
    }
    
    console.log(`Processing: ${note.title}`);
    
    // Upload to Cloudinary
    const filePath = path.join(COMPRESSED_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    
    const formData = new FormData();
    formData.append('file', blob, file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `notes/${note.subject}/${note.unit}`);
    
    const cRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!cRes.ok) {
      console.error(`-> Failed to migrate ${file} to Cloudinary: ${await cRes.text()}`);
      continue;
    }
    
    const data = await cRes.json();
    const newUrl = data.secure_url;
    const newPath = data.public_id;
    console.log(`-> Migrated to Cloudinary`);
    
    // Insert into Firestore
    const docData = {
      fields: {
        id: { stringValue: note.id.toString() },
        title: { stringValue: note.title },
        subject: { stringValue: note.subject },
        unit: { stringValue: note.unit },
        file_url: { stringValue: newUrl },
        file_path: { stringValue: newPath },
        created_at: { integerValue: new Date(note.created_at).getTime().toString() }
      }
    };
    
    const fRes = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/notes/${note.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(docData)
    });
    
    if (fRes.ok) {
      console.log(`-> Saved to Firestore`);
    } else {
      console.error(`-> Failed to save to Firestore: ${await fRes.text()}`);
    }
  }
  
  console.log("All compressed files migrated!");
}

run();
