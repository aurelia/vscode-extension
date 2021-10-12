import { ExtensionSettings } from '../../../feature/configuration/DocumentSettings';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { ViewRegionInfo, ViewRegionType } from '../embeddedSupport';
import { LanguageMode, Position, TextDocument } from '../languageModes';
import { Logger } from '../../../common/logging/logger';
import { aureliaRename } from '../../../feature/rename/aureliaRename';

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
      const renames = aureliaRename(
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
