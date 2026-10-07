import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly title: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('span.title');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Check if order completion page is displayed.
   */
  async isLoaded(): Promise<boolean> {
    return (
      (await this.isVisible(this.title)) &&
      (await this.getText(this.title)) === 'Checkout: Complete!'
    );
  }

  /**
   * Get completion confirmation header.
   */
  async getSuccessHeader(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  /**
   * Get completion descriptive text.
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.completeText);
  }

  /**
   * Return back to products inventory page.
   */
  async clickBackHome(): Promise<void> {
    await this.click(this.backHomeButton, 'Back Home Button');
  }
}

