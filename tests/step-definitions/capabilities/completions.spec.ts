import { StepDefinitions } from 'jest-cucumber';
import {
  CompletionList,
  Position,
  TextDocument,
} from 'vscode-html-languageservice';
import { CompletionParams } from 'vscode-languageserver';
import {
  CompletionTriggerKind,
  TextDocumentPositionParams,
} from 'vscode-languageserver-protocol';

import { Logger } from '../../../server/src/common/logging/logger';
import {
  AureliaCompletionItem,
  isAureliaCompletionItem,
} from '../../../server/src/feature/completions/virtualCompletion';
import { position } from './new-common/file.step';
import { myMockServer } from './new-common/project.step';

const logger = new Logger('[Test] Completions');

// eslint-disable-next-line import/no-mutable-exports
export let completions: AureliaCompletionItem[] | CompletionList | undefined;

export const completionSteps: StepDefinitions = ({ when, then }) => {
  when(
    /^I trigger Suggestions with (.*)$/,
    async (triggerCharacter: string) => {
      /* prettier-ignore */ logger.log('I trigger Suggestions',{env:'test'});

      triggerCharacter; /* ? */
      if (triggerCharacter === "' '") {
        triggerCharacter = ' ';
      }

      const document = myMockServer.textDocuments.getActive();
      const textDocumentPositionParams = createTextDocumentPositionParams(
        document,
        position,
        triggerCharacter
      );

      completions = await myMockServer
        .getAureliaServer()
        .onCompletion(document, textDocumentPositionParams);

      if (!isAureliaCompletionItem(completions)) {
        throw new Error('Not AureliaCompletionItem[]');
      }
    }
  );

  then(/^I should get the correct suggestions (.*)$/, (suggestion: string) => {
    /* prettier-ignore */ logger.log('I should get the correct suggestion',{env:'test'});

    expect(completions).toBeTruthy();

    if (isAureliaCompletionItem(completions)) {
      expect(completions.length).toBeGreaterThan(0);

      const target = completions.find((completion) =>
        completion.label.includes(suggestion)
      );
      expect(target?.label).toBeDefined();
      expect(target?.label).toContain(suggestion);
      if (target?.insertText !== undefined) {
        expect(target.insertText).toContain(suggestion);
      }
    }
  });

  then(
    /^I should get the correct method (.*) with brackets$/,
    (methodName: string) => {
      expect(completions).toBeTruthy();
      if (isAureliaCompletionItem(completions)) {
        expect(completions.length).toBeGreaterThan(0);

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
      expect(completions).toBeTruthy();
      if (isAureliaCompletionItem(completions)) {
        const target = completions.find(
          (completion) => completion.label === methodName
        );

        expect(target?.insertText).toEqual(
          // eslint-disable-next-line no-template-curly-in-string
          'methodWithArgs(${1:first}, ${2:second})'
        );
      }
    }
  );
};

export function createTextDocumentPositionParams(
  document: TextDocument,
  position: Position,
  triggerCharacter: string
): CompletionParams {
  const textDocument: CompletionParams = {
    textDocument: {
      uri: document.uri,
    },
    position,
    context: {
      triggerKind: CompletionTriggerKind.Invoked,
      triggerCharacter,
    },
  };

  return textDocument;
}
