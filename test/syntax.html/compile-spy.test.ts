import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax compile-spy attribute', () => {

  it('must tokenize compile-spy attribute with scope "compile-spy.attribute.html.au"', () => {

    // arrange
    let scope = 'compile-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p compile-spy foo="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 14);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize compile-spy="" attribute', () => {

    // arrange
    let scope = 'compile-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p compile-spy="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 14);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize compile-spy-foo="" attribute', () => {

    // arrange
    let scope = 'compile-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p compile-spy-foo="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 18);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-compile-spy="" attribute', () => {

    // arrange
    let scope = 'compile-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p foo-compile-spy="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 18);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-compile-spy="boo" attribute', () => {

    // arrange
    let scope = 'compile-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p foo-compile-spy="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 18);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize compile-spyfoo="boo" attribute', () => {

    // arrange
    let scope = 'compile-spy.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<p compile-spyfoo="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 3, 17);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must tokenize compile-spy attribute', () => {

    // arrange
    let scope = 'compile-spy.attribute.html.au';

    // act
    let template = '<template compile-spy></template>';
    let lineToken = tokenizeLine(template);

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 21);
    assert.isDefined(token);
    assert.isOk(hasScope(token.scopes, scope));

  });  
});
