import { defineFeature, loadFeature } from 'jest-cucumber';
import {
  parseDocumentRegions,
  ViewRegionInfo,
  ViewRegionType,
} from '../../../../server/src/feature/embeddedLanguages/embeddedSupport';
import { AureliaProgram } from '../../../../server/src/viewModel/AureliaProgram';
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
    let workspaceRootUri;
    let regionResults: ViewRegionInfo<ViewRegionInfo<any>[]>[];

    given(/^I'm in the project "(.*)"$/, (projectName: FixtureNames) => {
      workspaceRootUri = getFixtureUri(projectName);
    });

    when(/^I parse the file "(.*)"$/, async (fileName: string) => {
      const textDocumentPaths = getPathsFromFileNames(workspaceRootUri, [
        fileName,
      ]);
      const textDocuments = new MockTextDocuments(workspaceRootUri);
      const textDocument = textDocuments.mock(textDocumentPaths).getFirst();

      const parsedRegions = await parseDocumentRegions<ViewRegionInfo[]>(
        textDocument,
        // @ts-ignore
        [{ componentName: 'custom-element' }]
      );

      regionResults = parsedRegions.filter((region) => {
        const temp = region.data?.filter(
          (attribute) => attribute.type === ViewRegionType.BindableAttribute
        );

        if (temp && temp?.length > 0) {
          return true;
        }

        return false;
      });
    });

    then('the result should include Custom element bindable attributes', () => {
      expect(regionResults.length).toBeGreaterThan(0);
      const result = regionResults[0].data?.find(
        (attribute) => attribute.type === ViewRegionType.BindableAttribute
      );
      expect(result?.regionValue).toBe('foo');
    });
  });
});
