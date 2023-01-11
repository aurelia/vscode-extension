import { Container } from 'aurelia-dependency-injection';
import { Connection } from 'vscode-languageserver';
import { IAureliaComponent } from '../../../aot/aotTypes';
import { AureliaProgram } from '../../../aot/AureliaProgram';
import { getClass } from '../../../aot/tsMorph/tsMorphClass';
import {
  getEditorSelection,
  WorkspaceUpdates,
} from '../../../common/client/client';
import { extractSelectedTexts } from '../../../common/documens/selections';
import { TextDocumentUtils } from '../../../common/documens/TextDocumentUtils';
import {
  AllDocuments,
  GetEditorSelectionResponse,
} from '../../../common/types/types';
import { UriUtils } from '../../../common/view/uri-utils';
import { AureliaProjects } from '../../../core/AureliaProjects';
import { updateTsMorphProjectWithEditingFiles } from '../../definition/aureliaDefintion';

export class DeclareViewModelVariable {
  private workspaceUpdates: WorkspaceUpdates;

  constructor(
    private container: Container,
    private connection: Connection,
    private allDocuments: AllDocuments,
    private aureliaProjects: AureliaProjects
  ) {}

  async execute() {
    this.workspaceUpdates = new WorkspaceUpdates();

    const getEditorSelectionResponse = await getEditorSelection(
      this.connection
    );
    const selections = await this.getSelections(getEditorSelectionResponse);

    try {
      await this.addToViewModel(getEditorSelectionResponse, selections);
    } catch (error) {
      console.log('error: ', error);
    }

    await this.workspaceUpdates.applyChanges();
  }

  private async addToViewModel(
    getEditorSelectionResponse: GetEditorSelectionResponse,
    selections: string[]
  ) {
    // 0. Var setup
    const aureliaProjects = this.container.get(AureliaProjects);
    const { documentUri } = getEditorSelectionResponse;
    const document = this.allDocuments.get(documentUri);
    if (!document) return;

    const targetProject = aureliaProjects.getFromUri(document.uri);
    if (!targetProject) return;

    const aureliaProgram = targetProject?.aureliaProgram;
    if (!aureliaProgram) return;

    const viewPath = UriUtils.toSysPath(document.uri);
    const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
      'viewFilePath',
      viewPath
    );
    if (!targetComponent) return;

    // 1. re-parse regions ((experimenting))
    // const componentList = aureliaProgram.aureliaComponents.getAll();
    // const regions = RegionParser.parse(document, componentList);
    //  regions/*?*/
    // TODO: improvement: add types and differentiate between property and method

    // 2. Find location where to add
    const firstMemberPosition = this.getLocationToAdd(
      aureliaProgram,
      targetComponent
    );
    if (!firstMemberPosition) return;

    // 3. Add to view model class
    const whiteSpace = '  '; // Assumption: 2 spaces
    const endFormatting = `\n\n${whiteSpace}`;
    this.workspaceUpdates.replaceText(
      targetComponent.viewModelFilePath,
      selections[0] + endFormatting,
      firstMemberPosition.line,
      firstMemberPosition.character,
      firstMemberPosition.line,
      firstMemberPosition.character
    );
  }

  private getLocationToAdd(
    aureliaProgram: AureliaProgram,
    targetComponent: IAureliaComponent
  ) {
    const tsMorphProject = aureliaProgram.tsMorphProject.get();

    updateTsMorphProjectWithEditingFiles(this.container, tsMorphProject);
    const sourceFile = tsMorphProject.getSourceFile(
      targetComponent.viewModelFilePath
    );

    const className = targetComponent?.className ?? '';
    const classNode = getClass(sourceFile, className);
    if (!classNode) return;

    const viewModelDocument = TextDocumentUtils.createViewModelFromPath(
      targetComponent.viewModelFilePath
    );
    if (!viewModelDocument) return;
    const firstMember = classNode.getMembers()[0];
    if (!firstMember) {
      throw new Error('Unsupported: Class has to have at least one member.');
    }

    const firstMemberPosition = viewModelDocument.positionAt(
      firstMember.getStart()
    );

    classNode; /*?*/
    return firstMemberPosition;
  }

  private async getSelections(
    getEditorSelectionResponse: GetEditorSelectionResponse
  ) {
    const selectedTexts = await extractSelectedTexts(
      getEditorSelectionResponse,
      this.allDocuments
    );

    return selectedTexts;
  }
}
