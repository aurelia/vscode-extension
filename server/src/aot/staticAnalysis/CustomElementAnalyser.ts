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

import * as fs from 'fs';
import * as Path from 'path';

import { SyntaxKind, ts } from 'ts-morph';

import { getElementNameFromClassDeclaration } from '../../common/className';
import {
  AureliaClassTypes,
  AureliaDecorator,
  AureliaViewModel,
} from '../../common/constants';
import { UriUtils } from '../../common/view/uri-utils';
import { IAureliaClassMember, IAureliaComponent } from '../aotTypes';
import { Optional } from '../parser/regions/ViewRegions';
import { ConventionService } from './ConventionService';
import { ValueConverterAnalyser } from './ValueConverterAnalyser';

export class CustomElementAnalyser {
  public static getAureliaComponentInfoFromClassDeclaration(
    sourceFile: ts.SourceFile,
    checker: ts.TypeChecker
  ): Optional<IAureliaComponent, 'viewRegions'> | undefined {
    let result: Optional<IAureliaComponent, 'viewRegions'> | undefined;
    let targetClassDeclaration: ts.ClassDeclaration | undefined;

    sourceFile.forEachChild((node) => {
      const isClassDeclaration = ts.isClassDeclaration(node);
      if (!isClassDeclaration) return;

      const fulfillsAureliaConventions =
        ConventionService.fulfillsAureliaConventions(node);
      const validForAurelia =
        isNodeExported(node) && fulfillsAureliaConventions;

      if (validForAurelia) {
        targetClassDeclaration = node;

        if (node.name == null) return;
        const symbol = checker.getSymbolAtLocation(node.name);

        let documentation = '';
        if (symbol != null) {
          // console.log('No symbol found for: ', node.name.getText());

          documentation = ts.displayPartsToString(
            symbol.getDocumentationComment(checker)
          );
        }

        // Value Converter
        const isValueConverterModel =
          ValueConverterAnalyser.checkValueConverter(targetClassDeclaration);
        if (isValueConverterModel) {
          result = ValueConverterAnalyser.getComponentInfo(
            targetClassDeclaration,
            sourceFile,
            documentation
          );
          return;
        }

        // Standard Component
        const { fileName } = targetClassDeclaration.getSourceFile();
        const conventionViewFilePath = fileName.replace(/.[jt]s$/, '.html');
        let viewFilePath: string = '';
        if (fs.existsSync(conventionViewFilePath)) {
          viewFilePath = UriUtils.toSysPath(conventionViewFilePath);
        } else {
          viewFilePath =
            getTemplateImportPathFromCustomElementDecorator(
              targetClassDeclaration,
              sourceFile
            ) ?? '';
        }

        // TODO: better way to filter out non aurelia classes?
        if (viewFilePath === '') return;

        const resultClassMembers = getAureliaViewModelClassMembers(
          targetClassDeclaration,
          checker
        );
        const viewModelName = getElementNameFromClassDeclaration(
          targetClassDeclaration
        );

        // Decorator
        const customElementDecorator = getCustomElementDecorator(
          targetClassDeclaration
        );
        let decoratorComponentName;
        let decoratorStartOffset;
        let decoratorEndOffset;
        if (customElementDecorator) {
          // get argument for name property in decorator
          customElementDecorator.expression.forEachChild((decoratorChild) => {
            // @customElement('empty-view')
            if (ts.isStringLiteral(decoratorChild)) {
              decoratorComponentName = decoratorChild
                .getText()
                .replace(/['"]/g, '');
              decoratorStartOffset = decoratorChild.getStart() + 1; // start quote
              decoratorEndOffset = decoratorChild.getEnd(); // include the last character, ie. the end quote
            }

            // @customElement({ name: 'my-view', template })
            else if (ts.isObjectLiteralExpression(decoratorChild)) {
              decoratorChild.forEachChild((decoratorArgument) => {
                if (!ts.isPropertyAssignment(decoratorArgument)) return;
                decoratorArgument.forEachChild((decoratorProp) => {
                  if (!ts.isStringLiteral(decoratorProp)) {
                    // TODO: What if name is not a string? --> Notify users [ISSUE-8Rh31VAG]
                    return;
                  }

                  decoratorComponentName = decoratorProp
                    .getText()
                    .replace(/['"]/g, '');
                  decoratorStartOffset = decoratorProp.getStart() + 1; // start quote
                  decoratorEndOffset = decoratorProp.getEnd(); // include the last character, ie. the end quote
                });
              });
            }
          });
        }

        result = {
          documentation,
          className: targetClassDeclaration.name?.getText() ?? '',
          componentName: viewModelName,
          decoratorComponentName,
          decoratorStartOffset,
          decoratorEndOffset,
          baseViewModelFileName: Path.parse(sourceFile.fileName).name,
          viewModelFilePath: UriUtils.toSysPath(sourceFile.fileName),
          viewFilePath,
          type: AureliaClassTypes.CUSTOM_ELEMENT,
          classMembers: resultClassMembers,
          sourceFile,
        };
      }
    });

    return result;
  }

  public static getClassDecoratorInfos(
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
        const childName =
          decoratorChild.getText() as AureliaClassDecoratorPossibilites;
        const isAureliaDecorator = aureliaDecorators.includes(childName);

        if (isAureliaDecorator) {
          if (ts.isIdentifier(decoratorChild)) {
            result.decoratorName = childName;
          }
        }
        // @customElement({name:>'my-name'<})
        else if (ts.isObjectLiteralExpression(decoratorChild)) {
          decoratorChild.forEachChild((decoratorArgChild) => {
            // {>name:'my-name'<}
            if (ts.isPropertyAssignment(decoratorArgChild)) {
              if (decoratorArgChild.name.getText() === 'name') {
                const value = decoratorArgChild.getLastToken()?.getText();
                if (value == null) return;
                result.decoratorArgument = value;
              }
            }
          });
        } else if (ts.isToken(decoratorChild)) {
          result.decoratorArgument = childName;
        }
      });

      const withoutQuotes = result.decoratorArgument.replace(/['"]/g, '');
      result.decoratorArgument = withoutQuotes;
      classDecoratorInfos.push(result);
    });

    return classDecoratorInfos.filter((info) => info.decoratorName !== '');
  }
}

function isNodeExported(node: ts.ClassDeclaration): boolean {
  return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
}

function getAureliaViewModelClassMembers(
  classDeclaration: ts.ClassDeclaration,
  checker: ts.TypeChecker
): IAureliaClassMember[] {
  const classMembers: IAureliaClassMember[] = [];

  classDeclaration.forEachChild((classMember) => {
    // Constructor members
    if (ts.isConstructorDeclaration(classMember)) {
      const constructorMember = classMember;
      constructorMember.forEachChild((constructorArgument) => {
        if (constructorArgument.kind !== SyntaxKind.Parameter) return;
        const hasModifier = getConstructorHasModifier(constructorArgument);
        if (hasModifier === false) return;

        constructorArgument.forEachChild((argumentPart) => {
          if (argumentPart.kind !== SyntaxKind.Identifier) return;

          const name = argumentPart.getText();
          const symbol = checker.getSymbolAtLocation(argumentPart);
          const commentDoc = ts.displayPartsToString(
            symbol?.getDocumentationComment(checker)
          );
          const memberType =
            classMember.type?.getText() !== undefined
              ? classMember.type?.getText()
              : 'unknown';

          const result: IAureliaClassMember = {
            name,
            memberType,
            documentation: commentDoc,
            isBindable: false,
            syntaxKind: argumentPart.kind,
            start: constructorArgument.getStart(),
            end: constructorArgument.getEnd(),
          };
          classMembers.push(result);
        });
      });
    }

    // Class Members
    else if (
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
        memberType,
        documentation,
        isBindable: Boolean(isBindable),
        syntaxKind: ts.isPropertyDeclaration(classMember)
          ? ts.SyntaxKind.VariableDeclaration
          : ts.SyntaxKind.MethodDeclaration,
        start: classMember.getStart(),
        end: classMember.getEnd(),
      };
      classMembers.push(result);
    }
  });

  return classMembers;
}

function getConstructorHasModifier(constructorArgument: ts.Node) {
  let hasModifier = false;
  constructorArgument.forEachChild((argumentPart) => {
    if (hasModifier === true) return;

    const isPrivate = argumentPart.kind === SyntaxKind.PrivateKeyword;
    const isPublic = argumentPart.kind === SyntaxKind.PublicKeyword;
    const isProtected = argumentPart.kind === SyntaxKind.ProtectedKeyword;
    const isReadonly = argumentPart.kind === SyntaxKind.ReadonlyKeyword;
    hasModifier = isPrivate || isPublic || isProtected || isReadonly;
  });
  return hasModifier;
}

/**
 * [refactor]: also get other decorators
 */
function getCustomElementDecorator(classDeclaration: ts.ClassDeclaration) {
  const target = classDeclaration.decorators?.find((decorator) => {
    const result = decorator
      .getText()
      .includes(AureliaDecorator.CUSTOM_ELEMENT);
    return result;
  });
  return target;
}

function getTemplateImportPathFromCustomElementDecorator(
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
    Path.dirname(UriUtils.toSysPath(sourceFile.fileName)),
    templateImportPath
  );

  return templateImportPath;
}
