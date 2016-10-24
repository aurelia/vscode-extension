import * as path from 'path';
import { ExtensionContext, OutputChannel, window, languages } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import AureliaCliCommands from './aureliaCLICommands';

let outputChannel: OutputChannel;

export function activate(context: ExtensionContext) {

	// Create default output channel
	outputChannel = window.createOutputChannel('aurelia');
	context.subscriptions.push(outputChannel);

	// Register CLI commands
	context.subscriptions.push(AureliaCliCommands.registerCommands(outputChannel));

	// Register Aurelia language server
	const serverModule = context.asAbsolutePath(path.join('dist', 'src', 'server', 'main.js'));
	const debugOptions = { execArgv: ['--nolazy', '--debug=6004'] };
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	};

	const clientOptions: LanguageClientOptions = {
		diagnosticCollectionName: 'Aurelia',
		documentSelector: ['html'],
		initializationOptions: {},
		synchronize: {
			configurationSection: ['aurelia'],
		}
	};

	const client = new LanguageClient('html', 'Aurelia', serverOptions, clientOptions);
	const disposable = client.start();
	context.subscriptions.push(disposable);
}
