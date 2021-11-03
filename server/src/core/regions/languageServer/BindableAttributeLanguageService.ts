import { Logger } from '../../../common/logging/logger';
import { aureliaRenameFromView } from '../../../feature/rename/aureliaRename';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { ViewRegionInfo } from '../../embeddedLanguages/embeddedSupport';
import { Position, TextDocument } from '../../embeddedLanguages/languageModes';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';
import { AbstractRegion } from '../ViewRegions';

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
