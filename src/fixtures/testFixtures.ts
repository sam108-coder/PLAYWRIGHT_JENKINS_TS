import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { Config, AppConfig } from '../config/env.config';
import { AllureHelper } from '../utils/allureHelper';
import { Logger } from '../utils/logger';

// Declare custom test fixtures
type CustomFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  checkoutCompletePage: CheckoutCompletePage;
  appConfig: AppConfig;
};

export const test = baseTest.extend<CustomFixtures>({
  appConfig: async ({}, use) => {
    await use(Config);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

// Automatically capture screenshot on failure & log test status
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    Logger.error(`Test FAILED: ${testInfo.title}`);
    try {
      await AllureHelper.attachScreenshot(page, `FAILURE_${testInfo.title}`);
    } catch (err: any) {
      Logger.warn(`Could not attach failure screenshot: ${err.message}`);
    }
  } else {
    Logger.info(`Test PASSED: ${testInfo.title}`);
  }
});

export { expect };

