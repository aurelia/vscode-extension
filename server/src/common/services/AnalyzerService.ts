import { TextDocument } from 'vscode-languageserver-textdocument';

import { IAureliaComponent } from '../../aot/aotTypes';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';

export class AnalyzerService {
  public static getComponentByDocumennt(
    container: Container,
    document: TextDocument
  ): IAureliaComponent | undefined {
    const aureliaProjects = container.get(AureliaProjects);
    const targetProject = aureliaProjects.getFromUri(document.uri);

    if (!targetProject) return;
    const aureliaProgram = targetProject?.aureliaProgram;
    if (!aureliaProgram) return;

    const component =
      aureliaProgram.aureliaComponents.getOneByFromDocument(document);
    if (!component) return;

    return component;
  }
}
