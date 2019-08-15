/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
  workspace as Workspace, 
  ExtensionContext, 
  WorkspaceFolder,
  Uri
} from 'vscode';

import {
	LanguageClient
} from 'vscode-languageclient';

let defaultClient: LanguageClient;
let clients: Map<string, LanguageClient> = new Map();

export function activate(context: ExtensionContext) {

}

export function deactivate(): Thenable<void> {
  return Promise.resolve();
}
