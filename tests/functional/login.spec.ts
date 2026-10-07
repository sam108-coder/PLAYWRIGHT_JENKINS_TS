import { test, expect } from '../../src/fixtures/testFixtures';
import { AllureHelper, Severity } from '../../src/utils/allureHelper';
import { APP_CONSTANTS } from '../../src/constants/appConstants';

test.describe('Authentication & Login Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.load();
  });

  test(
    'TC_AUTH_01: Verify successful login with valid credentials @smoke @regression',
    async ({ loginPage, productsPage, appConfig }) => {
      AllureHelper.setMetadata({
        epic: 'Authentication Module',
        feature: 'User Login',
        story: 'Valid User Login',
        severity: Severity.BLOCKER,
        tags: ['smoke', 'regression', 'auth'],
        description: 'Verifies that a valid standard user can log in and view the products page.',
      });

      await loginPage.login(appConfig.STANDARD_USER, appConfig.PASSWORD);

      expect(await productsPage.isLoaded()).toBe(true);
      expect(productsPage.getCurrentUrl()).toContain(APP_CONSTANTS.ROUTES.INVENTORY);
    }
  );

  test(
    'TC_AUTH_02: Verify error message for locked out user @regression',
    async ({ loginPage, appConfig }) => {
      AllureHelper.setMetadata({
        epic: 'Authentication Module',
        feature: 'User Login',
        story: 'Locked User Login',
        severity: Severity.CRITICAL,
        tags: ['regression', 'auth', 'negative'],
        description: 'Verifies error message when attempting to log in with a locked out account.',
      });

      await loginPage.login(appConfig.LOCKED_USER, appConfig.PASSWORD);

      const errorText = await loginPage.getErrorMessageText();
      expect(errorText).toBe(APP_CONSTANTS.ERROR_MESSAGES.LOCKED_OUT_USER);
    }
  );

  test(
    'TC_AUTH_03: Verify error message for invalid password @regression',
    async ({ loginPage, appConfig }) => {
      AllureHelper.setMetadata({
        epic: 'Authentication Module',
        feature: 'User Login',
        story: 'Invalid Credentials',
        severity: Severity.NORMAL,
        tags: ['regression', 'auth', 'negative'],
      });

      await loginPage.login(appConfig.STANDARD_USER, 'incorrect_password');

      const errorText = await loginPage.getErrorMessageText();
      expect(errorText).toBe(APP_CONSTANTS.ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
  );

  test(
    'TC_AUTH_04: Verify error message when username is empty @regression',
    async ({ loginPage, appConfig }) => {
      AllureHelper.setMetadata({
        epic: 'Authentication Module',
        feature: 'User Login',
        story: 'Form Validation',
        severity: Severity.MINOR,
        tags: ['regression', 'auth', 'negative'],
      });

      await loginPage.login('', appConfig.PASSWORD);

      const errorText = await loginPage.getErrorMessageText();
      expect(errorText).toBe(APP_CONSTANTS.ERROR_MESSAGES.USERNAME_REQUIRED);
    }
  );

  test(
    'TC_AUTH_05: Verify error message when password is empty @regression',
    async ({ loginPage, appConfig }) => {
      AllureHelper.setMetadata({
        epic: 'Authentication Module',
        feature: 'User Login',
        story: 'Form Validation',
        severity: Severity.MINOR,
        tags: ['regression', 'auth', 'negative'],
      });

      await loginPage.login(appConfig.STANDARD_USER, '');

      const errorText = await loginPage.getErrorMessageText();
      expect(errorText).toBe(APP_CONSTANTS.ERROR_MESSAGES.PASSWORD_REQUIRED);
    }
  );
});

