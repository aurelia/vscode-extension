import { Logger } from '../../../common/logging/logger';
import { ExtensionSettings } from '../../../feature/configuration/DocumentSettings';
import { aureliaRenameFromView } from '../../../feature/rename/aureliaRename';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { ViewRegionInfo, ViewRegionType } from '../embeddedSupport';
import { LanguageMode, Position, TextDocument } from '../languageModes';

const logger = new Logger('getBindableAttributeMode');

export function getBindableAttributeMode(
  aureliaProgram: AureliaProgram,
  extensionSettings: ExtensionSettings
): LanguageMode {
  return {
    getId() {
      return ViewRegionType.BindableAttribute;
    },

    async doRename(
      document: TextDocument,
      position: Position,
      newName: string,
      region: ViewRegionInfo
    ) {
      const renames = aureliaRenameFromView(
        aureliaProgram,
        document,
        position,
        newName,
        region
      );
      return renames;
    },

    onDocumentRemoved(_document: TextDocument) {},
    dispose() {},
  };
}
