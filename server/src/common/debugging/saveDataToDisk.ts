/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as fs from 'fs';

const SAVE_FILE_PATH =
  '/Users/hdn/Desktop/aurelia-vscode-extension/vscode-extension/server/src/common/debugging/debugging-data.json';

export function saveDataToDisk(data: Record<string, any>): void {
  let finalData = {};

  if (fs.existsSync(SAVE_FILE_PATH)) {
    const existingSave = fs.readFileSync(SAVE_FILE_PATH, 'utf-8');
    const asJson = JSON.parse(existingSave || '{}');
    finalData = asJson;
  }

  finalData = {
    ...finalData,
    ...data,
  };
  const asJsonString = JSON.stringify(finalData, null, 4);
  fs.writeFileSync(SAVE_FILE_PATH, asJsonString);
}

export function getSaveData(): Record<string, any> {
  if (fs.existsSync(SAVE_FILE_PATH)) {
    const existingSave = fs.readFileSync(SAVE_FILE_PATH, 'utf-8');
    const asJson = JSON.parse(existingSave);
    return asJson;
  }

  throw new Error('No Save data');
}
