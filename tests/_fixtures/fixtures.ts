import { mergeTests } from '@playwright/test';
import { test as authTest } from './fixturesAuth';
import { test as genericTest } from './fixturesGeneric';
import { test as articleTest } from './fixturesArticle';
import { test as homeTest } from './fixturesHome';

export const test = mergeTests(authTest, genericTest, articleTest, homeTest);
