import { ts } from 'ts-morph';
import { Diagnostic } from 'vscode-languageserver';

import { RegionService } from '../../../../../common/services/RegionService';
import { checkAlreadyHasThis } from '../../../../../feature/completions/virtualCompletion2';
import { IAureliaClassMember, IAureliaComponent } from '../../../../aotTypes';
import { AureliaProgram } from '../../../../AureliaProgram';
import { getRangeFromSourceCodeLocation } from '../../../regions/rangeFromRegion';
import { AttributeRegion } from '../../../regions/ViewRegions';

const COMPLETIONS_ID = '//AUVSCCOMPL96';
const VIRTUAL_METHOD_NAME = '__vir';

export class AttributeRules {
  public static preventPrivateMethod(
    region: AttributeRegion,
    targetBindable: IAureliaClassMember | undefined,
    bindableName: string,
    aureliaProgram?: AureliaProgram,
    components?: IAureliaComponent[]
  ): Diagnostic | undefined {
    // region.regionValue;
    // // 1. check if accessScope value is imported

    // region.attributeValue;
    // // 2. then do virtual diagnostics
    if (!components) return;

    const targetComponent = components.find(
      (component) => component.componentName === region.tagName
    );

    if (!aureliaProgram) return;
    if (!targetComponent) return;
    if (region.attributeValue === undefined || region.attributeValue === '')
      return;

    // RegionParser.pretty([region],{asTable: true});/* ? */

    let virtualContent = region.attributeValue;
    // region; /* ? */
    region.accessScopes?.forEach((scope) => {
      const accessScopeName = scope.name;
      if (accessScopeName === '') return;

      const replaceRegexp = new RegExp(`\\b${accessScopeName}\\b`, 'g');
      const alreadyHasThis = checkAlreadyHasThis(
        virtualContent,
        accessScopeName
      );
      if (alreadyHasThis) return;

      virtualContent = virtualContent?.replace(replaceRegexp, (match) => {
        return `this.${match}`;
      });
    });

    // virtualContent;/* ? */
    let message: string | ts.DiagnosticMessageChain = '';
    createVirtualSourceFile_vNext(
      aureliaProgram,
      targetComponent,
      virtualContent,
      (languageService, sourceFilePath) => {
        const diagnostics =
          languageService.getSemanticDiagnostics(sourceFilePath);
        message = diagnostics[3].messageText;
      }
    );

    const attrLocation = RegionService.getAttributeLocation(region);
    const range = getRangeFromSourceCodeLocation(attrLocation);
    if (range === undefined) return;
    const diag = Diagnostic.create(range, message);

    return diag;
  }
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
  const project = aureliaProgram.tsMorphProject.get();
  const sourceFile = project.getSourceFile(component.viewModelFilePath);
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

  const languageService = project.getLanguageService().compilerObject;

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
