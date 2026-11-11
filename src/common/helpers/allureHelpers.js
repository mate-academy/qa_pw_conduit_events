import { camelCaseToPhrase, capitalize } from './stringHelpers';

export function parseTestTreeHierarchy(fileName, logger) {
  const normalizedFileName = fileName.replaceAll('\\', '/');
  const testFolder = 'tests/';
  const hierarchyStart =
    normalizedFileName.indexOf(testFolder) + testFolder.length;

  const attributesCamelCase = normalizedFileName
    .substring(hierarchyStart)
    .split('/');

  let attributes = attributesCamelCase.map(attribute =>
    capitalize(camelCaseToPhrase(attribute)),
  );

  if (attributes[2].includes('.spec.js')) {
    attributes = attributes.slice(0, 2);
  }

  logger.debug(`Parsed test hierarchy: ${JSON.stringify(attributes)}`);

  return attributes;
}
