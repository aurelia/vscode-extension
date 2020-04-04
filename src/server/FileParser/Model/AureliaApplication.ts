import { WebComponent } from './WebComponent';
import { singleton } from 'aurelia-dependency-injection';
import * as ts from 'typescript';

@singleton()
export class AureliaApplication {
  public components: WebComponent[] = [];
  public watcherProgram: ts.SemanticDiagnosticsBuilderProgram;

  /**
   * getProgram gets the current program
   *
   * The program may be undefined if no watcher is present or no program has been initiated yet.
   *
   * This program can change from each call as the program is fetched
   * from the watcher which will listen to IO changes in the tsconfig.
   */
  public getProgram(): ts.Program | undefined {
    if (this.watcherProgram !== undefined) {
      return this.watcherProgram.getProgram();
    } else {
      return undefined;
    }
  }
}
