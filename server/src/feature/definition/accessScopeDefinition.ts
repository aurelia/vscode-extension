/**
 * Defintion[Access Scope]: http://aurelia.io/docs/binding/how-it-works#abstract-syntax-tree
 */

import { Position, TextDocument } from 'vscode-languageserver';

import { DefinitionResult } from '../../aot/parser/parser-types';
import {
  AbstractRegion,
  RepeatForRegion,
  ViewRegionType,
} from '../../aot/parser/regions/ViewRegions';
import { findSourceWord } from '../../common/documens/find-source-word';
import { getRelatedFilePath } from '../../common/documens/related';
import { TextDocumentUtils } from '../../common/documens/TextDocumentUtils';
import { UriUtils } from '../../common/view/uri-utils';
import { AureliaProgram } from '../../core/viewModel/AureliaProgram';

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
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  position: Position,
  region: AbstractRegion,
  /**
   * All regions to also find definitions inside view itself
   */
  regions?: AbstractRegion[]
): DefinitionResult | undefined {
  const offset = document.offsetAt(position);
  const goToSourceWord = findSourceWord(region, offset);

  // 1.
  const repeatForRegions = regions?.filter(
    (_region) => _region.type === ViewRegionType.RepeatFor
  ) as RepeatForRegion[];
  if (repeatForRegions == null) return;

  const targetRepeatForRegion = repeatForRegions.find(
    (repeatForRegion) => repeatForRegion.data?.iterator === goToSourceWord
  );

  if (targetRepeatForRegion) {
    /** repeat.for="" */

    if (
      targetRepeatForRegion.sourceCodeLocation.startLine === undefined ||
      targetRepeatForRegion.sourceCodeLocation.startOffset === undefined ||
      targetRepeatForRegion.sourceCodeLocation.startCol === undefined
    ) {
      console.error(
        `RepeatFor-Region does not have a start (line). cSearched for ${goToSourceWord}`
      );
      return;
    }

    return {
      lineAndCharacter: {
        line: targetRepeatForRegion.sourceCodeLocation.startLine,
        character: targetRepeatForRegion.sourceCodeLocation.startCol,
      } /** TODO: Find class declaration position. Currently default to top of file */,
      viewModelFilePath: UriUtils.toSysPath(document.uri),
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
  region: AbstractRegion,
  aureliaProgram: AureliaProgram
): DefinitionResult | undefined {
  const offset = document.offsetAt(position);
  const goToSourceWord = findSourceWord(region, offset);

  const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
    'viewFilePath',
    UriUtils.toSysPath(document.uri)
  );
  const targetMember = targetComponent?.classMembers?.find(
    (member) => member.name === goToSourceWord
  );

  if (!targetMember) return;

  const viewModelPath = getRelatedFilePath(UriUtils.toSysPath(document.uri), [
    '.js',
    '.ts',
  ]);
  const viewModelDocument = TextDocumentUtils.createFromPath(
    viewModelPath,
    'typescript'
  );
  const targetPosition = viewModelDocument.positionAt(targetMember.start);
  const defintion: DefinitionResult = {
    lineAndCharacter: {
      line: targetPosition.line + 1, // from sourcefile, but defintion is 1 based
      character: targetPosition.character,
    },
    viewModelFilePath: viewModelPath,
  };

  return defintion;
}
