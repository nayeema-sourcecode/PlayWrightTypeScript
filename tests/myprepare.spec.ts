import { test, expect, chromium, Browser, Page } from '@playwright/test';

test('has title', async () => {
   const browser:Browser= await chromium.launch({headless:false, channel:'chrome'});
   const page:Page= await browser.newPage();
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('auth test', async () => {
   const browser:Browser= await chromium.launch({headless:false, channel:'chrome'});
   const page:Page= await browser.newPage();
  await page.goto('https://admin:admin@the-internet.herokuapp.com/basic_auth');

  // Expect a title "to contain" a substring.
 // await expect(page).toHaveTitle(/Playwright/);
});
//passing authorization through from Base 64
test('auth test with authorization', async () => {
   const browser:Browser= await chromium.launch({headless:false, channel:'chrome'});
   const page:Page= await browser.newPage();
   const userName="admin";
   const passWord="admin";
   const authHeader= 'Basic '+btoa(userName+':'+passWord);
   page.setExtraHTTPHeaders({Authorization:authHeader});
  await page.goto('https://the-internet.herokuapp.com/basic_auth');
     
  // Expect a title "to contain" a substring.
 // await expect(page).toHaveTitle(/Playwright/);
});
test('Testing normal code', async () => {
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const message: string = greet("World");
console.log(message);
});