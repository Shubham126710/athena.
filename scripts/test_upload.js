import fs from 'fs';

async function testUpload() {
  const bucket = "athena-56f24.appspot.com";
  const name = "test2.txt";
  
  const res = await fetch(`https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: 'hello world'
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}

testUpload();
