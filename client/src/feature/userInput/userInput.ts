import { window, ExtensionContext } from 'vscode';

export async function getUserInputCommand(context: ExtensionContext) {
  const result = await window.showInputBox({
    // value: 'abcdef',
    // valueSelection: [2, 4],
    placeHolder: 'Enter component name',
    validateInput: (text) => {
      const isEmpty = text === '';
      const isTooShort = text.length <= 2;
      if (isEmpty || isTooShort) return 'Must contain at least 3 characters';
    },
  });
  return result;
}
