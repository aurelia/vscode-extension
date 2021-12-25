import { Position } from 'vscode-html-languageservice';
import {
  CompletionParams,
  PublishDiagnosticsParams,
  TextDocumentChangeEvent,
  TextDocumentPositionParams,
  TextDocuments,
} from 'vscode-languageserver';
import { CodeActionParams } from 'vscode-languageserver-protocol';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { isViewModelDocument } from '../common/documens/TextDocumentUtils';

import { Logger } from '../common/logging/logger';
import { onCodeAction } from '../feature/codeAction/onCodeAction';
import { onCompletion } from '../feature/completions/onCompletions';
import { ExtensionSettings } from '../feature/configuration/DocumentSettings';
import { onConnectionDidChangeContent } from '../feature/content/changeContent';
import { onDefintion } from '../feature/definition/onDefinitions';
import { createDiagnostics } from '../feature/diagnostics/diagnostics';
import { onConnectionInitialized } from '../feature/initialization/initialization';
import { onRenameRequest } from '../feature/rename/onRenameRequest';
import { onDidSave } from '../feature/save/saveContent';
import { onDocumentSymbol } from '../feature/symbols/onDocumentSymbol';
import { onWorkspaceSymbol } from '../feature/symbols/onWorkspaceSymbol';
import { Container } from './container';
import { initDependencyInjection } from './depdencenyInjection';

const logger = new Logger('AureliaServer');

export class AureliaServer {
  constructor(
    private readonly container: Container,
    public readonly extensionSettings: ExtensionSettings,
    public allDocuments: TextDocuments<TextDocument>
  ) {
    initDependencyInjection(container, extensionSettings);
  }

  public async onConnectionInitialized(
    extensionSettings?: ExtensionSettings,
    forceReinit: boolean = false
  ): Promise<void> {
    try {
      await onConnectionInitialized(
        this.container,
        extensionSettings ?? this.extensionSettings,
        this.allDocuments.all(),
        forceReinit
      );
    } catch (_error) {
      const error = _error as Error;
      logger.log(error.message);
      logger.log(error.stack ?? '');
    }
  }

  public async onConnectionDidChangeContent(
    change: TextDocumentChangeEvent<TextDocument>
  ): Promise<void> {
    try {
      await onConnectionDidChangeContent(this.container, change);
    } catch (_error) {
      const error = _error as Error;
      logger.log(error.message);
      logger.log(error.stack ?? '');
    }
  }

  // listen() {}
  // onRequest() {}
  // sendRequest() {}
  // onNotification() {}
  // sendNotification() {}
  // // onProgress() {}
  // sendProgress() {}
  // onInitialize() {}
  // onInitialized() {}
  // onShutdown() {}
  // onExit() {}
  // onDidChangeConfiguration() {}
  // onDidChangeWatchedFiles() {}
  // onDidOpenTextDocument() {}
  // onDidChangeTextDocument() {}
  // onDidCloseTextDocument() {}
  // onWillSaveTextDocument() {}
  // onWillSaveTextDocumentWaitUntil() {}

  public async onDidSave(change: TextDocumentChangeEvent<TextDocument>) {
    await onDidSave(this.container, change);
  }

  public sendDiagnostics(document: TextDocument) {
    const diagnostics = createDiagnostics(this.container, document);

    const diagnosticsParams: PublishDiagnosticsParams = {
      uri: document.uri,
      diagnostics,
    };
    return diagnosticsParams;
  }

  public async onHover() {
    // filePath: string // position: Position, // documentContent: string,
    // const hovered = onHover(documentContent, position, filePath);
    // return hovered;
  }

  public async onCompletion(
    document: TextDocument,
    completionParams: CompletionParams
  ) {
    const dontTrigger = await this.dontTriggerInViewModel(document);
    if (dontTrigger) return;

    if (this.extensionSettings.capabilities?.completions === false) return;
    /* prettier-ignore */ logger.log('Completion triggered.',{logMs:true,msStart:true});

    try {
      const completions = await onCompletion(
        this.container,
        completionParams,
        document
      );

      if (completions == null) {
        /* prettier-ignore */ logger.log(`No Aurelia completions found.`,{logMs:true,msEnd:true});
        return;
      }

      /* prettier-ignore */ logger.log(`Found ${completions?.length ?? 0} completion(s).`,{logMs:true,msEnd:true});

      return completions;
    } catch (_error) {
      const error = _error as Error;
      logger.log(error.message);
      logger.log(error.stack ?? '');
    }
  }

  // onCompletionResolve() {}
  // onSignatureHelp() {}
  // onDeclaration() {}

