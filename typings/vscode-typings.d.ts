/// <reference path="../node_modules/vscode/typings/index.d.ts" />


declare namespace TestRunner {  
  export function configure(mochaSettings: any): void;
}

declare module 'vscode/lib/testrunner' {  
  export = TestRunner;
}
