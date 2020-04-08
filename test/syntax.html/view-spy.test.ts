import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax view-spy attribute', () => {

  it('must tokenize view-spy attribute with scope "view-spy.attribute.html.au"', async () => {

    // arrange
    const scope = 'view-spy.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<p view-spy foo="boo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 3, 11);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize view-spy="" attribute', async () => {

    // arrange
    const scope = 'view-spy.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<p view-spy="">');

    // assert
    const token = getTokenOnCharRange(lineToken, 3, 11);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize view-spy-foo="" attribute', async () => {

    // arrange
    const scope = 'view-spy.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<p view-spy-foo="">');

    // assert
    const token = getTokenOnCharRange(lineToken, 3, 15);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-containerles="" attribute', async () => {

    // arrange
    const scope = 'view-spy.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<p foo-view-spy="">');

    // assert
    const token = getTokenOnCharRange(lineToken, 3, 15);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-view-spy="boo" attribute', async () => {

    // arrange
    const scope = 'view-spy.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<p foo-view-spy="boo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 3, 15);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize view-spyfoo="boo" attribute', async () => {

    // arrange
    const scope = 'view-spy.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<p view-spyfoo="boo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 3, 14);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must tokenize compile-spy attribute', async () => {

    // arrange
    const scope = 'view-spy.attribute.html.au';

    // act
    const template = '<template view-spy></template>';
    const lineToken = await tokenizeLine(template);

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 18);
    assert.isDefined(token);
    assert.isOk(hasScope(token.scopes, scope));

  });
});
