import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax controller atrribute', () => {

  it('must tokenize controller attribute with scope "attribute.html.au"', () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
