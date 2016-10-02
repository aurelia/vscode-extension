import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax bindable attribute', () => {

  test('must tokenize bindable attribute with scope "bindable.attribute.html.au"', () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template bindable="greeting,name">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 18);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
