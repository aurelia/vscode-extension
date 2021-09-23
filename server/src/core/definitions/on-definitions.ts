import { pathToFileURL } from 'url';
import { Position, TextDocument } from 'vscode-html-languageservice';
import { LocationLink, Range } from 'vscode-languageserver';
import { AsyncReturnType } from '../../common/global';
import { LanguageModes } from '../../feature/embeddedLanguages/languageModes';
import { AureliaProgram } from '../../viewModel/AureliaProgram';

export async function onDefintion(
  documentContent: string,
  position: Position,
  filePath: string,
  languageModes: LanguageModes,
  aureliaProgram: AureliaProgram
): Promise<LocationLink[] | undefined> {
  const document = TextDocument.create(filePath, 'html', 0, documentContent);
  const isRefactor = true;

  let modeAndRegion: AsyncReturnType<
    LanguageModes['getModeAndRegionAtPosition']
  >;
  try {
    modeAndRegion = await languageModes.getModeAndRegionAtPosition(
      document,
      position
    );
  } catch (error) {
    console.log('TCL: error', error);
  }

  if (!modeAndRegion) return;
  const { mode, region } = modeAndRegion;

  if (!mode) return;
  if (!region) return;
  region.type; /*?*/

  const doDefinition = mode.doDefinition;

  if (doDefinition !== undefined && isRefactor) {
    let definition: AsyncReturnType<typeof doDefinition>;

    try {
      definition = await doDefinition(
        document,
        position,
        region,
        aureliaProgram
      );
    } catch (error) {
      console.log('TCL: error', error);
      return;
    }

    if (!definition) return;

    const { line, character } = definition.lineAndCharacter;
    const targetPath =
      definition.viewFilePath ?? definition.viewModelFilePath ?? '';

    const range = Range.create(
      Position.create(line - 1, character),
      Position.create(line, character)
    );

    return [
      LocationLink.create(pathToFileURL(targetPath).toString(), range, range),
    ];
  }
}
