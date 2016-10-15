import { doComplete } from './services/htmlCompletion';
import { TextDocument, Position, CompletionList } from 'vscode-languageserver-types';

export interface CompletionConfiguration {
	[provider: string]: boolean;
}

export interface LanguageService {
	doComplete(document: TextDocument, position: Position): CompletionList;
}

export function getLanguageService(): LanguageService {
	return {
		doComplete
	};
}
