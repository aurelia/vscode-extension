import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe(`The Aurelia HTML syntax repeat.for attribute`, () => {

  it(`must tokenize (repeat).for attribute with scope "repeat.attribute.html.au"`, async () => {

    // arrange
    const scope = 'repeat.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div repeat.for="foo of foos">');

    // assert
    const token = getTokenOnCharRange(lineToken, 5, 11);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize repeat.(for) attribute with scope "for.attribute.html.au"`, async () => {

    // arrange
    const scope = 'for.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div repeat.for="foo of foos">');

    // assert
    const token = getTokenOnCharRange(lineToken, 12, 15);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize repeat.(for) attribute with scope "for.attribute.html.au"`, async () => {

    // arrange
    const scope = 'for.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="repeat.for">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a="(repeat.for)" attribute with scope "for.attribute.html.au"`, async () => {

    // arrange
    const scope = 'for.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a="repeat.for">');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize a='(repeat.for)' attribute with scope "for.attribute.html.au"`, async () => {

    // arrange
    const scope = 'for.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<div a=\'repeat.for\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 8, 18);
    assert.isOk(!hasScope(token.scopes, scope));

  });

});
