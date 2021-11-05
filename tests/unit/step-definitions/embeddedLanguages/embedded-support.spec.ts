import { defineFeature, DefineStepFunction, loadFeature } from 'jest-cucumber';

import { ViewRegionUtils } from '../../../../server/src/common/documens/ViewRegionUtils';
import { RegionParser } from '../../../../server/src/core/regions/RegionParser';
import {
  AbstractRegion,
  RepeatForRegion,
  ViewRegionType,
} from '../../../../server/src/core/regions/ViewRegions';
import { getPathsFromFileNames } from '../../../common/file-path-mocks';
import { getTestDir } from '../../../common/files/get-test-dir';
import {
  FixtureNames,
  getFixtureUri,
} from '../../../common/fixtures/get-fixture-dir';
import { MockTextDocuments } from '../../../common/mock-server/text-documents';

const feature = loadFeature(
  `${getTestDir()}/unit/feature-files/embedded-support.feature`,
  {
    // tagFilter: '@focus',
  }
);

interface Shared {
  workspaceRootUri: string;
  parsedRegions: AbstractRegion[];
}

defineFeature(feature, (test) => {
  test('Parsing - Custom Element - Bindable Attribute', ({
    given,
    when,
    then,
  }) => {
    const parsedRegions: AbstractRegion[] = [];
    const shared: Shared = {
      workspaceRootUri: '',
      parsedRegions,
    };

    givenImInTheProject(given, shared);

    whenIParseTheFile(when, shared);

    then('the result should include Custom element bindable attributes', () => {
      shared.parsedRegions; /* ? */
      const regionResults = ViewRegionUtils.getRegionsOfType(
        shared.parsedRegions,
        ViewRegionType.CustomElement
      );

      expect(regionResults.length).toBeGreaterThan(0);
      const result = regionResults[0].data?.find(
        (attribute) => attribute.type === ViewRegionType.BindableAttribute
      );
      expect(result?.regionValue).toBe('foo');
    });
  });

  test('Parsing - Custom Element - Opening Tag', ({ given, when, then }) => {
    const parsedRegions: AbstractRegion[] = [];
    const shared = {
      workspaceRootUri: '',
      parsedRegions,
    };

    givenImInTheProject(given, shared);

    whenIParseTheFile(when, shared);

    then('the result should include Custom element opening tag', () => {
      const regionResults = ViewRegionUtils.getRegionsOfType(
        shared.parsedRegions,
        ViewRegionType.CustomElement
      );
      // RegionParser.pretty(shared.parsedRegions, {
      //   ignoreKeys: ['sourceCodeLocation', 'languageService', 'tagName'],
      //   asTable: true,
      //   maxColWidth: 12,
      // }); /*?*/

      const openingCustomElementTag = regionResults[0];
      const { sourceCodeLocation } = openingCustomElementTag;
      expect(sourceCodeLocation.startCol).toBe(3);
      expect(sourceCodeLocation.startLine).toBe(2);
      expect(sourceCodeLocation.startOffset).toBe(49);
      expect(sourceCodeLocation.endCol).toBe(17);
      expect(sourceCodeLocation.endLine).toBe(2);
      expect(sourceCodeLocation.endOffset).toBe(63);
    });
  });

  test('Parsing - Custom Element - Closing Tag', ({ given, when, then }) => {
    const parsedRegions: AbstractRegion[] = [];
    const shared = {
      workspaceRootUri: '',
      parsedRegions,
    };

    givenImInTheProject(given, shared);

    whenIParseTheFile(when, shared);

    then('the result should include Custom element closing tag', () => {
      const regionResults = ViewRegionUtils.getRegionsOfType(
        shared.parsedRegions,
        ViewRegionType.CustomElement
      );

      expect(regionResults.length).toBe(2);
      const closingCustomElementTag = regionResults[1];
      const { sourceCodeLocation } = closingCustomElementTag;
      expect(sourceCodeLocation.startCol).toBe(5);
      expect(sourceCodeLocation.startLine).toBe(7);
      expect(sourceCodeLocation.startOffset).toBe(146);
      expect(sourceCodeLocation.endCol).toBe(19);
      expect(sourceCodeLocation.endLine).toBe(7);
      expect(sourceCodeLocation.endOffset).toBe(160);
    });
  });

  test('Parsing - Offsets', ({ given, when, then, and }) => {
    const parsedRegions: AbstractRegion[] = [];
    const shared = {
      workspaceRootUri: '',
      parsedRegions,
      line: '',
    };
    givenImInTheProject(given, shared);

    whenIParseTheFile(when, shared);

    and(/^I'm on line (\d)$/, (line: string) => {
      shared.line = line;
    });

    then(
      /^the result should have the correct (\d*) and (\d*) for the whole region$/,
      (startOffset: string, endOffset: string) => {
        const target = ViewRegionUtils.getTargetRegionByLine(
          shared.parsedRegions,
          shared.line
        );

        expect(target).toBeDefined();
        if (!target) return;

        if (RepeatForRegion.is(target)) {
          const repeatForRegion = target;
          expect(repeatForRegion.data?.iterableStartOffset).toBe(
            Number(startOffset)
          );
          expect(repeatForRegion.data?.iterableEndOffset).toBe(
            Number(endOffset)
          );
        } else {
          expect(target.sourceCodeLocation.startOffset).toBe(
            Number(startOffset)
          );
          expect(target.sourceCodeLocation.endOffset).toBe(Number(endOffset));
        }
      }
    );
  });

  test('Parsing - Access Scopes', ({ given, when, then, and }) => {
    const parsedRegions: AbstractRegion[] = [];
    const shared = {
      workspaceRootUri: '',
      parsedRegions,
      line: '',
    };
    givenImInTheProject(given, shared);

    whenIParseTheFile(when, shared);

    and(/^I'm on line (\d)$/, (line: string) => {
      shared.line = line;
    });

    then(
      /^the result should have the following Access scopes (.*)$/,
      (accessScopesRaw: string) => {
        const expectedNames = accessScopesRaw.split(';');

        const targets = ViewRegionUtils.getManyTargetsRegionByLine(
          shared.parsedRegions,
          shared.line
        );

        targets.forEach((target, index) => {
          expect(target?.accessScopes).toBeDefined();
          if (!target?.accessScopes) return;

          const names = target.accessScopes.map((scope) => scope.name);
          expect(names).toEqual(expectedNames[index].split(','));
        });
      }
    );
  });
});

function givenImInTheProject(given: DefineStepFunction, shared: Shared) {
  given(/^I'm in the project "(.*)"$/, (projectName: FixtureNames) => {
    shared.workspaceRootUri = getFixtureUri(projectName);
  });
}

function whenIParseTheFile(when: DefineStepFunction, shared: Shared) {
  when(/^I parse the file "(.*)"$/, async (fileName: string) => {
    const textDocumentPaths = getPathsFromFileNames(shared.workspaceRootUri, [
      fileName,
    ]);
    const textDocuments = new MockTextDocuments(shared.workspaceRootUri);
    const textDocument = textDocuments
      .mock(textDocumentPaths)
      .setActive(textDocumentPaths)
      .getActive();

    // const parsedRegions = await parseDocumentRegions<ViewRegionInfo[]>(
    const parsedRegions = RegionParser.parse(
      textDocument,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [{ componentName: 'custom-element', viewFilePath: 'custom-element.html' }]
    );

    shared.parsedRegions = parsedRegions;
  });
}
