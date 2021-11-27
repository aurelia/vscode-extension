import * as fs from 'fs';
import * as path from 'path';

import { Position, TextDocument } from 'vscode-languageserver-textdocument';

import { UriUtils } from '../../../common/view/uri-utils';
import { DefinitionResult } from '../../../feature/definition/getDefinition';
import { AureliaProgram } from '../../viewModel/AureliaProgram';
import { AbstractRegion } from '../ViewRegions';
import { AbstractRegionLanguageService } from './AbstractRegionLanguageService';

export class ImportLanguageService implements AbstractRegionLanguageService {
  public async doDefinition(
    aureliaProgram: AureliaProgram,
    document: TextDocument,
    position: Position,
    importRegion: AbstractRegion
  ) {
    const components = aureliaProgram.aureliaComponents.getAll();
    const targetRelativePath = importRegion.regionValue;
    if (targetRelativePath === undefined) return;

    const sourceDirName = path.dirname(UriUtils.toSysPath(document.uri));
    const resolvedPath = path.resolve(sourceDirName, targetRelativePath);

    // View
    let viewPath: string | undefined;
    if (fs.existsSync(resolvedPath)) {
      viewPath = resolvedPath;
    }

    // View model
    // Note: We could have gone the simple `fs.existsSync` way, but with this approach
    //  we could check for component info.
    //  Probably rather needed for hover, so
    //  TODO: check like View, but only when you implement hover to reuse the below code.
    let viewModelPath: string | undefined;
    components.find((component) => {
      const { dir, name } = path.parse(component.viewModelFilePath);
      const viewModelWithoutExt = `${dir}${path.sep}${name}`;
      const isTargetViewModel = viewModelWithoutExt === resolvedPath;
      if (isTargetViewModel) {
        viewModelPath = component.viewModelFilePath;
        return true;
      }

      return false;
    });

    const result: DefinitionResult = {
      lineAndCharacter: { line: 1, character: 0 },
      viewModelFilePath: viewModelPath,
      viewFilePath: viewPath,
    };
    return result;
  }
}
