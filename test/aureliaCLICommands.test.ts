import * as assert from 'assert';
import using from './test-util';
import { commands } from 'vscode';
import AureliaCliCommands from '../src/aureliaCLICommands';

let sut = AureliaCliCommands;

suite('The Aurelia CLI Commands', () => {

  test('must register command au new', () => {

    // arrange
    let outputChannel = undefined;

    // act
    using(sut.registerCommands(outputChannel), async () => {

      // assert
      let result = (await commands.getCommands(true)).filter(x => x === 'extension.auNew');
      assert.equal(result.length, 1);
    });
  });

  test('must register command au generate', () => {

    // arrange
    let outputChannel = undefined;

    // act
    using(sut.registerCommands(outputChannel), async () => {

      // assert
      let result = (await commands.getCommands(true)).filter(x => x === 'extension.auGenerate');
      assert.equal(result.length, 1);
    });
  });

  test('must register command au test', () => {

    // arrange
    let outputChannel = undefined;

    // act
    using(sut.registerCommands(outputChannel), async () => {

      // assert
      let result = (await commands.getCommands(true)).filter(x => x === 'extension.auTest');
      assert.equal(result.length, 1);
    });
  });

  test('must register command au build', () => {

    // arrange
    let outputChannel = undefined;

    // act
    using(sut.registerCommands(outputChannel), async () => {

      // assert
      let result = (await commands.getCommands(true)).filter(x => x === 'extension.auBuild');
      assert.equal(result.length, 1);
    });
  });
});
