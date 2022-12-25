import { window, commands, ExtensionContext } from 'vscode';
import { CREATE_COMPONEN_TEXT } from '../../shared/constants';
import { GetComponentState } from '../../shared/types/types';
import { multiStepInput } from './multiStepInput';

export function getUserInputCommand(context: ExtensionContext) {
  // return commands.registerCommand('get-component-name', async () => {
  const outsideState = {};
  const options: {
    [key: string]: (context: ExtensionContext) => Promise<void>;
  } = {
    [CREATE_COMPONEN_TEXT]: multiStepInput(
      outsideState,
      (state: GetComponentState) => {
        /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: userInput.ts ~ line 16 ~ state.name', state.name)
      }
    ),
  };
  const quickPick = window.createQuickPick();
  quickPick.items = Object.keys(options).map((label) => ({ label }));
  quickPick.onDidChangeSelection((selection) => {
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: userInput.ts ~ line 16 ~ selection', selection)
    if (selection[0]) {
      options[selection[0].label](context).catch(console.error);
    }
  });
  quickPick.onDidHide(() => {
    /* prettier-ignore */ console.log('>>>> _ >>>> ~ file: userInput.ts ~ line 23 ~ outsideState', outsideState)
    quickPick.dispose();
  });
  quickPick.show();
  // });
}
