import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax containerles attribute', () => {

  test('must tokenize containerless attribute with scope "containerless.attribute.html.au"', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template containerless foo="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 23);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must not tokenize containerless="" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template containerless="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 23);
    assert.notEqual(token, null);
    assert.equal(hasScope(token.scopes, scope), false);

  });

  test('must not tokenize containerless-foo="" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template containerless-foo="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.notEqual(token, null);
    assert.equal(hasScope(token.scopes, scope), false);

  });

  test('must not tokenize foo-containerles="" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template foo-containerless="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.notEqual(token, null);
    assert.equal(hasScope(token.scopes, scope), false);

  });

  test('must not tokenize foo-containerless="boo" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template foo-containerless="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.notEqual(token, null);
    assert.equal(hasScope(token.scopes, scope), false);

  });

  test('must not tokenize containerlessfoo="boo" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template containerlessfoo="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 26);
    assert.notEqual(token, null);
    assert.equal(hasScope(token.scopes, scope), false);

  });
});
