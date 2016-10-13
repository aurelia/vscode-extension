import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax controller atrribute', () => {

  it(`must tokenize (controller).ref="foo" attribute with scope "controller.attribute.html.au"`, () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (controller)="foo" attribute with scope "controller.attribute.html.au"`, () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller).bind="foo" attribute with scope controller.attribute.html.au"`, () => {

    // arrangecontroller.attribute.html.au
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller).one-time="foo" attribute with scope "controller.attribute.html.au"`, () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller).one-way="foo" attribute with scope "controller.attribute.html.au"`, () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller).two-way="foo" attribute with scope "controller.attribute.html.au"`, () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller)-foo="foo" attribute with scope "controller.attribute.html.au"`, () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div controller-foo="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 19);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize foo-(controller)="foo" attribute with scope "controller.attribute.html.au"`, () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div foo-controller="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 19);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="(controller)" attribute with scope "controller.attribute.html.au"`, () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="controller">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a='(controller)' attribute with scope "controller.attribute.html.au"`, () => {

    // arrange
    let scope = 'controller.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a=\'controller\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
