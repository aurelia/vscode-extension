import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax ref attribute', () => {

  it('must tokenize any.(ref) attribute with scope "ref.attribute.html.au"', async () => {

    // arrange
    const scope = 'ref.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div any.ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 12);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize view-model.(ref) attribute with scope "ref.attribute.html.au"', async () => {

    // arrange
    const scope = 'ref.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div view-model.ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 16, 19);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize model.(ref) attribute with scope "ref.attribute.html.au"', async () => {

    // arrange
    const scope = 'ref.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div model.ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 11, 14);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize view.(ref) attribute with scope "ref.attribute.html.au"', async () => {

    // arrange
    const scope = 'ref.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div view.ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize controller.(ref) attribute with scope "ref.attribute.html.au"', async () => {

    // arrange
    const scope = 'ref.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div controller.ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 16, 19);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize ref attribute with scope "ref.attribute.html.au"', async () => {

    // arrange
    const scope = 'ref.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 8);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize ref part in body of other attribute', async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<meta name="referrer" content="origin-when-crossorigin">');

    // assert
    const token = getTokenOnCharRange(lineToken, 12, 20);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize client.ref* part in body of other attribute', async () => {

    // arrange
    const scope = 'meta.tag.block.any.html';

    // act
    const lineToken = await tokenizeLine('<div data-reference-id="client.referenceId">');

    // assert
    const token = getTokenOnCharRange(lineToken, 24, 42);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
