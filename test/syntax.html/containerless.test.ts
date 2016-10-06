import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax containerles attribute', () => {

  it('must tokenize containerless attribute with scope "containerless.attribute.html.au"', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template containerless foo="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 23);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize containerless="" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template containerless="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 23);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize containerless-foo="" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template containerless-foo="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-containerles="" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template foo-containerless="">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-containerless="boo" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template foo-containerless="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize containerlessfoo="boo" attribute', () => {

    // arrange
    let scope = 'containerless.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template containerlessfoo="boo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 26);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });
});
