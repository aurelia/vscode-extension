import * as Path from 'path';

import { ts } from 'ts-morph';

import {
  VALUE_CONVERTER_SUFFIX,
  AureliaClassTypes,
} from '../../common/constants';
import { UriUtils } from '../../common/view/uri-utils';
import { IAureliaComponent } from '../aotTypes';
import { Optional } from '../parser/regions/ViewRegions';

export class ValueConverterAnalyser {
  public static getComponentInfo(
    targetClassDeclaration: ts.ClassDeclaration,
    sourceFile: ts.SourceFile,
    documentation: string
  ): Optional<IAureliaComponent, 'viewRegions'> {
    const valueConverterName = targetClassDeclaration.name
      ?.getText()
      .replace(VALUE_CONVERTER_SUFFIX, '')
      .toLocaleLowerCase();

    const result: Optional<IAureliaComponent, 'viewRegions'> = {
      documentation,
      className: targetClassDeclaration.name?.getText() ?? '',
      valueConverterName,
      baseViewModelFileName: Path.parse(sourceFile.fileName).name,
      viewModelFilePath: UriUtils.toSysPath(sourceFile.fileName),
      type: AureliaClassTypes.VALUE_CONVERTER,
      sourceFile,
    };

    return result;
  }

  public static checkValueConverter(
    targetClassDeclaration: ts.ClassDeclaration
  ) {
    const isValueConverterName = targetClassDeclaration.name
      ?.getText()
      .includes(VALUE_CONVERTER_SUFFIX);

    return Boolean(isValueConverterName);
  }
}
