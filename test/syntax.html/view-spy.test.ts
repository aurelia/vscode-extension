import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax view-spy attribute', () => {

  it('must tokenize view-spy attribute with scope "view-spy.attribute.html.au"', () => {

    // arrange
    let scope = 'view-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p view-spy foo="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 11);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize view-spy="" attribute', () => {

    // arrange
    let scope = 'view-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p view-spy="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 11);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize view-spy-foo="" attribute', () => {

    // arrange
    let scope = 'view-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p view-spy-foo="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 15);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-containerles="" attribute', () => {

    // arrange
    let scope = 'view-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p foo-view-spy="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 15);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-view-spy="boo" attribute', () => {

    // arrange
    let scope = 'view-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p foo-view-spy="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 15);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize view-spyfoo="boo" attribute', () => {

    // arrange
    let scope = 'view-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p view-spyfoo="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 14);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must tokenize compile-spy attribute', () => {

    // arrange
    let scope = 'view-spy.attribute.html.au';

    // act
    let template = '<template view-spy></template>';
    let lineToken = tokenizeLine(template);

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 18);
    assert.isDefined(token);
    assert.isOk(hasScope(token.scopes, scope));

  });    
});
