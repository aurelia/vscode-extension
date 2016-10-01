import * as assert from 'assert';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

suite('The Aurelia HTML syntax', () => {

  test('must tokenize router-view start element with scope "router-view.html.au"', () => {

    // arrange
    let scope = 'router-view.html.au';

    // act
    let lineToken = tokenizeLine('<router-view>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 12);
    assert.equal(hasScope(token.scopes, scope), true);

  });

  test('must tokenize router-view end element with scope "router-view.html.au"', () => {

    // arrange
    let scope = 'router-view.html.au';

    // act
    let lineToken = tokenizeLine('</router-view>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 13);
    assert.equal(hasScope(token.scopes, scope), true);

  });

});
