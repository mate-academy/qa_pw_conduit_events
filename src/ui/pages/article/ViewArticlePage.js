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
    this.commentInput = this.page.getByPlaceholder('Write a comment...');
    this.postCommentButton = this.page.getByRole('button', {
      name: 'Post Comment',
    });
    this.card = this.page.locator('.card');
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

  async addComment(commentText) {
    await this.step(`Add comment with text '${commentText}'`, async () => {
      await this.commentInput.fill(commentText);
      await this.postCommentButton.click();
    });
  }

  async removeComment(commentText) {
    await this.step(`Remove comment with text '${commentText}'`, async () => {
      const comment = this.card.filter({ hasText: commentText });
      const deleteButton = comment.locator('.ion-trash-a');
      await deleteButton.click();
    });
  }

  async addCommentAndWaitForRequest(commentText) {
    return await this.step(`Add comment and wait for request`, async () => {
      const requestPromise = this.page.waitForRequest(ROUTES.comments);
      await this.addComment(commentText);
      const request = await requestPromise;
      expect(request.url()).toContain('comments');
      expect(request.method()).toBe('POST');
    });
  }

  async removeCommentAndWaitForRequest(commentText) {
    return await this.step(`Remove comment and wait for request`, async () => {
      const url = ROUTES.comments + '/**';
      const requestPromise = this.page.waitForRequest(url);
      await this.removeComment(commentText);
      const request = await requestPromise;
      expect(request.url()).toContain('comments');
      expect(request.method()).toBe('DELETE');
    });
  }
}
