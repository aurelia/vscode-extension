import { defineFeature, loadFeature } from 'jest-cucumber';

import {
  parseDocumentRegions,
  RepeatForRegionData,
  ViewRegionInfo,
  ViewRegionType,
} from '../../../../server/src/core/embeddedLanguages/embeddedSupport';
import { getRegionsOfType } from '../../../../server/src/core/regions/findSpecificRegion';
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
    const parsedRegions: ViewRegionInfo[] = [];
    const shared = {
      workspaceRootUri: '',
      parsedRegions,
    };

    givenImInTheProject(given, shared);

    whenIParseTheFile(when, shared);

    then('the result should include Custom element bindable attributes', () => {
      const regionResults = shared.parsedRegions.filter((region) => {
        region; /* ? */
        if (!region.data) return false;
        if (!Array.isArray(region.data)) return false;

        const temp = region.data.filter(
          (attribute) => attribute.type === ViewRegionType.BindableAttribute
        );

        if (temp && temp?.length > 0) {
          return true;
        }

        return false;
      });

      expect(regionResults.length).toBeGreaterThan(0);
      const result = regionResults[0].data?.find(
        (attribute) => attribute.type === ViewRegionType.BindableAttribute
      );
      expect(result?.regionValue).toBe('foo');
    });
  });

  test('Parsing - Custom Element - Opening Tag', ({ given, when, then }) => {
    const parsedRegions: ViewRegionInfo[] = [];
    const shared = {
      workspaceRootUri: '',
      parsedRegions,
    };

    givenImInTheProject(given, shared);

    whenIParseTheFile(when, shared);

    then('the result should include Custom element opening tag', () => {
      const regionResults = getRegionsOfType(
        shared.parsedRegions,
        ViewRegionType.CustomElement
      );

      const openingCustomElementTag = regionResults[0];
      openingCustomElementTag; /*?*/
      expect(openingCustomElementTag.startCol).toBe(4);
      expect(openingCustomElementTag.startLine).toBe(3);
      expect(openingCustomElementTag.startOffset).toBe(49);
      expect(openingCustomElementTag.endCol).toBe(18);
      expect(openingCustomElementTag.endLine).toBe(3);
      expect(openingCustomElementTag.endOffset).toBe(63);
    });
  });

  test('Parsing - Custom Element - Closing Tag', ({ given, when, then }) => {
    const parsedRegions: ViewRegionInfo[] = [];
    const shared = {
      workspaceRootUri: '',
      parsedRegions,
    };

    givenImInTheProject(given, shared);

    whenIParseTheFile(when, shared);

    then('the result should include Custom element closing tag', () => {
      const regionResults = getRegionsOfType(
        shared.parsedRegions,
        ViewRegionType.CustomElement
      );

      expect(regionResults.length).toBe(2);
      const closingCustomElementTag = regionResults[1];
      expect(closingCustomElementTag.startCol).toBe(6);
      expect(closingCustomElementTag.startLine).toBe(7);
      expect(closingCustomElementTag.startOffset).toBe(113);
      expect(closingCustomElementTag.endCol).toBe(20);
      expect(closingCustomElementTag.endLine).toBe(7);
      expect(closingCustomElementTag.endOffset).toBe(127);
    });
  });

  test('Parsing - Offsets', ({ given, when, then, and }) => {
    const parsedRegions: ViewRegionInfo[] = [];
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
        const target = getTargetRegion(shared.line);

        if (target?.type === ViewRegionType.RepeatFor) {
          const repeatForRegion = target as ViewRegionInfo<RepeatForRegionData>;
          expect(repeatForRegion.data?.iterableStartOffset).toBe(
            Number(startOffset)
          );
          expect(repeatForRegion.data?.iterableEndOffset).toBe(
            Number(endOffset)
          );
        } else {
          expect(target?.startOffset).toBe(Number(startOffset));
          expect(target?.endOffset).toBe(Number(endOffset));
        }
      }
    );

    function getTargetRegion(line: string) {
      const result = shared.parsedRegions.find((region) => {
        return region.startLine === Number(line);
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

    const parsedRegions = await parseDocumentRegions<ViewRegionInfo[]>(
      textDocument,
      // @ts-ignore
      [{ componentName: 'custom-element', viewFilePath: 'custom-element.html' }]
    );

    shared.parsedRegions = parsedRegions;
  });
}
