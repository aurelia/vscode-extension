import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax compose element', () => {

  it('must tokenize compose start element with scope "compose.element.html.au"', async () => {

    // arrange
    const scope = 'compose.element.html.au';

    // act
    const lineToken = await tokenizeLine('<compose>');

    // assert
    const token = getTokenOnCharRange(lineToken, 1, 8);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize compose end element with scope "compose.element.html.au"', async () => {

    // arrange
    const scope = 'compose.element.html.au';

    // act
    const lineToken = await tokenizeLine('</compose>');

    // assert
    const token = getTokenOnCharRange(lineToken, 2, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
