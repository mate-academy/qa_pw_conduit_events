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
    this.articleCommentField = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', {name: 'Post Comment'});

  }

  getRemoveCommentButtonByCommentText(commentText) {
    const target = this.page.getByText(commentText);
    const brother = target.locator('xpath=following-sibling::*[1]');
    return brother.locator('.ion-trash-a');
  }

  tagListItem(tagName) {
    return this.page.getByRole('listitem').filter({ hasText: tagName });
  }

  async addCommentForArticleAndWaitForRequest(newComment) {
    await this.step(
      `Add new article comment ${newComment} and wait for request`,
      async () => {

        const requestPromise = this.page.waitForRequest(
            `**${ROUTES.articles('**').comment}`
          );

        await this.articleCommentField.fill(newComment);
        await this.postCommentButton.click();

        const request = await requestPromise;

        expect(request.url()).toContain('comments');
        expect(request.method()).toEqual('POST');
      });
  }

  async removeCommentForArticleAndWaitForRequest(rComment) {
    return await this.step(
      `Remove created article comment ${rComment} and wait for request`,
      async () => {

        const requestPromise = this.page.waitForRequest(
          `**${ROUTES.articles('**').comment}/**`
        );
        await this.getRemoveCommentButtonByCommentText(rComment).click();

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

}
