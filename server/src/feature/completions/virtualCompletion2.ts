import { ts } from 'ts-morph';
import {
  CompletionItemKind,
  TextDocument,
  MarkupKind,
  InsertTextFormat,
} from 'vscode-languageserver';

import { AureliaLSP } from '../../common/constants';
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
  region: AbstractRegion | undefined
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

  // 2.1 Convert view content to view model
  if (!region.accessScopes) {
    project.removeSourceFile(copy);
    return [];
  }

  // 2.1.1 Add `this.`
  let virtualContent: string | undefined;
  const accessScopeNames = region.accessScopes.map((scope) => scope.name);
  let viewInput: string | undefined;
  if (
    AttributeInterpolationRegion.is(region) === true ||
    TextInterpolationRegion.is(region) === true
  ) {
    viewInput = region.regionValue;
  } else {
    viewInput = region.attributeValue;
  }

  accessScopeNames.forEach((accessScopeName) => {
    const replaceRegexp = new RegExp(`${accessScopeName}`, 'g');
    virtualContent = viewInput?.replace(
      replaceRegexp,
      `this.${accessScopeName}`
    );
  });

  // 2.1.2 Defalut to class members
  if (virtualContent === undefined) {
    virtualContent = 'this.';
  }

  // 2.2 Perform completions
  const targetStatementText = `${virtualContent}${COMPLETIONS_ID}`;
  const virMethod = myClass?.addMethod({
    name: VIRTUAL_METHOD_NAME,
    statements: [targetStatementText],
  });
  const targetStatement = virMethod?.getStatements()[0]; // we only add one statement
  if (!targetStatement) {
    project.removeSourceFile(copy);
    return [];
  }
  const finalTargetStatementText = `${targetStatement.getFullText()}${COMPLETIONS_ID}`;
  const targetPos = finalTargetStatementText?.indexOf(COMPLETIONS_ID);
  const finalPos = targetStatement.getPos() + targetPos;

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
