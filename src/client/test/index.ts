/* eslint-disable no-console */
// Copied from https://github.com/microsoft/vscode-extension-samples/blob/master/lsp-sample/client/src/test/index.ts

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Mocha from 'mocha';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as glob from 'glob';

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'bdd',
  });
  mocha.useColors(true);
  mocha.timeout(100000);

  // eslint-disable-next-line no-undef
  const testsRoot = __dirname;

  return new Promise((resolve, reject) => {
    glob('**.test.js', { cwd: testsRoot }, (err, files) => {
      if (err !== null) {
        // eslint-disable-next-line no-undef
        console.error("Got error from glob", err);
        return reject(err);
      }

      // Add files to the test suite
      files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // Run the mocha test
        mocha.run(failures => {
          if (failures > 0) {
            reject(new Error(`${failures} tests failed.`));
          } else {
            resolve();
          }
        });
      } catch (mochaErr) {
        // eslint-disable-next-line no-undef
        console.error(mochaErr);
        reject(mochaErr);
      }
    });
  });
}
