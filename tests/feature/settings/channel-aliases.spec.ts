import { expect, test } from '@playwright/test';

import { makePostApiRequest, PageAndRequest } from '../../utils/api';

async function clearChannelAliases(pageAndRequest: PageAndRequest): Promise<void> {
  await makePostApiRequest(pageAndRequest, '/api/v2/user/me/channel-aliases', {
    'Discord/1145065950027198474': '',
    'Twitch/floppydotbot': '',
  });
}

test.describe('Settings / Channel Aliases', () => {
  // Before Each
  test.beforeEach('load page', async ({ page }) => {
    await page.goto('/settings/channel-aliases');
  });

  test.beforeEach('reset channel aliases', async ({ page, request }) => {
    await clearChannelAliases({ page, request });
  });

  // All tests
  test('can load channel aliases list', async ({ page }) => {
    await expect(page.locator('mat-card-title')).toContainText('Channel Aliases');
    await expect(page.getByRole('textbox', { name: 'Discord/1145065950027198474' })).toBeEditable();
    await expect(page.getByRole('textbox', { name: 'Twitch/floppydotbot' })).toBeEditable();
  });

  test('can set a custom alias for a discord channel', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Discord/' }).fill('FloppyBot Discord Server');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.locator('fac-confirm-snack')).toContainText('Channel aliases saved');

    await page.reload();
    await expect(page.getByRole('textbox', { name: 'Discord/' })).toHaveValue('FloppyBot Discord Server');
  });

  test('can set a custom alias for a twitch channel', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Twitch/' }).fill('FloppyBot');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.locator('fac-confirm-snack')).toContainText('Channel aliases saved');

    await page.reload();
    await expect(page.getByRole('textbox', { name: 'Twitch/' })).toHaveValue('FloppyBot');
  });

  // After Each
  test.afterEach('reset channel aliases', async ({ page, request }) => {
    await clearChannelAliases({ page, request });
  });
});
