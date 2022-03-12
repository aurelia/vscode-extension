import * as Path from 'path';

import { kebabCase } from 'lodash';
import { ts } from 'ts-morph';

import { AureliaDecorator, AureliaClassTypes } from '../../common/constants';

export class ConventionService {
  public static fulfillsAureliaConventions(node: ts.ClassDeclaration) {
    const fulfillsAureliaConventions =
      classDeclarationHasUseViewOrNoView(node) ||
      hasCustomElementNamingConvention(node) ||
      hasValueConverterNamingConvention(node);

    return fulfillsAureliaConventions;
  }
}

/**
 * checks whether a classDeclaration has a useView or noView
 *
 * @param classDeclaration - ClassDeclaration to check
 */
function classDeclarationHasUseViewOrNoView(
  classDeclaration: ts.ClassDeclaration
): boolean {
  if (!classDeclaration.decorators) return false;

  const hasViewDecorator = classDeclaration.decorators.some((decorator) => {
    const result =
      decorator.getText().includes('@useView') ||
      decorator.getText().includes('@noView');
    return result;
  });

  return hasViewDecorator;
}

/**
 * MyClassCustomelement
 *
 * \@customElement(...)
 * MyClass
 */
function hasCustomElementNamingConvention(
  classDeclaration: ts.ClassDeclaration
): boolean {
  const hasCustomElementDecorator =
    classDeclaration.decorators?.some((decorator) => {
      const decoratorName = decorator.getText();
      const result =
        decoratorName.includes(AureliaDecorator.CUSTOM_ELEMENT) ||
        decoratorName.includes('name');
      return result;
    }) ?? false;

  const className = classDeclaration.name?.getText();
  const hasCustomElementNamingConvention = Boolean(
    className?.includes(AureliaClassTypes.CUSTOM_ELEMENT)
  );

  const { fileName } = classDeclaration.getSourceFile();
  const baseName = Path.parse(fileName).name;
  const isCorrectFileAndClassConvention =
    kebabCase(baseName) === kebabCase(className);

  return (
    hasCustomElementDecorator ||
    hasCustomElementNamingConvention ||
    isCorrectFileAndClassConvention
  );
}

/**
 * MyClassValueConverter
 *
 * \@valueConverter(...)
 * MyClass
 */
function hasValueConverterNamingConvention(
  classDeclaration: ts.ClassDeclaration
): boolean {
  const hasValueConverterDecorator =
    classDeclaration.decorators?.some((decorator) => {
      const result = decorator
        .getText()
        .includes(AureliaDecorator.VALUE_CONVERTER);
      return result;
    }) ?? false;

  const hasValueConverterNamingConvention = Boolean(
    classDeclaration.name?.getText().includes(AureliaClassTypes.VALUE_CONVERTER)
  );

  return hasValueConverterDecorator || hasValueConverterNamingConvention;
}
