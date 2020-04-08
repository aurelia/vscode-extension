import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax controller atrribute', () => {

  it(`must tokenize (controller).ref="foo" attribute with scope "controller.attribute.html.au"`, async () => {

    // arrange
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div controller.ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (controller)="foo" attribute with scope "controller.attribute.html.au"`, async () => {

    // arrange
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div controller="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller).bind="foo" attribute with scope controller.attribute.html.au"`, async () => {

    // arrangecontroller.attribute.html.au
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div controller.bind="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller).one-time="foo" attribute with scope "controller.attribute.html.au"`, async () => {

    // arrange
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div controller.one-time="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller).one-way="foo" attribute with scope "controller.attribute.html.au"`, async () => {

    // arrange
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div controller.one-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller).two-way="foo" attribute with scope "controller.attribute.html.au"`, async () => {

    // arrange
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div controller.two-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (controller)-foo="foo" attribute with scope "controller.attribute.html.au"`, async () => {

    // arrange
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div controller-foo="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 19);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize foo-(controller)="foo" attribute with scope "controller.attribute.html.au"`, async () => {

    // arrange
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div foo-controller="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 19);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="(controller)" attribute with scope "controller.attribute.html.au"`, async () => {

    // arrange
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="controller">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a='(controller)' attribute with scope "controller.attribute.html.au"`, async () => {

    // arrange
    const scope = 'controller.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a=\'controller\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
