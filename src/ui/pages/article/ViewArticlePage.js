import { expect } from 'playwright/test';
import { BasePage } from '../BasePage';
import { ArticleHeader } from '../../components/article/ArticleHeader';
import { ROUTES } from '../../../api/constants/apiRoutes';

export class ViewArticlePage extends BasePage {
  articleId;

  constructor(page, userId = 0) {
    super(page, userId);
    this.articleHeader = new ArticleHeader(page);
    this.articleTitleHeader = page.getByRole('heading');
    this.commentField = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByText('Post Comment');
    this.deleteCommentButton = page.locator('.ion-trash-a');
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
  }

  tagListItem(tagName) {
    return this.page.getByRole('listitem').filter({ hasText: tagName });
  }

  async addCommentAndWaitForRequest(commentText, articleSlug) {
    return await this.step(`Add comment and wait for request`, async () => {
      const requestPromise = this.page.waitForRequest(
        ROUTES.articles(articleSlug).comments().post,
      );

      const responsePromise = this.page.waitForResponse(
        ROUTES.articles(articleSlug).comments().post,
      );

      await this.commentField.fill(commentText);
      await this.postCommentButton.click();

      const request = await requestPromise;
      const response = await responsePromise;

      expect(request.url()).toContain('comments');
      expect(request.method()).toEqual('POST');

      const body = await response.json();
      return await body.comment.id;
      })
  }

  async removeCommentAndWaitForRequest(commentText, articleSlug, commentId) {
    return await this.step(`Remove comment and wait for request`, async () => {
      const requestPromise = this.page.waitForRequest(
        ROUTES.articles(articleSlug).comments(commentId).delete,
      );

      await this.deleteCommentButton.click();

      const request = await requestPromise;

      expect(request.url()).toContain('comments');
      expect(request.method()).toEqual('DELETE');
    });
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

  async assertNoCommentVisible(comment) {
    await this.step(
      `Assert that comment ${comment} is not visible`,
      async () => {
        await expect(this.page.getByText(comment)).toBeHidden();
      }
    )
  }
}
