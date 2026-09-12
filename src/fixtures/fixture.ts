import { test as base, createBdd } from 'playwright-bdd';

// Custom Fixtures definition (Page Objects, API Clients, Database Helpers)
export type CustomFixtures = {
  // To be added as we build Page Objects and API clients
};

export const test = base.extend<CustomFixtures>({
  // Fixture implementations will be registered here
});

export const { Given, When, Then, Before, After } = createBdd(test);
