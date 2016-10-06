import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax view attribute', () => {

  it('must tokenize view attribute with scope "view.attribute.html.au"', () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
