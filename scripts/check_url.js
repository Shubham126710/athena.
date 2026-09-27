const FIREBASE_PROJECT = "athena-56f24";

async function run() {
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/notes?pageSize=10`);
    const data = await res.json();
    data.documents.forEach(doc => console.log(doc.fields.title?.stringValue, " -> ", doc.fields.file_url?.stringValue));
}

run();
