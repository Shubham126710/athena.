const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));
  
  console.log("Navigating to Hub...");
  await page.goto('http://localhost:5174/hub', { waitUntil: 'networkidle2' });
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 2000));
  
  // Since we might need to click a note, let's see if there is any error just loading the app.
  // We can also click on the first note.
  const notes = await page.$$('.cursor-pointer'); // Assuming notes are clickable
  if (notes.length > 0) {
      console.log("Clicking a note...");
      await notes[0].click();
      await new Promise(r => setTimeout(r, 2000));
  } else {
      console.log("No notes found to click.");
  }
  
  await browser.close();
})();
