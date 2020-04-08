import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax show attribute', () => {

  it(`must tokenize (show).bind="foo" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div show.bind="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (show).one-way="foo" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div show.one-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (show).two-way="foo" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div show.two-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (show).one-time="foo" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div show.one-time="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (show)="foo" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div show="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (show-foo)="foo" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div show-foo="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (foo-show)="foo" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div foo-show="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (show-foo).bind="foo" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div show-foo.bind="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (foo-show).bind="foo" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div foo-show.bind="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="show" attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="show">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 12);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a='show' attribute with scope "show.attribute.html.au"`, async () => {

    // arrange
    const scope = 'show.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a=\'show\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 12);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
