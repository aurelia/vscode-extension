import * as path from 'path';

import { Diagnostic } from 'vscode-languageserver';
import { RegionService } from '../../../../../common/services/RegionService';
import { inject } from '../../../../../core/container';

import { DiagnosticsService } from '../../../../../feature/diagnostics/DiagnosticsService';
import {
  CustomElementRegion,
  ViewRegionType,
} from '../../../regions/ViewRegions';
import { AureliaProjects } from '../../../../../core/AureliaProjects';
import { TextDocument } from 'vscode-languageserver-textdocument';

@inject(RegionService)
export class CustomElementsRules {
  constructor(
    private aureliaProjects: AureliaProjects,
    private regionService: RegionService
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
      const ext = path.extname(component.viewModelFilePath);
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
      message = 'No local import found.';
    }

    const diag = DiagnosticsService.createDiagnosticsFromRegion(
      region,
      message
    );

    return diag;
  }
}
