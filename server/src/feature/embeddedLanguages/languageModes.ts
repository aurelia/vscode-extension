import {
  CompletionList,
  Diagnostic,
  Position,
  Range,
  TextDocument,
} from 'vscode-html-languageservice';
import { TextDocumentPositionParams } from 'vscode-languageserver';
import { DefinitionResult } from '../definition/getDefinition';
import { getAttributeInterpolationMode } from './modes/getAttributeInterpolationMode';
import { getAttributeMode } from './modes/getAttributeMode';
import { getAureliaHtmlMode } from './modes/getAureliaHtmlMode';
import { getCustomElementMode } from './modes/getCustomElementMode';
import { getRepeatForMode } from './modes/getRepeatForMode';
import { getTextInterpolationMode } from './modes/getTextInterpolationMode';
import { getValueConverterMode } from './modes/getValueConverterMode';
import { AureliaCompletionItem } from '../completions/virtualCompletion';
import {
  HTMLDocumentRegions,
  ViewRegionInfo,
  getDocumentRegions,
  ViewRegionType,
} from './embeddedSupport';
import {
  getLanguageModelCache,
  LanguageModelCache,
} from './languageModelCache';
import { CustomHover } from '../virtual/virtualSourceFile';
import {
  AureliaProgram,
  aureliaProgram as importedAureliaProgram,
} from '../../viewModel/AureliaProgram';

export * from 'vscode-html-languageservice';

export function createTextDocumentPositionParams(
  document: TextDocument,
  position: Position
): TextDocumentPositionParams {
  const textDocument: TextDocumentPositionParams = {
    textDocument: {
      uri: document.uri,
    },
    position,
  };

  return textDocument;
}

export interface LanguageMode {
  getId(): string;
  doValidation?: (document: TextDocument) => Diagnostic[];
  doComplete?: (
    document: TextDocument,
    _textDocumentPosition: TextDocumentPositionParams,
    triggerCharacter?: string,
    region?: ViewRegionInfo,
    aureliaProgram?: AureliaProgram
  ) => Promise<CompletionList | AureliaCompletionItem[]>;
  doDefinition?: (
    document: TextDocument,
    position: Position,
    region: ViewRegionInfo,
    aureliaProgram?: AureliaProgram
  ) => Promise<DefinitionResult | undefined>;
  doHover?: (
    document: TextDocument,
    position: Position,
    goToSourceWord: string,
    region: ViewRegionInfo
  ) => Promise<CustomHover | undefined>;
  onDocumentRemoved(document: TextDocument): void;
  dispose(): void;
}

export interface LanguageModes {
  getModeAtPosition(
    document: TextDocument,
    position: Position
  ): Promise<LanguageMode | undefined>;
  getModeAndRegionAtPosition(
    document: TextDocument,
    position: Position
  ): Promise<LanguageModeWithRegion | undefined>;
  // getModesInRange(document: TextDocument, range: Range): LanguageModeRange[];
  getAllModes(): LanguageMode[];
  // getAllModesInDocument(document: TextDocument): LanguageMode[];
  getMode(languageId: string): LanguageMode | undefined;
  onDocumentRemoved(document: TextDocument): void;
  dispose(): void;
}

export interface LanguageModeRange extends Range {
  mode: LanguageMode | undefined;
  attributeValue?: boolean;
}

export interface LanguageModeWithRegion {
  mode?: LanguageMode;
  region?: ViewRegionInfo;
}

type LanguageModeWithRegionMap = Record<ViewRegionType, LanguageModeWithRegion>;

