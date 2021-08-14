import {
  createVirtualLanguageService,
  CustomHover,
} from '../virtual/virtualSourceFile';
import { ViewRegionInfo } from '../embeddedLanguages/embeddedSupport';
import { Position, TextDocument } from '../embeddedLanguages/languageModes';

export async function getAccessScopeHover(
  document: TextDocument,
  position: Position,
  goToSourceWord: string,
  attributeRegion: ViewRegionInfo
): Promise<CustomHover | undefined> {
  const virtualLanguageService = await createVirtualLanguageService(
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
