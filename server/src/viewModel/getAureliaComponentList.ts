export interface AureliaClassDecorators {
  customElement: string;
  useView: string;
  noView: string;
}

type AureliaClassDecoratorPossibilites =
  | 'customElement'
  | 'useView'
  | 'noView'
  | '';

interface DecoratorInfo {
  decoratorName: AureliaClassDecoratorPossibilites;
  decoratorArgument: string;
}

import { IAureliaClassMember, IAureliaComponent } from './AureliaProgram';
import * as ts from 'typescript';
import * as Path from 'path';
import * as fs from 'fs';
import { getElementNameFromClassDeclaration } from '../common/className';
import {
  AureliaClassTypes,
  AureliaDecorator,
  AureliaViewModel,
  VALUE_CONVERTER_SUFFIX,
} from '../common/constants';
import { kebabCase } from 'lodash';

export function getAureliaComponentInfoFromClassDeclaration(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker
): IAureliaComponent | undefined {
  let result: IAureliaComponent | undefined;
  let targetClassDeclaration: ts.ClassDeclaration | undefined;

  sourceFile.forEachChild((node) => {
    if (
      ts.isClassDeclaration(node) &&
      isNodeExported(node) &&
      (classDeclarationHasUseViewOrNoView(node) ||
        hasCustomElementNamingConvention(node) ||
        hasValueConverterNamingConvention(node))
    ) {
      targetClassDeclaration = node;

      // Note the `!` in the argument: `getSymbolAtLocation` expects a `Node` arg, but returns undefined
      const symbol = checker.getSymbolAtLocation(node.name!);
      if (symbol === undefined) {
        console.log('No symbol found for: ', node.name);
        return;
      }

      const documentation = ts.displayPartsToString(
        symbol.getDocumentationComment(checker)
      );

      const isValueConverterModel = checkValueConverter(targetClassDeclaration);
      if (isValueConverterModel) {
        const valueConverterName = targetClassDeclaration.name
          ?.getText()
          .replace(VALUE_CONVERTER_SUFFIX, '')
          .toLocaleLowerCase();
        result = {
          documentation,
          className: targetClassDeclaration.name?.getText() ?? '',
          valueConverterName,
          baseViewModelFileName: Path.parse(sourceFile.fileName).name,
          viewModelFilePath: sourceFile.fileName,
          type: AureliaClassTypes.VALUE_CONVERTER,
          sourceFile,
        };
        return;
      }

      const viewModelName = getElementNameFromClassDeclaration(
        targetClassDeclaration
      );

      let viewFilePath: string = '';

      const { fileName } = targetClassDeclaration.getSourceFile();
      const conventionViewFilePath = fileName.replace(/.[jt]s$/, '.html');
      if (fs.existsSync(conventionViewFilePath)) {
        viewFilePath = conventionViewFilePath;
      } else {
        viewFilePath =
          getTemplateImportPathFromCustomElementDecorator(
            targetClassDeclaration,
            sourceFile
          ) ?? '';
      }

      //
      const resultClassMembers = getAureliaViewModelClassMembers(
        targetClassDeclaration,
        checker
      );

      result = {
        documentation,
        className: targetClassDeclaration.name?.getText() ?? '',
        componentName: viewModelName,
        baseViewModelFileName: Path.parse(sourceFile.fileName).name,
        viewModelFilePath: sourceFile.fileName,
        viewFilePath,
        type: AureliaClassTypes.CUSTOM_ELEMENT,
        classMembers: resultClassMembers,
        sourceFile,
      };
    }
  });

  return result;
}

function checkValueConverter(targetClassDeclaration: ts.ClassDeclaration) {
  const isValueConverterName = targetClassDeclaration.name
    ?.getText()
    .includes(VALUE_CONVERTER_SUFFIX);

  return Boolean(isValueConverterName);
}

function isNodeExported(node: ts.ClassDeclaration): boolean {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
}

export function getClassDecoratorInfos(
  classDeclaration: ts.ClassDeclaration
): DecoratorInfo[] {
  const classDecoratorInfos: DecoratorInfo[] = [];

  const aureliaDecorators = ['customElement', 'useView', 'noView'];
  classDeclaration.decorators?.forEach((decorator) => {
    const result: DecoratorInfo = {
      decoratorName: '',
      decoratorArgument: '',
    };

    decorator.expression.forEachChild((decoratorChild) => {
      const childName = decoratorChild.getText() as AureliaClassDecoratorPossibilites;
      const isAureliaDecorator = aureliaDecorators.includes(childName);

      if (isAureliaDecorator) {
        if (ts.isIdentifier(decoratorChild)) {
          result.decoratorName = childName;
        }
      } else if (ts.isToken(decoratorChild)) {
        result.decoratorArgument = childName;
      }
    });
    classDecoratorInfos.push(result);
  });

  return classDecoratorInfos.filter((info) => info.decoratorName !== '');
}

