import { test, expect } from '../../src/fixtures/testFixtures';
import { AllureHelper, Severity } from '../../src/utils/allureHelper';
import { APP_CONSTANTS } from '../../src/constants/appConstants';

test.describe('Products Inventory & Sorting Tests', () => {
  test.beforeEach(async ({ loginPage, productsPage, appConfig }) => {
    await loginPage.load();
    await loginPage.login(appConfig.STANDARD_USER, appConfig.PASSWORD);
    expect(await productsPage.isLoaded()).toBe(true);
  });

  test(
    'TC_PROD_01: Verify all 6 products are displayed on inventory page @regression',
    async ({ productsPage }) => {
      AllureHelper.setMetadata({
        epic: 'Product Catalog',
        feature: 'Inventory Display',
        story: 'Product Listing',
        severity: Severity.NORMAL,
        tags: ['regression', 'inventory'],
      });

      const titles = await productsPage.getAllProductTitles();
      expect(titles.length).toBe(6);
      expect(titles).toContain('Sauce Labs Backpack');
      expect(titles).toContain('Sauce Labs Fleece Jacket');
    }
  );

  test(
    'TC_PROD_02: Verify product sorting by Name (A to Z and Z to A) @regression',
    async ({ productsPage }) => {
      AllureHelper.setMetadata({
        epic: 'Product Catalog',
        feature: 'Product Sorting',
        story: 'Alphabetical Sorting',
        severity: Severity.NORMAL,
        tags: ['regression', 'inventory', 'sorting'],
      });

      // Default is A to Z
      await productsPage.sortProducts(APP_CONSTANTS.SORT_OPTIONS.NAME_A_TO_Z);
      const azTitles = await productsPage.getAllProductTitles();
      const sortedExpectedAZ = [...azTitles].sort((a, b) => a.localeCompare(b));
      expect(azTitles).toEqual(sortedExpectedAZ);

      // Sort Z to A
      await productsPage.sortProducts(APP_CONSTANTS.SORT_OPTIONS.NAME_Z_TO_A);
      const zaTitles = await productsPage.getAllProductTitles();
      const sortedExpectedZA = [...zaTitles].sort((a, b) => b.localeCompare(a));
      expect(zaTitles).toEqual(sortedExpectedZA);
    }
  );

  test(
    'TC_PROD_03: Verify product sorting by Price (Low to High and High to Low) @regression',
    async ({ productsPage }) => {
      AllureHelper.setMetadata({
        epic: 'Product Catalog',
        feature: 'Product Sorting',
        story: 'Price Sorting',
        severity: Severity.NORMAL,
        tags: ['regression', 'inventory', 'sorting'],
      });

      // Low to High
      await productsPage.sortProducts(APP_CONSTANTS.SORT_OPTIONS.PRICE_LOW_TO_HIGH);
      const lohiPrices = await productsPage.getAllProductPrices();
      const sortedLohi = [...lohiPrices].sort((a, b) => a - b);
      expect(lohiPrices).toEqual(sortedLohi);

      // High to Low
      await productsPage.sortProducts(APP_CONSTANTS.SORT_OPTIONS.PRICE_HIGH_TO_LOW);
      const hiloPrices = await productsPage.getAllProductPrices();
      const sortedHilo = [...hiloPrices].sort((a, b) => b - a);
      expect(hiloPrices).toEqual(sortedHilo);
    }
  );

  test(
    'TC_PROD_04: Verify adding and removing product updates cart badge count @smoke @regression',
    async ({ productsPage }) => {
      AllureHelper.setMetadata({
        epic: 'Cart Management',
        feature: 'Cart Badge Count',
        story: 'Item Addition & Removal',
        severity: Severity.CRITICAL,
        tags: ['smoke', 'regression', 'cart'],
      });

      expect(await productsPage.getCartBadgeCount()).toBe(0);

      // Add 2 items
      await productsPage.addProductToCart('Sauce Labs Backpack');
      expect(await productsPage.getCartBadgeCount()).toBe(1);

      await productsPage.addProductToCart('Sauce Labs Bike Light');
      expect(await productsPage.getCartBadgeCount()).toBe(2);

      // Remove 1 item
      await productsPage.removeProductFromCart('Sauce Labs Backpack');
      expect(await productsPage.getCartBadgeCount()).toBe(1);
    }
  );

  test(
    'TC_PROD_05: Verify user can logout successfully from sidebar menu @regression',
    async ({ productsPage, loginPage }) => {
      AllureHelper.setMetadata({
        epic: 'Authentication Module',
        feature: 'User Logout',
        story: 'Sidebar Logout',
        severity: Severity.NORMAL,
        tags: ['regression', 'auth'],
      });

      await productsPage.logout();
      expect(await loginPage.isLoaded()).toBe(true);
    }
  );
});

