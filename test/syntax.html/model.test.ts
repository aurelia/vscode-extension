import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax model attribute', () => {

  it('must tokenize model attribute with scope "model.attribute.html.au"', async () => {

    // arrange
    const scope = 'model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div model.bind="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 10);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize attribute body that contains model keyword with scope "model.attribute.html.au"', async () => {

    // arrange
    const scope = 'meta.tag.block.any.html';

    // act
    const lineToken = await tokenizeLine('<div value.bind="model.value">');

    // assert
    const token = getTokenOnCharRange(lineToken, 17, 28);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
