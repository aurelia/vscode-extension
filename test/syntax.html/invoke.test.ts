import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax invoke attributes', () => {

  it('must tokenize call attribute with scope "invoke.attribute.html.au"', () => {

    // arrange
    let scope = 'invoke.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div click.call="test()">');

    // assert
    let token = getTokenOnCharRange(lineToken, 11, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize triger attribute with scope "invoke.attribute.html.au"', () => {

    // arrange
    let scope = 'invoke.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div click.trigger="test()">');

    // assert
    let token = getTokenOnCharRange(lineToken, 11, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize attribute body that contains click.trigger keyword', () => {

    // arrange-
    let scope = 'meta.tag.block.any.html';

    // act
    let lineToken = tokenizeLine('<div value.bind="click.trigger">');

    // assert
    let token = getTokenOnCharRange(lineToken, 17, 30);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize invokes in attribute body with scope "invoke.attribute.html.au"', () => {

    // arrange
    let scope = 'meta.tag.inline.any.html';

    // act
    let lineToken = tokenizeLine('<a b="draw.call:animate(data)">');

    // assert
    let token = getTokenOnCharRange(lineToken, 6, 29);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize delegate attribute with scope "invoke.attribute.html.au"', () => {

    // arrange
    let scope = 'invoke.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div click.delegate="test()">');

    // assert
    let token = getTokenOnCharRange(lineToken, 11, 19);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
