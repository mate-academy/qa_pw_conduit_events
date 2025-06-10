import { test } from '../../_fixtures/fixtures';
import {
  EMPTY_EMAIL_MESSAGE,
  EMPTY_PASSWORD_MESSAGE,
  INVALID_EMAIL_OR_PASSWORD_MESSAGE,
} from '../../../src/ui/constants/authErrorMessages';
import { generateNewUserData } from '../../../src/common/testData/generateNewUserData';

const user = generateNewUserData();
const testParameters = [
  {
    email: user.email,
    password: '',
    message: EMPTY_PASSWORD_MESSAGE,
    title: 'empty password',
  },
  {
    email: '',
    password: user.password,
    message: EMPTY_EMAIL_MESSAGE,
    title: 'empty email',
  },
  {
    email: user.email,
    password: '1',
    message: INVALID_EMAIL_OR_PASSWORD_MESSAGE,
    title: 'wrong password',
  },
];

testParameters.forEach(({ email, password, message, title }) => {
  test.describe('Sign in negative tests', () => {
    test(`Sign in with ${title}`, async ({ signInPage }) => {
      await signInPage.open();
      await signInPage.fillEmailField(email);
      await signInPage.fillPasswordField(password);
      await signInPage.clickSignInButton();
      await signInPage.assertErrorMessageContainsText(message);
    });
  });
});
