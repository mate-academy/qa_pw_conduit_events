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

test('Click `Sign in` and check request sent', async ({
signInPage, 
page
}) => {
 await signInPage.open();
 await signInPage.fillEmailField('test@example.com');
 await signInPage.fillPasswordField('password');
 await signInPage.clickSignInButton();

  const requestPromise = signInPage.page.waitForRequest('**/api/users/login**');
  await signInPage.clickSignInButton();
  const request = await requestPromise;
   expect(request.url()).toContain('/api/users');
   expect(request.method()).toEqual('POST');
 });