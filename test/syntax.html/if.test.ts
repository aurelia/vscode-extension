import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe(`The Aurelia HTML syntax if attribute`, () => {

  it(`must tokenize (if).bind="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 7);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (naive-if).bind="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div naive-if.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (if).one-way="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 7);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (naive-if).one-way="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div naive-if.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (if).two-way="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 7);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (naive-if).two-way="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div naive-if.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (if).one-way="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 7);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (naive-if).one-way="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div naive-if.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (if)="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 7);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (naive-if)="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div naive-if="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (if-foo)="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if-foo="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 11);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (naive-if-foo)="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div naive-if-foo="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (foo-if)="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div foo-if="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 11);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (foo-naive-if)="foo" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div foo-naive-if="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="if" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="if">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 10);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="naive-if" attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="naive-if">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 16);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a='if' attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a=\'if\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 10);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a='naive-if' attribute with scope "if.attribute.html.au"`, () => {

    // arrange
    let scope = 'if.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a=\'naive-if\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 16);
    assert.isOk(!hasScope(token.scopes, scope));

  });  

});
