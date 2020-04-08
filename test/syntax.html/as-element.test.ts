import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax as-element attribute', async () => {

  it(`must tokenize (as-element)="item-template" attribute with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template as-element="item-template">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 20);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (as-element)='item-template' attribute with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template as-element=\'item-template\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 20);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (as-element) attribute with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template as-element>');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 20);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize class="as-element" attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div class="as-element">');

    // assert
    const token = getTokenOnCharRange(lineToken, 12, 22);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize class='as-element' attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div class=\'as-element\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 12, 22);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (someas-element)="item-template" attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template someas-element="item-template">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (someas-element)='item-template' attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template someas-element=\'item-template\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (as-elementsome)="item-template" attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template as-elementsome="item-template">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (as-elementsome)='item-template' attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template as-elementsome=\'item-template\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (as-element-some)="item-template" attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template as-element-some="item-template">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 25);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (as-element-some)='item-template' attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template as-element-some=\'item-template\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 25);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (some-as-element)="item-template" attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template some-as-element="item-template">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 25);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize (some-as-element)='item-template' attribute body with scope "as-element.attribute.html.au"`, async () => {

    // arrange
    const scope = 'as-element.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template some-as-element=\'item-template\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 25);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
