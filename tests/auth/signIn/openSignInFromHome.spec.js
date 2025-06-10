import { test } from '../../_fixtures/fixtures';

test('Open Sign In page from Home page', async ({
  signInPage,
  externalHomePage,
}) => {
  await externalHomePage.open();

  await externalHomePage.header.clickSignInLink();

  await signInPage.assertOpened();
});
