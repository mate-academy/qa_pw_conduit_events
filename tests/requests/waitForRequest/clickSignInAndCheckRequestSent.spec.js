import { test } from '../../_fixtures/fixtures';
import { expect } from '#common/helpers/pw';
import { ROUTES } from '../../../src/api/constants/apiRoutes';
import { SignInPage } from '../../../src/ui/pages/auth/SignInPage';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

test.use({ contextsNumber: 2 });

test.beforeEach(async ({ pages, user }) => {
  await signUpUser(pages[0], user);
});

test('Click `Sign in` and check request sent', async ({ pages, user }) => {
  const signInPage = new SignInPage(pages[1]);

  await signInPage.open();
  await signInPage.fillEmailField(user.email);
  await signInPage.fillPasswordField(user.password);

  const request = await signInPage.clickSignInButtonAndWaitForRequest();

  expect(request.url()).toContain(ROUTES.users.login);
  expect(request.method()).toEqual('POST');
});
