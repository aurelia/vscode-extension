import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax compose element', () => {

  it('must tokenize compose start element with scope "compose.element.html.au"', () => {

    // arrange
    let scope = 'compose.element.html.au';

    // act
    let lineToken = tokenizeLine('<compose>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 8);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize compose end element with scope "compose.element.html.au"', () => {

    // arrange
    let scope = 'compose.element.html.au';

    // act
    let lineToken = tokenizeLine('</compose>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 9);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
