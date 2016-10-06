import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax bindable attribute', function() {

  it('must tokenize bindable attribute with scope "bindable.attribute.html.au"', function() {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template bindable="greeting,name">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 18);
    assert.isOk(hasScope(token.scopes, scope));
  });
});
