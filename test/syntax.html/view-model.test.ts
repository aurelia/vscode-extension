import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax', () => {

  test('must tokenize (view-model).x attribute with scope "attribute.html.au"', () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 5, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize view-model attribute with scope "view-model.attribute.html.au"', () => {

    // arrange
    let scope = 'view-model.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<compose model.bind="item" view-model="widgets/${item.type}" />');

    // assert
    let token = getTokenOnCharRange(lineToken, 27, 37);
    assert.equal(hasScope(token.scopes, scope), true);

  }); 

  test('must tokenize view-model.(bind) attribute with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 20);
    assert.equal(hasScope(token.scopes, scope), true);

  }); 

  test('must tokenize view-model.(one-way) attribute with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 23);
    assert.equal(hasScope(token.scopes, scope), true);

  }); 

  test('must tokenize view-model.(two-way) attribute with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 23);
    assert.equal(hasScope(token.scopes, scope), true);

  }); 

  test('must tokenize view-model.(one-time) attribute with scope "databinding.html.au"', () => {

    // arrange
    let scope = 'databinding.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 24);
    assert.equal(hasScope(token.scopes, scope), true);

  }); 

});
