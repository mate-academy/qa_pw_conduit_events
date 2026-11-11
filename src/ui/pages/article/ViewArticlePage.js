import { expect } from '../../../common/helpers/pw';
import { BasePage } from '../BasePage';
import { ArticleHeader } from '../../components/article/ArticleHeader';
import { ROUTES } from '../../../api/constants/apiRoutes';

export class ViewArticlePage extends BasePage {
  articleId;

  constructor(page, userId = 0) {
    super(page, userId);
    this.articleHeader = new ArticleHeader(page);
    this.articleTitleHeader = page.getByRole('heading');
    this.articleFavoriteButton = page
      .getByRole('button', {
        name: 'Favorite Article',
      })
      .last();
    this.articleUnfavoriteButton = page
      .getByRole('button', {
        name: 'Unfavorite Article',
      })
      .last();
    this.postCommentButton = page.getByRole('button', {
      name: 'Post Comment',
    });
    this.deleteCommentButton = page.locator('.ion-trash-a').first();
    this.commentInput = page.getByPlaceholder('Write a comment...');
  }

  tagListItem(tagName) {
    return this.page.getByRole('listitem').filter({ hasText: tagName });
  }

  async assertArticleTextIsVisible(text) {
    await this.step(`Assert the article has correct text`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }

  async assertArticleTagsAreVisible(tags) {
    await this.step(`Assert the article has correct tags`, async () => {
      for (let i = 0; i < tags.length; i++) {
        await expect(this.tagListItem(tags[i])).toBeVisible();
      }
    });
  }

  async assertUnfavoriteButtonIsVisibleInArticleBody() {
    await this.step(
      `Assert the Unfavorite article button is shown in article body`,
      async () => {
        await expect(this.articleUnfavoriteButton).toBeVisible();
      },
    );
  }

  async assertFavoriteButtonIsVisibleInArticleBody() {
    await this.step(
      `Assert the Favorite article button is shown in article body`,
      async () => {
        await expect(this.articleFavoriteButton).toBeVisible();
      },
    );
  }

  async fillCommentInput(comment) {
    await this.step(`Fill the comment input`, async () => {
      await this.commentInput.fill(comment);
    });
  }

  async clickPostCommentButtonAndWaitForRequest() {
    await this.step(
      `Click the 'Post comment' button and wait for request`,
      async () => {
        const requestPromise = this.page.waitForRequest(
          `**${ROUTES.comments('**').create}`,
        );

        await this.postCommentButton.click();

        const request = await requestPromise;

        expect(request.url()).toContain('comments');
        expect(request.method()).toEqual('POST');
      },
    );
  }

  async clickDeleteCommentButtonAndWaitForRequest() {
    await this.step(
      `Click the 'Delete comment' button and wait for request`,
      async () => {
        const requestPromise = this.page.waitForRequest(
          `**${ROUTES.comments('**', '*').delete}`,
        );

        await this.deleteCommentButton.click();

        const request = await requestPromise;

        expect(request.url()).toContain('comments');
        expect(request.method()).toEqual('DELETE');
      },
    );
  }
}
