import { CreateArticlePage } from '../../pages/article/CreateArticlePage';
import { ViewArticlePage } from '../../pages/article/ViewArticlePage';
import { testStep } from '../../../common/helpers/pw';

export async function createArticle(page, article, userId = 0) {
  article['url'] = await testStep(
    `Create an article`,
    async () => {
      const createArticlePage = new CreateArticlePage(page, userId);
      const viewArticlePage = new ViewArticlePage(page, userId);

      await createArticlePage.open();
      await createArticlePage.submitCreateArticleForm(article);
      await viewArticlePage.articleHeader.assertTitleIsVisible(article.title);

      return viewArticlePage.getCurrentPageUrl();
    },
    userId,
  );

  return article;
}
