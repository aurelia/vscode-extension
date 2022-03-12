import { ts } from 'ts-morph';

export interface DefinitionResult {
  lineAndCharacter: ts.LineAndCharacter;
  viewModelFilePath?: string;
  viewFilePath?: string;
}
