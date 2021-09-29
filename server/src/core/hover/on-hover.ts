import { Position, TextDocument } from 'vscode-languageserver';

import { findSourceWord } from '../../common/documens/find-source-word';
import { LanguageModes } from '../../feature/embeddedLanguages/languageModes';

export async function onHover(
  documentContent: string,
  position: Position,
  filePath: string,
  languageModes: LanguageModes
) {
  const document = TextDocument.create(filePath, 'html', 0, documentContent);
  const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
    document,
    position
  );

  if (!modeAndRegion) return;
  const { mode, region } = modeAndRegion;

  if (!mode) return;
  if (!region) return;

  const doHover = mode.doHover;

  const offset = document.offsetAt(position);
  const goToSourceWord = findSourceWord(region, offset);

  if (doHover) {
    try {
      const hoverResult = await doHover(
        document,
        position,
        goToSourceWord,
        region
      );
      return hoverResult;
    } catch (error) {
      console.log('TCL: error', error);
      return;
    }
  }
}
