import {
  commands,
  Disposable,
  TextEditor,
  Uri,
  ViewColumn,
  workspace,
} from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class RelatedFiles implements Disposable {
  private readonly disposables: Disposable[] = [];

  public constructor() {
    this.disposables.push(
      commands.registerTextEditorCommand(
        'extension.auOpenRelated',
        this.onOpenRelated,
        this
      )
    );

    const fileExtensionsConfig = this.getRelatedFilePathExtensions();
    const {
      scriptExtensions,
      styleExtensions,
      unitExtensions,
      viewExtensions,
    } = fileExtensionsConfig;

    this.disposables.push(
      commands.registerTextEditorCommand(
        'extension.auOpenRelatedScript',
        this.openRelatedFactory(scriptExtensions),
        this
      )
    );
    this.disposables.push(
      commands.registerTextEditorCommand(
        'extension.auOpenRelatedStyle',
        this.openRelatedFactory(styleExtensions),
        this
      )
    );
    this.disposables.push(
      commands.registerTextEditorCommand(
        'extension.auOpenRelatedUnit',
        this.openRelatedFactory(unitExtensions),
        this
      )
    );
    this.disposables.push(
      commands.registerTextEditorCommand(
        'extension.auOpenRelatedView',
        this.openRelatedFactory(viewExtensions),
        this
      )
    );
  }

  public dispose(): void {
    if (this.disposables.length) {
      this.disposables.forEach((disposable) => {
        disposable.dispose();
      });
    }
  }

  /**
   * Provide file extensions for navigating between Aurelia files.
   */
  private getRelatedFilePathExtensions() {
    const settings = workspace.getConfiguration('aurelia.relatedFiles');
    if (settings !== undefined) {
      return {
        scriptExtensions: settings.script,
        styleExtensions: settings.style,
        unitExtensions: settings.unit,
        viewExtensions: settings.view,
      };
    }

    return {
      scriptExtensions: ['.js', '.ts'],
      styleExtensions: ['.less', '.sass', '.scss', '.styl', '.css'],
      unitExtensions: ['.spec.js', '.spec.ts'],
      viewExtensions: ['.html'],
    };
  }

  private onOpenRelated(editor: TextEditor) {
    if (editor.document === undefined || editor.document.isUntitled) {
      return;
    }

    let relatedFile: string;
    const fileName = editor.document.fileName;
    const extension = path.extname(fileName).toLowerCase();
    const fileExtensionsConfig = this.getRelatedFilePathExtensions();
    const { viewExtensions, scriptExtensions } = fileExtensionsConfig;

    if (viewExtensions.includes(extension)) {
      relatedFile = this.getRelatedFilePath(fileName, scriptExtensions);
    } else if (scriptExtensions.includes(extension)) {
      relatedFile = this.getRelatedFilePath(fileName, viewExtensions);
    }

    if (relatedFile) {
      void commands.executeCommand(
        'vscode.open',
        Uri.file(relatedFile),
        ViewColumn.Active
      );
    }
  }

  /**
   * Open a related Aurelia file, and
   * return a function, which can be used by vscode's registerTextEditorCommand
   *
   * @param switchToExtensions - Possible extensions, for target file
   */
  private openRelatedFactory(switchToExtensions: string[]) {
    return (editor: TextEditor) => {
      if (editor.document === undefined || editor.document.isUntitled) {
        return;
      }

      /**
       * '.spec' is not recognized as an file extension.
       * Thus, `replace`, so we are able to switch from, eg. 'unit' to 'style'.
       * */
      const fileName = editor.document.fileName.replace('.spec', '');
      const relatedFile = this.getRelatedFilePath(fileName, switchToExtensions);
      if (relatedFile) {
        void commands.executeCommand(
          'vscode.open',
          Uri.file(relatedFile),
          ViewColumn.Active
        );
      }
    };
  }

  /**
   * @param fullPath - Full path of the file, which triggered the command
   * @param relatedExts - Possible extensions, for target file
   * @returns targetFile
   */
  private getRelatedFilePath(fullPath: string, relatedExts: string[]): string {
    let targetFile: string;
    try {
      relatedExts.forEach((ext) => {
        const fileName = `${path.basename(
          fullPath,
          path.extname(fullPath)
        )}${ext}`.replace('.spec.spec', '.spec'); // Quick fix because we are appending eg. '.spec.ts' to 'file.spec'
        fullPath = path.join(path.dirname(fullPath), fileName);
        if (!fs.existsSync(fullPath)) return;
        targetFile = fullPath;
      });
    } catch (error) {
      console.log(error);
    }
    return targetFile;
  }
}
