import { test } from '../../_fixtures/fixtures';

test('Successful `Sign up` flow test', async ({
  user,
  signUpPage,
  internalHomePage,
}) => {
  await signUpPage.open();
  await signUpPage.fillUsernameField(user.username);
  await signUpPage.fillEmailField(user.email);
  await signUpPage.fillPasswordField(user.password);
  await signUpPage.clickSignUpButton();

  await internalHomePage.yourFeed.assertTabLinkVisible();
});
