import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax ref attribute', () => {

  test('must tokenize any.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div any.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 12);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize view-model.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 19);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize model.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div model.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 11, 14);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize view.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 13);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize controller.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 19);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
