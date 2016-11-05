import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax route-href attribute', () => {

  it(`must tokenize (route-href).bind="foo" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a route-href.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (route-href).one-way="foo" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a route-href.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (route-href).two-way="foo" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a route-href.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (route-href).one-time="foo" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a route-href.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (route-href)="foo" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a route-href="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (route-href-foo)="foo" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a route-href-foo="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (foo-route-href)="foo" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a foo-route-href="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (route-href-foo).bind="foo" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a route-href-foo.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (foo-route-href).bind="foo" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a foo-route-href.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 17);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="route-href" attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a a="route-href">');

    // assert
    let token = getTokenOnCharRange(lineToken, 6, 16);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a='route-href' attribute with scope "route-href.attribute.html.au"`, () => {

    // arrange
    let scope = 'route-href.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<a a=\'route-href\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 6, 16);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
