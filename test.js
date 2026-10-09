import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
  
  // Click guest tab
  const guestTab = await page.waitForSelector('button::-p-text(Guest Login)');
  if (guestTab) await guestTab.click();
  
  // Click sign in as guest
  const signInBtn = await page.waitForSelector('button[type="submit"]::-p-text(Sign in as Guest)');
  if (signInBtn) {
      await signInBtn.click();
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  } else {
      console.log('SignIn button not found');
  }
  
  console.log("Current URL after login:", page.url());
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
