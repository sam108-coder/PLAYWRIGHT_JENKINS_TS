import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AllureHelper } from '../utils/allureHelper';

export class CartPage extends BasePage {
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('span.title');
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  /**
   * Check if Cart page is loaded.
   */
  async isLoaded(): Promise<boolean> {
    return (await this.isVisible(this.title)) && (await this.getText(this.title)) === 'Your Cart';
  }

  /**
   * Get all product names currently in the cart.
   */
  async getCartItemNames(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  /**
   * Remove a specific item from the cart.
   */
  async removeItem(productName: string): Promise<void> {
    await AllureHelper.step(`Remove "${productName}" from cart`, async () => {
      const itemRow = this.cartItems.filter({ hasText: productName });
      const removeBtn = itemRow.locator('button');
      await this.click(removeBtn, `Remove button for "${productName}"`);
    });
  }

  /**
   * Return to shopping/inventory page.
   */
  async continueShopping(): Promise<void> {
    await this.click(this.continueShoppingButton, 'Continue Shopping Button');
  }

  /**
   * Proceed to the checkout flow.
   */
  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton, 'Checkout Button');
  }
}

