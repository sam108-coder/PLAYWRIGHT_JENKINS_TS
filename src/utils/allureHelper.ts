import { allure } from 'allure-playwright';
import { Page } from '@playwright/test';
import { Logger } from './logger';

export enum Severity {
  BLOCKER = 'blocker',
  CRITICAL = 'critical',
  NORMAL = 'normal',
  MINOR = 'minor',
  TRIVIAL = 'trivial',
}

export class AllureHelper {
  /**
   * Sets the Epic, Feature, and Story hierarchy in Allure report.
   */
  static setMetadata(options: {
    epic?: string;
    feature?: string;
    story?: string;
    severity?: Severity;
    tags?: string[];
    description?: string;
    owner?: string;
  }): void {
    if (options.epic) allure.epic(options.epic);
    if (options.feature) allure.feature(options.feature);
    if (options.story) allure.story(options.story);
    if (options.severity) allure.severity(options.severity);
    if (options.owner) allure.owner(options.owner);
    if (options.description) allure.description(options.description);
    if (options.tags && options.tags.length > 0) {
      allure.tags(...options.tags);
    }
  }

  /**
   * Wraps an asynchronous action inside an Allure Step and logs it.
   */
  static async step(name: string, action: () => Promise<any>): Promise<void> {
    Logger.step(name);
    await allure.step(name, action);
  }

  /**
   * Captures a screenshot and attaches it directly to the Allure report.
   */
  static async attachScreenshot(page: Page, name: string = 'Screenshot'): Promise<void> {
    try {
      const buffer = await page.screenshot({ fullPage: true });
      await allure.attachment(name, buffer, 'image/png');
      Logger.debug(`Attached screenshot "${name}" to Allure report`);
    } catch (err: any) {
      Logger.warn(`Failed to attach screenshot: ${err.message}`);
    }
  }

  /**
   * Attaches text/json data to Allure report.
   */
  static async attachJson(name: string, data: any): Promise<void> {
    try {
      const formatted = JSON.stringify(data, null, 2);
      await allure.attachment(name, formatted, 'application/json');
    } catch (err: any) {
      Logger.warn(`Failed to attach JSON: ${err.message}`);
    }
  }
}

