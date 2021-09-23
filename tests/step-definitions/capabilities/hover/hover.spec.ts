import { StepDefinitions } from 'jest-cucumber';
import { UriUtils } from '../../../../server/src/common/view/uri-utils';
import { CustomHover } from '../../../../server/src/feature/virtual/virtualSourceFile';
import { myMockServer } from '../../initialization/on-initialized/detecting-on-init.spec';
import { position, languageModes } from '../common/common-capabilities.spec';

export const hoverSteps: StepDefinitions = ({ when, then }) => {
  let hover: CustomHover;

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
    hover; /*?*/
    if (hover?.contents) {
      expect(hover.contents.value).toBeTruthy();
    }
    expect(true).toBeFalsy();
  });
};
