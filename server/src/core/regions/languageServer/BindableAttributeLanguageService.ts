import { kebabCase } from '@aurelia/kernel';
import { Position, TextDocument } from 'vscode-languageserver-textdocument';

import { TextDocumentUtils } from '../../../common/documens/TextDocumentUtils';
import { UriUtils } from '../../../common/view/uri-utils';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { aureliaRenameFromView } from '../../../feature/rename/aureliaRename';
import { Container } from '../../container';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

// const logger = new Logger('getBindableAttributeMode');

export class BindableAttributeLanguageService
  implements AbstractRegionLanguageService
{
  public async doDefinition(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    region: AbstractRegion
  ): Promise<DefinitionResult | undefined> {
    const targetComponent = aureliaProgram.aureliaComponents.getOneBy(
      'componentName',
      region.tagName
    );
    if (!targetComponent) return;

    const offset = document.offsetAt(position);
    const targetMember = targetComponent?.classMembers?.find((member) => {
      const correctNamingConvetion =
        kebabCase(member.name) === kebabCase(region.regionValue ?? '');
      const is = correctNamingConvetion && member.isBindable;
      return is;
    });
    const viewModelDocument = TextDocumentUtils.createFromPath(
      targetComponent.viewModelFilePath
    );
    if (targetMember == null) return;
    const { line, character } = viewModelDocument.positionAt(
      targetMember.start
    );

    const result = {
      lineAndCharacter: {
        line: line + 1, // + 1client is 1-based index
        character: character + 1, // + 1client is 1-based index
      } /** TODO: Find class declaration position. Currently default to top of file */,
      viewModelFilePath: UriUtils.toSysPath(targetComponent.viewModelFilePath),
    };
    return result;
  }

  public async doRename(
    container: Container,
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    newName: string,
    region: AbstractRegion
  ) {
    const renames = aureliaRenameFromView(
      container,
      aureliaProgram,
      document,
      position,
      newName,
      region
    );
    return renames;
  }
}
