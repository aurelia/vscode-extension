'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const vscode_1 = require("vscode");
const path = require("path");
const fs = require("fs");
class RelatedFiles {
    constructor() {
        this.disposable = vscode_1.commands.registerTextEditorCommand('extension.auOpenRelated', this.onOpenRelated, this);
    }
    dispose() {
        if (this.disposable) {
            this.disposable.dispose();
        }
    }
    onOpenRelated(editor, edit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!editor || !editor.document || editor.document.isUntitled) {
                return;
            }
            let relatedFile;
            const fileName = editor.document.fileName;
            const extension = path.extname(fileName).toLowerCase();
            if (extension === '.html') {
                const [tsFile, jsFile] = yield Promise.all([
                    this.relatedFileExists(fileName, '.ts'),
                    this.relatedFileExists(fileName, '.js'),
                ]);
                if (tsFile) {
                    relatedFile = tsFile;
                }
                else if (jsFile) {
                    relatedFile = jsFile;
                }
            }
            else if (extension === '.js' || extension === '.ts') {
                relatedFile = yield this.relatedFileExists(fileName, '.html');
            }
            if (relatedFile) {
                vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.file(relatedFile));
            }
        });
    }
    relatedFileExists(fullPath, relatedExt) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = `${path.basename(fullPath, path.extname(fullPath))}${relatedExt}`;
            fullPath = path.join(path.dirname(fullPath), fileName);
            return new Promise((resolve, reject) => fs.access(fullPath, fs.constants.R_OK, err => resolve(err ? undefined : fullPath)));
        });
    }
}
exports.RelatedFiles = RelatedFiles;
//# sourceMappingURL=relatedFiles.js.map