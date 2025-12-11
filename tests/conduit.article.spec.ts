import { test, expect } from '@playwright/test';

test('Conduit Article Create and', async ({ page }) => {
    // use the preloaded jsonData
    await page.goto('https://conduit.bondaracademy.com/login');
    await page.getByRole('textbox', { name: 'email' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill('pwtest@test.com');
    await page.getByRole('textbox', { name: 'password' }).fill('Welcome2')
    await page.getByRole('button', { name: 'Sign in' }).click();

    // add assertions specific to your app after login
    // e.g. await expect(page).toHaveURL(/some-dashboard/);
  });
