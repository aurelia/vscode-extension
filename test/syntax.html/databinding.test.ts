import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax databinding attributes', () => {

  it(`must tokenize (some).bind="foo" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div some.bind="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 14);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (some).one-way="foo" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div some.one-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (some).two-way="foo" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div some.two-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (some).one-time="foo" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div some.one-time="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (some).from-view="foo" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div some.from-view="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 19);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (some).to-view="foo" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div some.to-view="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(bind)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.bind">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 14);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(bind)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x; x.bind">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(bind)='x'; x" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.bind=\'x\'; x">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 21);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(one-way)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.one-way">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(one-way)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x; x.one-way">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 20);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(one-way)='x'; x" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.one-way=\'x\'; x">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(two-way)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.two-way">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(two-way)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x; x.two-way">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 20);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(two-way)='x; x" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.two-way=\'x\'; x">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(one-time)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.one-time">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(one-time)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x; x.one-time">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 21);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(one-time)='\'x\; x" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.one-time=\'x\'; x">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 25);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(from-view)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.from-view">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 19);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(from-view)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x; x.from-view">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 22);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(from-view)='\'x\; x" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.from-view=\'x\'; x">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 26);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(to-view)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.to-view">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(to-view)" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x; x.to-view">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 20);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(to-view)='\'x\; x" attribute with scope "databinding.attribute.html.au"`, async () => {

    // arrange
    const scope = 'databinding.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="x.to-view=\'x\'; x">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
