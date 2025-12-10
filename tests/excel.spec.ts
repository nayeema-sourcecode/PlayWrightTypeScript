import { test, expect } from '@playwright/test';
import xlsx from 'xlsx';
import path from 'path';

const userDataFile = path.join(__dirname, '..', 'Data', 'TestData.xlsx');

let jsonData: any[];

test.describe('Excel-driven tests', () => {
  test.beforeAll(async () => {
    // read the workbook once for the whole describe block
    const workbook = xlsx.readFile(userDataFile);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    jsonData = xlsx.utils.sheet_to_json(worksheet) as any[];
    console.log('Loaded test data rows:', jsonData.length);
  });

  test.beforeEach(async ({ page }) => {
    // common navigation before each test
    await page.goto('https://conduit.bondaracademy.com/login');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // optional: capture screenshot on failure
    if (testInfo.status !== testInfo.expectedStatus) {
      const file = `screenshots/${testInfo.title.replace(/\s+/g, '_')}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log('Saved failure screenshot:', file);
    }
  });

  test.afterAll(async ({ page }) => {
    // cleanup if needed
    jsonData = [];
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait for any pending operations
    await page.close();
  });

  test('Excel file Read validate content', async ({ page }) => {
    // use the preloaded jsonData
    const row = (jsonData as any[])[0];
    const email = String(row['User Name'] ?? '');
    const password = String(row['Password'] ?? '');
    console.log(`Email: ${email}, Password: ${password}`);

    await page.getByRole('textbox', { name: 'email' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill(email);
    await page.getByRole('textbox', { name: 'password' }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    // add assertions specific to your app after login
    // e.g. await expect(page).toHaveURL(/some-dashboard/);
  });
});
