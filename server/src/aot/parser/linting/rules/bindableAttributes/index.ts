import { kebabCase } from 'lodash';
import { Diagnostic } from 'vscode-languageserver';

import { createVirtualFileWithContentV2 } from '../../../../../feature/virtual/virtualSourceFile';
import { IAureliaClassMember, IAureliaComponent } from '../../../../aotTypes';
import { AureliaProgram } from '../../../../AureliaProgram';
import { getRangeFromRegion } from '../../../regions/rangeFromRegion';
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
      message = `Not found. No such bindable: '${region.regionValue}'`;
    } else {
      message = `Invalid casing. Did you mean: '${kebabCase(
        targetBindable.name
      )}'?`;
    }

    const range = getRangeFromRegion(region);
    if (!range) return;
    const diag = Diagnostic.create(range, message);

    return diag;
  }

  public static preventPrivateMethod(
    region: BindableAttributeRegion,
    targetBindable: IAureliaClassMember | undefined,
    bindableName: string,
    aureliaProgram?: AureliaProgram,
    components?: IAureliaComponent[]
  ): Diagnostic | undefined {
    aureliaProgram;
    // region.regionValue;
    // // 1. check if accessScope value is imported
    // region.attributeValue;
    // // 2. then do virtual diagnostics
    // if (!components) return;

    // const targetComponent = components.find(
    //   (component) => component.componentName === region.tagName
    // );

    // const virtual = createVirtualFileWithContentV2(
    //   components,
    //   targetComponent?.viewModelFilePath ?? '',
    //   region.attributeValue ?? ''
    // );
    // if (!virtual) return;

    return;
  }
}
