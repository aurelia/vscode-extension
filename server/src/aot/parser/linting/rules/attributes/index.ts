import { camelCase } from '@aurelia/kernel';
import { ts } from 'ts-morph';
import { Diagnostic } from 'vscode-languageserver';

import { RegionService } from '../../../../../common/services/RegionService';
import { checkAlreadyHasThis } from '../../../../../feature/completions/virtualCompletion2';
import { IAureliaComponent } from '../../../../aotTypes';
import { AureliaProgram } from '../../../../AureliaProgram';
import { getRangeFromSourceCodeLocation } from '../../../regions/rangeFromRegion';
import { AbstractRegion, AttributeRegion } from '../../../regions/ViewRegions';

const COMPLETIONS_ID = '//AUVSCCOMPL96';
const VIRTUAL_METHOD_NAME = '__vir';

export class AttributeRules {
  constructor(private aureliaProgram: AureliaProgram) {
    this.aureliaProgram = aureliaProgram;
  }

  preventPrivateMethod(region: AttributeRegion): Diagnostic | undefined {
    const targetComponent = this.aureliaProgram.aureliaComponents.getOneBy(
      'componentName',
      region.tagName
    );
    if (!targetComponent) return;

    const virtualContent = addThisToAccessScope(region, region.attributeValue);
    if (!virtualContent) return;

    let message: string | ts.DiagnosticMessageChain = '';
    createVirtualSourceFile_vNext(
      this.aureliaProgram,
      targetComponent,
      virtualContent,
      (languageService, sourceFilePath) => {
        const diagnostics =
          languageService.getSemanticDiagnostics(sourceFilePath);

        // 1. Filter PrivateMethod Diagnostic methods
        const tsPrivateMethodMessage =
          'is private and only accessible within class';
        const privateMethodDiagnostics = diagnostics.filter((diagnostic) =>
          diagnostic.messageText.toString().includes(tsPrivateMethodMessage)
        );

        // 2. Find Target Diagnostic from Diagnostic message
        const targetDiagnostic = privateMethodDiagnostics.find((diagnostic) => {
          // 2.1 Get class name from Diagnostic message
          const matchClassNameRegex = /class \'(.*)\'\.$/;
          const matchedClassName = matchClassNameRegex.exec(
            diagnostic.messageText.toString()
          );
          if (matchedClassName === null) return;

          const normalizeCase = camelCase(matchedClassName[1]);

          // 2.2. Find Access scope based on 2.1
          const isTargetAccessScope = region.accessScopes?.find(
            (accessScope) => {
              return normalizeCase === accessScope.name;
            }
          );

          return isTargetAccessScope;
        });

        // 3. Set diagnostic message
        message = targetDiagnostic?.messageText?.toString() ?? '';
      }
    );

    const attrLocation = RegionService.getAttributeLocation(region);
    const range = getRangeFromSourceCodeLocation(attrLocation);
    if (range === undefined) return;
    const diag = Diagnostic.create(range, message);

    return diag;
  }
}

export function addThisToAccessScope(
  region: AbstractRegion,
  virtualContent: string | undefined
): string | undefined {
  if (region.attributeValue === undefined || region.attributeValue === '') {
    return;
  }

  region.accessScopes?.forEach((scope) => {
    const accessScopeName = scope.name;
    if (accessScopeName === '') return;

    const replaceRegexp = new RegExp(`\\b${accessScopeName}\\b`, 'g');
    const alreadyHasThis = checkAlreadyHasThis(virtualContent, accessScopeName);
    if (alreadyHasThis) return;

    virtualContent = virtualContent?.replace(replaceRegexp, (match) => {
      return `this.${match}`;
    });
  });

  return virtualContent;
}

export function createVirtualSourceFile_vNext(
  aureliaProgram: AureliaProgram,
  component: IAureliaComponent,
  virtualContent: string,
  languageServiceMethod: (
    languageService: ts.LanguageService,
    sourceFilePath: string,
    finalPos: number
  ) => unknown
): void {
  const tsMorphProject = aureliaProgram.tsMorphProject.get();
  const sourceFile = tsMorphProject.getSourceFile(component.viewModelFilePath);
  if (sourceFile == null) return;

  const sourceFilePath = sourceFile.getFilePath();
  const myClass = sourceFile.getClass(component?.className);
  const targetStatementText = `${virtualContent}${COMPLETIONS_ID}`;

  let targetStatement;
  try {
    const virMethod = myClass?.addMethod({
      name: VIRTUAL_METHOD_NAME,
      statements: [targetStatementText],
    });
    targetStatement = virMethod?.getStatements()[0];
  } catch (error) {
    // Dont pass on ts-morph error
    return;
  }
  if (!targetStatement) return;

  const finalTargetStatementText = `${targetStatement.getFullText()}${COMPLETIONS_ID}`;
  const targetPos = finalTargetStatementText?.indexOf(COMPLETIONS_ID);
  const finalPos = targetStatement.getPos() + targetPos;

  const languageService = tsMorphProject.getLanguageService().compilerObject;

  if (typeof languageServiceMethod === 'function') {
    const patchedSourceFilePath = sourceFilePath.replace('file:///', 'file:/');
    languageServiceMethod(languageService, patchedSourceFilePath, finalPos);
  }

  try {
    targetStatement?.remove();
  } catch (error) {
    // Dont pass on ts-morph error
    return;
  }
}
