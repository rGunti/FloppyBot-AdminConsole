import { expect, test } from '@playwright/test';

test('loads the page and is authenticated', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading')).toContainText('Welcome to FloppyBot');
  await page.getByTestId('btn-main-menu').click();
  // await expect(page.getByTestId('btn-login')).toHaveCount(0);
  await expect(page.getByTestId('btn-logout')).toContainText('Logout');
  await expect(page.getByTestId('btn-user-profile')).toContainText('Profile (playwright)');
});
