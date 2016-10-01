import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax', () => {

  test('must tokenize controller attribute with scope "attribute.html.au"', () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
