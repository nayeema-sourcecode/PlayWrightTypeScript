import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://conduit.bondaracademy.com/');
  await page.getByRole('link', { name: 'Sign in' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('pwtest@test.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome2');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('link', { name: 'New Article' }).click();
  await page.getByRole('textbox', { name: 'Article Title' }).fill('nayeema test');
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).click();
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('dsjfkdkfjfkdsf');
  await page.getByRole('textbox', { name: 'Write your article (in' }).fill('sxcsmcksdjkfds');
  await page.getByRole('textbox', { name: 'Enter tags' }).fill('Testing tag');
  await page.getByRole('button', { name: 'Publish Article' }).click();
  await expect(page.getByText('sxcsmcksdjkfds')).toBeVisible();
  await page.getByRole('link', { name: 'Edit Article' }).first().click();
  
  await page.getByRole('textbox', { name: 'Enter tags' }).fill('tag Updated');
  await page.getByRole('button', { name: 'Publish Article' }).click();
  await expect(page.getByRole('heading', { name: 'nayeema test' })).toBeVisible();
  await page.getByRole('button', { name: 'Delete Article' }).first().click();
  await page.close();
});