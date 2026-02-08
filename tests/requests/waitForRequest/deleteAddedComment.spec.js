import { test } from '../../_fixtures/fixtures';
import { expect } from '#common/helpers/pw';
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
  pages,
  articleWithoutTags,
}) => {
  const viewArticlePage = new ViewArticlePage(pages[1], 2);
  const commentText = 'My new comment';

  await viewArticlePage.open(articleWithoutTags.url);

  const postRequest = await viewArticlePage.addCommentAndWaitForPostRequest(
    commentText,
  );
  expect(postRequest.url()).toContain('comments');
  expect(postRequest.method()).toEqual('POST');

  const deleteRequest =
    await viewArticlePage.deleteCommentAndWaitForDeleteRequest();
  expect(deleteRequest.url()).toContain('comments');
  expect(deleteRequest.method()).toEqual('DELETE');
});
