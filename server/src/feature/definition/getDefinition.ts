import * as ts from 'typescript';
export interface DefinitionResult {
  lineAndCharacter: ts.LineAndCharacter;
  viewModelFilePath?: string;
  viewFilePath?: string;
}
