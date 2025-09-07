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

    this.container = page.locator('form.card.comment-form');
    this.commentField = this.container.locator('textarea.form-control');
    this.postCommentButton = page.getByRole('button', { name: /Post Comment/ });
    this.deleteCommentButton = page.locator('.ion-trash-a');
    this.commentBlocks = page.locator('.card');
  }

  async fillComment(text) {
    await this.step(`Add a comment`, async () => {
      await this.commentField.fill(text);
    });
  }

  async clickPostCommentButton() {
    await this.step(`Click 'Post Comment' button`, async () => {
      await this.postCommentButton.click();
    });
  }

  async submitComment(text) {
    await this.step(`Submit comment for article`, async () => {
      await this.fillComment(text);
      await this.clickPostCommentButton();
    });
  }

  async submitCommentAndWaitForRequest(text, articleUrl = null) {
    return await this.step(
      `Submit comment for article and wait for request`,
      async () => {
        if (!articleUrl) {
          throw Error(`The 'Article URL' is required`);
        }
        const slug = articleUrl.split('/').pop();
        await this.fillComment(text);
        const requestPromise = this.page.waitForRequest(
          ROUTES.articles(slug).comments,
        );
        await this.postCommentButton.click();

        return await requestPromise;
      },
    );
  }

  async deleteCommentByText(comment) {
    await this.step(`Delete 'Comment' by text`, async () => {
      const specificCommentBlock = this.commentBlocks.filter({
        hasText: comment,
      });
      await specificCommentBlock.waitFor({ state: 'visible' });
      await expect(specificCommentBlock).toHaveText(comment);
      await specificCommentBlock.locator('.ion-trash-a').click();
    });
  }

  async deleteCommentByTextAndWAitForRequest(comment, articleUrl) {
    return await this.step(
      `Delete 'Comment' by text and wait for reqeust`,
      async () => {
        if (!articleUrl) {
          throw Error(`The 'Article URL' is required`);
        }
        const specificCommentBlock = this.commentBlocks.filter({
          hasText: comment,
        });
        await specificCommentBlock.waitFor({ state: 'visible' });
        await expect(specificCommentBlock).toContainText(comment);

        const slug = articleUrl.split('/').pop();
        const requestPromise = this.page.waitForRequest(r =>
          r.url().includes(`${ROUTES.articles(slug).comments}/`),
        );
        await specificCommentBlock.locator('.ion-trash-a').click();

        return await requestPromise;
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

  async assertAddedCommentIsVisible(comment) {
    await this.step(`Assert the just posted Comment is visible`, async () => {
      const commentBlock = this.commentBlocks.locator('.card-block', {
        hasText: comment,
      });
      await commentBlock.waitFor({ state: 'visible', timeout: 15000 });
      await expect(commentBlock).toBeVisible();
    });
  }

  async assertDeletedCommentIsNotVisible(comment) {
    await this.step(`Assert the deleted Comment is not visible`, async () => {
      const commentTexts = await this.commentBlocks.allTextContents();
      expect(commentTexts).not.toContain(comment);
    });
  }
}
