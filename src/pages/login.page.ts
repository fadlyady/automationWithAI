import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly alertErrorBanner: Locator;
  readonly alertErrorMessage: Locator;
  readonly usernameInputGroup: Locator;
  readonly passwordInputGroup: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.alertErrorBanner = page.locator('.oxd-alert--error');
    this.alertErrorMessage = page.locator('.oxd-alert--error .oxd-alert-content-text');
    this.usernameInputGroup = page.locator('.oxd-input-group').filter({ has: page.locator('input[name="username"]') });
    this.passwordInputGroup = page.locator('.oxd-input-group').filter({ has: page.locator('input[name="password"]') });
  }

  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/web/index.php/auth/login');
    await this.usernameInput.waitFor({ state: 'visible', timeout: 15000 });
    // Wait until OrangeHRM has injected a non-empty CSRF token into the form
    await this.page.waitForFunction(() => {
      const el = document.querySelector('input[name="_token"]') as HTMLInputElement;
      return el && el.value && el.value.length > 0;
    }, { timeout: 15000 });
  }

  async enterUsername(username: string): Promise<void> {
    if (username) {
      await this.usernameInput.fill(username);
    } else {
      await this.usernameInput.clear();
    }
  }

  async enterPassword(password: string): Promise<void> {
    if (password) {
      await this.passwordInput.fill(password);
    } else {
      await this.passwordInput.clear();
    }
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    await this.alertErrorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.alertErrorMessage.textContent())?.trim() || '';
  }

  async getFieldRequiredError(fieldName: 'username' | 'password'): Promise<Locator> {
    const group = fieldName === 'username' ? this.usernameInputGroup : this.passwordInputGroup;
    return group.locator('.oxd-input-group__message');
  }

  async isFieldBorderError(fieldName: 'username' | 'password'): Promise<boolean> {
    const input = fieldName === 'username' ? this.usernameInput : this.passwordInput;
    const classes = await input.getAttribute('class');
    return classes?.includes('oxd-input--error') || false;
  }
}
