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

  public getComponentByDocumennt(
    document: TextDocument
  ): IAureliaComponent | undefined {
    const aureliaProgram = this.getAureliaProgramByDocument(document);
    if (!aureliaProgram) return;

    const component =
      aureliaProgram.aureliaComponents.getOneByFromDocument(document);
    if (!component) return;

    return component;
  }

  public getOneComponentBy<
    T extends keyof IAureliaComponent,
    Value extends IAureliaComponent[T]
  >(
    document: TextDocument,
    key: T,
    targetValue: Value
  ): IAureliaComponent | undefined {
    const aureliaProgram = this.getAureliaProgramByDocument(document);

    const targetComponent = aureliaProgram?.aureliaComponents.getOneBy(
      key,
      targetValue
    );
    return targetComponent;
  }
}
