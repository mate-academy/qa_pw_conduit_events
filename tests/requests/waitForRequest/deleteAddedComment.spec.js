import { test } from '../../_fixtures/fixtures';
import { expect } from '../../../src/common/helpers/pw';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

test.use({ contextsNumber: 2, usersNumber: 2 });

test.beforeEach(async ({ pages, users, articleWithoutTags }) => {
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  await createArticle(pages[0], articleWithoutTags, 1);
});

test('Delete just added comment to article created by another user', async ({
  articleWithoutTags,
  pages,
}) => {
  const viewArticlePage = new ViewArticlePage(pages[1], 2);
  const commentText = `Test comment ${Date.now()}`;

  await viewArticlePage.open(articleWithoutTags.url);

  const addCommentRequest =
    await viewArticlePage.addCommentAndWaitForRequest(commentText);

  expect(addCommentRequest.url()).toContain('comments');
  expect(addCommentRequest.method()).toEqual('POST');

  await viewArticlePage.assertCommentIsVisible(commentText);

  const deleteCommentRequest =
    await viewArticlePage.deleteCommentAndWaitForRequest(commentText);

  expect(deleteCommentRequest.url()).toContain('comments');
  expect(deleteCommentRequest.method()).toEqual('DELETE');

  await viewArticlePage.assertCommentIsNotVisible(commentText);
});
