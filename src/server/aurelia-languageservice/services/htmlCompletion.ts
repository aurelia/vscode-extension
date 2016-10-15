import { TextDocument, Position, CompletionList, CompletionItemKind, Range } from 'vscode-languageserver-types';

export function doComplete(document: TextDocument, position: Position): CompletionList {

	let result: CompletionList = {
		isIncomplete: false,
		items: []
	};

	return result;
}
