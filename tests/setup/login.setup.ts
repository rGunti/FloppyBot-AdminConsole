import { expect, test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../../.playwright/auth.json');

function getCredentialsFromEnv(): { email: string; password: string } | null {
  const credentials = process.env['FLOPPYBOT_CREDENTIALS'] || '';
  if (!credentials) {
    return null;
  }

  const [email, password] = credentials.split(':');
  return { email, password };
}

function getCredentialsFromFile(): { email: string; password: string } | null {
  const credentialsFile = path.join(__dirname, '../../.playwright/credentials.json');

  if (!fs.existsSync(credentialsFile)) {
    console.log('Credentials file does not exist:', credentialsFile);
    return null;
  }

  const credentialsJson = fs.readFileSync(credentialsFile, 'utf-8');
  const credentials = JSON.parse(credentialsJson);
  if (credentials && credentials.email && credentials.password) {
    return { email: credentials.email, password: credentials.password };
  }

  return null;
}

function getCredentials(): { email: string; password: string } | null {
  const envCredentials = getCredentialsFromEnv();
  if (envCredentials) {
    return envCredentials;
  }
  const fileCredentials = getCredentialsFromFile();
  if (fileCredentials) {
    return fileCredentials;
  }
  return null;
}

setup('login', async ({ page }) => {
  const credentials = getCredentials();
  expect(
    credentials,
    'Credentials not found. Set them in the environment variable FLOPPYBOT_CREDENTIALS or in the .playwright/credentials.json file.',
  ).not.toBeNull();

  await page.goto('/');
  await page.getByTestId('btn-main-menu').click();
  await page.getByTestId('btn-login').click();

  await page.getByRole('textbox', { name: 'Testing User Email' }).fill(credentials!.email);
  await page.getByRole('textbox', { name: 'Testing User Password' }).fill(atob(credentials!.password));
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByTestId('btn-main-menu').click();
  await expect(page.getByTestId('btn-user-profile')).toContainText('Profile (playwright)');

  await page.context().storageState({ path: authFile });
});
