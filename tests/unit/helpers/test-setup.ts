import {
  defaultProjectOptions,
  IProjectOptions,
} from '../../../server/src/common/common.types';
import * as path from 'path';
import * as fs from 'fs';
import 'reflect-metadata';

import {
  AureliaProgram,
  globalContainer,
} from '../../../server/src/viewModel/AureliaProgram';
import { createAureliaWatchProgram } from '../../../server/src/viewModel/createAureliaWatchProgram';
import { Position, TextDocument } from 'vscode-html-languageservice';
import { Container } from 'aurelia-dependency-injection';
import { AureliaCompletionItem, isAureliaCompletionItem } from '../../../server/src/feature/completions/virtualCompletion';
import { createTextDocumentPositionParams, getLanguageModes } from '../../../server/src/feature/embeddedLanguages/languageModes';
import { DefinitionResult } from '../../../server/src/feature/definition/getDefinition';

export function getAureliaProgramForTesting(
  projectOptions: IProjectOptions = defaultProjectOptions
): AureliaProgram {
  const container: Container = globalContainer;
  const aureliaProgram = container.get(AureliaProgram);
  const sourceDirectory = path.resolve(__dirname, '../../testFixture');

  projectOptions.sourceDirectory = sourceDirectory;

  createAureliaWatchProgram(aureliaProgram, projectOptions);
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

    const { templatePath, templateContent, position, triggerCharacter } = options;

    const testPath = path.resolve(__dirname, '../../testFixture');
    const targetViewPath = path.resolve(testPath, templatePath);
    const languageModes = await getLanguageModes();
    const document = createTextDocumentForTesting(targetViewPath, templateContent);
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
    let {templateContent} = options;

    const testPath = path.resolve(__dirname, '../../testFixture');
    const targetViewPath = path.resolve(testPath, templatePath);
     targetViewPath/*?*/
    const languageModes = await getLanguageModes();

    if (templateContent === undefined) {
      templateContent = fs.readFileSync(targetViewPath, 'utf-8');
    }

    templateContent/*?*/

    const document = createTextDocumentForTesting(targetViewPath, templateContent);
    const modeAndRegion = await languageModes.getModeAndRegionAtPosition(
      document,
      position
    );
    const textDocument = createTextDocumentPositionParams(document, position);

    modeAndRegion?.mode?.getId()/*?*/
    modeAndRegion?.region/*?*/
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
