import { test } from '../../_fixtures/fixtures';
import {
  EMPTY_USERNAME_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  EMPTY_PASSWORD_MESSAGE,
} from '../../../src/ui/constants/authErrorMessages';

test.describe('Sign up negative tests', () => {
  test('Sign up with empty username', async ({ user, signUpPage }) => {
    await signUpPage.open();
    await signUpPage.fillEmailField(user.email);
    await signUpPage.fillPasswordField(user.password);
    await signUpPage.clickSignUpButton();

    await signUpPage.assertErrorMessageContainsText(EMPTY_USERNAME_MESSAGE);
  });

  test('Sign up with empty email', async ({ user, signUpPage }) => {
    await signUpPage.open();
    await signUpPage.fillUsernameField(user.username);
    await signUpPage.fillPasswordField(user.password);
    await signUpPage.clickSignUpButton();

    await signUpPage.assertErrorMessageContainsText(INVALID_EMAIL_MESSAGE);
  });

  test('Sign up with empty password', async ({ user, signUpPage }) => {
    await signUpPage.open();
    await signUpPage.fillUsernameField(user.username);
    await signUpPage.fillEmailField(user.email);
    await signUpPage.clickSignUpButton();

    await signUpPage.assertErrorMessageContainsText(EMPTY_PASSWORD_MESSAGE);
  });
});
