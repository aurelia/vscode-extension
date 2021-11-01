import { Position } from 'vscode-languageserver-types';
import {
  ViewRegionInfo,
  ViewRegionType,
} from '../../core/embeddedLanguages/embeddedSupport';

export class ViewRegionUtils {
  static getRegionFromPosition(region: ViewRegionInfo, position: Position) {}

  static regionVisitor(region: ViewRegionInfo, position: Position) {}
}

// ViewRegionUtils.regionVisitor([ViewRegionType.CustomElement, (region) => {}]);
