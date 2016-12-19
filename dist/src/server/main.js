"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode_languageserver_1 = require("vscode-languageserver");
const aureliaLanguageService_1 = require("./aurelia-languageservice/aureliaLanguageService");
const languageModelCache_1 = require("./languageModelCache");
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
            completionProvider: { resolveProvider: false, triggerCharacters: ['.', '<'] },
            textDocumentSync: documents.syncKind,
        },
    };
});
let aureliaSettings;
connection.onDidChangeConfiguration(change => aureliaSettings = change.settings.aurelia);
let languageService = aureliaLanguageService_1.getLanguageService();
documents.onDidChangeContent((change) => __awaiter(this, void 0, void 0, function* () {
    let htmlDocument = htmlDocuments.get(change.document);
    const diagnostics = yield languageService.doValidation(change.document, htmlDocument);
    connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
}));
connection.onCompletion(textDocumentPosition => {
    let document = documents.get(textDocumentPosition.textDocument.uri);
    let htmlDocument = htmlDocuments.get(document);
    return languageService.doComplete(document, textDocumentPosition.position, htmlDocument, aureliaSettings.autocomplete.quotes);
});
connection.listen();
//# sourceMappingURL=main.js.map