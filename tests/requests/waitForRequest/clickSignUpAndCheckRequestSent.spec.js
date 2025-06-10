import { test } from '../../_fixtures/fixtures';
import { expect } from '../../../src/common/helpers/pw';
import { ROUTES } from '../../../src/api/constants/apiRoutes';

test('Click `Sign up` and check request sent', async ({ signUpPage }) => {
  await signUpPage.open();

  const request = await signUpPage.clickSignUpButtonAndWaitForRequest();

  expect(request.url()).toContain(ROUTES.users.index);
  expect(request.method()).toEqual('POST');
});
