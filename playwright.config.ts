import { defineConfig, devices } from '@playwright/test';
import { Config } from './src/config/env.config';

/**
 * Playwright Test Configuration
 * Configured for Multi-Environment, Allure Reporting, and Jenkins CI/CD.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: Config.DEFAULT_TIMEOUT,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: 'allure-results',
        suiteTitle: true,
        environmentInfo: {
          Environment: Config.ENV,
          BaseURL: Config.BASE_URL,
          Headless: String(Config.HEADLESS),
          OS: process.platform,
          NodeVersion: process.version,
        },
      },
    ],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
  ],

  use: {
    baseURL: Config.BASE_URL,
    headless: Config.HEADLESS,
    viewport: { width: Config.VIEWPORT_WIDTH, height: Config.VIEWPORT_HEIGHT },
    actionTimeout: 10000,
    navigationTimeout: 15000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  outputDir: 'test-results/',
});

