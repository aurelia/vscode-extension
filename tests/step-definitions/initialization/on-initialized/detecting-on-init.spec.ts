import { DefineStepFunction, StepDefinitions } from 'jest-cucumber';
import { strictEqual } from 'assert';
import {
  FixtureNames,
  getFixtureUri,
} from '../../../common/fixtures/get-fixture-dir';
import { testError } from '../../../common/errors/TestErrors';
import { MockServer } from '../../../common/mock-server/mock-server';
// import { testContainer } from '../../../jest-cucumber-setup.spec';
import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { Logger } from '../../../../server/src/common/logging/logger';
import {
  getPathsFromFileNames,
  givenIOpenVsCodeWithTheFollowingFiles,
} from './hydrate-on-init.spec';
import {
  givenImOnTheLineAtCharacter,
  removeCursorFromCode,
} from '../../capabilities/common/common-capabilities.spec';
import { Position } from 'vscode-languageserver-protocol';
import { AsyncReturnType } from '../../../../server/src/common/global';
import {
  CompletionList,
  createTextDocumentPositionParams,
  getLanguageModes,
} from '../../../../server/src/feature/embeddedLanguages/languageModes';
import {
  AureliaCompletionItem,
  isAureliaCompletionItem,
} from '../../../../server/src/feature/completions/virtualCompletion';
import { Container } from '../../../../server/src/container';

export const testContainer = new Container();

const logger = new Logger('[Test] Detecting');

export const MARK_START = 'MARK_START';
export const MARK_MIDDLE = 'MARK_MIDDLE';
export const MARK_END = 'MARK_END';

export let myMockServer: MockServer;
let _WORKSPACE_URI_CACHE = '';
export let code = '';
let codeWithCursor = '';
export let languageModes: AsyncReturnType<typeof getLanguageModes>;
export let position: Position;
export let completions: AureliaCompletionItem[] | CompletionList = [];

describe.skip('single', () => {
  test('easy', (done) => {
    console.log('hi');
    // expect(true).toBeFalsy();
    done();
  });
});
describe.only('single', () => {
  test('/^the project is named "(.*)"$/', async () => {
    logger.log('/^the project is named "(.*)"$/', { logPerf: true });

    const projectName = 'cli-generated';
    testError.verifyProjectName(projectName);

    const workspaceRootUri = getFixtureUri(projectName);
    const useCached = workspaceRootUri !== _WORKSPACE_URI_CACHE;
    // if (useCached) {
    if (true) {
      myMockServer = new MockServer(testContainer, workspaceRootUri, {
        aureliaProject: {
          rootDirectory: UriUtils.toPath(workspaceRootUri),
        },
      });
      myMockServer.setWorkspaceUri(workspaceRootUri);
    }

    _WORKSPACE_URI_CACHE = workspaceRootUri;
    // expect(true).toBeFalsy();
  });

  test('/^I open VSCode with the following file "(.*)"$/', async () => {
    /* prettier-ignore */ logger.log(`^I open VSCode with the following file "(.*)"$`,{logPerf: true});
    const fileName = 'minimal-component.html';
    const textDocumentPaths = getPathsFromFileNames([fileName]);
    await givenIOpenVsCodeWithTheFollowingFiles(textDocumentPaths);
    // expect(true).toBeFalsy();
  });

  test(`/^I'm replacing the file content with (.*)$/`, () => {
    codeWithCursor = `\`<div click.delegate="\|"></div>\``;
    /* prettier-ignore */ logger.log(`/^I'm replacing the file content with (.*)$/`,{logPerf: true})

    code = removeCursorFromCode(codeWithCursor);
    myMockServer.textDocuments.changeFirst(code);
    // expect(true).toBeFalsy();
    // /* prettier-ignore */ logger.log(`after`, { logPerf: true });
  });

  test(`/^I'm on the line (\d+) at character (.*)$/`, async () => {
    const line: number = 0;
    /* prettier-ignore */ logger.log(`/^I'm on the line (\d+) at character (.*)$/`,{logPerf: true});

    code = removeCursorFromCode(codeWithCursor);

    ({ position, languageModes } = await givenImOnTheLineAtCharacter(
      codeWithCursor,
      position,
      Number(line)
    ));
    // expect(true).toBeFalsy();
  });

  test('I trigger Suggestions', async () => {
    /* prettier-ignore */ logger.log('I trigger Suggestions',{logPerf: true})

    const document = myMockServer.textDocuments.getFirst();
    const textDocumentPositionParams = createTextDocumentPositionParams(
      document,
      position
    );

    if (!isAureliaCompletionItem(completions)) {
      throw new Error('Not AureliaCompletionItem[]');
    }

    completions = await myMockServer
      .getAureliaServer()
      .onCompletion(textDocumentPositionParams, document, languageModes);
    // expect(true).toBeFalsy();
  });

  test('I should get the correct suggestions', () => {
    /* prettier-ignore */ logger.log('I should get the correct suggestion',{logPerf: true})

    if (isAureliaCompletionItem(completions)) {
      expect(completions.length).toBeGreaterThan(0);
    }

    // expect(true).toBeFalsy();
  });
});

