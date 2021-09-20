/**
 * File was copied and modified from
 * https://typescript-api-playground.glitch.me/#example=Creating%20a%20ts.Program%20and%20SourceFile%20in%20memory%20for%20testing%20without%20file%20system
 * From the SO question
 * https://stackoverflow.com/questions/50574469/can-i-change-the-sourcefile-of-a-node-using-the-typescript-compiler-api
 */

/**
 * 1. Get region
 * 2. Get aurelia view model file
 * 3. split content to instert temporary method (used for actual completion, thus "virtual")
 * 4. From 3. create virtualSourceFile
 * 5. Create language service from 4.
 * 6. Get completions
 */

interface EntryDetailsMapData {
  displayParts: string | undefined;
  documentation: string | undefined;
  kind: CompletionItemKind;
  methodArguments: string[];
}

interface EntryDetailsMap {
  [key: string]: EntryDetailsMapData;
}

import * as ts from 'typescript';
import {
  CompletionItem,
  CompletionItemKind,
  CompletionList,
  InsertTextFormat,
  MarkupKind,
  TextDocument,
  TextDocumentPositionParams,
} from 'vscode-languageserver';
import {
  AureliaProgram,
  aureliaProgram as importedAureliaProgram,
} from '../../viewModel/AureliaProgram';
import { AureliaLSP, VIRTUAL_SOURCE_FILENAME } from '../../common/constants';
import {
  createVirtualFileWithContent,
  createVirtualViewModelSourceFile,
  getVirtualLangagueService,
  VIRTUAL_METHOD_NAME,
} from '../virtual/virtualSourceFile';
import { AsyncReturnType } from '../../common/global';
import { ViewRegionInfo } from '../embeddedLanguages/embeddedSupport';

const PARAMETER_NAME = 'parameterName';

/**
 * Returns the virtual competion. (to be used as real completions)
 */
export function getVirtualCompletion(
  virtualSourcefile: ts.SourceFile,
  positionOfAutocomplete: number
) {
  const program = importedAureliaProgram.getProgram();

  const cls = getVirtualLangagueService(virtualSourcefile, program);
  const virtualSourceFilePath = virtualSourcefile.fileName;

  const virtualCompletions = cls
    .getCompletionsAtPosition(
      virtualSourceFilePath,
      positionOfAutocomplete,
      undefined
    )
    ?.entries.filter((result) => {
      return !result?.name.includes(VIRTUAL_METHOD_NAME);
    });

  if (!virtualCompletions) {
    throw new Error('No completions found');
  }

  const virtualCompletionEntryDetails = virtualCompletions
    .map((completion) => {
      return cls.getCompletionEntryDetails(
        virtualSourceFilePath,
        positionOfAutocomplete,
        completion.name,
        undefined,
        undefined,
        undefined,
        undefined
      );
    })
    .filter((result) => {
      return !result?.name.includes(VIRTUAL_METHOD_NAME);
    });

  return { virtualCompletions, virtualCompletionEntryDetails };
}

/** [Ignore] Seems useful, so keeping it for now */
export function createProgram(
  files: {
    fileName: string;
    content: string;
    sourceFile?: ts.SourceFile;
  }[],
  compilerOptions?: ts.CompilerOptions
): ts.Program {
  const tsConfigJson = ts.parseConfigFileTextToJson(
    'tsconfig.json',
    compilerOptions
      ? JSON.stringify(compilerOptions)
      : `{
   "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "lib": ["es2018"],
    "rootDir": ".",
    "strict": false,
    "esModuleInterop": true,
   }
 `
  );
  const { options, errors } = ts.convertCompilerOptionsFromJson(
    tsConfigJson.config.compilerOptions,
    '.'
  );
  if (errors.length) {
    throw errors;
  }
  const compilerHost = ts.createCompilerHost(options);
  compilerHost.getSourceFile = function (
    fileName: string
  ): ts.SourceFile | undefined {
    const file = files.find((f) => f.fileName === fileName);
    if (!file) return undefined;
    file.sourceFile =
      file.sourceFile ??
      ts.createSourceFile(fileName, file.content, ts.ScriptTarget.ES2015, true);
    return file.sourceFile;
  };
  return ts.createProgram(
    files.map((f) => f.fileName),
    options,
    compilerHost
  );
}

export interface AureliaCompletionItem extends CompletionItem {
  data?: AureliaLSP.AureliaCompletionItemDataType;
}

export function isAureliaCompletionItem(
  completion: CompletionList | AureliaCompletionItem[]
): completion is AureliaCompletionItem[] {
  if (!Array.isArray(completion)) return false;

  if (completion.length === 0) return true;

  if (completion[0].label) {
    return true;
  }

  return false;
}

