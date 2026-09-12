import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly userDropdownTab: Locator;
  readonly userDropdownMenu: Locator;
  readonly logoutLink: Locator;
  readonly sidebarSearchInput: Locator;
  readonly sidebarMenuContainer: Locator;
  readonly sidebarMenuItems: Locator;
  readonly adminMenuItem: Locator;
  readonly topbarHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.userDropdownTab = page.locator('.oxd-userdropdown-tab');
    this.userDropdownMenu = page.locator('.oxd-userdropdown');
    this.logoutLink = page.locator('.oxd-userdropdown-link[href*="logout"]');
    this.sidebarSearchInput = page.locator('.oxd-sidepanel .oxd-input');
    this.sidebarMenuContainer = page.locator('ul.oxd-main-menu');
    this.sidebarMenuItems = page.locator('ul.oxd-main-menu li .oxd-main-menu-item');
    this.adminMenuItem = page.locator('a.oxd-main-menu-item[href*="admin"]');
    this.topbarHeader = page.locator('.oxd-topbar-header');
  }

  async isDashboardLoaded(): Promise<boolean> {
    await this.topbarHeader.waitFor({ state: 'visible', timeout: 15000 });
    return this.page.url().includes('/dashboard/index');
  }

  async openUserDropdown(): Promise<void> {
    await this.userDropdownTab.click();
    await this.logoutLink.waitFor({ state: 'visible', timeout: 5000 });
  }

  async logout(): Promise<void> {
    await this.openUserDropdown();
    await this.logoutLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async searchSidebar(keyword: string): Promise<void> {
    await this.sidebarSearchInput.fill(keyword);
    // Tunggu animasi filter DOM
    await this.page.waitForTimeout(300);
  }

  async clearSidebarSearch(): Promise<void> {
    await this.sidebarSearchInput.clear();
    await this.page.waitForTimeout(300);
  }

  async getVisibleMenuItems(): Promise<Locator[]> {
    const items = await this.sidebarMenuItems.all();
    const visible: Locator[] = [];
    for (const item of items) {
      if (await item.isVisible()) {
        visible.push(item);
      }
    }
    return visible;
  }

  async getVisibleMenuTexts(): Promise<string[]> {
    const visibleItems = await this.getVisibleMenuItems();
    const texts: string[] = [];
    for (const item of visibleItems) {
      const text = await item.textContent();
      if (text) texts.push(text.trim());
    }
    return texts;
  }

  async navigateToAdminModule(): Promise<void> {
    await this.adminMenuItem.click();
    await this.page.waitForLoadState('networkidle');
  }
}
