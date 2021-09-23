import { Position, TextDocument } from 'vscode-html-languageservice';
import { AsyncReturnType } from '../../common/global';
import { DefinitionResult } from '../../feature/definition/getDefinition';
import { LanguageModes } from '../../feature/embeddedLanguages/languageModes';
import {
  AureliaProgram,
  aureliaProgram as importedAureliaProgram,
} from '../../viewModel/AureliaProgram';

export async function onDefintion(
  documentContent: string,
  position: Position,
  filePath: string,
  languageModes: LanguageModes,
  aureliaProgram: AureliaProgram = importedAureliaProgram
): Promise<DefinitionResult | undefined> {
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
    let definitions: AsyncReturnType<typeof doDefinition>;

    try {
      definitions = await doDefinition(
        document,
        position,
        region,
        aureliaProgram
      );
    } catch (error) {
      console.log('TCL: error', error);
      return;
    }
    return definitions;
  }
}
