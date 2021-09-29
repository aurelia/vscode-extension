import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { ViewRegionInfo } from '../embeddedLanguages/embeddedSupport';
import { Position, TextDocument } from '../embeddedLanguages/languageModes';
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