export async function getLanguageModes(
  aureliaProgram: AureliaProgram = importedAureliaProgram
): Promise<LanguageModes> {
  const languageModelCacheDocument = getLanguageModelCache<HTMLDocumentRegions>(
    10,
    60,
    (document) => getDocumentRegions(document, aureliaProgram)
  );

  let modelCaches: LanguageModelCache<any>[] = [];
  modelCaches.push(languageModelCacheDocument);

  let modes = Object.create(null) as LanguageModeWithRegionMap;

  modes[ViewRegionType.Html] = {};
  modes[ViewRegionType.Html].mode = getAureliaHtmlMode();

  modes[ViewRegionType.Attribute] = {};
  modes[ViewRegionType.Attribute].mode = getAttributeMode(
    languageModelCacheDocument
  );

  modes[ViewRegionType.AttributeInterpolation] = {};
  modes[
    ViewRegionType.AttributeInterpolation
  ].mode = getAttributeInterpolationMode(languageModelCacheDocument);

  modes[ViewRegionType.CustomElement] = {};
  modes[ViewRegionType.CustomElement].mode = getCustomElementMode();

  modes[ViewRegionType.RepeatFor] = {};
  modes[ViewRegionType.RepeatFor].mode = getRepeatForMode();

  modes[ViewRegionType.TextInterpolation] = {};
  modes[ViewRegionType.TextInterpolation].mode = getTextInterpolationMode(
    languageModelCacheDocument
  );

  modes[ViewRegionType.ValueConverter] = {};
  modes[ViewRegionType.ValueConverter].mode = getValueConverterMode();

  return {
    async getModeAndRegionAtPosition(
      document: TextDocument,
      position: Position
    ): Promise<LanguageModeWithRegion | undefined> {
      const documentOfRegion = await languageModelCacheDocument.get(document);
      const regionAtPosition = documentOfRegion.getRegionAtPosition(position);
      const languageId = regionAtPosition?.languageId ?? ViewRegionType.Html;

      if (languageId) {
        modes[languageId].region = regionAtPosition;
        return modes[languageId];
      }
      return undefined;
    },
    async getModeAtPosition(): // document: TextDocument,
    // position: Position
    Promise<LanguageMode | undefined> {
      // const documentRegion = await documentRegions.get(document);
      // const languageId = documentRegion.getLanguageAtPosition(position);

      // if (languageId) {
      //   return modes[languageId];
      // }
      return undefined;
    },
    // getModesInRange(document: TextDocument, range: Range): LanguageModeRange[] {
    //   return documentRegions
    //     .get(document)
    //     .getLanguageRanges(range)
    //     .map((r) => {
    //       return <LanguageModeRange>{
    //         start: r.start,
    //         end: r.end,
    //         mode: r.languageId && modes[r.languageId],
    //         attributeValue: r.attributeValue,
    //       };
    //     });
    // },
    // getAllModesInDocument(document: TextDocument): LanguageMode[] {
    //   let result = [];
    //   for (let languageId of documentRegions
    //     .get(document)
    //     .getLanguagesInDocument()) {
    //     let mode = modes[languageId];
    //     if (mode) {
    //       result.push(mode);
    //     }
    //   }
    //   return result;
    // },
    getAllModes(): LanguageMode[] {
      const result: LanguageMode[] = [];
      // for (const languageId in modes) {
      //   const mode = modes[languageId];
      //   if (mode) {
      //     result.push(mode);
      //   }
      // }
      return result;
    },
    getMode(languageId: string): LanguageMode | undefined {
      const viewRegionMode = languageId as ViewRegionType;

      return modes[viewRegionMode].mode;
    },
    onDocumentRemoved(document: TextDocument) {
      modelCaches.forEach((mc) => mc.onDocumentRemoved(document));
      for (const mode in modes) {
        const viewRegionMode = mode as ViewRegionType;
        modes[viewRegionMode].mode?.onDocumentRemoved(document);
      }
    },
    dispose(): void {
      modelCaches.forEach((mc) => mc.dispose());
      modelCaches = [];
      for (const mode in modes) {
        const viewRegionMode = mode as ViewRegionType;
        modes[viewRegionMode].mode?.dispose();
      }
      modes = {
        Attribute: { mode: undefined, region: undefined },
        AttributeInterpolation: { mode: undefined, region: undefined },
        html: { mode: undefined, region: undefined },
        RepeatFor: { mode: undefined, region: undefined },
        TextInterpolation: { mode: undefined, region: undefined },
        CustomElement: { mode: undefined, region: undefined },
        ValueConverter: { mode: undefined, region: undefined },
      };
    },
  };
}
