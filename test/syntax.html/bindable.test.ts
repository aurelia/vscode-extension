import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe(`The Aurelia HTML syntax bindable attribute`, () => {

  it(`must tokenize (bindable)="greeting,name" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template bindable="greeting,name">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 18);
    assert.isOk(hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).bind="foo" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div bindable.bind="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).one-way="foo" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div bindable.one-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).two-way="foo" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div bindable.two-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).one-time="foo" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div bindable.one-time="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).foo="foo" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div bindable.foo="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable).ref="foo" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div bindable.ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 13);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (foo-bindable)="foo" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div foo-bindable="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 17);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize (bindable-foo)="foo" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div bindable-foo="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 17);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize a="(bindable)" attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="bindable">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 16);
    assert.isOk(!hasScope(token.scopes, scope));
  });

  it(`must not tokenize a='(bindable)' attribute with scope "bindable.attribute.html.au"`, async () => {

    // arrange
    const scope = 'bindable.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a=\'bindable\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 16);
    assert.isOk(!hasScope(token.scopes, scope));
  });

});
