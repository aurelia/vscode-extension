import { createConnection, IConnection, TextDocuments, InitializeParams, InitializeResult } from 'vscode-languageserver';
import { getLanguageService, CompletionConfiguration } from './aurelia-languageservice/aureliaLanguageService';

interface Settings {
	html: LanguageSettings;
}

interface LanguageSettings {
	suggest: CompletionConfiguration;
}

let connection: IConnection = createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

let documents: TextDocuments = new TextDocuments();
documents.listen(connection);

let workspacePath: string;

connection.onInitialize((params: InitializeParams): InitializeResult => {
	workspacePath = params.rootPath;
	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			completionProvider: { resolveProvider: false, triggerCharacters: ['.', '<'] }
		}
	};
});

let languageSettings: LanguageSettings;
connection.onDidChangeConfiguration((change) => {
	let settings = <Settings>change.settings;
	languageSettings = settings.html;
});

connection.onCompletion(textDocumentPosition => {
  let uri = textDocumentPosition.textDocument.uri;
  let position = textDocumentPosition.position;

  let document = documents.get(textDocumentPosition.textDocument.uri);
  let documentContent = document.getText();
  

  return [];
});

connection.listen();
