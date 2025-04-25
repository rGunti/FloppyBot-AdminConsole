import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',

  // Run all tests in parallel.
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env['CI'],

  // Retry on CI only.
  retries: process.env['CI'] ? 2 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env['CI'] ? 1 : undefined,

  // Reporter to use
  outputDir: '.playwright/test-results',
  reporter: [
    ['html', { open: 'never', outputFolder: '.playwright/html' }],
    ['list'],
    [
      'junit',
      {
        outputFile: '.playwright/test-results/junit.xml',
      },
    ],
  ],

  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: 'http://localhost:4200',

    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
    screenshot: 'on',
  },
  // Configure projects for major browsers.
  projects: [
    {
      name: 'login',
      use: {
        ...devices['Desktop Chrome'],
      },
      testDir: 'tests/setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.playwright/auth.json' },
      dependencies: ['login'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: '.playwright/auth.json' },
      dependencies: ['login'],
    },
    {
      name: 'safari',
      use: { ...devices['Desktop WebKit'], storageState: '.playwright/auth.json' },
      dependencies: ['login'],
    },
  ],
  // Run your local dev server before starting the tests.
  webServer: {
    command: 'npm run start:pw',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
  },
});
