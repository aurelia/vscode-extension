import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe(`The Aurelia HTML syntax with attribute`, () => {

  it(`must tokenize (with).bind attribute with scope "with.attribute.html.au"`, async () => {

    // arrange
    const scope = 'with.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div with.bind="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (with).one-way attribute with scope "with.attribute.html.au"`, async () => {

    // arrange
    const scope = 'with.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div with.one-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (with).two-way attribute with scope "with.attribute.html.au"`, async () => {

    // arrange
    const scope = 'with.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div with.two-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (with).one-time attribute with scope "with.attribute.html.au"`, async () => {

    // arrange
    const scope = 'with.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div with.one-time="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (with)="foo" attribute with scope "with.attribute.html.au"`, async () => {

    // arrange
    const scope = 'with.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<compose model.bind="item" with="foo" />');

    // assert
    const token = getTokenOnCharRange(lineToken, 27, 31);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must tokenize (with-foo)="foo" attribute with scope "with.attribute.html.au"`, async () => {

    // arrange
    const scope = 'with.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div with-foo="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must tokenize (foo-with)="foo" attribute with scope "with.attribute.html.au"`, async () => {

    // arrange
    const scope = 'with.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div foo-with="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must tokenize a="(with)" attribute with scope "with.attribute.html.au"`, async () => {

    // arrange
    const scope = 'with.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="with">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 12);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
