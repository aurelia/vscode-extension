import { StepDefinitions } from 'jest-cucumber';

import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { CustomHover } from '../../../../server/src/feature/virtual/virtualSourceFile';
import { position, languageModes } from '../common/common-capabilities.spec';
import { myMockServer } from '../new-common/project.step';

export const hoverSteps: StepDefinitions = ({ when, then }) => {
  let hover: CustomHover | undefined;

  when('I execute Hover', async () => {
    const document = myMockServer.textDocuments.getFirst();

    hover = await myMockServer
      .getAureliaServer()
      .onHover(
        document.getText(),
        position,
        UriUtils.toPath(document.uri),
        languageModes
      );
  });

  then('I should see hover details', () => {
    hover; /* ? */
    expect(hover).toBeDefined();
    if (hover?.contents) {
      expect(hover.contents.value).toBeTruthy();
    }
    // expect(true).toBeFalsy();
  });
};
