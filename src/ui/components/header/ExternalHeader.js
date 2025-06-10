import { BaseHeader } from './BaseHeader';

export class ExternalHeader extends BaseHeader {
  #signUpLink;
  #signInLink;

  constructor(page, userId = 0) {
    super(page, userId);
    this.#signUpLink = this.page.getByRole('link', { name: 'Sign up' });
    this.#signInLink = this.page.getByRole('link', { name: 'Sign in' });
  }

  async clickSignUpLink() {
    await this.step(`Click 'Sign Up' link`, async () => {
      await this.#signUpLink.click();
    });
  }

  async clickSignInLink() {
    await this.step(`Click 'Sign In' link`, async () => {
      await this.#signInLink.click();
    });
  }
}
