import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SystemUsersPage extends BasePage {
  readonly pageHeading: Locator;
  readonly usernameFilterInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly recordsCounter: Locator;
  readonly tableRows: Locator;
  readonly emptyTableState: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.locator('.oxd-topbar-header-breadcrumb');
    // Field input Username pada form filter System Users (input text pertama di form row filter)
    this.usernameFilterInput = page.locator('.oxd-table-filter input.oxd-input, .oxd-form-row input.oxd-input').first();
    this.searchButton = page.locator('button[type="submit"]');
    this.resetButton = page.locator('button.oxd-button--ghost');
    this.recordsCounter = page.locator('.orangehrm-horizontal-padding span, .oxd-text--span').filter({ hasText: /Record/i });
    this.tableRows = page.locator('.oxd-table-body .oxd-table-card, .oxd-table-body .oxd-table-row');
    this.emptyTableState = page.locator('.oxd-text--toast-message, span:has-text("No Records Found")');
  }

  async navigateToSystemUsers(): Promise<void> {
    await this.navigateTo('/web/index.php/admin/viewSystemUsers');
    await this.usernameFilterInput.waitFor({ state: 'visible', timeout: 15000 });
  }

  async filterByUsername(username: string): Promise<void> {
    await this.usernameFilterInput.fill(username);
    await this.searchButton.click();
    await this.page.waitForTimeout(800); // Wait for AJAX table reload
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
    await this.page.waitForTimeout(800); // Wait for AJAX table reload
  }

  async getRecordsCounterText(): Promise<string> {
    await this.recordsCounter.waitFor({ state: 'visible', timeout: 8000 });
    return (await this.recordsCounter.textContent())?.trim() || '';
  }

  async getTableRowsCount(): Promise<number> {
    return this.tableRows.count();
  }

  async getRowUsernameText(rowIndex: number = 0): Promise<string> {
    const row = this.tableRows.nth(rowIndex);
    // Kolom kedua biasanya berisi username di OrangeHRM tabel
    const cell = row.locator('.oxd-table-cell').nth(1);
    return (await cell.textContent())?.trim() || '';
  }
}
