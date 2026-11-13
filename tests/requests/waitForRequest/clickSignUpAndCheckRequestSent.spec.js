import { test } from '../../_fixtures/fixtures';
import { expect } from '../../../src/common/helpers/pw';
import { ROUTES } from '../../../src/api/constants/apiRoutes';

test('Click `Sign up` and check request sent', async ({
  signUpPage,
  baseURL,
}) => {
  await signUpPage.open();

  const request = await signUpPage.clickSignUpButtonAndWaitForRequest();

  expect(request.url()).toBe(new URL(ROUTES.users.index, baseURL).href);
  expect(request.method()).toEqual('POST');
});
