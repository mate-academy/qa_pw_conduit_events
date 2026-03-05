import { BaseComponent } from '../../components/BaseComponent';
import { expect } from '../../../common/helpers/pw';
import { ROUTES } from '../../../api/constants/apiRoutes';

export class CommentSection extends BaseComponent {
  constructor(page, userId = 0) {
    super(page, userId);
    this.commentInput = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', { name: 'Post Comment' });
  }

  deleteButton(index = 0) {
    return this.page.locator('i.ion-trash-a').nth(index);
  }

  async addCommentAndWaitForRequest(commentText) {
    return await this.step(`Add comment and wait for request`, async () => {
      const requestPromise = this.page.waitForRequest(
        `**${ROUTES.articles('**').comments}`,
      );

      await this.commentInput.fill(commentText);
      await this.postCommentButton.click();

      const request = await requestPromise;

      expect(request.url()).toContain('comments');
      expect(request.method()).toEqual('POST');

      return request;
    });
  }

  async deleteCommentAndWaitForRequest() {
    return await this.step(`Delete comment and wait for request`, async () => {
      const requestPromise = this.page.waitForRequest(
        req => req.url().includes('comments') && req.method() === 'DELETE',
      );

      await this.deleteButton(0).click();

      const request = await requestPromise;

      expect(request.url()).toContain('comments');
      expect(request.method()).toEqual('DELETE');

      return request;
    });
  }
}
