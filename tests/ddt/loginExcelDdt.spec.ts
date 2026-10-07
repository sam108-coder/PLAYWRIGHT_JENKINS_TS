import { test, expect } from '../../src/fixtures/testFixtures';
import { ExcelUtil } from '../../src/utils/excelUtil';
import { AllureHelper, Severity } from '../../src/utils/allureHelper';

interface LoginTestRecord {
  testCaseId: string;
  description: string;
  username: string;
  password: string;
  expectedOutcome: string;
  expectedErrorMessage: string;
  severity?: string;
}

// Read test data synchronously from Excel file for Playwright DDT test generation
const excelPath = 'src/testdata/excel/testdata.xlsx';
const testRecords = ExcelUtil.readSheetData<LoginTestRecord>(excelPath, 'LoginData');

test.describe('Data-Driven Testing (DDT) - Excel Login Scenarios', () => {
  for (const record of testRecords) {
    test(
      `${record.testCaseId}: ${record.description} @ddt @excel`,
      async ({ loginPage, productsPage }) => {
        AllureHelper.setMetadata({
          epic: 'DDT Suite',
          feature: 'Excel Data-Driven Login',
          story: record.testCaseId,
          severity: (record.severity as Severity) || Severity.NORMAL,
          tags: ['ddt', 'excel', 'login'],
          description: `Test Case: ${record.testCaseId}\nDescription: ${record.description}\nUsername: ${record.username}\nExpected: ${record.expectedOutcome}`,
        });

        await AllureHelper.attachJson('TestData_Input', {
          testCaseId: record.testCaseId,
          description: record.description,
          username: record.username,
          expectedOutcome: record.expectedOutcome,
          expectedErrorMessage: record.expectedErrorMessage,
        });

        await loginPage.load();
        await loginPage.login(record.username, record.password);

        if (record.expectedOutcome === 'SUCCESS') {
          expect(await productsPage.isLoaded()).toBe(true);
        } else {
          const errorMsg = await loginPage.getErrorMessageText();
          expect(errorMsg).toBe(record.expectedErrorMessage);
        }
      }
    );
  }
});

