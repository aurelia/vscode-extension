import { StepDefinitions } from 'jest-cucumber';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { UriUtils } from '../../../server/src/common/view/uri-utils';
import { myMockServer } from '../capabilities/new-common/project.step';

export const AureliaProjectsSteps: StepDefinitions = ({ when, then }) => {
  const newName = 'newNesw';

  when('I call updateManyViewModel', async () => {
    const document = myMockServer.textDocuments.getActive();
    const { uri, languageId, version } = document;
    const updatedContent = document
      .getText()
      .replace('@bindable foo', `@bindable ${newName}`);
    const updatedDocument = TextDocument.create(
      uri,
      languageId,
      version,
      updatedContent
    );
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    AureliaProjects.updateManyViewModel([updatedDocument]);

    await myMockServer.getAureliaServer().onDidSave({ document });
  });

  then('the view model should change', () => {
    const { AureliaProjects } = myMockServer.getContainerDirectly();
    const tsConfigPath = UriUtils.toPath(myMockServer.getWorkspaceUri());
    const targetProject = AureliaProjects.getBy(tsConfigPath);
    const documentPath = UriUtils.toPath(
      myMockServer.textDocuments.getActive().uri
    );
    const targetComponent = targetProject?.aureliaProgram?.aureliaComponents.getOneBy(
      'viewModelFilePath',
      documentPath
    );

    const result = targetComponent?.classMembers?.find(
      (member) => member.name === newName
    );

    expect(result).toBeDefined();
    expect(result?.name).toBe(newName);
  });
};
