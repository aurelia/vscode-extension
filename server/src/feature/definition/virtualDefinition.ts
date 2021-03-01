import { DefinitionResult } from './getDefinition';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import {
  createVirtualFileWithContent,
  getVirtualLangagueService,
  VirtualSourceFileInfo,
} from '../virtual/virtualSourceFile';

/**
 * 1. Create virtual file
 * 2. with goToSourceWord
 * 3. return definition
 */
export function getVirtualDefinition(
  filePath: string,
  aureliaProgram: AureliaProgram,
  goToSourceWord: string
): DefinitionResult | undefined {
  const { virtualSourcefile, virtualCursorIndex, viewModelFilePath } =
    createVirtualFileWithContent(aureliaProgram, filePath, goToSourceWord) ??
    ({} as VirtualSourceFileInfo);

  const virtualCls = getVirtualLangagueService(virtualSourcefile);

  const result = virtualCls.getDefinitionAtPosition(
    virtualSourcefile.fileName,
    virtualCursorIndex
  );

  if (result?.length === 0) return;

  return {
    lineAndCharacter: virtualSourcefile.getLineAndCharacterOfPosition(
      result![0].contextSpan?.start ?? 0
    ),
    viewModelFilePath,
  };
}
