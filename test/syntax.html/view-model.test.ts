import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe(`The Aurelia HTML syntax view-model attribute`, () => {

  it(`must tokenize (view-model).bind attribute with scope "attribute.html.au"`, async () => {

    // arrange
    const scope = 'view-model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div view-model.bind="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model).one-way attribute with scope "attribute.html.au"`, async () => {

    // arrange
    const scope = 'view-model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div view-model.one-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model).two-way attribute with scope "attribute.html.au"`, async () => {

    // arrange
    const scope = 'view-model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div view-model.two-way="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model).one-time attribute with scope "attribute.html.au"`, async () => {

    // arrange
    const scope = 'view-model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div view-model.one-time="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model).ref attribute with scope "attribute.html.au"`, async () => {

    // arrange
    const scope = 'view-model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div view-model.ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model)="foo" attribute with scope "view-model.attribute.html.au"`, async () => {

    // arrange
    const scope = 'view-model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<compose model.bind="item" view-model="foo" />');

    // assert
    const token = getTokenOnCharRange(lineToken, 27, 37);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model-foo)="foo" attribute with scope "attribute.html.au"`, async () => {

    // arrange
    const scope = 'view-model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div view-model-foo="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 19);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must tokenize (foo-view-model)="foo" attribute with scope "attribute.html.au"`, async () => {

    // arrange
    const scope = 'view-model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div foo-view-model="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 19);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must tokenize a="(view-model)" attribute with scope "attribute.html.au"`, async () => {

    // arrange
    const scope = 'view-model.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="view-model">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
