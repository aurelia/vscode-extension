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

    const sourceDirName = path.dirname(UriUtils.toPath(document.uri));
    const targetComponent = components.find((component) => {
      const resolvedPath = path.resolve(sourceDirName, targetRelativePath);
      const { dir, name } = path.parse(component.viewModelFilePath);
      /** Without extension to support .ts and .js */
      const viewModelWithoutExt = path.normalize(`${dir}/${name}`);
      const isTarget = viewModelWithoutExt === resolvedPath;
      return isTarget;
    });

    const result: DefinitionResult = {
      lineAndCharacter: { line: 1, character: 0 },
      viewModelFilePath: targetComponent?.viewModelFilePath,
    };
    return result;
  }
}
