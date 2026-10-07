import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AllureHelper } from '../utils/allureHelper';

export class CheckoutPage extends BasePage {
  // Step One Locators
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // Step Two Locators
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('span.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  /**
   * Check if Step One (Information) is loaded.
   */
  async isStepOneLoaded(): Promise<boolean> {
    return (
      (await this.isVisible(this.title)) &&
      (await this.getText(this.title)) === 'Checkout: Your Information'
    );
  }

  /**
   * Check if Step Two (Overview) is loaded.
   */
  async isStepTwoLoaded(): Promise<boolean> {
    return (
      (await this.isVisible(this.title)) &&
      (await this.getText(this.title)) === 'Checkout: Overview'
    );
  }

  /**
   * Fill Step 1 checkout information and click Continue.
   */
  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await AllureHelper.step(
      `Fill checkout details: ${firstName} ${lastName}, Zip: ${postalCode}`,
      async () => {
        if (firstName) await this.fill(this.firstNameInput, firstName, 'First Name Input');
        if (lastName) await this.fill(this.lastNameInput, lastName, 'Last Name Input');
        if (postalCode) await this.fill(this.postalCodeInput, postalCode, 'Postal Code Input');
        await this.click(this.continueButton, 'Continue Button');
      }
    );
  }

  /**
   * Retrieve Step 1 error message.
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Parse numerical totals from the Overview page.
   */
  async getSummaryTotals(): Promise<{ itemTotal: number; tax: number; total: number }> {
    const itemTotalText = await this.getText(this.subtotalLabel);
    const taxText = await this.getText(this.taxLabel);
    const totalText = await this.getText(this.totalLabel);

    const extractNumber = (str: string) => {
      const match = str.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 0;
    };

    return {
      itemTotal: extractNumber(itemTotalText),
      tax: extractNumber(taxText),
      total: extractNumber(totalText),
    };
  }

  /**
   * Complete the checkout by clicking Finish button.
   */
  async finishCheckout(): Promise<void> {
    await this.click(this.finishButton, 'Finish Button');
  }
}

