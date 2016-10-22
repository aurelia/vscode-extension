import { createConnection, IConnection, TextDocuments, InitializeParams, InitializeResult } from 'vscode-languageserver';
import { HTMLDocument, getLanguageService, CompletionConfiguration } from './aurelia-languageservice/aureliaLanguageService';
import { getLanguageModelCache } from './languageModelCache';

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

let htmlDocuments = getLanguageModelCache<HTMLDocument>(10, 60, document => getLanguageService().parseHTMLDocument(document));
documents.onDidClose(e => {
	htmlDocuments.onDocumentRemoved(e.document);
});

connection.onShutdown(() => {
	htmlDocuments.dispose();
});

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

let languageService = getLanguageService();

connection.onCompletion(textDocumentPosition => {
  
	let document = documents.get(textDocumentPosition.textDocument.uri);
	let htmlDocument = htmlDocuments.get(document);
	let options = languageSettings && languageSettings.suggest;
	return languageService.doComplete(document, textDocumentPosition.position, htmlDocument);
});

connection.listen();
