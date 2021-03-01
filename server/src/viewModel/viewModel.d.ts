type Method = {
  name: string;
  returnType: string;
  modifiers: string[];
  parameters: string[];
  range: Range; // Position[]
};

export declare type Methods = Method[];

type Property = {
  name: string;
  modifiers: string[];
  isBindable: boolean;
  type: string | undefined;
  range: Range; // Position[]
};

export declare type Properties = Property[];
