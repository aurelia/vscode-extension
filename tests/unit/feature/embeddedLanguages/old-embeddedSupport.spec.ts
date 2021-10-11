// import 'reflect-metadata';
// import { strictequal } from 'assert';
// import * as fs from 'fs';

// import { aureliaprogram } from '../../../../server/src/viewmodel/aureliaprogram';
// import { textdocument } from 'vscode-html-languageservice';
// import {
//   parsedocumentregions,
//   viewregiontype,
// } from '../../../../server/src/feature/embeddedlanguages/embeddedsupport';
// import { container } from 'aurelia-dependency-injection';
// import path from 'path';
// import {
//   iprojectoptions,
//   defaultprojectoptions,
// } from '../../../../server/src/common/common.types';
// import { globalcontainer } from '../../../../server/src/container';

// export async function getaureliaprogramfortesting(
//   projectoptions: iprojectoptions = defaultprojectoptions
// ): promise<aureliaprogram> {
//   const container: container = globalcontainer;
//   const aureliaprogram = container.get(aureliaprogram);
//   const rootdirectory = path.resolve(__dirname, '../../testfixture');

//   projectoptions.rootdirectory = rootdirectory;

//   await createaureliawatchprogram(aureliaprogram);
//   return aureliaprogram;
// }

// let testaureliaprogram: aureliaprogram;
// describe('embeddedsupport.ts', () => {
//   before(async () => {
//     testaureliaprogram = await getaureliaprogramfortesting({
//       include: ['src/realdworld-advanced'],
//     });
//   });

//   it('parsedocumentregions', async () => {
//     const aureliacomponentlist = testaureliaProgram.aureliaComponents.get();
//     const settingscomponent = aureliacomponentlist.find(
//       (component) => component.componentname === 'settings-view'
//     );

//     if (settingscomponent === undefined) return;

//     const { viewfilepath } = settingscomponent;

//     if (viewfilepath === undefined) return;

//     const uri = viewfilepath;
//     const content = fs.readfilesync(uri, 'utf-8');
//     const document = textdocument.create(uri, 'html', 99, content);
//     const regions = await parsedocumentregions(document, testaureliaprogram);

//     strictequal(regions.length, 8);

//     const attributeregions = regions.filter(
//       (region) => region.type === viewregiontype.attribute
//     );
//     strictequal(attributeregions.length, 6);

//     const attributeinterpolationregions = regions.filter(
//       (region) => region.type === viewregiontype.attributeinterpolation
//     );
//     strictequal(attributeinterpolationregions.length, 1);

//     const textinterpolationregions = regions.filter(
//       (region) => region.type === viewregiontype.textinterpolation
//     );
//     strictequal(textinterpolationregions.length, 1);
//   });

//   it('parsedocumentregions - set viewregions to componentlist', async () => {
//     testaureliaprogram.initcomponentlist();
//     const aureliacomponentlist = testaureliaProgram.aureliaComponents.get();
//     const settingscomponent = aureliacomponentlist.find(
//       (component) => component.componentname === 'settings-view'
//     );

//     if (settingscomponent === undefined) return;

//     const uri = settingscomponent.viewfilepath ?? '';
//     const content = fs.readfilesync(uri, 'utf-8');
//     const document = textdocument.create(uri, 'html', 99, content);
//     const regions = await parsedocumentregions(document, testaureliaprogram);

//     testaureliaprogram.setviewregions(
//       settingscomponent.componentname ?? '',
//       regions
//     );

//     strictequal(settingscomponent.viewregions?.length, 8);
//   });
// });
