import { test, expect } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

test.use({ contextsNumber: 2, usersNumber: 2 });

// Tworzymy użytkowników i artykuł przed każdym testem
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

  // 1. Otwórz artykuł
  await viewArticlePage.open(articleWithoutTags.url);

  // 2. Dodaj komentarz i poczekaj na request POST
  const commentText = 'This is a test comment';
  const postRequest =
    await viewArticlePage.addCommentAndWaitForRequest(commentText);

  // Asserty dla POST
  expect(postRequest.url()).toContain('/comments');
  expect(postRequest.method()).toEqual('POST');

  // 3. Usuń komentarz i poczekaj na request DELETE
  const deleteRequest =
    await viewArticlePage.deleteLastCommentAndWaitForRequest();

  // Asserty dla DELETE
  expect(deleteRequest.url()).toContain('/comments');
  expect(deleteRequest.method()).toEqual('DELETE');
});
