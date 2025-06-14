import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

test.use({ contextsNumber: 2, usersNumber: 2 });

test.beforeEach(async ({ pages, users, articleWithoutTags }) => {
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  await createArticle(pages[0], articleWithoutTags, 1);
});

test('Unfollow just followed article created by another user', async ({
  articleWithoutTags,
  pages,
}) => {
  const viewArticlePage = new ViewArticlePage(pages[1], 2);
  const articleHeader = viewArticlePage.articleHeader;

  await viewArticlePage.open(articleWithoutTags.url);
  await articleHeader.clickFollowArtcileAndWaitForRequest();
  await articleHeader.assertUnfavoriteButtonIsVisibleInArticleHeader();
  await viewArticlePage.assertUnfavoriteButtonIsVisibleInArticleBody();
  await articleHeader.clickUnfollowArtcileAndWaitForRequest();
  await articleHeader.assertFavoriteButtonIsVisibleInArticleHeader();
  await viewArticlePage.assertFavoriteButtonIsVisibleInArticleBody();
});
