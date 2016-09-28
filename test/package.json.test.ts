import * as assert from 'assert';

suite('The package.json', () => {

  test('must contain an activation events onCommand au new', () => {
    // arrange
    let packageConfig = require('./../../package.json');

    // act
    let results = packageConfig.activationEvents.filter(
      evt => evt === 'onCommand:extension.auNew');

    // assert
    assert.equal(results.length, 1);
  });

  test('must contain an activation events onCommand au generate', () => {
    // arrange
    let packageConfig = require('./../../package.json');

    // act
    let results = packageConfig.activationEvents.filter(
      evt => evt === 'onCommand:extension.auGenerate');

    // assert
    assert.equal(results.length, 1);
  });

  test('must contain an activation events onCommand au test', () => {
    // arrange
    let packageConfig = require('./../../package.json');

    // act
    let results = packageConfig.activationEvents.filter(
      evt => evt === 'onCommand:extension.auTest');

    // assert
    assert.equal(results.length, 1);
  });

  test('must contain an activation events onCommand au build', () => {
    // arrange
    let packageConfig = require('./../../package.json');

    // act
    let results = packageConfig.activationEvents.filter(
      evt => evt === 'onCommand:extension.auBuild');

    // assert
    assert.equal(results.length, 1);
  });

  test('must contain an activation events onLanguage html', () => {
    // arrange
    let packageConfig = require('./../../package.json');

    // act
    let results = packageConfig.activationEvents.filter(
      evt => evt === 'onLanguage:html');

    // assert
    assert.equal(results.length, 1);
  });

  test('must contain an contribution command for au new', () => {
    // arrange
    let packageConfig = require('./../../package.json');

    // act
    let results = packageConfig.contributes.commands.filter(
      cmd => cmd.command === 'extension.auNew');

    // assert
    assert.equal(results.length, 1);
  });

  test('must contain an contribution command for au generate', () => {
    // arrange
    let packageConfig = require('./../../package.json');

    // act
    let results = packageConfig.contributes.commands.filter(
      cmd => cmd.command === 'extension.auGenerate');

    // assert
    assert.equal(results.length, 1);
  });

  test('must contain an contribution command for au test', () => {
    // arrange
    let packageConfig = require('./../../package.json');

    // act
    let results = packageConfig.contributes.commands.filter(
      cmd => cmd.command === 'extension.auTest');

    // assert
    assert.equal(results.length, 1);
  });

  test('must contain an contribution command for au build', () => {
    // arrange
    let packageConfig = require('./../../package.json');

    // act
    let results = packageConfig.contributes.commands.filter(
      cmd => cmd.command === 'extension.auBuild');

    // assert
    assert.equal(results.length, 1);
  });
});
