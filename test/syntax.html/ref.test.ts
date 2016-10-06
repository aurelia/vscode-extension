import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax ref attribute', () => {

  it('must tokenize any.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div any.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 12);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize view-model.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 19);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize model.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div model.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 11, 14);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize view.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize controller.(ref) attribute with scope "ref.attribute.html.au"', () => {

    // arrange
    let scope = 'ref.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 19);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
