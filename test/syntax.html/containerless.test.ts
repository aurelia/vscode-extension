import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax containerles attribute', () => {

  it('must tokenize containerless attribute with scope "containerless.attribute.html.au"', async () => {

    // arrange
    const scope = 'containerless.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template containerless foo="boo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 23);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize containerless="" attribute', async () => {

    // arrange
    const scope = 'containerless.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template containerless="">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 23);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize containerless-foo="" attribute', async () => {

    // arrange
    const scope = 'containerless.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template containerless-foo="">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-containerles="" attribute', async () => {

    // arrange
    const scope = 'containerless.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template foo-containerless="">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize foo-containerless="boo" attribute', async () => {

    // arrange
    const scope = 'containerless.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template foo-containerless="boo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must not tokenize containerlessfoo="boo" attribute', async () => {

    // arrange
    const scope = 'containerless.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<template containerlessfoo="boo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 26);
    assert.isDefined(token);
    assert.isNotOk(hasScope(token.scopes, scope));

  });

  it('must tokenize containerless attribute', async () => {

    // arrange
    const scope = 'containerless.attribute.html.au';

    // act
    const template = '<template containerless></template>';
    const lineToken = await tokenizeLine(template);

    // assert
    const token = getTokenOnCharRange(lineToken, 10, 23);
    assert.isDefined(token);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
