import { faker } from '@faker-js/faker';

export function generateNewCommentText() {
  return faker.lorem.sentence();
}
