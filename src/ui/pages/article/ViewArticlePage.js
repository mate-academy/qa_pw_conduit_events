import { expect } from '#common/helpers/pw';
import { BasePage } from '../BasePage';
import { ArticleHeader } from '../../components/article/ArticleHeader';

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
    this.commentField = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', {
      name: 'Post Comment',
    });
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

  async addCommentAndWaitForPostRequest(commentText) {
    return await this.step(
      `Add comment and wait for POST request to comments`,
      async () => {
        const requestPromise = this.page.waitForRequest(
          request =>
            request.url().includes('comments') && request.method() === 'POST',
        );

        await this.commentField.fill(commentText);
        await this.postCommentButton.click();

        return await requestPromise;
      },
    );
  }

  getLastCommentDeleteButton() {
    return this.page
      .locator(
        '[class*="trash"], [class*="delete"], .ion-trash-a, .ion-trash-b, [title="Delete"], [title="delete"], [aria-label*="delete" i]',
      )
      .last();
  }

  async deleteCommentAndWaitForDeleteRequest() {
    return await this.step(
      `Delete comment and wait for DELETE request to comments`,
      async () => {
        const requestPromise = this.page.waitForRequest(
          request =>
            request.url().includes('comments') &&
            request.method() === 'DELETE',
        );

        await this.getLastCommentDeleteButton().click();

        return await requestPromise;
      },
    );
  }
}
