import { expect } from '../../../common/helpers/pw';
import { BasePage } from '../BasePage';
import { ArticleHeader } from '../../components/article/ArticleHeader';
import { ROUTES } from '../../../api/constants/apiRoutes';
import { faker } from '@faker-js/faker';

export class ViewArticlePage extends BasePage {
  articleId;

  constructor(page, userId = 0) {
    super(page, userId);
    this.articleHeader = new ArticleHeader(page);
    this.articleTitleHeader = page.getByRole('heading');
    this.commentField = page.getByPlaceholder('Write a comment...');
    this.postComment = page.getByRole('button', {name: 'Post Comment'});
    this.deleteIcon = page.locator('.mod-options .ion-trash-a');
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

  async clickPostCommentButtonAndWaitForRequest(slug) {
    return await this.step(
      `Click the 'post comment' button and wait for request `,
      async () => {
        const sentence = faker.lorem.sentence();
        const requestPromise = this.page.waitForRequest(
          req =>
            req.url().includes(ROUTES.articles(slug).index + '/comments') &&
            req.method() === 'POST'
        );

        await this.commentField.fill(sentence);
        await this.postComment.click();

        return await requestPromise;
      },
    );
  }

  async clickDeleteCommentButtonAndWaitForRequest() {
    return await this.step(
      `Click the 'delete comment' button and wait for request `,
      async () => {
        const requestPromise = this.page.waitForRequest(
          req =>
            req.url().includes('/comments') &&
            req.method() === 'DELETE'
        );

        await this.deleteIcon.click();

        return await requestPromise;
      },
    );
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
}
