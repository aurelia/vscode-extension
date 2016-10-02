import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax view-model attribute', () => {

  test('must tokenize (view-model).x attribute with scope "attribute.html.au"', () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize view-model attribute with scope "view-model.attribute.html.au"', () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<compose model.bind="item" view-model="widgets/${item.type}" />');

    // assert
    let token = getTokenOnCharRange(lineToken, 27, 37);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
