import { expect } from '../../../common/helpers/pw';
import { BasePage } from '../BasePage';
import { ArticleHeader } from '../../components/article/ArticleHeader';
import { ROUTES } from '../../../api/constants/apiRoutes';


export class ViewArticlePage extends BasePage {
  articleId;
  commentId;

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
    this.commentArea = page.getByPlaceholder('Write a comment...');
    this.postCommentButton = page.getByRole('button', {name: 'Post Comment'});
    this.deleteCommentLink = page.locator('.ion-trash-a');
  }

  tagListItem(tagName) {
    return this.page.getByRole('listitem').filter({ hasText: tagName });
  }

    async clickPostCommentAndWaitForRequest() {
      await this.step(
        `Click the post comment button and wait for request`,
        async () => {
          const requestPromise = this.page.waitForRequest(
            `**${ROUTES.articles('**').comments}`,
          );
          
          await this.commentArea.fill('1');
          await this.postCommentButton.click();
  
          const request = await requestPromise;
  
          expect(request.url()).toContain('comments');
          expect(request.method()).toEqual('POST');

          this.commentId = await request.json().comment.id;
        },
      );
    }

    async clickDeleteCommentAndWaitForRequest() {
      await this.step(
        `Click the delete comment button and wait for request`,
        async () => {
          const requestPromise = this.page.waitForRequest(
            `**${ROUTES.articles('**').comments}/${this.commentId}`,
          );
          
          await this.deleteCommentLink.click();
  
          const request = await requestPromise;
  
          expect(request.url()).toContain('comments');
          expect(request.method()).toEqual('DELETE');
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
