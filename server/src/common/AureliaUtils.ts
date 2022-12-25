import { camelCase } from '@aurelia/kernel';
import { AureliaVersion } from './constants';

export class AureliaUtils {
  public static normalizeVariable(varName: string): string {
    return camelCase(varName);
  }

  public static isSameVariableName(
    name1: string | undefined,
    name2: string | undefined
  ): boolean {
    if (name1 === undefined) return false;
    if (name2 === undefined) return false;

    const normalized1 = this.normalizeVariable(name1);
    const normalized2 = this.normalizeVariable(name2);
    const isSame = normalized1 === normalized2;

    return isSame;
  }

  public static isAuV1(auVersion: AureliaVersion): boolean {
    const is = auVersion === AureliaVersion.V1;
    return is;
  }

  public static isAuV2(auVersion: AureliaVersion): boolean {
    const is = auVersion === AureliaVersion.V1;
    return is;
  }
}
