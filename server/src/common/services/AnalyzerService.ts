import { TextDocument } from 'vscode-languageserver-textdocument';

import { IAureliaComponent } from '../../aot/aotTypes';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';

export class AnalyzerService {
  public static getAureliaProgramByDocument(
    container: Container,
    document: TextDocument
  ) {
    const aureliaProjects = container.get(AureliaProjects);
    const targetProject = aureliaProjects.getFromUri(document.uri);

    if (!targetProject) return;
    const aureliaProgram = targetProject?.aureliaProgram;
    if (!aureliaProgram) return;

    return aureliaProgram;
  }

  public static getComponentByDocumennt(
    container: Container,
    document: TextDocument
  ): IAureliaComponent | undefined {
    const aureliaProgram = this.getAureliaProgramByDocument(
      container,
      document
    );
    if (!aureliaProgram) return;

    const component =
      aureliaProgram.aureliaComponents.getOneByFromDocument(document);
    if (!component) return;

    return component;
  }

  public static getOneComponentBy<
    T extends keyof IAureliaComponent,
    Value extends IAureliaComponent[T]
  >(
    container: Container,
    document: TextDocument,
    key: T,
    targetValue: Value
  ): IAureliaComponent | undefined {
    const aureliaProgram = this.getAureliaProgramByDocument(
      container,
      document
    );

    const targetComponent = aureliaProgram?.aureliaComponents.getOneBy(key, targetValue);
    return targetComponent;
  }
}
