import { expect } from '../../../common/helpers/pw';
import { BasePage } from '../BasePage';
import { ArticleHeader } from '../../components/article/ArticleHeader';

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
    this.commentTextArea = page.getByPlaceholder('Write a comment...');
    this.commentPostButton = page.getByRole('button', { name: 'Post Comment' });
    this.commentDeleteButton = page.locator('i.ion-trash-a');
  }

  async fillComment(commentText) {
    await this.step(
      `Add new comment to the article and wait for request`, async () =>{
       await this.commentTextArea.fill(commentText);
      }
    );
  }



  async deleteComment() {
    await this.step(
      `Delete the comment and wait for request`, async () =>{
       await this.commentDeleteButton.click();
      }
    );
  }

 async clickPostCommentButton(){
  await this.step(
    `Click the 'Post Comment' button and wait for request`, async () =>{
     await this.commentPostButton.click();
    }
  );
 }

  tagListItem(tagName) {
    return this.page.getByRole('listitem').filter({ hasText: tagName });
  }

  getCommentIdFromResponse(request) {
    const responseBody = JSON.parse(request.postData());
    return responseBody.comment.id;
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
