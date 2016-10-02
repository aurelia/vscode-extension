import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax databinding attributes', () => {

 test('must tokenize show.bind with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div show.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 14);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize show.one-way with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div show.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 17);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize show.two-way with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div show.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 17);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize show.one-time with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div show.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 18);
    assert.equal(hasScope(token.scopes, scope), true);

  });

 test('must tokenize if.bind with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 12);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize if.ony-way with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize if.two-way with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 15);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize if.one-time with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div if.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 8, 16);
    assert.equal(hasScope(token.scopes, scope), true);

  });    

  test('must tokenize view-model.(bind) attribute with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.bind="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 20);
    assert.equal(hasScope(token.scopes, scope), true);

  }); 

  test('must tokenize view-model.(one-way) attribute with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.one-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 23);
    assert.equal(hasScope(token.scopes, scope), true);

  }); 

  test('must tokenize view-model.(two-way) attribute with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.two-way="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 23);
    assert.equal(hasScope(token.scopes, scope), true);

  }); 

  test('must tokenize view-model.(one-time) attribute with scope "databinding.attribute.html.au"', () => {

    // arrange
    let scope = 'databinding.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div view-model.one-time="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 16, 24);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
