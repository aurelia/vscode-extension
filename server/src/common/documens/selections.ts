import { AllDocuments, GetEditorSelectionResponse } from '../types/types';
import { Range } from 'vscode-languageserver';

export function extractSelectedTexts(
  getEditorSelectionResponse: GetEditorSelectionResponse,
  allDocuments: AllDocuments,
) {
  const { documentUri, selections } = getEditorSelectionResponse;
  const document = allDocuments.get(documentUri);

  let rawTexts = selections.map((selection) => {
    const range = Range.create(selection.start, selection.end);
    const text = document?.getText(range);
    return text;
  });
  const selectedTexts = rawTexts.filter(
    (text) => text !== undefined
  ) as string[];

  return selectedTexts;
}
