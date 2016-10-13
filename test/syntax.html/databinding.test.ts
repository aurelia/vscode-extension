import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine, writeOut } from './test.utils';

describe('The Aurelia HTML syntax databinding attributes', () => {

  it(`must tokenize (some).bind="foo" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div some.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 14);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (some).one-way="foo" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div some.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (some).two-way="foo" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div some.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (some).one-time="foo" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div some.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(bind)" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x.bind">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 14);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(bind)" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x; x.bind">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });  

  it(`must not tokenize a="x.(bind)='x'; x" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x.bind=\'x\'; x">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 21);
    assert.isOk(!hasScope(token.scopes, scope));

  });  

  it(`must not tokenize a="x.(one-way)" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x.one-way">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(one-way)" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x; x.one-way">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 20);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(one-way)='x'; x" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x.one-way=\'x\'; x">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(two-way)" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x.two-way">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(two-way)" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x; x.two-way">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 20);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(two-way)='x; x" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x.two-way=\'x\'; x">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(one-time)" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x.one-time">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x; x.(one-time)" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x; x.one-time">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 21);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="x.(one-time)='\'x\; x" attribute with scope "databinding.attribute.html.au"`, () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="x.one-time=\'x\'; x">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 25);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
