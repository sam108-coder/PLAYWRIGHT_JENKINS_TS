import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { AllureHelper } from '../utils/allureHelper';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a relative URL or absolute URL.
   */
  async navigateTo(path: string = ''): Promise<void> {
    await AllureHelper.step(`Navigate to "${path}"`, async () => {
      Logger.info(`Navigating to URL: ${path}`);
      await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    });
  }

  /**
   * Click an element with logging and Allure step.
   */
  async click(locator: Locator, description: string): Promise<void> {
    await AllureHelper.step(`Click: ${description}`, async () => {
      Logger.debug(`Clicking element: ${description}`);
      await locator.waitFor({ state: 'visible' });
      await locator.click();
    });
  }

  /**
   * Fill text into an input field with logging and Allure step.
   */
  async fill(locator: Locator, text: string, description: string): Promise<void> {
    await AllureHelper.step(`Fill "${text}" into ${description}`, async () => {
      Logger.debug(`Filling "${text}" in ${description}`);
      await locator.waitFor({ state: 'visible' });
      await locator.fill(text);
    });
  }

  /**
   * Get trimmed text from an element.
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    const text = (await locator.textContent()) || '';
    return text.trim();
  }

  /**
   * Check if locator is visible without throwing.
   */
  async isVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the current page title.
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current page URL.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Take screenshot on demand.
   */
  async captureScreenshot(name: string): Promise<void> {
    await AllureHelper.attachScreenshot(this.page, name);
  }
}