export function getAureliaViewModelClassMembers(
  classDeclaration: ts.ClassDeclaration,
  checker: ts.TypeChecker
): IAureliaClassMember[] {
  const classMembers: IAureliaClassMember[] = [];

  classDeclaration.forEachChild((classMember) => {
    if (
      ts.isPropertyDeclaration(classMember) ||
      ts.isGetAccessorDeclaration(classMember) ||
      ts.isMethodDeclaration(classMember)
    ) {
      const classMemberName = classMember.name?.getText();

      const isBindable = classMember.decorators?.find((decorator) => {
        return decorator.getText().includes('@bindable');
      });

      // Get bindable type. If bindable type is undefined, we set it to be "unknown".
      const memberType =
        classMember.type?.getText() !== undefined
          ? classMember.type?.getText()
          : 'unknown';
      const memberTypeText =
        '' + `${isBindable ? 'Bindable ' : ''}` + `Type: \`${memberType}\``;
      // Add comment documentation if available
      const symbol = checker.getSymbolAtLocation(classMember.name);
      const commentDoc = ts.displayPartsToString(
        symbol?.getDocumentationComment(checker)
      );

      let defaultValueText: string = '';
      if (ts.isPropertyDeclaration(classMember)) {
        // Add default values. The value can be undefined, but that is correct in most cases.
        const defaultValue = classMember.initializer?.getText() ?? '';
        defaultValueText = `Default value: \`${defaultValue}\``;
      }

      // Concatenate documentation parts with spacing
      const documentation = `${commentDoc}\n\n${memberTypeText}\n\n${defaultValueText}`;

      const result: IAureliaClassMember = {
        name: classMemberName,
        documentation,
        isBindable: Boolean(isBindable),
        syntaxKind: ts.isPropertyDeclaration(classMember)
          ? ts.SyntaxKind.VariableDeclaration
          : ts.SyntaxKind.MethodDeclaration,
      };
      classMembers.push(result);
    }
  });

  return classMembers;
}

/**
 * classDeclarationHasUseViewOrNoView checks whether a classDeclaration has a useView or noView
 *
 * @param classDeclaration - ClassDeclaration to check
 */
export function classDeclarationHasUseViewOrNoView(
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
export function hasCustomElementNamingConvention(
  classDeclaration: ts.ClassDeclaration
): boolean {
  const hasCustomElementDecorator =
    classDeclaration.decorators?.some((decorator) => {
      const result = decorator
        .getText()
        .includes(AureliaDecorator.CUSTOM_ELEMENT);
      return result;
    }) ?? false;

  const className = classDeclaration.name?.getText();
  const hasCustomElementNamingConvention = Boolean(
    className?.includes(AureliaClassTypes.CUSTOM_ELEMENT)
  );

  const { fileName } = classDeclaration.getSourceFile();
  const baseName = Path.parse(fileName).name;
  const isCorrectFileAndClassConvention = baseName === kebabCase(className);

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
export function hasValueConverterNamingConvention(
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

export function getTemplateImportPathFromCustomElementDecorator(
  classDeclaration: ts.ClassDeclaration,
  sourceFile: ts.SourceFile
): string | undefined {
  if (!classDeclaration.decorators) return;

  const customElementDecorator = classDeclaration.decorators.find(
    (decorator) => {
      const result = decorator
        .getText()
        .includes(AureliaDecorator.CUSTOM_ELEMENT);
      return result;
    }
  );

  if (!customElementDecorator) return;

  const hasTemplateProp = customElementDecorator
    .getText()
    .includes(AureliaViewModel.TEMPLATE);
  if (!hasTemplateProp) return;

  let templateImportPath = '';
  const templateImport = sourceFile.statements.find((statement) => {
    const isImport = statement.kind === ts.SyntaxKind.ImportDeclaration;
    if (!isImport) {
      return false;
    }

    let foundTemplateImport = false;
    statement.getChildren().forEach((child) => {
      if (child.kind === ts.SyntaxKind.ImportClause) {
        if (child.getText().includes(AureliaViewModel.TEMPLATE)) {
          foundTemplateImport = true;
        }
      }
    });

    return foundTemplateImport;
  });

  templateImport?.getChildren().forEach((child) => {
    if (child.kind === ts.SyntaxKind.StringLiteral) {
      templateImportPath = child.getText().replace(/['"]/g, '');
    }
  });

  templateImportPath = Path.resolve(
    Path.dirname(sourceFile.fileName),
    templateImportPath
  );

  return templateImportPath;
}
