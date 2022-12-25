import { TextDocuments } from 'vscode-languageserver';
import { Position, TextDocument } from 'vscode-languageserver-textdocument';

export type AllDocuments = TextDocuments<TextDocument>;

/**
 * Type from the client: vscode.TextEditor.Selection
 */
export interface ClientEditorSelection {
  /**
   * The position at which the selection starts.
   * This position might be before or after [active](#Selection.active).
   */
  anchor: Position;
  /**
   * The position of the cursor.
   * This position might be before or after [anchor](#Selection.anchor).
   */
  active: Position;
  start: Position;
  end: Position;

  /**
   * A selection is reversed if [active](#Selection.active).isBefore([anchor](#Selection.anchor)).
   */
  // isReversed: boolean;
}

export interface GetEditorSelectionResponse {
  documentText: string;
  documentUri: string;
  documentPath: string;
  selections: ClientEditorSelection[];
}
