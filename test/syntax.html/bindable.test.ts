import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe(`The Aurelia HTML syntax bindable attribute`, function() {

  it(`must tokenize (bindable)="greeting,name" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template bindable="greeting,name">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 18);
    assert.isOk(hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).bind="foo" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div bindable.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).one-way="foo" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div bindable.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).two-way="foo" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div bindable.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).one-time="foo" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div bindable.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).foo="foo" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div bindable.foo="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).ref="foo" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div bindable.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (foo-bindable)="foo" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div foo-bindable="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 17);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable-foo)="foo" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div bindable-foo="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 17);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize a="(bindable)" attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="bindable">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 16);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize a='(bindable)' attribute with scope "bindable.attribute.html.au"`, () => {

    // arrange
    let scope = 'bindable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a=\'bindable\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 16);
    assert.isOk(!hasScope(token.scopes, scope));
  });

});
