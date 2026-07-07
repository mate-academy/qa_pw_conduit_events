import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';

/*
Test:
1. Open sign in page
2. Create a new method within the 'SignInPage' class that 
  click the 'Sign in' button and wais for the request sent to the /api/users 
3. Assert the request URL is equal to the expected
4. Assert the request method is POST 
*/

test('Click `Sign in` and check request sent', async ({ signInPage }) => {
  await signInPage.open();
  await signInPage.fillEmailField('test@example.com');
  await signInPage.fillPasswordField('password');
  
  const request = await signInPage.clickSignInAndWaitForRequest();
  
  expect(request.url()).toContain('/api/users');
  expect(request.method()).toEqual('POST');
});