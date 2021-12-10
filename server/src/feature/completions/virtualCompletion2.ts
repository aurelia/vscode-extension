import { ts } from 'ts-morph';
import {
  CompletionItemKind,
  TextDocument,
  MarkupKind,
  InsertTextFormat,
} from 'vscode-languageserver';

import { AureliaLSP, interpolationRegex } from '../../common/constants';
import { OffsetUtils } from '../../common/documens/OffsetUtils';
import { XScopeUtils } from '../../common/documens/xScopeUtils';
import { StringUtils } from '../../common/string/StringUtils';
import {
  AbstractRegion,
  AttributeInterpolationRegion,
  TextInterpolationRegion,
} from '../../core/regions/ViewRegions';
import { AureliaProgram } from '../../core/viewModel/AureliaProgram';
import { AureliaCompletionItem } from './virtualCompletion';

interface EntryDetailsMapData {
  displayParts: string | undefined;
  documentation: string | undefined;
  kind: CompletionItemKind;
  methodArguments: string[];
}

interface EntryDetailsMap {
  [key: string]: EntryDetailsMapData;
}

interface CustomizeEnhanceDocumentation {
  /** Array of the arguments of the method (without types) */
  customEnhanceMethodArguments: (methodArguments: string[]) => string;
  omitMethodNameAndBrackets?: boolean;
}

const DEFAULT_CUSTOMIZE_ENHANCE_DOCUMENTATION: CustomizeEnhanceDocumentation = {
  customEnhanceMethodArguments: enhanceMethodArguments,
  omitMethodNameAndBrackets: false,
};
const VIRTUAL_METHOD_NAME = '__vir';
const PARAMETER_NAME = 'parameterName';

export function aureliaVirtualComplete_vNext(
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  region: AbstractRegion | undefined,
  triggerCharacter?: string,
  offset?: number,
  replaceTriggerCharacter?: boolean
) {
  if (!region) return [];
  const COMPLETIONS_ID = '//AUVSCCOMPL95';

  // 1. Component
  const project = aureliaProgram.tsMorphProject.project;
  const tsConfigPath =
    aureliaProgram.documentSettings.getSettings().aureliaProject
      ?.rootDirectory ?? '';
  const targetComponent =
    aureliaProgram.aureliaComponents.getOneByFromDocument(document);
  if (!targetComponent) return [];

  // 2. Virtual copy with content
  const sourceFile = project.addSourceFileAtPath(
    targetComponent.viewModelFilePath
  );
  const COPY_PATH = `${tsConfigPath}/copy.ts`;
  const copy = sourceFile.copy(COPY_PATH, { overwrite: true });
  const myClass = copy.getClass(targetComponent?.className);

  if (!region.accessScopes) {
    project.removeSourceFile(copy);
    return [];
  }

  // 2.1 Transform view content to virtual view model
  // 2.1.1 Add `this.`
  // region; /* ? */

  let virtualContent = getVirtualContentFromRegion(
    region,
    offset,
    triggerCharacter,
    replaceTriggerCharacter
  ); /* ? */
  // virtualContent; /*?*/

  // 2.2 Perform completions
  // 2.2.1 Differentiate Interpolation
  let interpolationModifier = 0;
  let targetStatementText = `${virtualContent}${COMPLETIONS_ID}`;
  if (virtualContent.match(interpolationRegex)?.length != null) {
    targetStatementText = `\`${virtualContent}\`${COMPLETIONS_ID}`;
    interpolationModifier = 2; // - 2 we added "\`" because regionValue is ${}, thus in virtualContent we need to do `${}`
  }

  // 2.2.2 Find specific regionValue from accessScope (Reason: can have multitple interpolations in a region)
  const targetScope = XScopeUtils.getScopeByOffset(region.accessScopes, offset);
  let normalizeConstant = 0;
  if (targetScope != null) {
    const { endOffset } = region.sourceCodeLocation;
    normalizeConstant = endOffset - targetScope.nameLocation.end;
  }

  let targetStatement;
  try {
    const virMethod = myClass?.addMethod({
      name: VIRTUAL_METHOD_NAME,
      statements: [targetStatementText],
    });
    targetStatement = virMethod?.getStatements()[0];
  } catch (error) {
    // Dont pass on ts-morph error
    return [];
  }
  if (!targetStatement) {
    project.removeSourceFile(copy);
    return [];
  }
  const finalTargetStatementText = `${targetStatement.getFullText()}${COMPLETIONS_ID}`;
  const targetPos = finalTargetStatementText?.indexOf(COMPLETIONS_ID);
  const finalPos =
    targetStatement.getPos() +
    targetPos -
    interpolationModifier -
    normalizeConstant;

  // copy.getText(); /* ? */
  // copy.getText().length /* ? */
  // copy.getText().substr(finalPos - 1, 30); /* ? */
  // copy.getText().substr(finalPos - 9, 30); /* ? */

  const languageService = project.getLanguageService().compilerObject;
  // Completions
  const virtualCompletions = languageService
    .getCompletionsAtPosition(
      COPY_PATH.replace('file:///', 'file:/'),
      finalPos,
      {}
    )
    ?.entries.filter((result) => {
      return !result?.name.includes(VIRTUAL_METHOD_NAME);
    });
  if (!virtualCompletions) {
    project.removeSourceFile(copy);
    return [];
  }

  const virtualCompletionEntryDetails = virtualCompletions
    .map((completion) => {
      return languageService.getCompletionEntryDetails(
        COPY_PATH.replace('file:///', 'file:/'),
        finalPos,
        completion.name,
        undefined,
        undefined,
        undefined,
        undefined
      );
    })
    .filter((result) => {
      if (result === undefined) return false;
      return !result.name.includes(VIRTUAL_METHOD_NAME);
    });

  const entryDetailsMap: EntryDetailsMap = {};

  const result = enhanceCompletionItemDocumentation(
    virtualCompletionEntryDetails,
    entryDetailsMap,
    virtualCompletions
  );
  project.removeSourceFile(copy);

  return result;
}

