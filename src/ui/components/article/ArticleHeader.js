import { BaseComponent } from '../BaseComponent';
import { expect } from '../../../common/helpers/pw';
import { ROUTES } from '../../../api/constants/apiRoutes';

export class ArticleHeader extends BaseComponent {
  constructor(page, userId = 0) {
    super(page, userId);
    this.title = page.getByRole('heading');
    this.articleFavoriteButton = page
      .getByRole('button', {
        name: 'Favorite Article',
      })
      .first();
    this.articleUnfavoriteButton = page
      .getByRole('button', {
        name: 'Unfavorite Article',
      })
      .first();
  }

  async clickFollowArtcileAndWaitForRequest() {
    await this.step(
      `Click the Follow article button and wait for request`,
      async () => {
        const requestPromise = this.page.waitForRequest(
          `**${ROUTES.articles('**').favorite}`,
        );

        await this.articleFavoriteButton.click();

        const request = await requestPromise;

        expect(request.url()).toContain('favorite');
        expect(request.method()).toEqual('POST');
      },
    );
  }

  async clickUnfollowArtcileAndWaitForRequest() {
    await this.step(
      `Click the Unfollow article button and wait for request`,
      async () => {
        const requestPromise = this.page.waitForRequest(
          `**${ROUTES.articles('**').favorite}`,
        );

        await this.articleUnfavoriteButton.click();

        const request = await requestPromise;

        expect(request.url()).toContain('favorite');
        expect(request.method()).toEqual('DELETE');
      },
    );
  }

  async assertTitleIsVisible(title) {
    await this.step(`Assert the article has correct title`, async () => {
      await expect(this.title).toContainText(title);
    });
  }

  authorLink(username) {
    return this.page.getByRole('link', { username }).first();
  }

  async assertAuthorNameIsVisible(username) {
    await this.step(
      `Assert the article has correct author username`,
      async () => {
        await expect(this.authorLink(username)).toBeVisible();
      },
    );
  }

  async assertUnfavoriteButtonIsVisibleInArticleHeader() {
    await this.step(
      `Assert the Unfavorite article button is shown in article header`,
      async () => {
        await expect(this.articleUnfavoriteButton).toBeVisible();
      },
    );
  }

  async assertFavoriteButtonIsVisibleInArticleHeader() {
    await this.step(
      `Assert the Favorite article button is shown in article header`,
      async () => {
        await expect(this.articleFavoriteButton).toBeVisible();
      },
    );
  }
}
