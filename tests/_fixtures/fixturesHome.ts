import { test as base } from '@playwright/test';
import { InternalHomePage } from '../../src/ui/pages/home/InternalHomePage';
import { ExternalHomePage } from '../../src/ui/pages/home/ExternalHomePage';

export const test = base.extend<{
  internalHomePage;
  externalHomePage;
}>({
  internalHomePage: async ({ page }, use) => {
    const homePage = new InternalHomePage(page);

    await use(homePage);
  },
  externalHomePage: async ({ page }, use) => {
    const homePage = new ExternalHomePage(page);

    await use(homePage);
  },
});
