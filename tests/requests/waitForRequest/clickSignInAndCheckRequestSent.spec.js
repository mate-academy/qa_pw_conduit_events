import { test } from '../../_fixtures/fixtures';
import { expect } from 'allure-playwright';
import { ROUTES } from '../../../src/api/constants/apiRoutes';

test('Click `Sign in` and check request sent', async ({ signInPage }) => {
  await signInPage.open();

  const request = await signInPage.clickSignInButtonAndWaitForRequest();

  expect(request.url()).toContain(ROUTES.users.login);
  expect(request.method()).toEqual('POST');
});
