import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { expect } from '../../../src/common/helpers/pw';
import { ROUTES } from '../../../src/api/constants/apiRoutes';

/*
Preconditions:
1. Sign up User1
2. Sign up User 2
3. Create article as User1

Test:
1. Open article as User2
2. Add new comment to the article and 
  wait for request to the /api/articles/{slug}/comments 
  - assert the request url contains 'comments'
  - assert the request method is POST
3. Remove just added comment and
  wait for request to the /api/articles/{slug}/comments/{commentId} 
  - assert the request url contains 'comments'
  - assert the request method is DELETE
*/

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
  const comment = 'Just added new comment';
  const viewArticlePage = new ViewArticlePage(pages[1], 2);
  const articleUrl = articleWithoutTags.url;
  await viewArticlePage.open(articleUrl);

  await test.step('Add a new comment and wait', async () => {
    const request = await viewArticlePage.submitCommentAndWaitForRequest(
      comment,
      articleUrl,
    );
    expect(request.url()).toContain('comments');
    expect(request.method()).toEqual('POST');
    // Refresh the page
    await viewArticlePage.open(articleUrl);
    await viewArticlePage.assertAddedCommentIsVisible(comment);
  });

  await test.step('Delete just added comment and wait', async () => {
    const request = await viewArticlePage.deleteCommentByTextAndWAitForRequest(
      comment,
      articleUrl,
    );
    expect(request.url()).toContain('comments');
    expect(request.method()).toEqual('DELETE');
    // Refresh the page
    await viewArticlePage.open(articleUrl);
    await viewArticlePage.assertDeletedCommentIsNotVisible(comment);
  });
});
