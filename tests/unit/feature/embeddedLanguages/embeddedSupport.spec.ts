// import 'reflect-metadata';
// import { strictEqual } from 'assert';
// import * as fs from 'fs';

// import { AureliaProgram } from '../../../../server/src/viewModel/AureliaProgram';
// import { CompletionItemKind, TextDocument } from 'vscode-html-languageservice';
// import {
//   parseDocumentRegions,
//   ViewRegionType,
// } from '../../../../server/src/feature/embeddedLanguages/embeddedSupport';
// import { Container } from 'aurelia-dependency-injection';
// import path from 'path';
// import {
//   IProjectOptions,
//   defaultProjectOptions,
// } from '../../../../server/src/common/common.types';
// import { globalContainer } from '../../../../server/src/container';
// import { createAureliaWatchProgram } from '../../../../server/src/viewModel/createAureliaWatchProgram';

// export async function getAureliaProgramForTesting(
//   projectOptions: IProjectOptions = defaultProjectOptions
// ): Promise<AureliaProgram> {
//   const container: Container = globalContainer;
//   const aureliaProgram = container.get(AureliaProgram);
//   const rootDirectory = path.resolve(__dirname, '../../testFixture');

//   projectOptions.rootDirectory = rootDirectory;

//   await createAureliaWatchProgram(aureliaProgram);
//   return aureliaProgram;
// }

// let testAureliaProgram: AureliaProgram;
// describe('embeddedSupport.ts', () => {
//   before(async () => {
//     testAureliaProgram = await getAureliaProgramForTesting({
//       include: ['src/realdworld-advanced'],
//     });
//   });

//   it('parseDocumentRegions', async () => {
//     const aureliaComponentList = testAureliaProgram.getComponentList();
//     const settingsComponent = aureliaComponentList.find(
//       (component) => component.componentName === 'settings-view'
//     );

//     if (settingsComponent === undefined) return;

//     const { viewFilePath } = settingsComponent;

//     if (viewFilePath === undefined) return;

//     const uri = viewFilePath;
//     const content = fs.readFileSync(uri, 'utf-8');
//     const document = TextDocument.create(uri, 'html', 99, content);
//     const regions = await parseDocumentRegions(document, testAureliaProgram);

//     strictEqual(regions.length, 8);

//     const attributeRegions = regions.filter(
//       (region) => region.type === ViewRegionType.Attribute
//     );
//     strictEqual(attributeRegions.length, 6);

//     const attributeInterpolationRegions = regions.filter(
//       (region) => region.type === ViewRegionType.AttributeInterpolation
//     );
//     strictEqual(attributeInterpolationRegions.length, 1);

//     const textInterpolationRegions = regions.filter(
//       (region) => region.type === ViewRegionType.TextInterpolation
//     );
//     strictEqual(textInterpolationRegions.length, 1);
//   });

//   it('parseDocumentRegions - set viewRegions to ComponentList', async () => {
//     testAureliaProgram.initComponentList();
//     const aureliaComponentList = testAureliaProgram.getComponentList();
//     const settingsComponent = aureliaComponentList.find(
//       (component) => component.componentName === 'settings-view'
//     );

//     if (settingsComponent === undefined) return;

//     const uri = settingsComponent.viewFilePath ?? '';
//     const content = fs.readFileSync(uri, 'utf-8');
//     const document = TextDocument.create(uri, 'html', 99, content);
//     const regions = await parseDocumentRegions(document, testAureliaProgram);

//     testAureliaProgram.setViewRegions(
//       settingsComponent.componentName ?? '',
//       regions
//     );

//     strictEqual(settingsComponent.viewRegions?.length, 8);
//   });
// });
