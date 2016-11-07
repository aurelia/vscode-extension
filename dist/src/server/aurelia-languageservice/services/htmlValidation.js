'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const vscode_languageserver_types_1 = require('vscode-languageserver-types');
const htmlScanner_1 = require('../parser/htmlScanner');
exports.DiagnosticCodes = {
    InvalidCasing: 'invalid-casing',
    InvalidMethod: 'invalid-method',
};
exports.DiagnosticSource = 'Aurelia';
const kebabCaseValidationRegex = /(.*)\.(bind|one-way|two-way|one-time|call|delegate|trigger)/;
function camelToKebab(s) {
    return s.replace(/\.?([A-Z])/g, (x, y) => '-' + y.toLowerCase()).replace(/^-/, '');
}
class HTMLValidation {
    constructor() {
        this.validationEnabled = true;
    }
    configure(raw) {
        if (raw) {
            this.validationEnabled = raw.validate;
        }
    }
    doValidation(document, htmlDocument) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.validationEnabled) {
                return Promise.resolve([]);
            }
            const text = document.getText();
            const scanner = htmlScanner_1.createScanner(text, htmlDocument.roots[0].start);
            const diagnostics = [];
            let attr;
            let token = scanner.scan();
            while (token !== htmlScanner_1.TokenType.EOS) {
                // tslint:disable-next-line:switch-default
                switch (token) {
                    case htmlScanner_1.TokenType.AttributeName:
                        attr = {
                            length: scanner.getTokenLength(),
                            name: scanner.getTokenText(),
                            start: scanner.getTokenOffset(),
                        };
                        break;
                    case htmlScanner_1.TokenType.AttributeValue:
                        attr.value = scanner.getTokenText();
                        yield this.validateAttribute(attr, document, diagnostics);
                        break;
                }
                token = scanner.scan();
            }
            return Promise.resolve(diagnostics);
        });
    }
    validateAttribute(attr, document, diagnostics) {
        return __awaiter(this, void 0, void 0, function* () {
            let match = kebabCaseValidationRegex.exec(attr.name);
            if (match && match.length) {
                const prop = match[1];
                const op = match[2];
                if (prop !== prop.toLowerCase()) {
                    diagnostics.push(this.toDiagnostic(attr, document, `'${attr.name}' has invalid casing; it should likely be '${camelToKebab(prop)}.${op}'`, exports.DiagnosticCodes.InvalidCasing));
                }
            }
            return Promise.resolve();
        });
    }
    toDiagnostic(attr, document, message, code = undefined, serverity = 1 /* Error */) {
        const range = vscode_languageserver_types_1.Range.create(document.positionAt(attr.start), document.positionAt(attr.start + attr.length));
        const diagnostic = {
            message: message,
            range: range,
            severity: serverity,
            source: exports.DiagnosticSource,
        };
        if (code !== undefined) {
            diagnostic.code = code;
        }
        return diagnostic;
    }
}
exports.HTMLValidation = HTMLValidation;
//# sourceMappingURL=htmlValidation.js.map