import { defineFeature, loadFeature } from 'jest-cucumber';

import {
  parseDocumentRegions,
  RepeatForRegionData,
  ViewRegionInfo,
  ViewRegionType,
} from '../../../../server/src/feature/embeddedLanguages/embeddedSupport';
import { getPathsFromFileNames } from '../../../common/file-path-mocks';
import { getTestDir } from '../../../common/files/get-test-dir';
import {
  FixtureNames,
  getFixtureUri,
} from '../../../common/fixtures/get-fixture-dir';
import { MockTextDocuments } from '../../../common/mock-server/text-documents';

const feature = loadFeature(
  `${getTestDir()}/unit/feature-files/embedded-support.feature`
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
    const textDocument = textDocuments.mock(textDocumentPaths).getFirst();

    const parsedRegions = await parseDocumentRegions<ViewRegionInfo[]>(
      textDocument,
      // @ts-ignore
      [{ componentName: 'custom-element', viewFilePath: 'custom-element.html' }]
    );

    shared.parsedRegions = parsedRegions;
  });
}
