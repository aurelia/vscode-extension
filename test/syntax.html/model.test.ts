import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax model attribute', () => {

  test('must tokenize model attribute with scope "model.attribute.html.au"', () => {

    // arrange
    let scope = 'model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div model.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 10);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must not tokenize attribute body that contains model keyword with scope "model.attribute.html.au"', () => {

    // arrange
    let scope = 'meta.tag.block.any.html';

    // act
    let lineToken = tokenizeLine('<div value.bind="model.value">');

    // assert
    let token = getTokenOnCharRange(lineToken, 17, 28);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
