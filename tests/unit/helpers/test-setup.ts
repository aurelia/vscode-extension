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
    );

    if (!isAureliaCompletionItem(completion)) {
      throw new Error('Not AureliaCompletionItem[]');
    }

    return completion;
  }
}
