// import 'reflect-metadata';
// import { strictEqual } from 'assert';

// import { AureliaProgram } from '../../../server/src/viewModel/AureliaProgram';
// import { getAureliaProgramForTesting } from '../helpers/test-setup';
// import { AureliaClassTypes } from '../../../server/src/common/constants';
// import { SyntaxKind } from 'typescript';

// let testAureliaProgram: AureliaProgram;
// describe('Aurelia Component List', () => {
//   before(async () => {
//     testAureliaProgram = await getAureliaProgramForTesting({
//       include: ['src/realdworld-advanced'],
//     });
//   });

//   it('#initComponentList', () => {
//     testAureliaProgram.initComponentList();

//     const componentList = testaureliaProgram.aureliaComponents.get();  /*?*/

//     strictEqual(componentList.length, 2);

//     const settingsComponent = componentList.find(
//       (component) => component.componentName === 'settings-view'
//     );
//     strictEqual(settingsComponent?.className, 'SettingsViewCustomElement');
//     strictEqual(settingsComponent?.componentName, 'settings-view');
//     strictEqual(settingsComponent?.baseViewModelFileName, 'index');
//     strictEqual(settingsComponent?.type, AureliaClassTypes.CUSTOM_ELEMENT);
//     //
//     const { classMembers } = settingsComponent;

//     if (!classMembers) return;

//     strictEqual(classMembers.length, 7);
//     const bindables = classMembers.filter((member) => member.isBindable);
//     strictEqual(bindables.length, 0);
//     const variables = classMembers.filter(
//       (member) => member.syntaxKind === SyntaxKind.VariableDeclaration
//     );
//     strictEqual(variables.length, 2);
//     const methods = classMembers.filter(
//       (member) => member.syntaxKind === SyntaxKind.MethodDeclaration
//     );
//     strictEqual(methods.length, 5);
//   });
// });

// describe('Aurelia Component List - Methods', () => {
//   it('#setBindableList #getBindableList', async () => {
//     testAureliaProgram = await getAureliaProgramForTesting({
//       include: ['src/minimal-component/*'],
//     });
//     testAureliaProgram.initComponentList();

//     const bindableList = testAureliaProgram.getBindableList();
//     strictEqual(bindableList.length, 1);
//     strictEqual(bindableList[0].classMember.name, 'minimalBindable');
//     strictEqual(bindableList[0].componentName, 'minimal-component');
//   });
// });
