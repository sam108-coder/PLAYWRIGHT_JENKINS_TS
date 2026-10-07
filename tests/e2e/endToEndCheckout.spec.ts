import { test, expect } from '../../src/fixtures/testFixtures';
import { AllureHelper, Severity } from '../../src/utils/allureHelper';
import { APP_CONSTANTS } from '../../src/constants/appConstants';

test.describe('End-to-End Checkout Workflow', () => {
  test(
    'TC_E2E_01: Complete standard user purchase journey from login to order confirmation @e2e @smoke',
    async ({
      loginPage,
      productsPage,
      cartPage,
      checkoutPage,
      checkoutCompletePage,
      appConfig,
    }) => {
      AllureHelper.setMetadata({
        epic: 'E2E Shopping Workflows',
        feature: 'Complete Checkout',
        story: 'End-to-End Purchase Order',
        severity: Severity.BLOCKER,
        tags: ['e2e', 'smoke', 'checkout'],
        description:
          'Executes complete end-to-end checkout flow: login -> add items -> view cart -> fill customer info -> verify summary -> complete order.',
      });

      // 1. Navigate to Saucedemo and Login
      await loginPage.load();
      await loginPage.login(appConfig.STANDARD_USER, appConfig.PASSWORD);
      expect(await productsPage.isLoaded()).toBe(true);

      // 2. Select Items to Purchase
      const itemsToBuy = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt'];
      for (const item of itemsToBuy) {
        await productsPage.addProductToCart(item);
      }
      expect(await productsPage.getCartBadgeCount()).toBe(itemsToBuy.length);

      // 3. Navigate to Cart and Verify Contents
      await productsPage.goToCart();
      expect(await cartPage.isLoaded()).toBe(true);
      const cartItems = await cartPage.getCartItemNames();
      for (const item of itemsToBuy) {
        expect(cartItems).toContain(item);
      }

      // 4. Proceed to Checkout Step One (Customer Information)
      await cartPage.proceedToCheckout();
      expect(await checkoutPage.isStepOneLoaded()).toBe(true);
      await checkoutPage.fillCheckoutInformation('Emily', 'Watson', '94102');

      // 5. Checkout Step Two (Overview and Price Summary)
      expect(await checkoutPage.isStepTwoLoaded()).toBe(true);
      const totals = await checkoutPage.getSummaryTotals();
      expect(totals.itemTotal).toBeGreaterThan(0);
      expect(totals.tax).toBeGreaterThan(0);
      expect(Number((totals.itemTotal + totals.tax).toFixed(2))).toBe(totals.total);

      // 6. Complete Order
      await checkoutPage.finishCheckout();

      // 7. Verification of Confirmation Page
      expect(await checkoutCompletePage.isLoaded()).toBe(true);
      expect(await checkoutCompletePage.getSuccessHeader()).toBe(
        APP_CONSTANTS.COMPLETION_MESSAGES.HEADER
      );
      expect(await checkoutCompletePage.getSuccessMessage()).toBe(
        APP_CONSTANTS.COMPLETION_MESSAGES.DISPATCH
      );

      // 8. Return back to Products
      await checkoutCompletePage.clickBackHome();
      expect(await productsPage.isLoaded()).toBe(true);
    }
  );
});

