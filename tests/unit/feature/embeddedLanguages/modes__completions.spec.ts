import {
  getAureliaProgramForTesting,
  getNamingsForTest,
  TestSetup,
} from '../../helpers/test-setup';
import { Position } from 'vscode-html-languageservice';
import { strictEqual } from 'assert';
import { AureliaView } from '../../../../server/src/common/constants';

const COMPONENT_NAME = 'minimal-component';
// const COMPONENT_NAME = 'my-compo';
const COMPONENT_VIEW_FILE_NAME = `${COMPONENT_NAME}.html`;
const COMPONENT_VIEW_PATH = `./src/${COMPONENT_NAME}/${COMPONENT_VIEW_FILE_NAME}`;
// const COMPONENT_VIEW_MODEL_FILE_NAME = `${COMPONENT_NAME}.ts`;

describe('embeddedSupport.ts - Modes - Individual - Definitions', () => {
  it('Completions - Custom Element', async () => {
    const testAureliaProgram = await getAureliaProgramForTesting();
    const templateContent = '<div></div>\n<';
    const position = Position.create(0, 13);
    const completion = await TestSetup.createCompletionTest(
      testAureliaProgram,
      {
        templatePath: COMPONENT_VIEW_PATH,
        templateContent,
        position,
        triggerCharacter: '<',
      }
    );

    const hasComponentCompletions = completion?.length >= 4;
    strictEqual(hasComponentCompletions, true);
  });
  it('Completions - Attribute {{ISSUE-9WZg54qT}}', async () => {
    const testAureliaProgram = await getAureliaProgramForTesting();
    const templateContent = '<div click.delegate=""></div>';
    const position = Position.create(0, 21);
    const completion = await TestSetup.createCompletionTest(
      testAureliaProgram,
      {
        templatePath: COMPONENT_VIEW_PATH,
        templateContent,
        position,
      }
    );

    const hasComponentCompletions = completion?.length >= 2;
    strictEqual(hasComponentCompletions, true);
  });
  it('Completions - Attribute interpolation', async () => {
    const testAureliaProgram = await getAureliaProgramForTesting();
    /** Test case, where letter already provided */
    // eslint-disable-next-line no-template-curly-in-string
    const templateContent = '<div class="${m}"></div>';
    const position = Position.create(0, 14);
    const completion = await TestSetup.createCompletionTest(
      testAureliaProgram,
      {
        templatePath: COMPONENT_VIEW_PATH,
        templateContent,
        position,
      }
    );

    const hasComponentCompletions = completion?.length >= 2;
    strictEqual(hasComponentCompletions, true);
  });
  it('Completions - Text interpolation', async () => {
    const testAureliaProgram = await getAureliaProgramForTesting();
    /** Test case, where letter already provided */
    // eslint-disable-next-line no-template-curly-in-string
    const templateContent = '<div css="width: ${m}px;"></div>';
    const position = Position.create(0, 19);
    const completion = await TestSetup.createCompletionTest(
      testAureliaProgram,
      {
        templatePath: COMPONENT_VIEW_PATH,
        templateContent,
        position,
      }
    );

    const hasComponentCompletions = completion?.length >= 2;
    strictEqual(hasComponentCompletions, true);
  });
  it('Completions - Object completion (Same file)', async () => {
    const testAureliaProgram = await getAureliaProgramForTesting();
    const templateContent = '<div if.bind="minimalInterfaceVar."></div>';
    const position = Position.create(0, 33);
    const completion = await TestSetup.createCompletionTest(
      testAureliaProgram,
      {
        templatePath: COMPONENT_VIEW_PATH,
        templateContent,
        position,
        triggerCharacter: '.',
      }
    );

    strictEqual(completion[0].insertText, 'field');
  });
  it('Completions - Bindables', async () => {
    const testAureliaProgram = await getAureliaProgramForTesting();
    const templateContent = '<minimal-component ></minimal-component>';
    const position = Position.create(0, 18);
    const completion = await TestSetup.createCompletionTest(
      testAureliaProgram,
      {
        templatePath: COMPONENT_VIEW_PATH,
        templateContent,
        position,
        triggerCharacter: ' ',
      }
    );

    strictEqual(completion[0].detail, 'minimalBindable');
  });
  it.skip('Completions - Aurelia Attribute Keywords', async () => {
    const testAureliaProgram = await getAureliaProgramForTesting();
    const templateContent = '<div ></div>';
    const position = Position.create(0, 18);
    const completion = await TestSetup.createCompletionTest(
      testAureliaProgram,
      {
        templatePath: COMPONENT_VIEW_PATH,
        templateContent,
        position,
        triggerCharacter: ' ',
      }
    );

    strictEqual(completion[0], 'minimalBindable');
  });
});

describe('Feature: Completions - correct insertText in View', () => {
  context('Scenario: Function variable completion', () => {
    it('Should insert brackets for functionVariable in view', async () => {
      const componentName = 'view-model-test';
      const testAureliaProgram = await getAureliaProgramForTesting({
        include: [`src/${componentName}`],
      });
      const templateContent = '<div if.bind="f"></div>';
      const position = Position.create(0, 14);
      const completions = await TestSetup.createCompletionTest(
        testAureliaProgram,
        {
          templatePath: getNamingsForTest(componentName).componentViewPath,
          templateContent,
          position,
        }
      );

      const target = completions.find(
        (completion) => completion.label === 'functionVariable'
      );

      strictEqual(target?.insertText, 'functionVariable()');
    });
  });

  context('Scenario: Function arguments completion', () => {
    it('Should insert brackets for functionVariable in view', async () => {
      const componentName = 'view-model-test';
      const testAureliaProgram = await getAureliaProgramForTesting({
        include: [`src/${componentName}`],
      });
      const templateContent = '<div if.bind="m"></div>';
      const position = Position.create(0, 14);
      const completions = await TestSetup.createCompletionTest(
        testAureliaProgram,
        {
          templatePath: getNamingsForTest(componentName).componentViewPath,
          templateContent,
          position,
        }
      );
      const target = completions.find(
        (completion) => completion.label === 'methodWithArgs'
      );

      strictEqual(target?.insertText, 'methodWithArgs(${1:first}, ${2:second})');
    });
  });
});

describe('Feature: Completions - Value Converter', () => {
  context('Scenario: List correct VC completions', () => {
    it('Should list VCs', async () => {
      const testAureliaProgram = await getAureliaProgramForTesting();
      const templateContent = '<div if.bind="m |"></div>';
      const position = Position.create(0, 16);
      const completions = await TestSetup.createCompletionTest(
        testAureliaProgram,
        {
          templatePath: getNamingsForTest().componentViewPath,
          templateContent,
          position,
          triggerCharacter: AureliaView.VALUE_CONVERTER_OPERATOR
        }
      );

      const hasValConvCompletions = completions.length >= 2;
      strictEqual(hasValConvCompletions, true);

      const sortVC = completions.find(completion => completion.detail === 'sort');
      strictEqual(sortVC?.detail, 'sort');

      const hasPrefix = sortVC.label.includes('(Au VC)');
      strictEqual(hasPrefix, true);
    })
  });
})
