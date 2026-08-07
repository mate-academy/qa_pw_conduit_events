import { test } from '../../_fixtures/fixtures';
import { ROUTES } from '../../../src/api/constants/apiRoutes';
import { expect } from 'allure-playwright';

/*
Test:
1. Open sign in page
2. Create a new method within the 'SignInPage' class that 
  click the 'Sign in' button and waits for the request sent to the /api/users
3. Assert the request URL is equal to the expected
4. Assert the request method is POST 
*/

test('Click `Sign in` and check request sent', async ({ signInPage }) => {
  await signInPage.open();

  const request = await signInPage.clickSignInButtonAndWaitForRequest();

  expect(request.url()).toContain(ROUTES.users.login)
  expect(request.method()).toEqual('POST');
});

