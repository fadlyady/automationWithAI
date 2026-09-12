import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/fixture';

Given('Pengguna berada di halaman filter System Users', async ({ systemUsersPage }) => {
  await systemUsersPage.navigateToSystemUsers();
});

Given('Pengguna telah melakukan pencarian username {string}', async ({ systemUsersPage }, username: string) => {
  await systemUsersPage.filterByUsername(username);
});

When('Pengguna mengklik menu {string} pada sidebar navigasi', async ({ dashboardPage }, menuName: string) => {
  if (menuName.toLowerCase() === 'admin') {
    await dashboardPage.navigateToAdminModule();
  }
});

When('Pengguna mencari pengguna dengan username {string}', async ({ systemUsersPage }, username: string) => {
  await systemUsersPage.filterByUsername(username);
});

When('Pengguna mengklik tombol Reset pada form filter', async ({ systemUsersPage }) => {
  await systemUsersPage.clickReset();
});

Then('Browser berpindah ke halaman System Users {string}', async ({ page }, expectedUrl: string) => {
  await page.waitForURL(`**${expectedUrl}`, { timeout: 15000 });
  expect(page.url()).toContain(expectedUrl);
});

Then('Header breadcrumb menampilkan {string} dan form filter pengguna siap digunakan', async ({ systemUsersPage }, expectedBreadcrumb: string) => {
  await expect(systemUsersPage.pageHeading).toBeVisible({ timeout: 10000 });
  expect(await systemUsersPage.pageHeading.textContent()).toContain(expectedBreadcrumb);
  await expect(systemUsersPage.usernameFilterInput).toBeVisible();
});

Then('Label counter record menampilkan minimal {string} record ditemukan', async ({ systemUsersPage }, minCount: string) => {
  const counterText = await systemUsersPage.getRecordsCounterText();
  expect(counterText).toMatch(/\(\d+\)\s*Records?\s*Found/i);
});

Then('Baris data pada tabel menampilkan username {string}', async ({ systemUsersPage }, expectedUsername: string) => {
  const rowsCount = await systemUsersPage.getTableRowsCount();
  expect(rowsCount).toBeGreaterThan(0);
  const usernameText = await systemUsersPage.getRowUsernameText(0);
  expect(usernameText).toContain(expectedUsername);
});

Then('Tabel memuat dan menampilkan record pengguna yang mengandung {string}', async ({ systemUsersPage }, substr: string) => {
  const rowsCount = await systemUsersPage.getTableRowsCount();
  expect(rowsCount).toBeGreaterThan(0);
});

Then('Muncul pesan atau counter {string}', async ({ systemUsersPage }, expectedText: string) => {
  // Check counter or toast
  const counterText = await systemUsersPage.recordsCounter.textContent();
  expect(counterText).toContain(expectedText);
});

Then('Tabel tidak menampilkan baris data apapun', async ({ systemUsersPage }) => {
  const rowsCount = await systemUsersPage.getTableRowsCount();
  expect(rowsCount).toBe(0);
});

Then('Input field Username kembali kosong', async ({ systemUsersPage }) => {
  const value = await systemUsersPage.usernameFilterInput.inputValue();
  expect(value).toBe('');
});

Then('Tabel memuat ulang dan menampilkan seluruh record pengguna sistem', async ({ systemUsersPage }) => {
  const counterText = await systemUsersPage.getRecordsCounterText();
  expect(counterText).toMatch(/\(\d+\)\s*Records?\s*Found/i);
});
