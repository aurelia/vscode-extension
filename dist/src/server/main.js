"use strict";
const vscode_languageserver_1 = require('vscode-languageserver');
const aureliaLanguageService_1 = require('./aurelia-languageservice/aureliaLanguageService');
const languageModelCache_1 = require('./languageModelCache');
let connection = vscode_languageserver_1.createConnection();
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
let documents = new vscode_languageserver_1.TextDocuments();
documents.listen(connection);
let htmlDocuments = languageModelCache_1.getLanguageModelCache(10, 60, document => aureliaLanguageService_1.getLanguageService().parseHTMLDocument(document));
documents.onDidClose(e => {
    htmlDocuments.onDocumentRemoved(e.document);
});
connection.onShutdown(() => {
    htmlDocuments.dispose();
});
let workspacePath;
connection.onInitialize((params) => {
    workspacePath = params.rootPath;
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            completionProvider: { resolveProvider: false, triggerCharacters: ['.', '<'] }
        }
    };
});
let aureliaSettings;
connection.onDidChangeConfiguration((change) => aureliaSettings = change.settings.aurelia);
let languageService = aureliaLanguageService_1.getLanguageService();
connection.onCompletion(textDocumentPosition => {
    let document = documents.get(textDocumentPosition.textDocument.uri);
    let htmlDocument = htmlDocuments.get(document);
    return languageService.doComplete(document, textDocumentPosition.position, htmlDocument, aureliaSettings.autocomplete.quotes);
});
connection.listen();
//# sourceMappingURL=main.js.map