import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

test.use({ contextsNumber: 2, usersNumber: 2 });

test.beforeEach(async ({ pages, users, articleWithoutTags }) => {
  await signUpUser(pages[0], users[0], 1); // User1
  await signUpUser(pages[1], users[1], 2); // User2
  await createArticle(pages[0], articleWithoutTags, 1); // Article by User1
});

test('Delete just added comment to article created by another user', async ({
  pages,
  articleWithoutTags,
}) => {
  const commentText = 'Nice article! ' + Date.now();
  const viewArticlePage = new ViewArticlePage(pages[1], 2);

  await viewArticlePage.open(articleWithoutTags.url);

  const addReq = await viewArticlePage.addCommentAndWaitForRequest(commentText);
  expect(addReq.url()).toContain('/comments');
  expect(addReq.method()).toBe('POST');

  const delReq = await viewArticlePage.deleteCommentByTextAndWaitForRequest(commentText);
  expect(delReq.url()).toContain('/comments');
  expect(delReq.method()).toBe('DELETE');
});
