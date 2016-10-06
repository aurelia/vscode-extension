import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax if attribute', () => {

  it('must tokenize if attribute with scope "if.attribute.html.au"', () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 7);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize naive-if attribute with scope "if.attribute.html.au"', () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div naive-if.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
