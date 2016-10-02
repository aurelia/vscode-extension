import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax invoke attributes', () => {

  test('must tokenize call attribute with scope "invoke.attribute.html.au"', () => {

    // arrange
    let scope = 'invoke.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div click.call="test()">');

    // assert
    let token = getTokenOnCharRange(lineToken, 11, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize triger attribute with scope "invoke.attribute.html.au"', () => {

    // arrange
    let scope = 'invoke.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div click.trigger="test()">');

    // assert
    let token = getTokenOnCharRange(lineToken, 11, 18);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize delegate attribute with scope "invoke.attribute.html.au"', () => {

    // arrange
    let scope = 'invoke.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div click.delegate="test()">');

    // assert
    let token = getTokenOnCharRange(lineToken, 11, 19);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
