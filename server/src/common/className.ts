import { kebabCase } from 'lodash';
import { ts } from 'ts-morph';

import { getClassDecoratorInfos } from '../aot/getAureliaComponentList';
import { CUSTOM_ELEMENT_SUFFIX } from './constants';

/**
 * Fetches the equivalent component name based on the given class declaration
 *
 * @param sourceFile - The class declaration to map a component name from
 */
export function getElementNameFromClassDeclaration(
  classDeclaration: ts.ClassDeclaration
): string {
  const className = classDeclaration.name?.getText() ?? '';
  const classDecoratorInfos = getClassDecoratorInfos(classDeclaration);

  const customElementDecoratorName = classDecoratorInfos.find(
    (info) => info.decoratorName === 'customElement'
  )?.decoratorArgument;

  // Prioritize decorator name over class name convention
  if (customElementDecoratorName) {
    return customElementDecoratorName;
  }

  const withoutCustomElementSuffix = className.replace(
    CUSTOM_ELEMENT_SUFFIX,
    ''
  );
  return kebabCase(withoutCustomElementSuffix);
}
