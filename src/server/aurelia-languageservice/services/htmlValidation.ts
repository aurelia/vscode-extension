'use strict';
//import { commands } from 'vscode';
import { Files } from 'vscode-languageserver';
import { Diagnostic, DiagnosticSeverity, Range, SymbolInformation, SymbolKind, TextDocument } from 'vscode-languageserver-types';
import { LanguageSettings } from "../aureliaLanguageService";
import { HTMLDocument } from '../parser/htmlParser';
import { TokenType, createScanner, ScannerState } from '../parser/htmlScanner'
import * as fs from 'fs';
import * as path from 'path';

export type DiagnosticCodes = 'invalid-casing' | 'invalid-method';
export const DiagnosticCodes = {
	InvalidCasing: 'invalid-casing' as DiagnosticCodes,
	InvalidMethod: 'invalid-method' as DiagnosticCodes
}

export const DiagnosticSource = 'Aurelia';

interface Attribute {
	name: string;
	start: number;
	length: number;
	value?: string;
}

const kebabCaseValidationRegex = /(.*)\.(bind|one-way|two-way|one-time|call|delegate|trigger)/;
const methodRegex = /\"(.*)\(/;

function kebabToCamel(s: string) {
	return s.replace(/(\-\w)/g, m => m[1].toUpperCase());
}

function camelToKebab(s: string) {
	return s.replace(/\.?([A-Z])/g, (x, y) => "-" + y.toLowerCase()).replace(/^-/, "");
}

export class HTMLValidation {
	private validationEnabled: boolean;

	constructor() {
		this.validationEnabled = true;
	}

	public configure(raw: LanguageSettings) {
		if (raw) {
			this.validationEnabled = raw.validate;
		}
	}

	async doValidation(document: TextDocument, htmlDocument: HTMLDocument): Promise<Diagnostic[]> {
		if (!this.validationEnabled) return Promise.resolve([]);

		const text = document.getText();
		const scanner = createScanner(text, htmlDocument.roots[0].start);

		const diagnostics: Diagnostic[] = [];

		let attr;
		let token = scanner.scan();
		while (token !== TokenType.EOS) {
			switch (token) {
				case TokenType.AttributeName:
					attr = <Attribute>{
						name: scanner.getTokenText(),
						start: scanner.getTokenOffset(),
						length: scanner.getTokenLength()
					};
					break;
				case TokenType.AttributeValue:
					attr.value = scanner.getTokenText();
					await this._validateAttribute(attr, document, diagnostics);
					break;
			}
			token = scanner.scan();
		}

		return Promise.resolve(diagnostics);
	}

	private async _validateAttribute(attr: Attribute, document: TextDocument, diagnostics: Diagnostic[]) {
		let match = kebabCaseValidationRegex.exec(attr.name);
		if (match && match.length) {
			const prop = match[1];
			const op = match[2];

			if (prop !== prop.toLowerCase()) {
				diagnostics.push(this.toDiagnostic(attr, document,
					`'${attr.name}' has invalid casing; it should likely be '${camelToKebab(prop)}.${op}'`,
					DiagnosticCodes.InvalidCasing));
			}

			// if (op === 'call' || op === 'trigger' || op === 'delegate') {
			// 	match = methodRegex.exec(attr.value);
			// 	const method = match[1];

			// 	const parseFilename = path.parse(Files.uriToFilePath(document.uri));
			// 	let codeBehindFilename = path.join(parseFilename.dir, `${parseFilename.name}.ts`);

			// 	if (!fs.existsSync(codeBehindFilename)) {
			// 		codeBehindFilename = path.join(parseFilename.dir, `${parseFilename.name}.js`);
			// 		if (!fs.existsSync(codeBehindFilename)) return Promise.resolve();
			// 	}

			// 	// Can't access vscode commands here -- do we really need to talk directly to the typescript language service?
			// 	const symbols = await <Promise<SymbolInformation[]>>commands.executeCommand('vscode.executeDocumentSymbolProvider', Uri.file(codeBehindFilename));
			// 	if (!symbols.some(s => (s.kind === SymbolKind.Function || s.kind === SymbolKind.Method) && s.name === method)) {
			// 		diagnostics.push(this.toDiagnostic(attr, document, `'${method}' is missing from ${kebabToCamel(prop)}`));
			// 	}
			// }
		}

		return Promise.resolve();
	}

	private toDiagnostic(attr: Attribute, document: TextDocument, message: string, code: DiagnosticCodes | undefined = undefined, serverity: DiagnosticSeverity = DiagnosticSeverity.Error): Diagnostic {
		const range = Range.create(document.positionAt(attr.start), document.positionAt(attr.start + attr.length));
		const diagnostic = <Diagnostic>{
			message: message,
			range: range,
			severity: serverity,
			source: DiagnosticSource
		};

		if (code !== undefined) {
			diagnostic.code = code;
		}
		return diagnostic;
	}
}
