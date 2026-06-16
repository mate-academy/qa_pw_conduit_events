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
    this.articleInputComment = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
    this.comments = page.locator('.card');
  }

  tagListItem(tagName) {
    return this.page.getByRole('listitem').filter({ hasText: tagName });
  }

  async writeNewCommentAndWaitForRequest(commentText) {
    await this.step(`Write a new comment and wait for request`, async () => {
      const requestPromise = this.page.waitForRequest(
        `**${ROUTES.articles('**').comments}`,
      );

      await this.articleInputComment.fill(commentText);
      await this.postCommentButton.click();

      const request = await requestPromise;

      expect(request.url()).toContain('comments');
      expect(request.method()).toBe('POST');
    });
  }

  async removeCommentAndWaitForRequest(commentText) {
    await this.step(`Remove comment and wait for request`, async () => {
      const requestPromise = this.page.waitForRequest(
        `**${ROUTES.articles('**').comments}/**`,
      );

      const commentBlock = this.comments
        .filter({ hasText: commentText })
        .first();
      const deleteCommentButton = commentBlock.locator('.ion-trash-a');

      await deleteCommentButton.click();

      const request = await requestPromise;

      expect(request.url()).toContain('comments');
      expect(request.method()).toBe('DELETE');
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

  async assertCommentTextIsVisible(commentText) {
    await this.step(`Assert Comment text is visible`, async () => {
      await expect(
        this.comments.filter({ hasText: commentText }).first(),
      ).toBeVisible();
    });
  }

  async assertCommentTextIsNotVisible(commentText) {
    await this.step(`Assert Comment text is not visible`, async () => {
      await expect(
        this.comments.filter({ hasText: commentText }).first(),
      ).toBeHidden();
    });
  }
}
