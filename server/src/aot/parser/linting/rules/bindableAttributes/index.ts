import { kebabCase } from 'lodash';
import { Diagnostic } from 'vscode-languageserver';
import { AURELIA_BINDABLE_KEYWORDS } from '../../../../../common/constants';

import { DiagnosticsService } from '../../../../../feature/diagnostics/DiagnosticsService';
import { IAureliaClassMember, IAureliaComponent } from '../../../../aotTypes';
import { AureliaProgram } from '../../../../AureliaProgram';
import { BindableAttributeRegion } from '../../../regions/ViewRegions';

export class BindableAttributeRules {
  public static bindableAttributeNamingConvention(
    region: BindableAttributeRegion,
    targetBindable: IAureliaClassMember | undefined,
    bindableName: string,
    aureliaProgram?: AureliaProgram,
    components?: IAureliaComponent[]
  ): Diagnostic | undefined {
    let message = '';

    if (
      kebabCase(bindableName ?? '') === kebabCase(targetBindable?.name ?? '')
    ) {
      return;
    }
    if (!targetBindable) {
      if (AURELIA_BINDABLE_KEYWORDS.includes(bindableName)) return;

      message = `Not found. No such bindable: '${
        region.regionValue ?? 'null'
      }'`;
    } else {
      message = `Invalid casing. Did you mean: '${kebabCase(
        targetBindable.name
      )}'?`;
    }

    const diag = DiagnosticsService.createDiagnosticsFromRegion(
      region,
      message
    );

    return diag;
  }
}
