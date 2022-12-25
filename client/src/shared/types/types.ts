import { QuickPickItem } from 'vscode';

export interface GetComponentState {
  title: string;
  step: number;
  totalSteps: number;
  resourceGroup: QuickPickItem | string;
  name: string;
  runtime: QuickPickItem;
}
