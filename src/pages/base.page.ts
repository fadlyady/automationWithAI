import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = ''): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 30000 });
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForToastMessage(expectedText: string): Promise<Locator> {
    const toast = this.page.locator('.toast, [role="alert"], .ant-message, .chakra-alert').filter({ hasText: expectedText });
    await toast.waitFor({ state: 'visible', timeout: 5000 });
    return toast;
  }
}
