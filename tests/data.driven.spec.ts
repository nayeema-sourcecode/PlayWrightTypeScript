import { test, expect } from '@playwright/test';
import xlsx from 'xlsx';
import path from 'path';

[
    {userName: '12', errorMessage: 'username is too short (minimum is 3 characters)', isErrorDisplayed: true},
    {userName: '123', errorMessage: 'username', isErrorDisplayed: false},
    {userName: '2345678901234456789', errorMessage: 'username', isErrorDisplayed: false},
    {userName: '123456789012344567890', errorMessage: 'username is too long (maximum is 20 characters)', isErrorDisplayed: true}
].forEach( data => {
    test(`Data driven test for username validation: ${data.userName}`, async ({ page }) => {
        await page.goto('https://conduit.bondaracademy.com/register');
        await page.getByPlaceholder('Username').fill(data.userName);
        await page.getByRole('textbox', { name: 'email' }).fill("email@example.com");
        await page.getByRole('textbox', { name: 'password' }).fill("password");
        await page.getByRole('button', { name: 'Sign up' }).click();
    if (data.isErrorDisplayed) {
        const errorLocator = page.locator('.error-messages', { hasText: data.errorMessage });
        await expect(errorLocator).toBeVisible();
    } else {
        const errorLocator = page.locator('.error-message', { hasText: data.errorMessage });
        await expect(errorLocator).toHaveCount(0);
    }
    await page.close();
    })
});    

  
  
