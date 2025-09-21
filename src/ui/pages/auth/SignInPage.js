import { expect } from '../../../common/helpers/pw';
import { BasePage } from '../BasePage';
import { ROUTES } from '../../../api/constants/apiRoutes';

export class SignInPage extends BasePage {
  constructor(page, userId = 0) {
    super(page, userId);
    this._url = '/user/login';
    this.emailField = page.getByPlaceholder('Email');
    this.passwordField = page.getByPlaceholder('Password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('list').nth(1);
  }

  async fillEmailField(email) {
    await this.step(`Fill the 'Email' field`, async () => {
      await this.emailField.fill(email);
    });
  }

  async fillPasswordField(password) {
    await this.step(`Fill the 'Password' field`, async () => {
      await this.passwordField.fill(password);
    });
  }

  async clickSignInButton() {
    await this.step(`Click the 'Sign in' button`, async () => {
      await this.signInButton.click();
    });
  }

  async clickSignInButtonAndWaitForRequest() {
    return await this.step(`Click 'Sign in' and wait for login request`, async () => {
      const [req] = await Promise.all([
        this.page.waitForRequest(r =>
          r.url().includes(ROUTES.users.login) && r.method() === 'POST'
        ),
        this.signInButton.click(), // ⬅ reuse the locator from constructor
      ]);
      return req;
    });
  }

  async assertErrorMessageContainsText(messageText) {
    await this.step(`Assert the '${messageText}' error is shown`, async () => {
      await expect(this.errorMessage).toContainText(messageText);
    });
  }
}
