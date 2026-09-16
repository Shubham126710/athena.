import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://ethharrjgjxwgxgwzxzt.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0aGhhcnJqZ2p4d2d4Z3d6eHp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MTQ5NDgsImV4cCI6MjA3MjQ5MDk0OH0.Z-UjozQDiVQ-KjtSo5L5EhNDuAPXVoaD3QY3GtMc_6U";
const CLOUD_NAME = "dhdyooirr";
const UPLOAD_PRESET = "athena_notes";
const FIREBASE_PROJECT = "athena-56f24";

async function run() {
  console.log("Starting data rescue...");
  
  // 1. Fetch notes from Supabase
  const supaRes = await fetch(`${SUPABASE_URL}/rest/v1/notes?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  
  if (!supaRes.ok) {
    console.error("Failed to fetch from Supabase. Quota might be fully blocked.");
    console.log(await supaRes.text());
    return;
  }
  
  const notes = await supaRes.json();
  console.log(`Found ${notes.length} notes in Supabase.`);
  
  for (const note of notes) {
    console.log(`Processing: ${note.title}`);
    let newUrl = note.file_url;
    let newPath = note.file_path;
    
    // 2. Transfer to Cloudinary (if it's a supabase URL)
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
       }
    }
    
    // 3. Insert into Firestore
    // Using Firestore REST API
    const docData = {
      fields: {
        title: { stringValue: note.title },
        subject: { stringValue: note.subject },
        unit: { stringValue: note.unit },
        file_url: { stringValue: newUrl },
        file_path: { stringValue: newPath },
        created_at: { integerValue: new Date(note.created_at).getTime().toString() }
      }
    };
    
    const fRes = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/notes`, {
      method: 'POST',
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
  
  console.log("Migration complete!");
}

run();