async function getVirtualViewModelCompletion(
  textDocumentPosition: TextDocumentPositionParams,
  document: TextDocument,
  aureliaProgram: AureliaProgram,
  region?: ViewRegionInfo
): Promise<AureliaCompletionItem[]> {
  // 1. From the region get the part, that should be made virtual.
  const documentUri = textDocumentPosition.textDocument.uri;

  if (!region) return [];

  const virtualContent = document
    .getText()
    .slice(region.startOffset, region.endOffset);

  const {
    virtualSourcefile,
    virtualCursorIndex,
  } = createVirtualFileWithContent(
    aureliaProgram,
    documentUri,
    virtualContent
  )!;

  // 4. Use TLS
  const {
    virtualCompletions,
    virtualCompletionEntryDetails,
  } = getVirtualCompletion(virtualSourcefile, virtualCursorIndex);

  const entryDetailsMap: EntryDetailsMap = {};

  const result = enhanceCompletionItemDocumentation(
    virtualCompletionEntryDetails,
    entryDetailsMap,
    virtualCompletions
  );

  return result;
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

/**
 * Pass in arbitrary content for the virtual file.
 *
 * Cf. getVirtualViewModelCompletion
 * Here, we go by document region
 */
export function getVirtualViewModelCompletionSupplyContent(
  aureliaProgram: AureliaProgram,
  virtualContent: string,
  targetSourceFile: ts.SourceFile,
  /**
   * Identify the correct class in the view model file
   */
  viewModelClassName: string,
  customizeEnhanceDocumentation?: CustomizeEnhanceDocumentation
): AureliaCompletionItem[] {
  // 3. Create virtual completion
  const virtualViewModelSourceFile = ts.createSourceFile(
    VIRTUAL_SOURCE_FILENAME,
    targetSourceFile?.getText(),
    99
  );
  const {
    virtualSourcefile,
    virtualCursorIndex,
  } = createVirtualViewModelSourceFile(
    virtualViewModelSourceFile,
    virtualContent,
    viewModelClassName
  );

  const {
    virtualCompletions,
    virtualCompletionEntryDetails,
  } = getVirtualCompletion(virtualSourcefile, virtualCursorIndex);

  const entryDetailsMap: EntryDetailsMap = {};

  const result = enhanceCompletionItemDocumentation(
    virtualCompletionEntryDetails,
    entryDetailsMap,
    virtualCompletions,
    customizeEnhanceDocumentation
  );

  return (result as unknown) as AureliaCompletionItem[];
}

function enhanceCompletionItemDocumentation(
  virtualCompletionEntryDetails: (ts.CompletionEntryDetails | undefined)[],
  entryDetailsMap: EntryDetailsMap,
  virtualCompletions: ts.CompletionEntry[],
  customizeEnhanceDocumentation: CustomizeEnhanceDocumentation = DEFAULT_CUSTOMIZE_ENHANCE_DOCUMENTATION
) {
  const kindMap = {
    [ts.ScriptElementKind[
      'memberVariableElement'
    ] as ts.ScriptElementKind]: CompletionItemKind.Field,
    [ts.ScriptElementKind[
      'memberFunctionElement'
    ] as ts.ScriptElementKind]: CompletionItemKind.Method,
  };

  virtualCompletionEntryDetails.reduce((acc, entryDetail) => {
    if (!entryDetail) return acc;

    acc[entryDetail.name] = {
      displayParts: entryDetail.displayParts?.map((part) => part.text).join(''),
      documentation: entryDetail.documentation?.map((doc) => doc.text).join(''),
      kind: kindMap[entryDetail.kind],
      methodArguments: entryDetail.displayParts
        .filter((part) => part.kind === PARAMETER_NAME)
        .map((part) => part.text),
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
    const entryDetail = entryDetailsMap[tsCompletion.name];
    const isMethod =
      entryDetail.kind === CompletionItemKind.Method ||
      entryDetail.displayParts?.includes('() => '); // If variable has function type, treat as method
    /** Default value is just the method name */
    let insertMethodTextWithArguments = tsCompletion.name;

    if (isMethod) {
      if (customizeEnhanceDocumentation?.omitMethodNameAndBrackets === true) {
        insertMethodTextWithArguments = createArgCompletion(entryDetail);
      } else {
        insertMethodTextWithArguments = `${
          tsCompletion.name
        }(${createArgCompletion(entryDetail)})`;
      }
    }

    let insertText: string;
    if (isMethod) {
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

export async function getAureliaVirtualCompletions(
  _textDocumentPosition: TextDocumentPositionParams,
  document: TextDocument,
  region?: ViewRegionInfo,
  aureliaProgram: AureliaProgram = importedAureliaProgram
): Promise<AureliaCompletionItem[]> {
  // Virtual file
  let virtualCompletions: AsyncReturnType<
    typeof getVirtualViewModelCompletion
  > = [];
  try {
    virtualCompletions = await getVirtualViewModelCompletion(
      _textDocumentPosition,
      document,
      aureliaProgram,
      region
    );
  } catch (err) {
    console.log('onCompletion 261 TCL: err', err);
  }

  const aureliaVirtualCompletions = virtualCompletions.filter((completion) => {
    const isAureliaRelated =
      completion.data === AureliaLSP.AureliaCompletionItemDataType;
    const isUnrelatedTypescriptCompletion = completion.kind === undefined;
    const wantedResult = isAureliaRelated && !isUnrelatedTypescriptCompletion;
    return wantedResult;
  });

  return aureliaVirtualCompletions;
}
