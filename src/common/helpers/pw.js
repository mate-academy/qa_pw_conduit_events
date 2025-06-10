import { test } from '@playwright/test';

export async function testStep(title, stepToRun, userId = 0) {
  let stepTitle = title;

  if (userId > 0) {
    stepTitle = `User${userId}: ${title}`;
  }

  return await test.step(stepTitle, stepToRun);
}

export { expect } from '@playwright/test';