// export const commonExtensionSteps: StepDefinitions = ({ given, then }) => {
//   given(/^the project is named "(.*)"$/, async (projectName: FixtureNames) => {
// logger.log('/^the project is named "(.*)"$/');

//     testError.verifyProjectName(projectName);

//     const workspaceRootUri = getFixtureUri(projectName);
//     const useCached = workspaceRootUri !== _WORKSPACE_URI_CACHE;
//     // if (useCached) {
//     if (true) {
//       myMockServer = new MockServer(testContainer, workspaceRootUri, {
//         aureliaProject: {
//           rootDirectory: UriUtils.toPath(workspaceRootUri),
//         },
//       });
//       myMockServer.setWorkspaceUri(workspaceRootUri);
//     }

//     _WORKSPACE_URI_CACHE = workspaceRootUri;
//   });

//   then('the extension should not activate', () => {
//     const { AureliaProjects } = myMockServer.getContainerDirectly();
//     const auProjects = AureliaProjects.getProjects();
//     strictEqual(auProjects.length, 0);
//   });

//   test('I trigger Suggestions', async () => {
//     /* prettier-ignore */ logger.log('I trigger Suggestions')

//     const document = myMockServer.textDocuments.getFirst();
//     const textDocumentPositionParams = createTextDocumentPositionParams(
//       document,
//       position
//     );

//     if (!isAureliaCompletionItem(completions)) {
//       throw new Error('Not AureliaCompletionItem[]');
//     }

//     completions = await myMockServer
//       .getAureliaServer()
//       .onCompletion(textDocumentPositionParams, document, languageModes);
//   });
// };

// export const cliGenerateSteps: StepDefinitions = ({ given, then }) => {
//   given(/^I open VSCode with no active files$/, async () => {
//     const mockTextDocuments = myMockServer.textDocuments.mock().getAll();
//     await myMockServer.getAureliaServer().onConnectionInitialized(
//       {
//         aureliaProject: {
//           rootDirectory: myMockServer.getWorkspaceUri(),
//         },
//       },
//       mockTextDocuments
//     );
//   });

//   // then('the extension should detect the Aurelia project', () => {
//   //   const { AureliaProjects } = myMockServer.getContainerDirectly();
//   //   const auProjects = AureliaProjects.getProjects();
//   //   strictEqual(auProjects.length, 1);
//   //   strictEqual(auProjects[0].aureliaProgram, null);
//   // });

//   // then('the extension should detect all Aurelia projects', () => {
//   //   const { AureliaProjects } = myMockServer.getContainerDirectly();
//   //   const auProjects = AureliaProjects.getProjects();
//   //   strictEqual(auProjects.length >= 2, true);
//   // });
// };
