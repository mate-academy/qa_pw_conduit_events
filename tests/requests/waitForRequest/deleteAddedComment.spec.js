import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { expect } from '@playwright/test';

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
   pages,
  articleWithoutTags,
}) => {
const viewArticlePage = new ViewArticlePage(pages[1], 2);
await viewArticlePage.open(articleWithoutTags.url);
await viewArticlePage.fillComment(
  'This is a new comment to the article created by another user'
);
const slug = new URL(articleWithoutTags.url).pathname.split('/').pop();

const requestPromise = viewArticlePage.page.waitForRequest(
  (request) =>
    request.url().includes(`/api/articles/${slug}/comments`) &&
    request.method() === 'POST'
);
const responsePromise = viewArticlePage.page.waitForResponse(
  (response) =>
    response.url().includes(`/api/articles/${slug}/comments`) &&
    response.request().method() === 'POST'
);

await viewArticlePage.clickPostCommentButton();
const request = await requestPromise;
expect(request.url()).toContain('comments');
expect(request.method()).toEqual('POST');

const response = await responsePromise;
const responseBody = await response.json();
const commentId = responseBody.comment.id;


const deleteRequestPromise = viewArticlePage.page.waitForRequest(
  (deleteRequest) =>
    deleteRequest.url().includes(`/api/articles/${slug}/comments/${commentId}`) &&
    deleteRequest.method() === 'DELETE'
);
await viewArticlePage.deleteComment();

const deleteRequest = await deleteRequestPromise;
expect(deleteRequest.url()).toContain('comments');
expect(deleteRequest.method()).toEqual('DELETE');
});
