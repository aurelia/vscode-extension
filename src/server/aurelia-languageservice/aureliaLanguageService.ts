import { parse } from './parser/htmlParser';
import { doComplete } from './services/htmlCompletion';
import { HTMLValidation } from './services/htmlValidation';
import { CompletionList, Diagnostic, Position, TextDocument } from 'vscode-languageserver-types';
import { HTMLDocument } from './parser/htmlParser';

export { HTMLDocument } from './parser/htmlParser';

export interface CompletionConfiguration {
	[provider: string]: boolean;
}

export interface LanguageSettings {
	validate?: boolean;
}

export interface LanguageService {
	doComplete(document: TextDocument, position: Position, htmlDocument: HTMLDocument, quotes: string): CompletionList;
	doValidation(document: TextDocument, htmlDocument: HTMLDocument): Thenable<Diagnostic[]>;
	parseHTMLDocument(document: TextDocument): HTMLDocument;
}

export function getLanguageService(): LanguageService {
	const validation = new HTMLValidation();
	return {
		doComplete,
		doValidation: validation.doValidation.bind(validation),
		parseHTMLDocument: document => parse(document.getText())
	};
}
