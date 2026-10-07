import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AllureHelper } from '../utils/allureHelper';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginCredentialsBox: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginCredentialsBox = page.locator('#login_credentials');
  }

  /**
   * Load the login page.
   */
  async load(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Perform login action.
   */
  async login(username: string, password: string): Promise<void> {
    await AllureHelper.step(`Login with username: "${username}"`, async () => {
      await this.fill(this.usernameInput, username, 'Username Input');
      await this.fill(this.passwordInput, password, 'Password Input');
      await this.click(this.loginButton, 'Login Button');
    });
  }

  /**
   * Retrieve error message if displayed.
   */
  async getErrorMessageText(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  /**
   * Checks if login page is loaded.
   */
  async isLoaded(): Promise<boolean> {
    return await this.isVisible(this.loginButton);
  }
}

