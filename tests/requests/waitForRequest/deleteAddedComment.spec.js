import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { ROUTES } from '../../../src/api/constants/apiRoutes';
import { expect } from 'allure-playwright';

test.use({ contextsNumber: 2, usersNumber: 2 });

test.beforeEach(async ({ pages, users, articleWithoutTags }) => {
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  await createArticle(pages[0], articleWithoutTags, 1);
});

test('Delete just added comment to article created by another user', async ({
  pages,
  articleWithoutTags
}) => {
  const viewArticlePage = new ViewArticlePage(pages[1], 2);

  await viewArticlePage.open(articleWithoutTags.url);
  const request1 = await viewArticlePage.clickPostCommentButtonAndWaitForRequest(articleWithoutTags.slug);

  expect(request1.url()).toContain(ROUTES.articles(articleWithoutTags.slug).index + '/comments');
  expect(request1.method()).toBe('POST');

  await viewArticlePage.clickDeleteCommentButtonAndWaitForRequest();

  const request2 = await viewArticlePage.clickDeleteCommentButtonAndWaitForRequest();

  expect(request2.url()).toContain('/comments');
  expect(request2.method()).toBe('DELETE');
});
