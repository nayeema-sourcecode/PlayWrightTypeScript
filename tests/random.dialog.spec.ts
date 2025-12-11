import { test, expect } from '@playwright/test';

test('Test random dialog', async ({ page }) => {
  
await page.goto('https://playground.bondaracademy.com/pages/modal-overlays/dialog');
page.setDefaultTimeout(6000);
await page.getByRole('button', { name: 'Enter Name' }).click();
await page.addLocatorHandler(page.getByText('Friendly reminder'), async (locator) => {
    console.log('Dialog appeared with text:', await locator.textContent());
    await page.getByRole('button', { name: 'OK' }).click();
    page.setDefaultTimeout(6000);
});

await page.getByRole('textbox', { name: 'Name' }).fill('test');
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('button', { name: 'Enter Name' }).click();
await page.getByRole('textbox', { name: 'Name' }).fill('kdjfkdjskfs');
await page.getByRole('button', { name: 'Cancel' }).click();
await page.getByRole('button', { name: 'Enter Name' }).click();
await page.getByRole('textbox', { name: 'Name' }).fill('cmvmsdmvkdk');
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByRole('heading', { name: 'Names:' }).click();
await page.getByText('cmvmsdmvkdk').click();
await page.getByText('cmvmsdmvkdk').click();
await page.close();
});
