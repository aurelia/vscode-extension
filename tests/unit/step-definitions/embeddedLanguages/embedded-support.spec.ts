import { defineFeature, loadFeature } from 'jest-cucumber';
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

defineFeature(feature, (test) => {
  test('Parsing - Custom Element - Bindable Attribute', ({
    given,
    when,
    then,
  }) => {
    const parsedRegions: AbstractRegion[] = [];
    const shared = {
      workspaceRootUri: '',
      parsedRegions,
    };

    givenImInTheProject(given, shared);

    whenIParseTheFile(when, shared);

    then('the result should include Custom element bindable attributes', () => {
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
        const target = ViewRegionUtils.getTargetRegion(
          shared.parsedRegions,
          shared.line
        );

        expect(target).toBeDefined();
        target; /*?*/
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

    function getTargetRegion(line: string) {
      const result = shared.parsedRegions.find((region) => {
        return region.sourceCodeLocation.startLine === Number(line);
      });
      return result;
    }
  });
});

function givenImInTheProject(given, shared) {
  given(/^I'm in the project "(.*)"$/, (projectName: FixtureNames) => {
    shared.workspaceRootUri = getFixtureUri(projectName);
  });
}

function whenIParseTheFile(when, shared) {
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
    const parsedRegions = await RegionParser.parse(
      textDocument,
      // @ts-ignore
      [{ componentName: 'custom-element', viewFilePath: 'custom-element.html' }]
    );

    shared.parsedRegions = parsedRegions;
  });
}
