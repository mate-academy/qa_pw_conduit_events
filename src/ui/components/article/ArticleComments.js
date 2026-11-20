import { BaseComponent } from '../BaseComponent';
import { expect } from '../../../common/helpers/pw';

export class ArticleComments extends BaseComponent {
  constructor(page, userId = 0) {
    super(page, userId);
    this.commentField = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', {
      name: 'Post Comment',
    });
  }

  commentCard(text) {
    return this.page.locator('.card').filter({ hasText: text });
  }

  async addCommentAndWaitForRequest(text) {
    await this.step(`Add comment and wait for request`, async () => {
      await this.commentField.fill(text);

      const requestPromise = this.page.waitForRequest(
        request =>
          request.url().includes('comments') && request.method() === 'POST',
      );

      await this.postCommentButton.click();

      const request = await requestPromise;

      expect(request.url()).toContain('comments');
      expect(request.method()).toEqual('POST');
    });
  }

  async deleteCommentAndWaitForRequest(text) {
    await this.step(`Delete comment and wait for request`, async () => {
      const requestPromise = this.page.waitForRequest(
        request =>
          request.url().includes('comments') && request.method() === 'DELETE',
      );

      await this.commentCard(text).locator('.ion-trash-a').click();

      const request = await requestPromise;

      expect(request.url()).toContain('comments');
      expect(request.method()).toEqual('DELETE');
    });
  }
}
