import { TextDocumentPositionParams } from 'vscode-languageserver';

import { AureliaClassTypes, AureliaViewModel } from '../../../common/constants';
import { createValueConverterCompletion } from '../../../feature/completions/completions';
import { getVirtualViewModelCompletionSupplyContent } from '../../../feature/completions/virtualCompletion';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import {
  getRegionAtPosition,
  parseDocumentRegions,
  ValueConverterRegionData,
  ViewRegionInfo,
  ViewRegionType,
} from '../embeddedSupport';
import { LanguageMode, Position, TextDocument } from '../languageModes';

export function getValueConverterMode(
  aureliaProgram: AureliaProgram
): LanguageMode {
  return {
    getId() {
      return ViewRegionType.ValueConverter;
    },
    async doComplete(
      document: TextDocument,
      _textDocumentPosition: TextDocumentPositionParams,
      triggerCharacter: string | undefined,
      region?: ViewRegionInfo
    ) {
      if (triggerCharacter === ':') {
        const completions = await onValueConverterCompletion(
          _textDocumentPosition,
          document,
          aureliaProgram
        );
        return completions;
      }

      const valueConverterCompletion = createValueConverterCompletion(
        aureliaProgram
      );
      return valueConverterCompletion;
    },
    async doDefinition(
      document: TextDocument,
      position: Position,
      valueConverterRegion: ViewRegionInfo | undefined
    ): Promise<DefinitionResult | undefined> {
      const targetRegion = valueConverterRegion as ViewRegionInfo<ValueConverterRegionData>;
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
    },
    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };
}

async function onValueConverterCompletion(
  _textDocumentPosition: TextDocumentPositionParams,
  document: TextDocument,
  aureliaProgram: AureliaProgram
) {
  const componentList = aureliaProgram.aureliaComponents.getAll();
  const regions = await parseDocumentRegions(document, componentList);
  const targetRegion = getRegionAtPosition(
    document,
    regions,
    _textDocumentPosition.position
  );

  if (targetRegion?.type !== ViewRegionType.ValueConverter) return [];

  /** TODO: Infer type via isValueConverterRegion (see ts.isNodeDeclaration) */
  // Find value converter sourcefile
  const valueConverterRegion = targetRegion as ViewRegionInfo<ValueConverterRegionData>;

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
