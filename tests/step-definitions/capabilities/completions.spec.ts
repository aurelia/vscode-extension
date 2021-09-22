import { StepDefinitions } from 'jest-cucumber';
import { CompletionList } from 'vscode-html-languageservice';
import {
  AureliaCompletionItem,
  isAureliaCompletionItem,
} from '../../../server/src/feature/completions/virtualCompletion';
import { createTextDocumentPositionParams } from '../../../server/src/feature/embeddedLanguages/languageModes';
import { myMockServer } from '../initialization/on-initialized/detecting-on-init.spec';
import { position, languageModes } from './common/common-capabilities.spec';

export let completions: AureliaCompletionItem[] | CompletionList = [];

export const completionSteps: StepDefinitions = ({ when, then }) => {
  when('I trigger Suggestions', async () => {
    const { AureliaProjectFiles } = myMockServer.getContainerDirectly();
    const { aureliaProgram } = AureliaProjectFiles.getFirstAureiaProject();
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
      .onCompletion(
        textDocumentPositionParams,
        document,
        languageModes,
        aureliaProgram
      );
  });

  then('I should get the correct suggestions', () => {
    if (isAureliaCompletionItem(completions)) {
      expect(completions.length).toBeGreaterThan(0);
    }
  });

  then(
    /^I should get the correct method (.*) with brackets$/,
    (methodName: string) => {
      if (isAureliaCompletionItem(completions)) {
        const target = completions.find(
          (completion) => completion.label === methodName
        );

        expect(target?.insertText).toEqual('functionVariable()');
      }
    }
  );

  then(
    /^I should get the correct method (.*) with its arguments$/,
    (methodName: string) => {
      if (isAureliaCompletionItem(completions)) {
        const target = completions.find(
          (completion) => completion.label === methodName
        );

        expect(target?.insertText).toEqual(
          'methodWithArgs(${1:first}, ${2:second})'
        );
      }
    }
  );
};
