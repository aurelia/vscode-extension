import * as fs from 'fs';
import * as path from 'path';

import { Diagnostic } from 'vscode-languageserver';
import { RegionService } from '../../../../../common/services/RegionService';
import { inject } from '../../../../../core/container';

import { DiagnosticsService } from '../../../../../feature/diagnostics/DiagnosticsService';
import { ImportRegion } from '../../../regions/ViewRegions';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { UriUtils } from '../../../../../common/view/uri-utils';

@inject(RegionService)
export class ImportsRules {
  constructor() {}

  public validImportNaming(
    region: ImportRegion,
    document: TextDocument
  ): Diagnostic | undefined {
    const documentPath = UriUtils.toSysPath(document.uri);
    const parsedPath = path.parse(documentPath);
    /** Note: relative based on _dir_ only, when file is also given -> does not work */
    const withoutFileExt = `${parsedPath.dir}`;
    const resolvedPath = path.resolve(withoutFileExt, region.regionValue ?? '');
    const ext = path.extname(documentPath);
    const withExt = `${resolvedPath}${ext}`;

    if (fs.existsSync(withExt)) return;

    const message = 'File path does not exist.';

    const diag = DiagnosticsService.createDiagnosticsFromRegion(
      region,
      message
    );

    return diag;
  }
}
