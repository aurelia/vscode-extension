'use strict';
import { commands, Disposable, TextEditor, TextEditorEdit, Uri, workspace } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AureliaConfigProperties } from './Model/AureliaConfigProperties';

export class RelatedFiles implements Disposable {
  private disposables: Disposable[] = [];

  constructor() {
    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelated', this.onOpenRelated, this));

    const fileExtensionsConfig = this.getFileExtensionsFromConfig();
    const {
      script: scriptExtension,
      style: styleExtension,
      unit: unitExtension,
      view: viewExtension,
    } = fileExtensionsConfig

    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelatedScript', this.openRelatedFactory(scriptExtension), this));
    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelatedStyle', this.openRelatedFactory(styleExtension), this));
    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelatedUnit', this.openRelatedFactory(unitExtension), this));
    this.disposables.push(commands.registerTextEditorCommand('extension.auOpenRelatedView', this.openRelatedFactory(viewExtension), this));
  }

  public dispose() {
    if (this.disposables.length) {
      this.disposables.forEach((disposable) => {
        disposable.dispose();
      });
    }
  }

  private getFileExtensionsFromConfig() {
    const defaultSettings = {
      script: '.js',
      style: '.less',
      unit: '.spec.js',
      view: '.html',
    };
    return workspace.getConfiguration().get<AureliaConfigProperties['relatedFiles']>('aurelia.relatedFiles', defaultSettings);
  }

  private async onOpenRelated(editor: TextEditor, edit: TextEditorEdit) {
    if (!editor || !editor.document || editor.document.isUntitled) {
      return;
    }

    let relatedFile: string;
    const fileName = editor.document.fileName;
    const extension = path.extname(fileName).toLowerCase();
    const fileExtensionsConfig = this.getFileExtensionsFromConfig();
    const {
      view: viewExtension,
      script: scriptExtension,
    } = fileExtensionsConfig

    if (extension === viewExtension) {
      relatedFile = await this.relatedFileExists(fileName, scriptExtension);
    }
    else if (extension === scriptExtension) {
      relatedFile = await this.relatedFileExists(fileName, viewExtension);
    }

    if (relatedFile) {
      commands.executeCommand('vscode.open', Uri.file(relatedFile), editor.viewColumn);
    }
  }

  private openRelatedFactory(switchToExtension) {
    return async (editor, edit) => {
      if (!editor || !editor.document || editor.document.isUntitled) {
        return;
      }

      const fileName = editor.document.fileName;
      const extension = path.extname(fileName).toLowerCase();
      const relatedFile = await this.relatedFileExists(fileName, switchToExtension);

      if (relatedFile) {
        commands.executeCommand('vscode.open', Uri.file(relatedFile), editor.viewColumn);
      }
    }
  }

  private async relatedFileExists(fullPath: string, relatedExt: string): Promise<string | undefined> {
    const fileName = `${path.basename(fullPath, path.extname(fullPath))}${relatedExt}`;
    fullPath = path.join(path.dirname(fullPath), fileName);

    return new Promise<string | undefined>((resolve, reject) =>
      fs.access(fullPath, fs.constants.R_OK, err => resolve(err ? undefined : fullPath)));
  }
}
