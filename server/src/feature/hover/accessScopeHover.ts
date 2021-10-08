import { TextDocument, Position } from 'vscode-languageserver';
import { ViewRegionInfo } from '../../core/embeddedLanguages/embeddedSupport';
import { AureliaProgram } from '../../core/viewModel/AureliaProgram';
import {
  createVirtualLanguageService,
  CustomHover,
} from '../virtual/virtualSourceFile';

export async function getAccessScopeHover(
  aureliaProgram: AureliaProgram,
  document: TextDocument,
  position: Position,
  goToSourceWord: string,
  attributeRegion: ViewRegionInfo
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
