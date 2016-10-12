import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe(`The Aurelia HTML syntax view-model attribute`, () => {

  it(`must tokenize (view-model).bind attribute with scope "attribute.html.au"`, () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model).one-way attribute with scope "attribute.html.au"`, () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model).two-way attribute with scope "attribute.html.au"`, () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model).one-time attribute with scope "attribute.html.au"`, () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model).ref attribute with scope "attribute.html.au"`, () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model)="foo" attribute with scope "view-model.attribute.html.au"`, () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<compose model.bind="item" view-model="foo" />');

    // assert
    let token = getTokenOnCharRange(lineToken, 27, 37);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view-model-foo)="foo" attribute with scope "attribute.html.au"`, () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model-foo="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 19);
    assert.isOk(!hasScope(token.scopes, scope));

  });  

  it(`must tokenize (foo-view-model)="foo" attribute with scope "attribute.html.au"`, () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div foo-view-model="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 19);
    assert.isOk(!hasScope(token.scopes, scope));

  }); 

  it(`must tokenize a="(view-model)" attribute with scope "attribute.html.au"`, () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div a="view-model">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });    

});
