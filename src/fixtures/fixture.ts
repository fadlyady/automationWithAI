import { test as base, createBdd } from 'playwright-bdd';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { SystemUsersPage } from '../pages/system-users.page';

// Custom Fixtures definition
export type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  systemUsersPage: SystemUsersPage;
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  systemUsersPage: async ({ page }, use) => {
    await use(new SystemUsersPage(page));
  },
});

export const { Given, When, Then, Before, After } = createBdd(test);
