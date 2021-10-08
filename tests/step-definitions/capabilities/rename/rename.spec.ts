import { StepDefinitions } from 'jest-cucumber';
import { WorkspaceEdit } from 'vscode-languageserver';
import { Logger } from '../../../../server/src/common/logging/logger';
import { position } from '../common/common-capabilities.spec';
import { languageModes } from '../new-common/file.step';
import { myMockServer } from '../new-common/project.step';

const logger = new Logger('rename.spec');

// const feature = loadFeature(
//   `${getTestDir()}/features/capabilities/rename/rename.feature`,
//   {
//     // tagFilter: '@focus',
//   }
// );

let code = '';
let renamed: WorkspaceEdit | undefined;

export const renameSteps: StepDefinitions = ({ given, and, when, then }) => {
  when(/^I trigger Rename to (.*)$/, async (newWord: string) => {
    /* prettier-ignore */ logger.log('I trigger Suggestions',{logPerf:true});

    const document = myMockServer.textDocuments.getFirst();

    renamed = await myMockServer
      .getAureliaServer()
      .onRenameRequest(position, document, newWord, languageModes);
  });

  then('the View model variable should be renamed', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    // TODO: update componentList
  });

  and(
    'all other components, that also use the Bindable should be renamed',
    () => {
      expect(renamed?.changes).toBeDefined();
      if (renamed?.changes) {
        expect(Object.keys(renamed.changes).length).toBeGreaterThan(0);
      }
    }
  );
};

// defineFeature(feature, (test) => {
//   test('Normal rename', ({ given, when, then, and }) => {
//     given(
//       /^the project is named "(.*)"$/,
//       async (projectName: FixtureNames) => {
//         /* prettier-ignore */ theProjectIsNamed(projectName);
//       }
//     );

//     and(
//       /^I open VSCode with the following file "(.*)"$/,
//       async (fileName: string) => {
//         /* prettier-ignore */ logger.log('^I open VSCode with the following file "(.*)"$');
//         const uri = myMockServer.getWorkspaceUri();
//         const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
//         await givenIOpenVsCodeWithTheFollowingFiles(textDocumentPaths);
//       }
//     );

//     and(
//       /^I'm on the line (\d+) at character (.*)$/,
//       async (line: number, codeWithCursor: string) => {
//         /* prettier-ignore */ logger.log('/^I\'m on the line (\d+) at character (.*)$/',{logPerf: true});

//         code = removeCursorFromCode(codeWithCursor);

//         ({ position, languageModes } = await givenImOnTheLineAtCharacter(
//           codeWithCursor,
//           Number(line)
//         ));
//       }
//     );

//     when(/^I trigger Rename to (.*)$/, async (newWord: string) => {
//       /* prettier-ignore */ logger.log('I trigger Suggestions',{logPerf:true});

//       const document = myMockServer.textDocuments.getFirst();

//       renamed = await myMockServer
//         .getAureliaServer()
//         .onRenameRequest(position, document, newWord, languageModes);

//       // expect(true).toBeFalsy();
//     });

//     then('the View model variable should be renamed', () => {});

//     and(
//       'all other components, that also use the Bindable should be renamed',
//       () => {}
//     );
//   });

//   test('Rename Bindable attribute', ({ given, when, then, and }) => {
//     given(
//       /^the project is named "(.*)"$/,
//       async (projectName: FixtureNames) => {
//         /* prettier-ignore */ theProjectIsNamed(projectName);
//       }
//     );

//     and(
//       /^I open VSCode with the following file "(.*)"$/,
//       async (fileName: string) => {
//         /* prettier-ignore */ logger.log('^I open VSCode with the following file "(.*)"$');
//         const uri = myMockServer.getWorkspaceUri();
//         const textDocumentPaths = getPathsFromFileNames(uri, [fileName]);
//         await givenIOpenVsCodeWithTheFollowingFiles(textDocumentPaths);
//       }
//     );

//     and(
//       /^I'm on the line (\d+) at character (.*)$/,
//       async (line: number, codeWithCursor: string) => {
//         /* prettier-ignore */ logger.log('/^I\'m on the line (\d+) at character (.*)$/',{logPerf: true});

//         code = removeCursorFromCode(codeWithCursor);

//         ({ position, languageModes } = await givenImOnTheLineAtCharacter(
//           codeWithCursor,
//           Number(line)
//         ));
//       }
//     );

//     when(/^I trigger Rename to (.*)$/, async (newWord: string) => {
//       /* prettier-ignore */ logger.log('I trigger Suggestions',{logPerf:true});

//       const document = myMockServer.textDocuments.getFirst();

//       renamed = await myMockServer
//         .getAureliaServer()
//         .onRenameRequest(position, document, newWord, languageModes);
//     });

//     then('the View model variable should be renamed', () => {
//       const { AureliaProjects } = myMockServer.getContainerDirectly();
//       // TODO: update componentList
//     });

//     and(
//       'all other components, that also use the Bindable should be renamed',
//       () => {
//         expect(renamed?.changes).toBeDefined();
//         if (renamed?.changes) {
//           expect(Object.keys(renamed.changes).length).toBeGreaterThan(1);
//         }
//       }
//     );
//   });
// });
