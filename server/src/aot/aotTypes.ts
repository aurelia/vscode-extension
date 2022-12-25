import { ts } from 'ts-morph';

import { AureliaClassTypes } from '../common/constants';
import { AbstractRegion } from './parser/regions/ViewRegions';

export interface IAureliaClassMember {
  name: string;
  memberType: string;
  documentation: string;
  isBindable: boolean;
  syntaxKind: ts.SyntaxKind;
  start: number;
  end: number;
}

export interface IAureliaComponent {
  documentation: string;
  sourceFile?: ts.SourceFile;
  version?: number;
  /** export class >ComponentName< {} */
  className: string;
  /** component-name */
  baseViewModelFileName: string;
  /** path/to/component-name.ts */
  viewModelFilePath: string;
  /**
   * export class >Sort<ValueConverter {} --> sort
   */
  valueConverterName?: string;
  /**
   * Kebab case of eg.
   * \@customElement(">component-name<")
   * export class >ComponentName< {} --> component-name
   */
  componentName?: string;
  decoratorComponentName?: string;
  decoratorStartOffset?: number;
  decoratorEndOffset?: number;
  viewFilePath?: string;
  type: AureliaClassTypes;
  /** Class Members */
  classMembers?: IAureliaClassMember[];
  /** View */
  viewRegions: AbstractRegion[];
}

export interface IAureliaBindable {
  componentName: string;
  /**
   * Class member information of bindable.
   *
   * Reason for structure:
   * Before, the interface was like `export interface IAureliaBindable extends IAureliaClassMember`,
   * but due to further processing hardship (creating actual CompletionItem), that interface was hard to work with.
   */
  classMember: IAureliaClassMember;
}
