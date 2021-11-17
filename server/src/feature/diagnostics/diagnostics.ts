import { Diagnostic } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { AureliaProjects } from '../../core/AureliaProjects';
import { Container } from '../../core/container';

export function createDiagnostics(
  container: Container,
  document: TextDocument
): Diagnostic[] {
  const aureliaProjects = container.get(AureliaProjects);
  const targetProject = aureliaProjects.getFromUri(document.uri);
  if (!targetProject) return [];
  const aureliaProgram = targetProject?.aureliaProgram;
  if (!aureliaProgram) return [];

  const targetComponent =
    aureliaProgram.aureliaComponents.getOneByFromDocument(document);
  const regions = targetComponent?.viewRegions;

  if (!regions) return [];

  return [];
}
