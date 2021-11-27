// import { strictEqual } from 'assert';
// import { Position } from 'vscode-html-languageservice';
// import * as path from 'path';

// import { AsyncReturnType } from '../../../../server/src/common/global.d';
// import {
//   createTextDocumentPositionParams,
//   getLanguageModes,
//   LanguageModes,
//   LanguageModeWithRegion,
// } from '../../../../server/src/core/embeddedLanguages/languageModes';
// import {
//   createTextDocumentForTesting,
//   getAureliaProgramForTesting,
// } from '../../helpers/test-setup';
// import { isAureliaCompletionItem } from '../../../../server/src/feature/completions/virtualCompletion';
// import { VIRTUAL_METHOD_NAME } from '../../../../server/src/feature/virtual/virtualSourceFile';

// describe('languageModes.ts', () => {
//   let languageModes: AsyncReturnType<typeof getLanguageModes>;

//   before('getLanguageModes', async () => {
//     getAureliaProgramForTesting();
//     languageModes = await getLanguageModes();
//   });

//   it('getModeAndRegionAtPosition', async () => {
//     const testPath = path.resolve(__dirname, '../../../testFixture');
//     const targetViewPath = path.resolve(
//       testPath,
//       './src/realdworld-advanced/settings/index.html'
//     );
//     const document = createTextDocumentForTesting(targetViewPath);
//     const position = Position.create(12, 26);
//     const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
//       document,
//       position
//     );

//     //
//     strictEqual(modeAndRegion?.region?.attributeValue, 'local.email');
//   });
// });

// describe('languageModes.ts - Modes', () => {
//   let mode: LanguageModeWithRegion['mode'];
//   let document: ReturnType<typeof createTextDocumentForTesting>;
//   let modeAndRegion: AsyncReturnType<
//     LanguageModes['getModeAndRegionAtPosition']
//   >;

//   const position = Position.create(4, 8);

//   before(async () => {
//     getAureliaProgramForTesting();
//     const languageModes = await getLanguageModes();

//     const testPath = path.resolve(__dirname, '../../../testFixture');
//     const targetViewPath = path.resolve(
//       testPath,
//       './src/realdworld-advanced/settings/index.html'
//     );
//     document = createTextDocumentForTesting(targetViewPath);

//     modeAndRegion = await languageModes.getModeAndRegionAtPosition(
//       document,
//       position
//     );

//     if (!modeAndRegion) return;

//     //
//     mode = modeAndRegion.mode;
//   });

//   it('Completions', async () => {
//     const position = Position.create(4, 8);

//     if (!mode?.doDefinition) return;

//     const definition = await mode.doDefinition(document, position, 'dirty');
//     strictEqual(definition?.lineAndCharacter.character, 2);
//     strictEqual(definition?.lineAndCharacter.line, 10);
//     const correctPath = definition.viewModelFilePath?.includes(
//       '/settings/index'
//     );
//     strictEqual(correctPath, true);
//   });
//   it('Hover', async () => {
//     if (!mode?.doHover) return;

//     const region = modeAndRegion?.region;
//     if (region === undefined) return;

//     const hover = await mode.doHover(document, position, 'dirty', region);

//     // eslint-disable-next-line
//     const correctDocs = hover?.contents.value.includes(
//       'SettingsViewCustomElement.dirty'
//     );
//     strictEqual(correctDocs, true);
//   });
//   it('Complete', async () => {
//     if (!mode?.doComplete) return;

//     const region = modeAndRegion?.region;
//     if (region === undefined) return;

//     const textDocumentPositionParams = createTextDocumentPositionParams(
//       document,
//       {
//         line: 4,
//         character: 13,
//       }
//     );
//     const complete = await mode.doComplete(
//       document,
//       textDocumentPositionParams,
//       'dirty',
//       region
//     );

//     if (!isAureliaCompletionItem(complete)) return;

//     const hasInternalVirMethod =
//       complete.find((completeItem) =>
//         completeItem.label?.includes(VIRTUAL_METHOD_NAME)
//       ) !== undefined;
//     strictEqual(hasInternalVirMethod, true);

//     const numOfClassMembers = 10;
//     /** 1: __vir */
//     const completionsResults = numOfClassMembers + 1;
//     strictEqual(complete?.length, completionsResults);
//   });
// });
