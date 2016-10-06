import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax show attribute', () => {

  it('must tokenize show attribute with scope "show.attribute.html.au"', () => {

    // arrange
    let scope = 'show.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div show.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
