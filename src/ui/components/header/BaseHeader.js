import { BaseComponent } from '../BaseComponent';

export class BaseHeader extends BaseComponent {
  #homeLink;
  #conduitLogo;

  constructor(page, userId = 0) {
    super(page, userId);
    this.#conduitLogo = this.page.getByRole('link', { name: 'Conduit' });
    this.#homeLink = this.page.getByRole('link', { name: 'Home' });
  }

  async clickConduitLogo() {
    await this.step(`Click 'Conduit' logo in the page header`, async () => {
      await this.#conduitLogo.click();
    });
  }

  async clickHomeLink() {
    await this.step(`Click 'Home' link in the page header`, async () => {
      await this.#homeLink.click();
    });
  }
}
