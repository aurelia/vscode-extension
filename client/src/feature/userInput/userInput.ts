import { window, commands, ExtensionContext } from 'vscode';
import { CREATE_COMPONEN_TEXT } from '../../shared/constants';
import { GetComponentState } from '../../shared/types/types';
import { multiStepInput } from './multiStepInput';

export async function getUserInputCommand(context: ExtensionContext) {
  const result = await window.showInputBox({
		// value: 'abcdef',
		// valueSelection: [2, 4],
		placeHolder: 'Enter component name',
		// validateInput: text => {
		// 	return text === '123' ? 'Not 123!' : null;
		// }
	});
  return result
}