  public async onDefinition(document: TextDocument, position: Position) {
    if (this.extensionSettings.capabilities?.definitions === false) return;
    /* prettier-ignore */ logger.log('Definition triggered.',{logMs:true,msStart:true});

    try {
      const definitions = await onDefintion(document, position, this.container);

      if (definitions == null) {
        /* prettier-ignore */ logger.log(`No Aurelia defintions found.`,{logMs:true,msEnd:true});
        return;
      }

      /* prettier-ignore */ logger.log(`Found ${definitions?.length ?? 0} definition(s).`,{logMs:true,msEnd:true});
      return definitions;
    } catch (_error) {
      const error = _error as Error;
      logger.log(error.message);
      logger.log(error.stack ?? '');
    }
  }

  // onTypeDefinition() {}
  // onImplementation() {}
  // onReferences() {}
  // onDocumentHighlight() {}

  public async onDocumentSymbol(documentUri: string) {
    const dontTrigger = await this.dontTriggerInViewModel({
      uri: documentUri,
    });
    if (dontTrigger) return;
    if (this.extensionSettings.capabilities?.documentSymbols === false) return;
    // Too spammy, since Vscode basically triggers this after every file change.
    // /* prettier-ignore */ logger.log('Document symbol triggered.',{logMs:true,msStart:true});

    try {
      const symbols = await onDocumentSymbol(this.container, documentUri);
      return symbols;
    } catch (_error) {
      const error = _error as Error;
      logger.log(error.message);
      logger.log(error.stack ?? '');
    }
  }

  public onWorkspaceSymbol() {
    if (this.extensionSettings.capabilities?.workspaceSymbols === false) return;
    /* prettier-ignore */ logger.log('Workspace symbol triggered.',{logMs:true,msStart:true});

    // const symbols = onWorkspaceSymbol(this.container, query);
    const symbols = onWorkspaceSymbol(this.container);

    /* prettier-ignore */ logger.log(`Found ${symbols?.length ?? 0} symbol(s).`,{logMs:true,msEnd:true});
    return symbols;
  }

  public async onCodeAction(codeActionParams: CodeActionParams) {
    const dontTrigger = await this.dontTriggerInViewModel(
      codeActionParams.textDocument
    );
    if (dontTrigger) return;

    if (this.extensionSettings.capabilities?.codeActions === false) return;
    // Too spammy
    // /* prettier-ignore */ logger.log('Code action triggered.',{logMs:true,msStart:true});

    try {
      const codeAction = await onCodeAction(
        this.container,
        codeActionParams,
        this.allDocuments
      );

      // /* prettier-ignore */ logger.log(`Found ${codeAction?.length ?? 0} code action(s).`,{logMs:true,msEnd:true});
      return codeAction;
    } catch (_error) {
      const error = _error as Error;
      logger.log(error.message);
      logger.log(error.stack ?? '');
    }
  }

  // onCodeLens() {}
  // onCodeLensResolve() {}
  // onDocumentFormatting() {}
  // onDocumentRangeFormatting() {}
  // onDocumentOnTypeFormatting() {}

  public async onRenameRequest(
    document: TextDocument,
    position: Position,
    newName: string
  ) {
    if (this.extensionSettings.capabilities?.renames === false) return;
    /* prettier-ignore */ logger.log('Rename triggered.',{logMs:true,msStart:true});

    try {
      const renames = await onRenameRequest(
        document,
        position,
        newName,
        this.container
      );

      if (renames == null) {
        /* prettier-ignore */ logger.log(`No Aurelia renames found.`,{logMs:true,msEnd:true});
        return;
      }

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      /* prettier-ignore */ logger.log(`Found ${Object.keys(renames?.changes ?? {}).length ?? '0'} file(s) to rename.`,{logMs:true,msEnd:true});
      return renames;
    } catch (_error) {
      const error = _error as Error;
      logger.log(error.message);
      logger.log(error.stack ?? '');
    }
  }

  // onPrepareRename() {}
  // onDocumentLinks() {}
  // onDocumentLinkResolve() {}
  // onDocumentColor() {}
  // onColorPresentation() {}
  // onFoldingRanges() {}
  // onSelectionRanges() {}

  // public async onExecuteCommand(executeCommandParams: ExecuteCommandParams) {
  //   onExecuteCommand(this.container, executeCommandParams);
  // }

  // dispose() {}

  // console: RemoteConsole & PConsole;
  // tracer: Tracer & PTracer;
  // telemetry: Telemetry & PTelemetry;
  // client: RemoteClient & PClient;
  // window: RemoteWindow & PWindow;
  // workspace: RemoteWorkspace & PWorkspace;
  // languages: Languages & PLanguages;
  // console;
  // tracer;
  // telemetry;
  // client;
  // window;
  // workspace;
  // languages;

  private dontTriggerInViewModel(document: { uri: string }) {
    const dontTrigger = isViewModelDocument(document, this.extensionSettings);
    return dontTrigger;
  }
}
