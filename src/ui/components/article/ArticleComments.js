import { BaseComponent } from '../BaseComponent';
import { expect } from '../../../common/helpers/pw';

export class ArticleComments extends BaseComponent {
  constructor(page, userId = 0) {
    super(page, userId);
    this.commentTextarea = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
  }

  get deleteCommentButton() {
    return this.page.locator('.ion-trash-a').first();
  }

  async addCommentAndWaitForRequest(commentText) {
    return await this.step(
      `Add comment and wait for request`,
      async () => {
        await this.commentTextarea.fill(commentText);

        const requestPromise = this.page.waitForRequest(request => {
          return request.url().includes('comments') && request.method() === 'POST';
        });

        await this.postCommentButton.click();

        const request = await requestPromise;

        expect(request.url()).toContain('comments');
        expect(request.method()).toEqual('POST');

        return request;
      },
    );
  }

  async deleteCommentAndWaitForRequest() {
    return await this.step(
      `Delete comment and wait for request`,
      async () => {
        const requestPromise = this.page.waitForRequest(request => {
          return request.url().includes('comments') && request.method() === 'DELETE';
        });

        await this.deleteCommentButton.click();

        const request = await requestPromise;

        expect(request.url()).toContain('comments');
        expect(request.method()).toEqual('DELETE');

        return request;
      },
    );
  }
}
