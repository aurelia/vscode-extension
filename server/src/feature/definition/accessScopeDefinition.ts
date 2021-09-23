/**
 * Defintion[Access Scope]: http://aurelia.io/docs/binding/how-it-works#abstract-syntax-tree
 */

import {
  RepeatForRegionData,
  ViewRegionInfo,
  ViewRegionType,
} from '../embeddedLanguages/embeddedSupport';
import { TextDocument } from 'vscode-languageserver';
import {
  AureliaProgram,
  aureliaProgram as importedAureliaProgram,
} from '../../viewModel/AureliaProgram';
import { getVirtualDefinition } from './virtualDefinition';
import { DefinitionResult } from './getDefinition';
import { Position } from '../embeddedLanguages/languageModes';
import { findSourceWord } from '../../common/documens/find-source-word';

/**
 * Priority
 * 1. Inside view itself
 *   1.1 repeat.for=">rule< of rules"
 *
 * 2. To related view model
 *  Below all have same logic:
 *  2.1 inter-bindable.bind=">increaseCounter()<"
 *  2.2 <div css="width: ${>message<}px;"></div>
 *  2.3 ${grammarRules.length}
 */
export function getAccessScopeDefinition(
  document: TextDocument,
  position: Position,
  region: ViewRegionInfo,
  /**
   * All regions to also find definitions inside view itself
   */
  regions?: ViewRegionInfo[],
  aureliaProgram: AureliaProgram = importedAureliaProgram
): DefinitionResult | undefined {
  const offset = document.offsetAt(position);
  const goToSourceWord = findSourceWord(region, offset);

  // 1.
  const repeatForRegions = regions?.filter(
    (_region) => _region.type === ViewRegionType.RepeatFor
  ) as ViewRegionInfo<RepeatForRegionData>[];
  const targetRepeatForRegion = repeatForRegions.find(
    (repeatForRegion) => repeatForRegion.data?.iterator === goToSourceWord
  );

  if (targetRepeatForRegion) {
    /** repeat.for="" */

    if (
      targetRepeatForRegion?.startLine === undefined ||
      targetRepeatForRegion.startOffset === undefined ||
      targetRepeatForRegion.startCol === undefined
    ) {
      console.error(
        `RepeatFor-Region does not have a start (line). cSearched for ${goToSourceWord}`
      );
      return;
    }

    return {
      lineAndCharacter: {
        line: targetRepeatForRegion.startLine,
        character: targetRepeatForRegion.startCol,
      } /** TODO: Find class declaration position. Currently default to top of file */,
      viewModelFilePath: document.uri,
    };
  }

  // 2.
  const viewModelDefinition = getAccessScopeViewModelDefinition(
    document,
    position,
    region,
    aureliaProgram
  );
  return viewModelDefinition;
}

/*
 * 2. To related view model
 *  Below all have same logic:
 *  2.1 inter-bindable.bind=">increaseCounter()<"
 *  2.2 <div css="width: ${>message<}px;"></div>
 *  2.3 ${grammarRules.length}
 */
export function getAccessScopeViewModelDefinition(
  document: TextDocument,
  position: Position,
  region: ViewRegionInfo,
  aureliaProgram: AureliaProgram = importedAureliaProgram
): DefinitionResult | undefined {
  const offset = document.offsetAt(position);
  const goToSourceWord = findSourceWord(region, offset);

  const virtualDefinition = getVirtualDefinition(
    document.uri,
    aureliaProgram,
    goToSourceWord
  );
  if (
    virtualDefinition?.lineAndCharacter.line !== 0 &&
    virtualDefinition?.lineAndCharacter.character !== 0
  ) {
    return virtualDefinition;
  }

  return;
}
