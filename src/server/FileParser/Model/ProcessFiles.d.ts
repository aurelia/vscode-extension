import { Range } from 'vscode-languageserver';

// Can take this from `ViewModelDocuments.ts`;

type Method = {
  name: string;
  returnType: string;
  modifiers: string[];
  parameters: string[];
  range: Range // Position[]
};

export declare type Methods = Method[];

type Property = {
  name: string;
  modifiers: string[];
  type: string | undefined;
  range: Range // Position[]
};

export declare type Properties = Property[];