function getVirtualContentFromRegion(
  region: AbstractRegion,
  offset: number | undefined,
  triggerCharacter?: string,
  replaceTriggerCharacter?: boolean
) {
  // triggerCharacter; /* ? */
  // offset; /* ? */

  let viewInput: string | undefined = '';
  const isInterpolationRegion = AbstractRegion.isInterpolationRegion(region);
  if (isInterpolationRegion) {
    viewInput = region.regionValue;
  } else {
    viewInput = region.attributeValue;
  }

  // Add triggerCharacter at offset
  if (replaceTriggerCharacter) {
    if (offset != null) {
      const normalizedOffset =
        offset - region.sourceCodeLocation.startOffset - 1; // - 1: insert one before
      viewInput = StringUtils.insert(
        viewInput,
        normalizedOffset,
        triggerCharacter
      );
    }
  }

  // viewInput; /* ? */
  let virtualContent: string | undefined;
  region.accessScopes?.forEach((scope) => {
    const { start, end } = scope.nameLocation;
    const offsetIncluded = OffsetUtils.isIncluded(start, end, offset);
    // Need more care for interpolation, because, can have multiple regions
    // TODO: How to deal/split `${1} ${2} ${3}`, because right now, it is treated as one region
    if (isInterpolationRegion) {
      // if (!offsetIncluded) return;
    }

    const accessScopeName = scope.name;
    const replaceRegexp = new RegExp(`${accessScopeName}`, 'g');
    virtualContent = viewInput?.replace(
      replaceRegexp,
      `this.${accessScopeName}`
    );
  });

  // 2.1.2 Defalut to any class member
  if (virtualContent === undefined) {
    virtualContent = 'this.';
  }
  virtualContent; /* ? */
  return virtualContent;
}

function enhanceCompletionItemDocumentation(
  virtualCompletionEntryDetails: (ts.CompletionEntryDetails | undefined)[],
  entryDetailsMap: EntryDetailsMap,
  virtualCompletions: ts.CompletionEntry[],
  customizeEnhanceDocumentation: CustomizeEnhanceDocumentation = DEFAULT_CUSTOMIZE_ENHANCE_DOCUMENTATION
) {
  const kindMap = {
    [ts.ScriptElementKind['memberVariableElement'] as ts.ScriptElementKind]:
      CompletionItemKind.Field,
    [ts.ScriptElementKind['memberFunctionElement'] as ts.ScriptElementKind]:
      CompletionItemKind.Method,
  };

  virtualCompletionEntryDetails.reduce((acc, entryDetail) => {
    if (!entryDetail) return acc;

    acc[entryDetail.name] = {
      displayParts: entryDetail.displayParts?.map((part) => part.text).join(''),
      documentation: entryDetail.documentation?.map((doc) => doc.text).join(''),
      kind: kindMap[entryDetail.kind],
      methodArguments: entryDetail.displayParts
        .filter((part) => part?.kind === PARAMETER_NAME)
        .map((part) => part?.text),
    };
    return acc;
  }, entryDetailsMap);

  /** ${1: argName1}, ${2: argName2} */
  function createArgCompletion(entryDetail: EntryDetailsMapData) {
    const result = customizeEnhanceDocumentation.customEnhanceMethodArguments(
      entryDetail.methodArguments
    );
    return result;
  }

  const result = virtualCompletions.map((tsCompletion) => {
    const entryDetail = entryDetailsMap[tsCompletion.name] ?? {};
    const isMethod =
      entryDetail.kind === CompletionItemKind.Method ||
      entryDetail.displayParts?.includes('() => '); // If variable has function type, treat as method
    /** Default value is just the method name */
    let insertMethodTextWithArguments = tsCompletion.name;

    if (isMethod === true) {
      if (customizeEnhanceDocumentation?.omitMethodNameAndBrackets === true) {
        insertMethodTextWithArguments = createArgCompletion(entryDetail);
      } else {
        insertMethodTextWithArguments = `${
          tsCompletion.name
        }(${createArgCompletion(entryDetail)})`;
      }
    }

    let insertText: string;
    if (isMethod !== undefined) {
      insertText = insertMethodTextWithArguments;
    } else {
      insertText = tsCompletion.name.replace(/^\$/g, '\\$');
    }

    const completionItem: AureliaCompletionItem = {
      documentation: {
        kind: MarkupKind.Markdown,
        value: entryDetail.documentation ?? '',
      },
      detail: entryDetail.displayParts ?? '',
      insertText: insertText,
      insertTextFormat: InsertTextFormat.Snippet,
      kind: entryDetail.kind,
      label: tsCompletion.name,
      data: AureliaLSP.AureliaCompletionItemDataType,
    };
    /**
      documentation: {
        kind: MarkupKind.Markdown,
        value: documentation,
      },
      detail: `${elementName}`,
      insertText: `${elementName}$2>$1</${elementName}>$0`,
      insertTextFormat: InsertTextFormat.Snippet,
      kind: CompletionItemKind.Class,
      label: `${elementName} (Au Class Declaration)`,
     */
    return completionItem;
  });
  return result;
}

function enhanceMethodArguments(methodArguments: string[]): string {
  return methodArguments
    .map((argName, index) => {
      return `\${${index + 1}:${argName}}`;
    })
    .join(', ');
}
