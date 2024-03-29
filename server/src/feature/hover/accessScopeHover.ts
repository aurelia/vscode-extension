import { TextDocument, Position } from 'vscode-languageserver';

import { AureliaProgram } from '../../aot/AureliaProgram';
import { AbstractRegion } from '../../aot/parser/regions/ViewRegions';
import {
  createVirtualLanguageService,
  CustomHover,
} from '../virtual/virtualSourceFile';

export async function getAccessScopeHover(
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  position: Position,
  goToSourceWord: string,
  attributeRegion: AbstractRegion
): Promise<CustomHover | undefined> {
  const virtualLanguageService = await createVirtualLanguageService(
    aureliaProgram,
    position,
    document,
    {
      region: attributeRegion,
      startAtBeginningOfMethodInVirtualFile: true,
    }
  );

  if (!virtualLanguageService) return;

  const quickInfo = virtualLanguageService.getQuickInfoAtPosition();

  if (!quickInfo) return;
  return quickInfo;
}
