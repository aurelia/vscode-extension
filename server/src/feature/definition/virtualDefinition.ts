import { AureliaProgram } from '../../viewModel/AureliaProgram';
import {
  createVirtualFileWithContent,
  getVirtualLangagueService,
  VirtualSourceFileInfo,
} from '../virtual/virtualSourceFile';
import { DefinitionResult } from './getDefinition';

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

  const program = aureliaProgram.getProgram();
  if (!program) return;

  const virtualCls = getVirtualLangagueService(virtualSourcefile, program);

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
