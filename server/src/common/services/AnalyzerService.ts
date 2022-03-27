import { TextDocument } from 'vscode-languageserver-textdocument';

import { IAureliaComponent } from '../../aot/aotTypes';
import { AureliaProjects } from '../../core/AureliaProjects';
import { inject } from '../../core/container';

@inject(AureliaProjects)
export class AnalyzerService {
  constructor(private readonly aureliaProjects: AureliaProjects) {}

  public getAureliaProgramByDocument({ uri }: { uri: string }) {
    const targetProject = this.aureliaProjects.getFromUri(uri);

    if (!targetProject) return;
    const aureliaProgram = targetProject?.aureliaProgram;
    if (!aureliaProgram) return;

    return aureliaProgram;
  }

  public getComponentByDocumennt({
    uri,
  }: {
    uri: string;
  }): IAureliaComponent | undefined {
    const aureliaProgram = this.getAureliaProgramByDocument({ uri });
    if (!aureliaProgram) return;

    const component = aureliaProgram.aureliaComponents.getOneByFromDocument({
      uri,
    });
    if (!component) return;

    return component;
  }

  public getOneComponentBy<
    T extends keyof IAureliaComponent,
    Value extends IAureliaComponent[T]
  >(
    { uri }: { uri: string },
    key: T,
    targetValue: Value
  ): IAureliaComponent | undefined {
    const aureliaProgram = this.getAureliaProgramByDocument({ uri });

    const targetComponent = aureliaProgram?.aureliaComponents.getOneBy(
      key,
      targetValue
    );
    return targetComponent;
  }
}
