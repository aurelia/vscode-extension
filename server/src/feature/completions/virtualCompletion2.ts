import { ts } from 'ts-morph';
import {
  CompletionItemKind,
  TextDocument,
  MarkupKind,
  InsertTextFormat,
  CompletionParams,
  CompletionTriggerKind,
} from 'vscode-languageserver';

import {
  AbstractRegion,
  RepeatForRegion,
} from '../../aot/parser/regions/ViewRegions';
import {
  AureliaLSP,
  interpolationRegex,
  TemplateAttributeTriggers,
} from '../../common/constants';
import { OffsetUtils } from '../../common/documens/OffsetUtils';
import { StringUtils } from '../../common/string/StringUtils';
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
  insertTriggerCharacter?: boolean,
  completionParams?: CompletionParams
) {
  if (!region) return [];
  if (!region.accessScopes) return [];
  // Dont allow ` ` (Space) to trigger completions for view model,
  // otherwise it will trigger 800 JS completions too often which takes +1.5secs
  const shouldReturnOnSpace = getShouldReturnOnSpace(
    completionParams,
    triggerCharacter
  );
  if (shouldReturnOnSpace) return [];

  const COMPLETIONS_ID = '//AUVSCCOMPL95';

  // 1. Component
  const project = aureliaProgram.tsMorphProject.get();
  const targetComponent =
    aureliaProgram.aureliaComponents.getOneByFromDocument(document);
  if (!targetComponent) return [];

  const sourceFile = project.getSourceFile(targetComponent.viewModelFilePath);
  if (sourceFile == null) return [];
  const sourceFilePath = sourceFile.getFilePath();
  const myClass = sourceFile.getClass(targetComponent?.className);

  // 2.1 Transform view content to virtual view model
  // 2.1.1 Add `this.`
  // region; /* ? */

  const virtualContent = getVirtualContentFromRegion(
    region,
    offset,
    triggerCharacter,
    insertTriggerCharacter
  );
  // virtualContent; /*?*/

  // 2.2 Perform completions
  // 2.2.1 Differentiate Interpolation
  let interpolationModifier = 0;
  let targetStatementText = `${virtualContent}${COMPLETIONS_ID}`;
  if (virtualContent.match(interpolationRegex)?.length != null) {
    targetStatementText = `\`${virtualContent}\`${COMPLETIONS_ID}`;
    interpolationModifier = 2; // - 2 we added "\`" because regionValue is ${}, thus in virtualContent we need to do `${}`
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
  if (!targetStatement) return [];

  const finalTargetStatementText = `${targetStatement.getFullText()}${COMPLETIONS_ID}`;
  const targetPos = finalTargetStatementText?.indexOf(COMPLETIONS_ID);
  const finalPos = targetStatement.getPos() + targetPos - interpolationModifier;

  // sourceFile.getText(); /* ? */
  // sourceFile.getText().length /* ? */
  // sourceFile.getText().substr(finalPos - 1, 30); /* ? */
  // sourceFile.getText().substr(finalPos - 9, 30); /* ? */

  const languageService = project.getLanguageService().compilerObject;
  // Completions
  const virtualCompletions = languageService
    .getCompletionsAtPosition(
      sourceFilePath.replace('file:///', 'file:/'),
      finalPos,
      {}
    )
    ?.entries.filter((result) => {
      return !result?.name.includes(VIRTUAL_METHOD_NAME);
    });
  if (!virtualCompletions) return [];

  // virtualCompletions /* ? */

  const virtualCompletionEntryDetails = virtualCompletions
    .map((completion) => {
      return languageService.getCompletionEntryDetails(
        sourceFilePath.replace('file:///', 'file:/'),
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

  try {
    targetStatement?.remove();
  } catch (error) {
    // Dont pass on ts-morph error
    return [];
  }

  return result;
}

function getVirtualContentFromRegion(
  region: AbstractRegion,
  offset: number | undefined,
  triggerCharacter?: string,
  insertTriggerCharacter?: boolean
) {
  if (offset == null) return '';
  // triggerCharacter; /* ? */
  // offset; /* ? */

  let viewInput: string | undefined = '';
  const isInterpolationRegion = AbstractRegion.isInterpolationRegion(region);
  if (isInterpolationRegion) {
    viewInput = region.regionValue;
  } else if (RepeatForRegion.is(region)) {
    const { iterableStartOffset, iterableEndOffset } = region.data;
    const isIterableRegion = OffsetUtils.isIncluded(
      iterableStartOffset,
      iterableEndOffset,
      offset
    );
    if (isIterableRegion) {
      viewInput = region.data.iterableName;
    }
  } else {
    viewInput = region.attributeValue;
  }

  const normalizedOffset = offset - region.sourceCodeLocation.startOffset;

  // Add triggerCharacter at offset
  if (insertTriggerCharacter) {
    const insertLocation = normalizedOffset - 1; // - 1: insert one before
    viewInput = StringUtils.insert(viewInput, insertLocation, triggerCharacter);
  }

  // Cut off content after offset
  const cutOff = viewInput?.substring(0, normalizedOffset);
  // Readd `}`
  const ending = AbstractRegion.isInterpolationRegion(region) ? '}' : '';
  const removeWhitespaceAtEnd = `${cutOff}${ending}`;

  // viewInput; /* ? */
  let virtualContent: string | undefined = removeWhitespaceAtEnd;
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

  // 2.1.2 Defalut to any class member
  const isEmptyInterpolation = getIsEmptyInterpolation(virtualContent);
  const shouldDefault =
    virtualContent === undefined ||
    virtualContent.trim() === '' ||
    isEmptyInterpolation;
  if (shouldDefault) {
    virtualContent = 'this.';
  }
  virtualContent; /* ? */

  // 2.1.3 Return if no `this.` included, because we don't want (do we?) support any Javascript completion
  if (!virtualContent.includes('this.')) return '';

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

function checkAlreadyHasThis(
  virtualContent: string | undefined,
  accessScopeName: string
) {
  if (virtualContent == null) return false;

  const checkHasThisRegex = new RegExp(`\\b(this.${accessScopeName})\\b`);
  const has = checkHasThisRegex.exec(virtualContent ?? '');

  return Boolean(has);
}

function getIsEmptyInterpolation(virtualContent: string) {
  const withoutSpace = virtualContent.replace(/\s/g, '');
  const isSimplestInterpolation = withoutSpace === '${}';
  return isSimplestInterpolation;
}

function getShouldReturnOnSpace(
  completionParams: CompletionParams | undefined,
  triggerCharacter: string | undefined
) {
  const isSpace = triggerCharacter === TemplateAttributeTriggers.SPACE;
  const shouldReturn =
    isSpace &&
    completionParams?.context?.triggerKind !== CompletionTriggerKind.Invoked;

  return shouldReturn;
}
