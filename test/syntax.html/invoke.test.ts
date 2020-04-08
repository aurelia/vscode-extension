import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax invoke attributes', () => {

  it('must tokenize call attribute with scope "invoke.attribute.html.au"', async () => {

    // arrange
    const scope = 'invoke.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div click.call="test()">');

    // assert
    const token = getTokenOnCharRange(lineToken, 11, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize triger attribute with scope "invoke.attribute.html.au"', async () => {

    // arrange
    const scope = 'invoke.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div click.trigger="test()">');

    // assert
    const token = getTokenOnCharRange(lineToken, 11, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize delegate attribute with scope "invoke.attribute.html.au"', async () => {

    // arrange
    const scope = 'invoke.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div click.delegate="test()">');

    // assert
    const token = getTokenOnCharRange(lineToken, 11, 19);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize capture attribute with scope "invoke.attribute.html.au"', async () => {

    // arrange
    const scope = 'invoke.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div click.capture="test()">');

    // assert
    const token = getTokenOnCharRange(lineToken, 11, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize attribute body that contains click.trigger keyword', async () => {

    // arrange-
    const scope = 'meta.tag.block.any.html';

    // act
    const lineToken = await tokenizeLine('<div value.bind="click.trigger">');

    // assert
    const token = getTokenOnCharRange(lineToken, 17, 30);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize invokes in attribute body with scope "invoke.attribute.html.au"', async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<a b="draw.call:animate(data)">');

    // assert
    const token = getTokenOnCharRange(lineToken, 6, 29);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
