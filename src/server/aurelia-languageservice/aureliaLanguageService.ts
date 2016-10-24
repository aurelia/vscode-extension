import { parse } from './parser/htmlParser';
import { doComplete } from './services/htmlCompletion';
import { TextDocument, Position, CompletionList } from 'vscode-languageserver-types';

export declare type HTMLDocument = {};

export interface LanguageService {
	doComplete(document: TextDocument, position: Position, htmlDocument: HTMLDocument, quotes: string): CompletionList;
  parseHTMLDocument(document: TextDocument): HTMLDocument;
}

export function getLanguageService(): LanguageService {
	return {
		doComplete,
    parseHTMLDocument: document => parse(document.getText()),
	};
}
