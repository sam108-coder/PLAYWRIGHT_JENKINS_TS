import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AllureHelper } from '../utils/allureHelper';

export class ProductsPage extends BasePage {
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('span.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  /**
   * Check if products page is currently displayed.
   */
  async isLoaded(): Promise<boolean> {
    return (await this.isVisible(this.title)) && (await this.getText(this.title)) === 'Products';
  }

  /**
   * Get all product titles displayed on the page.
   */
  async getAllProductTitles(): Promise<string[]> {
    return await this.itemNames.allTextContents();
  }

  /**
   * Get all product prices as numeric values.
   */
  async getAllProductPrices(): Promise<number[]> {
    const priceTexts = await this.itemPrices.allTextContents();
    return priceTexts.map((text) => parseFloat(text.replace('$', '').trim()));
  }

  /**
   * Sort products by value:
   * 'az' (Name A-Z), 'za' (Name Z-A), 'lohi' (Price low to high), 'hilo' (Price high to low)
   */
  async sortProducts(sortOption: string): Promise<void> {
    await AllureHelper.step(`Sort products by option "${sortOption}"`, async () => {
      await this.sortDropdown.selectOption(sortOption);
      await this.page.waitForTimeout(300); // Allow DOM reordering
    });
  }

  /**
   * Add a specific product to cart by its name.
   */
  async addProductToCart(productName: string): Promise<void> {
    await AllureHelper.step(`Add product "${productName}" to cart`, async () => {
      const productCard = this.inventoryItems.filter({ hasText: productName });
      const addToCartBtn = productCard.locator('button');
      await this.click(addToCartBtn, `Add to Cart for "${productName}"`);
    });
  }

  /**
   * Remove a specific product from cart on the products page.
   */
  async removeProductFromCart(productName: string): Promise<void> {
    await AllureHelper.step(`Remove product "${productName}" from inventory view`, async () => {
      const productCard = this.inventoryItems.filter({ hasText: productName });
      const removeBtn = productCard.locator('button');
      await this.click(removeBtn, `Remove button for "${productName}"`);
    });
  }

  /**
   * Get current cart badge count (returns 0 if badge is not visible).
   */
  async getCartBadgeCount(): Promise<number> {
    if (await this.isVisible(this.cartBadge, 2000)) {
      const text = await this.getText(this.cartBadge);
      return parseInt(text, 10) || 0;
    }
    return 0;
  }

  /**
   * Navigate to the cart page.
   */
  async goToCart(): Promise<void> {
    await this.click(this.cartLink, 'Shopping Cart Link');
  }

  /**
   * Log out of Saucedemo.
   */
  async logout(): Promise<void> {
    await AllureHelper.step('Logout from application', async () => {
      await this.click(this.menuButton, 'Burger Menu Button');
      await this.click(this.logoutLink, 'Logout Sidebar Link');
    });
  }
}

