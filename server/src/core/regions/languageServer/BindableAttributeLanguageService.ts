import { Logger } from '../../../common/logging/logger';
import { aureliaRenameFromView } from '../../../feature/rename/aureliaRename';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';
import { AbstractRegion } from '../ViewRegions';
import { Position, TextDocument } from 'vscode-languageserver-textdocument';

const logger = new Logger('getBindableAttributeMode');

export class BindableAttributeLanguageService
  implements AbstractRegionLanguageService {
  async doRename(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    newName: string,
    region: AbstractRegion
  ) {
    const renames = aureliaRenameFromView(
      aureliaProgram,
      document,
      position,
      newName,
      region
    );
    return renames;
  }
}
