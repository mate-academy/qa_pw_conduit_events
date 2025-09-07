import { test } from '../../_fixtures/fixtures';
import { expect } from '../../../src/common/helpers/pw';
import { ROUTES } from '../../../src/api/constants/apiRoutes';

/*
Test:
1. Open sign in page
2. Create a new method within the 'SignInPage' class that 
  click the 'Sign in' button and wait for the request sent to the /api/users 
3. Assert the request URL is equal to the expected
4. Assert the request method is POST 
*/

test('Click `Sign in` and check request sent', async ({ signInPage }) => {
  await signInPage.open();

  await signInPage.fillEmailField('email@email.com');
  await signInPage.fillPasswordField('password');

  const request = await signInPage.clickSignUpButtonAndWaitForRequest();

  expect(request.url()).toContain(ROUTES.users.login);
  expect(request.method()).toEqual('POST');
});
