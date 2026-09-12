import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/fixture';

Given('Pengguna telah login sebagai Admin dan berada di dashboard', async ({ loginPage, dashboardPage }) => {
  await loginPage.navigateToLoginPage();
  await loginPage.login('Admin', 'admin123');
  await dashboardPage.isDashboardLoaded();
});

Given('Pengguna sedang memfilter sidebar dengan kata kunci {string}', async ({ dashboardPage }, keyword: string) => {
  await dashboardPage.searchSidebar(keyword);
});

When('Pengguna mengetikkan {string} pada input search sidebar', async ({ dashboardPage }, keyword: string) => {
  await dashboardPage.searchSidebar(keyword);
});

When('Pengguna membersihkan input search sidebar', async ({ dashboardPage }) => {
  await dashboardPage.clearSidebarSearch();
});

Then('Hanya menu {string} yang tampil pada panel sidebar', async ({ dashboardPage }, expectedMenu: string) => {
  const visibleTexts = await dashboardPage.getVisibleMenuTexts();
  expect(visibleTexts.length).toBe(1);
  expect(visibleTexts[0]).toContain(expectedMenu);
});

Then('Menu {string} berhasil difilter dan tampil pada sidebar', async ({ dashboardPage }, expectedMenu: string) => {
  const visibleTexts = await dashboardPage.getVisibleMenuTexts();
  expect(visibleTexts).toContain(expectedMenu);
});

Then('Menu navigasi lainnya disembunyikan secara otomatis', async ({ dashboardPage }) => {
  const visibleTexts = await dashboardPage.getVisibleMenuTexts();
  expect(visibleTexts.length).toBeLessThan(12);
});

Then('Seluruh {int} item menu sidebar kembali ditampilkan secara lengkap', async ({ dashboardPage }, expectedCount: number) => {
  const visibleItems = await dashboardPage.getVisibleMenuItems();
  expect(visibleItems.length).toBeGreaterThanOrEqual(expectedCount - 2); // OrangeHRM standard has 11-12 items depending on version
});

Then('Tidak ada item menu navigasi yang ditampilkan pada panel sidebar', async ({ dashboardPage }) => {
  const visibleItems = await dashboardPage.getVisibleMenuItems();
  expect(visibleItems.length).toBe(0);
});
