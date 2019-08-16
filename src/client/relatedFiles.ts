'use strict';
import { commands, Disposable, TextEditor, TextEditorEdit, Uri, workspace } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AureliaConfigProperties } from './Model/AureliaConfigProperties';

export class RelatedFiles implements Disposable {
  private disposables: Disposable[] = [];

  constructor() {
    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelated', this.onOpenRelated, this));

    const fileExtensionsConfig = this.getRelatedFileExtensions();
    const {
      scriptExtensions,
      styleExtensions,
      unitExtensions,
      viewExtensions,
    } = fileExtensionsConfig

    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelatedScript', this.openRelatedFactory(scriptExtensions), this));
    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelatedStyle', this.openRelatedFactory(styleExtensions), this));
    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelatedUnit', this.openRelatedFactory(unitExtensions), this));
    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelatedView', this.openRelatedFactory(viewExtensions), this));
  }

  public dispose() {
    if (this.disposables.length) {
      this.disposables.forEach((disposable) => {
        disposable.dispose();
      });
    }
  }

  /**
   * Provide file extensions for navigating between Aurelia files.
   */
  private getRelatedFileExtensions() {
    const defaultSettings = {
      scriptExtensions: [".js", ".ts"],
      styleExtensions: [".less", ".sass", ".scss", ".styl", ".css"],
      unitExtensions: [".spec.js", ".spec.ts"],
      viewExtensions: [".html"],
    };
    return defaultSettings;
  }

  private onOpenRelated(editor: TextEditor, edit: TextEditorEdit) {
    if (!editor || !editor.document || editor.document.isUntitled) {
      return;
    }

    let relatedFile: string;
    const fileName = editor.document.fileName;
    const extension = path.extname(fileName).toLowerCase();
    const fileExtensionsConfig = this.getRelatedFileExtensions();
    const {
      viewExtensions,
      scriptExtensions,
    } = fileExtensionsConfig

    if (viewExtensions.includes(extension)) {
      relatedFile = this.relatedFileExists(fileName, scriptExtensions);
    }
    else if (scriptExtensions.includes(extension)) {
      relatedFile = this.relatedFileExists(fileName, viewExtensions);
    }

    if (relatedFile) {
      commands.executeCommand('vscode.open', Uri.file(relatedFile), editor.viewColumn);
    }
  }

  /**
   * Open a related Aurelia file, and
   * return a function, which can be used by vscode's registerTextEditorCommand
   * @param switchToExtensions Possible extensions, for target file
   */
  private openRelatedFactory(switchToExtensions: string[]) {
    return (editor, edit) => {
      if (!editor || !editor.document || editor.document.isUntitled) {
        return;
      }

      /**
       * '.spec' is not recognized as an file extension.
       * Thus, `replace`, so we are able to switch from, eg. 'unit' to 'style'.
       * */
      const fileName = editor.document.fileName.replace('.spec', '');
      const extension = path.extname(fileName).toLowerCase();
      const relatedFile = this.relatedFileExists(fileName, switchToExtensions);
      if (relatedFile) {
        commands.executeCommand('vscode.open', Uri.file(relatedFile), editor.viewColumn);
      }
    }
  }

  /**
   * @param fullPath Full path of the file, which triggered the command
   * @param relatedExts Possible extensions, for target file
   * @returns targetFile
   */
  private relatedFileExists(fullPath: string, relatedExts: string[]): string {
    let targetFile: string;
    relatedExts.forEach(ext => {
      let fileName = `${path.basename(fullPath, path.extname(fullPath))}${ext}`
        .replace('.spec.spec', '.spec'); // Quick fix because we are appending eg. '.spec.ts' to 'file.spec'
      fullPath = path.join(path.dirname(fullPath), fileName);
      if (!fs.existsSync(fullPath)) return;
      targetFile = fullPath;
    });
    return targetFile
  }
}
