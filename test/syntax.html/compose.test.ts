import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax compose element', () => {

  test('must tokenize compose start element with scope "compose.element.html.au"', () => {

    // arrange
    let scope = 'compose.element.html.au';

    // act
    let lineToken = tokenizeLine('<compose>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 8);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize compose end element with scope "compose.element.html.au"', () => {

    // arrange
    let scope = 'compose.element.html.au';

    // act
    let lineToken = tokenizeLine('</compose>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 9);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
