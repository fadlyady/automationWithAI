import { expect } from '@playwright/test';
import { Given, When, Then } from '../../fixtures/fixture';

Given('Pengguna berada di halaman login OrangeHRM', async ({ loginPage }) => {
  await loginPage.navigateToLoginPage();
});

Given('Pengguna belum melakukan login ke dalam sistem', async ({ page }) => {
  // Clear cookies and session
  await page.context().clearCookies();
});

When('Pengguna memasukkan {string} pada input field Username', async ({ loginPage }, username: string) => {
  await loginPage.enterUsername(username);
});

When('Pengguna memasukkan {string} pada input field Password', async ({ loginPage }, password: string) => {
  await loginPage.enterPassword(password);
});

When('Pengguna mengosongkan input field Username', async ({ loginPage }) => {
  await loginPage.enterUsername('');
});

When('Pengguna mengosongkan input field Password', async ({ loginPage }) => {
  await loginPage.enterPassword('');
});

When('Pengguna mengklik tombol {string}', async ({ loginPage }, buttonLabel: string) => {
  if (buttonLabel.toLowerCase() === 'login') {
    await loginPage.clickLogin();
  }
});

When('Pengguna langsung mengklik tombol {string} tanpa mengisi field apapun', async ({ loginPage }) => {
  await loginPage.clickLogin();
});

When('Pengguna membuka menu dropdown profil pengguna', async ({ dashboardPage }) => {
  await dashboardPage.openUserDropdown();
});

When('Pengguna mengklik tautan {string}', async ({ dashboardPage }, linkLabel: string) => {
  if (linkLabel.toLowerCase() === 'logout') {
    await dashboardPage.logoutLink.click();
  }
});

When('Pengguna menekan tombol {string} pada browser', async ({ page }) => {
  await page.goBack();
  await page.waitForLoadState('networkidle');
});

Then('Browser berhasil dialihkan ke URL Dashboard {string}', async ({ page }, expectedUrl: string) => {
  await page.waitForURL(`**${expectedUrl}`, { timeout: 15000 });
  expect(page.url()).toContain(expectedUrl);
});

Then('Header menampilkan nama profil pengguna dan sidebar menu navigasi ditampilkan lengkap', async ({ dashboardPage }) => {
  await expect(dashboardPage.userDropdownTab).toBeVisible({ timeout: 10000 });
  await expect(dashboardPage.sidebarMenuContainer).toBeVisible();
});

Then('URL browser tetap berada di {string}', async ({ page }, expectedUrl: string) => {
  expect(page.url()).toContain(expectedUrl);
});

Then('Muncul banner alert merah dengan pesan {string}', async ({ loginPage }, expectedError: string) => {
  const alertText = await loginPage.getErrorMessage();
  expect(alertText).toContain(expectedError);
});

Then('Form submission diblokir dan URL tetap {string}', async ({ page }, expectedUrl: string) => {
  expect(page.url()).toContain(expectedUrl);
});

Then('Di bawah input field Username muncul teks label error {string}', async ({ loginPage }, expectedText: string) => {
  const errorLocator = await loginPage.getFieldRequiredError('username');
  await expect(errorLocator).toBeVisible();
  expect(await errorLocator.textContent()).toContain(expectedText);
});

Then('Di bawah input field Password muncul teks label error {string}', async ({ loginPage }, expectedText: string) => {
  const errorLocator = await loginPage.getFieldRequiredError('password');
  await expect(errorLocator).toBeVisible();
  expect(await errorLocator.textContent()).toContain(expectedText);
});

Then('Border input field Username berubah warna menjadi merah', async ({ loginPage }) => {
  const isError = await loginPage.isFieldBorderError('username');
  expect(isError).toBeTruthy();
});

Then('Border input field Password berubah warna menjadi merah', async ({ loginPage }) => {
  const isError = await loginPage.isFieldBorderError('password');
  expect(isError).toBeTruthy();
});

Then('Karakter password pada field Password tersamar dengan atribut type bernilai {string}', async ({ loginPage }, expectedType: string) => {
  const typeAttr = await loginPage.passwordInput.getAttribute('type');
  expect(typeAttr).toBe(expectedType);
});

Then('Browser berhasil dialihkan kembali ke URL Login {string}', async ({ page }, expectedUrl: string) => {
  await page.waitForURL(`**${expectedUrl}`, { timeout: 15000 });
  expect(page.url()).toContain(expectedUrl);
});

Then('Form login ditampilkan bersih dan siap menerima input baru', async ({ loginPage }) => {
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
});

Then('Sistem secara otomatis memaksa redirect kembali ke {string}', async ({ page }, expectedUrl: string) => {
  await page.waitForURL(`**${expectedUrl}`, { timeout: 15000 });
  expect(page.url()).toContain(expectedUrl);
});
