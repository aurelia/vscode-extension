import { AureliaProgram } from '../../core/viewModel/AureliaProgram';
import {
  createVirtualFileWithContent,
  getVirtualLangagueService,
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
  const virtualFileWithContent = createVirtualFileWithContent(
    aureliaProgram,
    filePath,
    goToSourceWord
  );
  if (virtualFileWithContent === undefined) return;

  const { virtualSourcefile, virtualCursorIndex, viewModelFilePath } =
    virtualFileWithContent;

  const program = aureliaProgram.getProgram();
  if (program === undefined) return;

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
