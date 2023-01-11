import { Container } from 'aurelia-dependency-injection';
import { Connection, TextDocuments } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  ExtensionSettings,
  DocumentSettings,
} from '../configuration/DocumentSettings';
import { DeclareViewModelVariable } from '../feature/commands/declareViewModelVariable/declareViewModelVariable';
import { ExtractComponent } from '../feature/commands/extractComponent/extractComponent';
import { AureliaProjects } from './AureliaProjects';

export const ConnectionInjection = 'Connection';
export const AllDocumentsInjection = 'AllDocuments';

export function initDependencyInjection(
  container: Container,
  connection: Connection,
  extensionSettings: ExtensionSettings,
  allDocuments: TextDocuments<TextDocument>
) {
  container.registerInstance(Container);
  container.registerInstance(ConnectionInjection, connection);
  container.registerInstance(AllDocumentsInjection, allDocuments);

  container.registerInstance(
    DocumentSettings,
    new DocumentSettings(extensionSettings)
  );
  const settings = container.get(DocumentSettings);
  container.registerInstance(AureliaProjects, new AureliaProjects(settings));
  const aureliaProjects = container.get(AureliaProjects);

  container.registerInstance(
    ExtractComponent,
    new ExtractComponent(container, connection, allDocuments, aureliaProjects)
  );

  container.registerInstance(
    DeclareViewModelVariable,
    new DeclareViewModelVariable(container, connection, allDocuments, aureliaProjects)
  );
}
