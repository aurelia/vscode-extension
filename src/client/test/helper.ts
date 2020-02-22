// Copied from https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/client/src/test/helper.ts

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import * as path from 'path';

export let doc: vscode.TextDocument;
export let editor: vscode.TextEditor;
export let documentEol: string;
export let platformEol: string;

/**
 * Activates the vscode.lsp-sample extension
 */
export async function activate(docUri: vscode.Uri) {
  // The extensionId is `publisher.name` from package.json
  // const ext = vscode.extensions.getExtension('vscode-samples.lsp-sample')!;
  // const ext = vscode.extensions.getExtension('AureliaEffect.aurelia')!;
  const ext = vscode.extensions.getExtension('aureliaeffect.aurelia')!;
  await ext.activate();
  try {
    doc = await vscode.workspace.openTextDocument(docUri);
    editor = await vscode.window.showTextDocument(doc);
    await sleep(3000); // Wait for server activation
    console.log('done')
  } catch (e) {
    console.error(e);
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getDocPath = (p: string) => {
  let resultPath = path.resolve(__dirname, '../../testFixture', p);
  resultPath = resultPath.replace('/dist', '')
  return resultPath;
  // return path.resolve(__dirname, '../../testFixture', p);
  // console.log("TCL: getDocPath -> resultPath", resultPath)
  // return '/Users/hdn/Desktop/(official)-aurelia-vscode-extension/src/testFixture/completion.txt'
};
export const getDocUri = (p: string) => {
  return vscode.Uri.file(getDocPath(p));
};

export async function setTestContent(content: string): Promise<boolean> {
  const all = new vscode.Range(
    doc.positionAt(0),
    doc.positionAt(doc.getText().length)
  );
  return editor.edit(eb => eb.replace(all, content));
}
