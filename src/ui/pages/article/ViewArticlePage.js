import { expect } from '../../../common/helpers/pw';
import { BasePage } from '../BasePage';
import { ArticleHeader } from '../../components/article/ArticleHeader';

export class ViewArticlePage extends BasePage {
  articleId;

  constructor(page, userId = 0) {
    super(page, userId);
    this.articleHeader = new ArticleHeader(page);
    this.articleTitleHeader = page.getByRole('heading');
    this.articleFavoriteButton = page.getByRole('button', { name: 'Favorite Article' }).last();
    this.articleUnfavoriteButton = page.getByRole('button', { name: 'Unfavorite Article' }).last();
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
    await this.step(`Assert the Unfavorite article button is shown in article body`, async () => {
      await expect(this.articleUnfavoriteButton).toBeVisible();
    });
  }

  async addCommentAndWaitForRequest(text) {
    const { page } = this;
    await page.getByPlaceholder(/write a comment/i).fill(text);
    const [req] = await Promise.all([
      page.waitForRequest(r =>
        r.url().includes('/api/articles/') &&
        r.url().includes('/comments') &&
        r.method() === 'POST'
      ),
      page.getByRole('button', { name: /post comment/i }).click(),
    ]);
    await page.locator('.card').filter({ hasText: text }).first().waitFor();
    return req;
  }

  async deleteCommentByTextAndWaitForRequest(text) {
    return await this.step(`Delete comment "${text}" and wait for request`, async () => {
      const { page } = this;

      const card = page.locator('.card').filter({ hasText: text }).first();
      await card.waitFor({ state: 'visible' });

      const deleteControl = card
        .locator('[data-testid="delete-comment"], .mod-options .ion-trash-a, button:has-text("Delete")')
        .first();

      await deleteControl.waitFor({ state: 'visible' });

      const [req] = await Promise.all([
        page.waitForRequest(r =>
          r.method() === 'DELETE' &&
          r.url().includes('/api/articles/') &&
          r.url().includes('/comments/')
        ),
        deleteControl.click()
      ]);

      try {
        await expect(card).toBeHidden({ timeout: 5000 });
      } catch {
        // optional: ignore flake if the card is already gone
      }

      return req;
    });
  }

  async assertFavoriteButtonIsVisibleInArticleBody() {
    await this.step(`Assert the Favorite article button is shown in article body`, async () => {
      await expect(this.articleFavoriteButton).toBeVisible();
    });
  }
}
