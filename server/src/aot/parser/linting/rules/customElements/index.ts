import * as path from 'path';

import { Diagnostic } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { RegionService } from '../../../../../common/services/RegionService';
import { AureliaProjects } from '../../../../../core/AureliaProjects';
import { inject } from '../../../../../core/container';
import { DiagnosticsService } from '../../../../../feature/diagnostics/DiagnosticsService';
import {
  CustomElementRegion,
  ViewRegionType,
} from '../../../regions/ViewRegions';
import { LINT_MESSAGES } from '../../lintMessages';

@inject(RegionService)
export class CustomElementsRules {
  constructor(
    private readonly aureliaProjects: AureliaProjects,
    private readonly regionService: RegionService
  ) {}

  public validImport(
    region: CustomElementRegion,
    document: TextDocument
  ): Diagnostic | undefined {
    const component = this.aureliaProjects.getComponentByDocument(
      document,
      region.tagName
    );
    if (!component) return;

    const importRegions = this.regionService.getRegionsOfTypeInDocument(
      document,
      {
        regionType: ViewRegionType.Import,
      }
    );
    let message = '';
    const locallyImported = importRegions.find((importRegion) => {
      const resolvedPath = path.resolve(
        component.viewModelFilePath,
        importRegion.regionValue ?? ''
      );
      if (component.viewFilePath === undefined) return false;

      const ext = path.extname(component.viewFilePath);
      const withExt = `${resolvedPath}${ext}`;

      const isLocal = withExt === component.viewFilePath;
      return isLocal;
      // withExt/*?*/
      // component.viewFilePath/*?*/
      // isLocal/*?*/

      // // 2.2 Local Import
      // const isLocallyImported = importRegion
      // // 2.3 Local Import
      // const isLocalImportRegion = fs.existsSync(withExt)

      // if (isLocalImportRegion) return;

      // 2.4 TODO Alias path?

      // 2.5
    });

    if (locallyImported === undefined) {
      message = LINT_MESSAGES.customElement.missingImport.message;
    }

    const diag = DiagnosticsService.createDiagnosticsFromRegion(
      region,
      message
    );

    return diag;
  }
}
