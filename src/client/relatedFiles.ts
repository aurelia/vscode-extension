'use strict';
import { commands, Disposable, TextEditor, TextEditorEdit, Uri } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class RelatedFiles implements Disposable {
  private disposable: Disposable;

  constructor() {
    this.disposable = commands.registerTextEditorCommand('extension.auOpenRelated', this.onOpenRelated, this);
  }

  public dispose() {
    if (this.disposable) {
      this.disposable.dispose();
    }
  }

  private async onOpenRelated(editor: TextEditor, edit: TextEditorEdit) {
    if (!editor || !editor.document || editor.document.isUntitled) {
      return;
    }

    let relatedFile: string;
    const fileName = editor.document.fileName;
    const extension = path.extname(fileName).toLowerCase();
    if (extension === '.html') {
      const [tsFile, jsFile] = await Promise.all([
        this.relatedFileExists(fileName, '.ts'),
        this.relatedFileExists(fileName, '.js'),
      ]);
      if (tsFile) {
        relatedFile = tsFile;
      } else if (jsFile) {
        relatedFile = jsFile;
      }
    } else if (extension === '.js' || extension === '.ts') {
      relatedFile = await this.relatedFileExists(fileName, '.html');
    }

    if (relatedFile) {
      commands.executeCommand('vscode.open', Uri.file(relatedFile));
    }
  }

  private async relatedFileExists(fullPath: string, relatedExt: string): Promise<string | undefined> {
    const fileName = `${path.basename(fullPath, path.extname(fullPath))}${relatedExt}`;
    fullPath = path.join(path.dirname(fullPath), fileName);

    return new Promise<string | undefined>((resolve, reject) =>
        fs.access(fullPath, fs.constants.R_OK, err => resolve(err ? undefined : fullPath)));
  }
}
