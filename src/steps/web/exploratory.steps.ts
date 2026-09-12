import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/fixture';

When('Pengguna mengklik tombol Login secara cepat berulang', async ({ loginPage }) => {
  // Rapid double click simulation (<200ms)
  await Promise.all([
    loginPage.clickLogin(),
    loginPage.clickLogin(),
  ]);
});

When('Pengguna mengakses langsung URL terproteksi {string}', async ({ page }, targetUrl: string) => {
  await page.goto(targetUrl);
  await page.waitForLoadState('networkidle');
});

Then('Browser tidak mengalami crash atau error visual dan berpindah ke dashboard', async ({ dashboardPage }) => {
  await dashboardPage.isDashboardLoaded();
});
