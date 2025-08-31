import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { faker} from '@faker-js/faker';


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

let createdArticle;

test.beforeEach(async ({ pages, users, articleWithoutTags }) => {
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  createdArticle = await createArticle(pages[0], articleWithoutTags, 1);

});

test(
  'Delete just added comment to article created by another user',
  async ({ pages }) => {
    const viewArticlePage = new ViewArticlePage(pages[1]);
    const commentText = faker.word.words(2)

    await viewArticlePage.open(createdArticle.url);
    await viewArticlePage.addCommentForArticleAndWaitForRequest(commentText);
    await viewArticlePage.removeCommentForArticleAndWaitForRequest(commentText);

});
