import {
  defaultProjectOptions,
  IProjectOptions,
} from '../../../server/src/common/common.types';
import * as path from 'path';
import * as fs from 'fs';
import 'reflect-metadata';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { AureliaProgram } from '../../../server/src/viewModel/AureliaProgram';
import { createAureliaWatchProgram } from '../../../server/src/viewModel/createAureliaWatchProgram';
import { Position } from 'vscode-html-languageservice';
import { Container } from 'aurelia-dependency-injection';
import {
  AureliaCompletionItem,
  isAureliaCompletionItem,
} from '../../../server/src/feature/completions/virtualCompletion';
import {
  createTextDocumentPositionParams,
  getLanguageModes,
} from '../../../server/src/feature/embeddedLanguages/languageModes';
import { DefinitionResult } from '../../../server/src/feature/definition/getDefinition';
import { globalContainer } from '../../../server/src/container';
import {
  DocumentSettings,
  ExtensionSettings,
  IAureliaProjectSetting,
} from '../../../server/src/configuration/DocumentSettings';
import { onConnectionInitialized } from '../../../server/src/aureliaServer';
import { AureliaExtension } from '../../../server/src/common/AureliaExtension';

export async function getAureliaProgramForTesting(
  projectOptions: IProjectOptions = defaultProjectOptions
): Promise<AureliaProgram> {
  const container: Container = globalContainer;
  const aureliaProgram = container.get(AureliaProgram);
  const rootDirectory = path.resolve(__dirname, '../../testFixture');

  projectOptions.rootDirectory = rootDirectory;

  await createAureliaWatchProgram(aureliaProgram);
  return aureliaProgram;
}

export function createTextDocumentForTesting(
  filePath: string,
  content?: string
): TextDocument {
  const uri = filePath;
  content = content ?? fs.readFileSync(uri, 'utf-8');
  const document = TextDocument.create(uri, 'html', 99, content);
  return document;
}

const COMPONENT_NAME = 'minimal-component';

export function getNamingsForTest(componentName: string = COMPONENT_NAME) {
  const componentViewFileName = `${componentName}.html`;
  const componentViewPath = `./src/${componentName}/${componentViewFileName}`;
  return { componentViewPath, componentViewFileName };
}

export class TestSetup {
  public static async createCompletionTest(
    aureliaProgram: AureliaProgram,
    options: {
      templatePath: string;
      templateContent: string;
      position: Position;
      triggerCharacter?: string;
    }
  ): Promise<AureliaCompletionItem[]> {
    /** Indicate, that aureliaProgram is needed. */
    void aureliaProgram;

    const {
      templatePath,
      templateContent,
      position,
      triggerCharacter,
    } = options;

    const testPath = path.resolve(__dirname, '../../testFixture');
    const targetViewPath = path.resolve(testPath, templatePath);
    const languageModes = await getLanguageModes();
    const document = createTextDocumentForTesting(
      targetViewPath,
      templateContent
    );
    const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
      document,
      position
    );
    const textDocument = createTextDocumentPositionParams(document, position);

    if (modeAndRegion?.mode?.doComplete === undefined) {
      throw new Error('doComplete not provded.');
    }

    const completion = await modeAndRegion?.mode?.doComplete(
      document,
      textDocument,
      triggerCharacter ?? '',
      modeAndRegion.region
    );

    if (!isAureliaCompletionItem(completion)) {
      throw new Error('Not AureliaCompletionItem[]');
    }

    return completion;
  }

  public static async createDefinitionTest(
    aureliaProgram: AureliaProgram,
    options: {
      templatePath: string;
      templateContent?: string;
      position: Position;
      goToSourceWord: string;
    }
  ): Promise<DefinitionResult> {
    /** Indicate, that aureliaProgram is needed. */
    void aureliaProgram;

    const { templatePath, position, goToSourceWord } = options;
    let { templateContent } = options;

    const testPath = path.resolve(__dirname, '../../testFixture');
    const targetViewPath = path.resolve(testPath, templatePath);
    const languageModes = await getLanguageModes();

    if (templateContent === undefined) {
      templateContent = fs.readFileSync(targetViewPath, 'utf-8');
    }

    const document = createTextDocumentForTesting(
      targetViewPath,
      templateContent
    );
    const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
      document,
      position
    );
    const textDocument = createTextDocumentPositionParams(document, position);

    if (modeAndRegion?.mode?.doDefinition === undefined) {
      throw new Error('doDefinition not provded.');
    }

    const definitions = await modeAndRegion?.mode?.doDefinition(
      document,
      position,
      goToSourceWord
    );

    if (definitions === undefined) {
      throw 'No Definitions';
    }

    return definitions;
  }
}

const testsDir = path.resolve(__dirname, '../..');
const monorepoFixtureDir = path.resolve(testsDir, 'testFixture/src/monorepo');
const rootDirectory = `file:/${monorepoFixtureDir}`;

export class MockServer {
  private textDocuments: TextDocument[];

  constructor(
    private readonly container: Container = globalContainer,
    private readonly workspaceRootUri: string = rootDirectory,
    private readonly extensionSettings: ExtensionSettings = {},
    private readonly activeDocuments: TextDocument[] = []
  ) {}

  log(pluck: (input: MockServer) => any): MockServer {
    /* prettier-ignore */
    const logValue = pluck(this);
    console.log('TCL: MockConnection -> log -> input', logValue);
    return this;
  }

  private setTextDocuments(textDocuments: TextDocument[]): void {
    this.textDocuments = textDocuments;
  }
  public getTextDocuments(): TextDocument[] {
    if (this.textDocuments === undefined) {
      throw new Error(
        '[MockConnection]: No TextDocument. Provide one in the constructor, or call mockTextDocuments (fluentApi).'
      );
    }

    return this.textDocuments;
  }

  public getContainer(): Container {
    return this.container;
  }

  /**
   * Just path a string, instead of
   * ```ts
   * #getContainer().get(MyClass)
   * ```
   */
  public getContainerDirectly() {
    return {
      AureliaExtension: this.container.get(AureliaExtension),
      AureliaProgram: this.container.get(AureliaProgram),
      DocumentSettings: this.container.get(DocumentSettings),
    };
  }

  mockTextDocuments(
    fileUris: string[],
    options: { isUri: boolean; isRelative: boolean } = {
      isUri: false,
      isRelative: true,
    }
  ): MockServer {
    if (options.isRelative) {
      fileUris = fileUris.map((uri) => {
        const absPaths = path.resolve(this.workspaceRootUri, uri);
        return absPaths;
      });
    }
    if (!options.isUri) {
      fileUris = fileUris.map((uri) => {
        const convertToUri = `file:/${uri}`;
        return convertToUri;
      });
    }

    const textDocuments = fileUris.map((uri) => {
      const textDocument = TextDocument.create(uri, 'typescript', 1, '');
      return textDocument;
    });

    this.setTextDocuments(textDocuments);

    return this;
  }

  /**
   * Goal: Can access data, after method called
   */
  async onConnectionInitialized(
    aureliaProject: Partial<IAureliaProjectSetting>
  ) {
    await onConnectionInitialized(
      this.container,
      aureliaProject.rootDirectory ?? this.workspaceRootUri,
      {
        aureliaProject: {
          exclude: undefined,
          rootDirectory: this.workspaceRootUri,
          ...aureliaProject,
        },
      },
      this.textDocuments
    );
  }
}
