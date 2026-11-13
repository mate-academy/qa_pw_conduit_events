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
    this.articleWriteCommentField = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
    this.deleteCommentIcon = page.locator('.ion-trash-a');
  }

  async writeComment(text) {
    await this.step(`Write a comment`, async () => {
      await this.articleWriteCommentField.fill(text);
    });
  }

  async clickPostCommentButtonAndWaitForRequest() {
    await this.step(
      `Click "Post Comment" button and wait for request`,
      async () => {
        const requestPromise = this.page.waitForRequest(
          `**${ROUTES.articles('**').addComment}`,
        );

        await this.postCommentButton.click();

        const request = await requestPromise;

        expect(request.url()).toContain('comments');
        expect(request.method()).toBe('POST');
      },
    );
  }

  async clickDeleteCommentIconAndWaitForRequest() {
    await this.step(
      `Click "Delete Comment" icon and wait for request`,
      async () => {
        const requestPromise = this.page.waitForRequest(
          `**${ROUTES.articles('**').deleteComment('**')}`,
        );

        await this.deleteCommentIcon.click();

        const request = await requestPromise;

        expect(request.url()).toContain('comments');
        expect(request.method()).toBe('DELETE');
      },
    );
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

  async assertCommentIsVisible(comment) {
    await this.step(`Assert the comment is visible`, async () => {
      await expect(this.page.getByText(comment)).toBeVisible();
    });
  }

  async assertCommentIsNotVisible(comment) {
    await this.step(`Assert the comment is Not visible`, async () => {
      await expect(this.page.getByText(comment)).toBeHidden();
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
}
