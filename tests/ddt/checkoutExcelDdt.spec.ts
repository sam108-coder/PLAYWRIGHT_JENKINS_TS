import { test, expect } from '../../src/fixtures/testFixtures';
import { ExcelUtil } from '../../src/utils/excelUtil';
import { AllureHelper, Severity } from '../../src/utils/allureHelper';
import { APP_CONSTANTS } from '../../src/constants/appConstants';

interface CheckoutTestRecord {
  testCaseId: string;
  description: string;
  products: string;
  firstName: string;
  lastName: string;
  postalCode: string;
  expectedOutcome: string;
}

// Read test data synchronously from Excel file for Playwright DDT test generation
const excelPath = 'src/testdata/excel/testdata.xlsx';
const testRecords = ExcelUtil.readSheetData<CheckoutTestRecord>(excelPath, 'CheckoutData');

test.describe('Data-Driven Testing (DDT) - Excel Checkout Scenarios', () => {
  for (const record of testRecords) {
    test(
      `${record.testCaseId}: ${record.description} @ddt @excel`,
      async ({
        loginPage,
        productsPage,
        cartPage,
        checkoutPage,
        checkoutCompletePage,
        appConfig,
      }) => {
        AllureHelper.setMetadata({
          epic: 'DDT Suite',
          feature: 'Excel Data-Driven Checkout',
          story: record.testCaseId,
          severity: Severity.CRITICAL,
          tags: ['ddt', 'excel', 'checkout'],
          description: `Test Case: ${record.testCaseId}\nItems: ${record.products}\nCustomer: ${record.firstName} ${record.lastName}`,
        });

        await AllureHelper.attachJson('TestData_Input', record);

        // 1. Login
        await loginPage.load();
        await loginPage.login(appConfig.STANDARD_USER, appConfig.PASSWORD);
        expect(await productsPage.isLoaded()).toBe(true);

        // 2. Add products split by semicolon
        const productList = record.products.split(';').map((p) => p.trim());
        for (const item of productList) {
          await productsPage.addProductToCart(item);
        }

        // 3. View cart & verify
        await productsPage.goToCart();
        expect(await cartPage.isLoaded()).toBe(true);
        const cartItems = await cartPage.getCartItemNames();
        for (const item of productList) {
          expect(cartItems).toContain(item);
        }

        // 4. Fill checkout info
        await cartPage.proceedToCheckout();
        expect(await checkoutPage.isStepOneLoaded()).toBe(true);
        await checkoutPage.fillCheckoutInformation(
          record.firstName,
          record.lastName,
          record.postalCode
        );

        // 5. Complete and verify
        expect(await checkoutPage.isStepTwoLoaded()).toBe(true);
        await checkoutPage.finishCheckout();

        expect(await checkoutCompletePage.isLoaded()).toBe(true);
        expect(await checkoutCompletePage.getSuccessHeader()).toBe(
          APP_CONSTANTS.COMPLETION_MESSAGES.HEADER
        );
      }
    );
  }
});

