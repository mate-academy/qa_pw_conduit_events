import { camelCaseToPhrase, capitalize } from './stringHelpers';

export function parseTestTreeHierarchy(fileName, logger) {
  const normalizedFileName = fileName.replace(/\\/g, '/');
  const testFolder = 'tests/';

  const attributesCamelCase = normalizedFileName
    .substring(normalizedFileName.indexOf(testFolder) + testFolder.length)
    .split('/')
    .filter(attribute => attribute && !attribute.endsWith('.spec.js'));

  const attributes = attributesCamelCase.map(attribute =>
    capitalize(camelCaseToPhrase(attribute)),
  );

  logger.debug(`Parsed test hierarchy: ${JSON.stringify(attributes)}`);

  return attributes;
}
