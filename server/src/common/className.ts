import { kebabCase } from 'lodash';
import { ts } from 'ts-morph';

import { getClassDecoratorInfos } from '../core/viewModel/getAureliaComponentList';
import { CUSTOM_ELEMENT_SUFFIX } from './constants';

/**
 * Fetches the equivalent component name based on the given class declaration
 *
 * @param sourceFile - The class declaration to map a component name from
 */
export function getElementNameFromClassDeclaration(
  classDeclaration: ts.ClassDeclaration
): string {
  const classDecoratorInfos = getClassDecoratorInfos(classDeclaration);

  classDecoratorInfos
    .find((info) => info.decoratorName === 'customElement')
    ?.decoratorArgument.replace(/'"/, ''); // The argument is a string with the quotes. We don' want the quotes.

  const className = classDeclaration.name?.getText() ?? '';
  const withoutCustomElementSuffix = className.replace(
    CUSTOM_ELEMENT_SUFFIX,
    ''
  );
  return kebabCase(withoutCustomElementSuffix);
}
