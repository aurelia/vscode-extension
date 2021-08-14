import { AsyncReturnType } from '../../../../server/src/common/global.d';
import { strictEqual } from 'assert';
import { Position } from 'vscode-html-languageservice';
import * as path from 'path';
import * as ts from 'typescript';

import {
  createTextDocumentPositionParams,
  getLanguageModes,
  LanguageModes,
} from '../../../../server/src/feature/embeddedLanguages/languageModes';
import {
  createTextDocumentForTesting,
  getAureliaProgramForTesting,
  TestSetup,
} from '../../helpers/test-setup';
import { ViewRegionType } from '../../../../server/src/feature/embeddedLanguages/embeddedSupport';
import { AureliaView } from '../../../../server/src/common/constants';

const COMPONENT_NAME = 'compo-user';
// const COMPONENT_NAME = 'my-compo';
const COMPONENT_VIEW_FILE_NAME = `${COMPONENT_NAME}.html`;
const COMPONENT_VIEW_PATH = `./src/${COMPONENT_NAME}/${COMPONENT_VIEW_FILE_NAME}`;
const COMPONENT_VIEW_MODEL_FILE_NAME = `${COMPONENT_NAME}.ts`;

describe('embeddedSupport.ts - Modes - Individual', () => {
  let languageModes: AsyncReturnType<typeof getLanguageModes>;
  let document: ReturnType<typeof createTextDocumentForTesting>;
  let modeAndRegion: AsyncReturnType<
    LanguageModes['getModeAndRegionAtPosition']
  >;

  before(async () => {
    const testAup = await getAureliaProgramForTesting();
    // testAup.initComponentList();
    // const componentList = testAup.getComponentList();
    // console.log('TCL: componentList', componentList.length);

    languageModes = await getLanguageModes();

    const testPath = path.resolve(__dirname, '../../../testFixture');
    const targetViewPath = path.resolve(testPath, COMPONENT_VIEW_PATH);
    document = createTextDocumentForTesting(targetViewPath);
  });

  const templateTestCases__Definition: {
    position: Position;
    type: ViewRegionType;
    targetWord?: string;
    fileNameOfDef?: string;
    lineAndCharacterOfDef?: ts.LineAndCharacter;
    attributeName?: string;
    attributeValue?: string;
    regionValue?: string;
    numOfBindables?: number;
  }[] = [
    {
      position: Position.create(3, 23),
      type: ViewRegionType.Attribute,
      attributeName: 'click.delegate',
      attributeValue: '',
    }, // {{ISSUE-9WZg54qT}}
    {
      position: Position.create(7, 23),
      type: ViewRegionType.Attribute,
      targetWord: 'increaseCounter',
      attributeName: 'click.delegate',
      attributeValue: 'increaseCounter()',
      lineAndCharacterOfDef: { line: 25, character: 2 },
    }, // {{ISSUE-15pHmj6C}}
    {
      position: Position.create(11, 21),
      type: ViewRegionType.AttributeInterpolation,
      targetWord: 'message',
      attributeName: 'css',
      regionValue: 'message',
      lineAndCharacterOfDef: { line: 17, character: 2 },
    }, // {{ISSUE-lj6q5QtN}}
    {
      position: Position.create(19, 3),
      type: ViewRegionType.CustomElement,
      targetWord: 'my-compo',
      fileNameOfDef: 'my-compo.ts',
      lineAndCharacterOfDef: { line: 1, character: 1 },
    }, // {{ISSUE-8Q6EL3Ui}}
    {
      position: Position.create(20, 4),
      type: ViewRegionType.CustomElement,
      targetWord: 'inter-bindable',
      fileNameOfDef: 'my-compo.ts',
      lineAndCharacterOfDef: { line: 28, character: 2 },
    }, // {{ISSUE-8Q6EL3Ui}}
    {
      position: Position.create(21, 4),
      type: ViewRegionType.CustomElement,
      targetWord: 'string-bindable',
      fileNameOfDef: 'my-compo.ts',
      lineAndCharacterOfDef: { line: 26, character: 2 },
    }, // {{ISSUE-8Q6EL3Ui}}
    {
      position: Position.create(55, 3),
      type: ViewRegionType.CustomElement,
      targetWord: 'compo-user',
      fileNameOfDef: COMPONENT_VIEW_MODEL_FILE_NAME,
      lineAndCharacterOfDef: { line: 1, character: 1 },
    },
    {
      position: Position.create(27, 8),
      type: ViewRegionType.TextInterpolation,
      targetWord: 'grammarRules',
      regionValue: 'grammarRules.length',
      lineAndCharacterOfDef: { line: 21, character: 2 },
    }, // {{ISSUE-sCxw9bfm}}
    {
      position: Position.create(30, 23),
      type: ViewRegionType.RepeatFor,
      targetWord: 'rule',
      attributeName: AureliaView.REPEAT_FOR,
      regionValue: 'rule of grammarRules',
      lineAndCharacterOfDef: { line: 23, character: 2 },
    }, // {{ISSUE-uMZ1grJD}}
    {
      position: Position.create(30, 31),
      type: ViewRegionType.RepeatFor,
      targetWord: 'grammarRules',
      attributeName: AureliaView.REPEAT_FOR,
      regionValue: 'rule of grammarRules',
      lineAndCharacterOfDef: { line: 21, character: 2 },
    }, // {{ISSUE-uMZ1grJD}}
    {
      position: Position.create(33, 8),
      type: ViewRegionType.TextInterpolation,
      targetWord: 'rule',
      fileNameOfDef: COMPONENT_VIEW_FILE_NAME,
      regionValue: 'rule.id',
      lineAndCharacterOfDef: { line: 31, character: 23 },
    }, // {{ISSUE-uMZ1grJD}}
    {
      position: Position.create(48, 25),
      type: ViewRegionType.ValueConverter,
      targetWord: 'sort',
      fileNameOfDef: 'sort-value-converter.ts',
      attributeName: 'if.bind',
      regionValue: 'message | sort:',
      lineAndCharacterOfDef: { line: 1, character: 1 },
    }, // {{ISSUE-M0pKnxbJ}}
  ];

  templateTestCases__Definition.forEach(
    ({
      position,
      type,
      targetWord,
      lineAndCharacterOfDef,
      fileNameOfDef = COMPONENT_VIEW_MODEL_FILE_NAME,
      attributeName,
      attributeValue,
      regionValue,
    }, index) => {
      it(`Definition - ${type} - ${index}`, async () => {
        modeAndRegion = await languageModes.getModeAndRegionAtPosition(
          document,
          position
        );

        if (!modeAndRegion) return;

        //
        const { mode, region } = modeAndRegion;

        if (region !== undefined) {
          strictEqual(region.type, type);
          strictEqual(region.attributeName, attributeName);
          strictEqual(region.attributeValue, attributeValue);
          strictEqual(region.regionValue, regionValue);
        }

        if (!mode?.doDefinition) return;
        if (targetWord === undefined) return;

        const definition = await mode.doDefinition(
          document,
          position,
          targetWord,
          region
        );

        if (definition === undefined) return;

        strictEqual(
          definition.lineAndCharacter.line,
          lineAndCharacterOfDef?.line
        );
        strictEqual(
          definition.lineAndCharacter.character,
          lineAndCharacterOfDef?.character
        );

        if (fileNameOfDef === undefined) return;
        if (fileNameOfDef.length === 0) {
          throw new Error('Please provide fileNameOfDef');
        }

        const correctPath = definition.viewModelFilePath?.includes(
          fileNameOfDef
        );
        strictEqual(correctPath, true);
      });
    }
  );

  // it('Hover', async () => {
  //   if (!mode?.doHover) return;

  //   const region = modeAndRegion?.region;
  //   if (region === undefined) return;

  //   const hover = await mode.doHover(document, position, 'dirty', region);

  //   // eslint-disable-next-line
  //   const correctDocs = hover?.contents.value.includes(
  //     'SettingsViewCustomElement.dirty'
  //   );
  //   strictEqual(correctDocs, true);
  // });
  // it('Complete', async () => {
  //   if (!mode?.doComplete) return;

  //   const region = modeAndRegion?.region;
  //   if (region === undefined) return;

  //   const textDocumentPositionParams = createTextDocumentPositionParams(document, {
  //     line: 4,
  //     character: 13,
  //   });
  //   const complete = await mode.doComplete(document, textDocumentPositionParams, 'dirty');

  //   if (!isAureliaCompletionItem(complete)) return;

  //   const hasInternalVirMethod =
  //     complete.find((completeItem) =>
  //       completeItem.label?.includes(VIRTUAL_METHOD_NAME)
  //     ) !== undefined;
  //   strictEqual(hasInternalVirMethod, true);

  //   const numOfClassMembers = 10;
  //   /** 1: __vir */
  //   const completionsResults = numOfClassMembers + 1;
  //   strictEqual(complete?.length, completionsResults);
  // });
});

describe('Feature: Definition - Components with same file names (index.ts/html)', () => {
  context('Scenario: Find correct View Model', () => {
    it.only('Should find correct View Model', async () => {
      const testAureliaProgram = await getAureliaProgramForTesting({
        include: ['src/realdworld-advanced'],
      });
      const position = Position.create(3, 34);
      const defintions = await TestSetup.createDefinitionTest(
        testAureliaProgram,
        {
          templatePath: 'src/realdworld-advanced/settings/index.html',
          position,
          goToSourceWord: 'dirty',
        }
      );

      const isCorrectViewModel = defintions.viewModelFilePath?.includes(
        'src/realdworld-advanced/settings/index.ts'
      );
      strictEqual(isCorrectViewModel, true);
    });
  });
});
