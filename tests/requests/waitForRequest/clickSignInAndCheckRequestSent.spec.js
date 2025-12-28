import { test } from '../../_fixtures/fixtures';
import { expect } from '../../../src/common/helpers/pw';
import { ROUTES } from '../../../src/api/constants/apiRoutes';

test('Click `Sign in` and check request sent', async ({ signInPage }) => {
  // 1. Otwórz stronę logowania
  await signInPage.open();

  // 2. Kliknij przycisk Sign In i poczekaj na żądanie
  const request = await signInPage.clickSignInButtonAndWaitForRequest();

  // 3. Sprawdź, czy wysłano właściwe żądanie
  expect(request.url()).toContain(ROUTES.users.login); // POST na /users/login
  expect(request.method()).toEqual('POST');
});

