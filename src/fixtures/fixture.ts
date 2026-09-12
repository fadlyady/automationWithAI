import { test as base, createBdd } from 'playwright-bdd';

// Custom Fixtures definition
export type CustomFixtures = {
  // Page Objects, API Clients, and custom helpers to be registered here
};

export const test = base.extend<CustomFixtures>({
  // Fixture implementations to be registered here
});

export const { Given, When, Then, Before, After } = createBdd(test);
