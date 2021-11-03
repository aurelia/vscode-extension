import { Position, TextDocumentPositionParams } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaClassTypes, AureliaViewModel } from '../../../common/constants';
import { ViewRegionUtils } from '../../../common/documens/ViewRegionUtils';
import { createValueConverterCompletion } from '../../../feature/completions/completions';
import { getVirtualViewModelCompletionSupplyContent } from '../../../feature/completions/virtualCompletion';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import {
  ValueConverterRegionData,
  parseDocumentRegions,
  getRegionAtPosition,
} from '../../embeddedLanguages/embeddedSupport';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { RegionParser } from '../RegionParser';
import {
  AbstractRegion,
  ValueConverterRegion,
  ViewRegionType,
} from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class ValueConverterLanguageService
  implements AbstractRegionLanguageService {
  async doComplete(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    _textDocumentPosition: TextDocumentPositionParams,
    triggerCharacter: string | undefined,
    region?: AbstractRegion
  ) {
    if (triggerCharacter === ':') {
      const completions = await onValueConverterCompletion(
        _textDocumentPosition,
        document,
        aureliaProgram
      );
      if (!completions) return [];
      return completions;
    }

    const valueConverterCompletion = createValueConverterCompletion(
      aureliaProgram
    );
    return valueConverterCompletion;
  }
  async doDefinition(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    valueConverterRegion: AbstractRegion | undefined
  ): Promise<DefinitionResult | undefined> {
    if (!ValueConverterRegion.is(valueConverterRegion)) return;

    const targetRegion = valueConverterRegion;
    const targetValueConverterComponent = aureliaProgram.aureliaComponents
      .getAll()
      .filter(
        (component) => component.type === AureliaClassTypes.VALUE_CONVERTER
      )
      .find(
        (valueConverterComponent) =>
          valueConverterComponent.valueConverterName ===
          targetRegion.data?.valueConverterName
      );

    return {
      lineAndCharacter: {
        line: 1,
        character: 1,
      } /** TODO: Find toView() method */,
      viewModelFilePath: targetValueConverterComponent?.viewModelFilePath,
    };
  }
}

async function onValueConverterCompletion(
  _textDocumentPosition: TextDocumentPositionParams,
  document: TextDocument,
  aureliaProgram: AureliaProgram
) {
  const componentList = aureliaProgram.aureliaComponents.getAll();
  const regions = RegionParser.parse(document, componentList);
  const targetRegion = ViewRegionUtils.findRegionAtPosition(
    regions,
    _textDocumentPosition.position
  );
  if (!targetRegion) return;

  if (!ValueConverterRegion.is(targetRegion)) return [];

  // Find value converter sourcefile
  const valueConverterRegion = targetRegion;
  const targetValueConverterComponent = aureliaProgram.aureliaComponents
    .getAll()
    .filter((component) => component.type === AureliaClassTypes.VALUE_CONVERTER)
    .find(
      (valueConverterComponent) =>
        valueConverterComponent.valueConverterName ===
        valueConverterRegion.data?.valueConverterName
    );

  if (!targetValueConverterComponent?.sourceFile) return [];

  const valueConverterCompletion = getVirtualViewModelCompletionSupplyContent(
    aureliaProgram,
    /**
     * Aurelia interface method name, that handles interaction with view
     */
    AureliaViewModel.TO_VIEW,
    targetValueConverterComponent?.sourceFile,
    'SortValueConverter',
    {
      customEnhanceMethodArguments: enhanceValueConverterViewArguments,
      omitMethodNameAndBrackets: true,
    }
  ).filter(
    /** ASSUMPTION: Only interested in `toView` */
    (completion) => completion.label === AureliaViewModel.TO_VIEW
  );

  return valueConverterCompletion;
}

/**
 * Convert Value Converter's `toView` to view format.
 *
 * @example
 * ```ts
 * // TakeValueConverter
 *   toView(array, count)
 * ```
 *   -->
 * ```html
 *   array | take:count
 * ```
 *
 */
function enhanceValueConverterViewArguments(methodArguments: string[]) {
  // 1. Omit the first argument, because that's piped to the method
  const [_, ...viewArguments] = methodArguments;

  // 2. prefix with :
  const result = viewArguments
    .map((argName, index) => {
      return `\${${index + 1}:${argName}}`;
    })
    .join(':');

  return result;
}
