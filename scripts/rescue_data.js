import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://ethharrjgjxwgxgwzxzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0aGhhcnJqZ2p4d2d4Z3d6eHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTQ5NDgsImV4cCI6MjA3MjQ5MDk0OH0.Z-UjozQDiVQ-KjtSo5L5EhNDuAPXVoaD3QY3GtMc_6U";
const CLOUD_NAME = "dhdyooirr";
const UPLOAD_PRESET = "athena_notes";
const FIREBASE_PROJECT = "athena-56f24";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit

async function run() {
  console.log("Starting data rescue for files <= 10MB...");
  
  const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/notes?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!supaRes.ok) {
    console.error("Failed to fetch from Supabase. Quota might be fully blocked.");
    return;
  }
  
  const notes = await supaRes.json();
  console.log(`Found ${notes.length} notes in Supabase.`);
  
  for (const note of notes) {
    console.log(`Processing: ${note.title}`);
    let newUrl = note.file_url;
    let newPath = note.file_path;
    let shouldSkip = false;
    
    // Check file size first
    if (note.file_url && note.file_url.includes('supabase')) {
      try {
        const headRes = await fetch(note.file_url, { method: 'HEAD' });
        const sizeStr = headRes.headers.get('content-length');
        if (sizeStr && parseInt(sizeStr, 10) > MAX_SIZE) {
          console.log(`-> Skipping (larger than 10MB)`);
          shouldSkip = true;
        }
      } catch (err) {
        console.error(`-> Error checking size:`, err.message);
      }
    }
    
    if (shouldSkip) continue; // Skip large files for now
    
    // Transfer to Cloudinary
    if (note.file_url && note.file_url.includes('supabase')) {
       const formData = new FormData();
       formData.append('file', note.file_url);
       formData.append('upload_preset', UPLOAD_PRESET);
       formData.append('folder', `notes/${note.subject}/${note.unit}`);
       
       const cRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
         method: 'POST',
         body: formData
       });
       
       if (cRes.ok) {
         const data = await cRes.json();
         newUrl = data.secure_url;
         newPath = data.public_id;
         console.log(`-> Migrated to Cloudinary`);
       } else {
         console.error(`-> Failed to migrate to Cloudinary: ${await cRes.text()}`);
         continue; // Don't save to firestore if it failed to upload to cloudinary
       }
    }
    
    // Insert into Firestore using PATCH to specific ID to avoid duplicates
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
    
    // PATCH creates the document if it doesn't exist when we use updateMask
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
  
  console.log("Migration complete for files <= 10MB!");
}

run();
