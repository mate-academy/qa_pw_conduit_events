import { test } from '../../_fixtures/fixtures';

test('Open SignUp page from Home page', async ({
  signUpPage,
  externalHomePage,
}) => {
  await externalHomePage.open();

  await externalHomePage.header.clickSignUpLink();

  await signUpPage.assertOpened();
});
