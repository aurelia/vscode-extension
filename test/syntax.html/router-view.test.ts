import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax router-view element', () => {

  it('must tokenize router-view start element with scope "router-view.element.html.au"', () => {

    // arrange
    let scope = 'router-view.element.html.au';

    // act
    let lineToken = tokenizeLine('<router-view>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 12);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize router-view end element with scope "router-view.element.html.au"', () => {

    // arrange
    let scope = 'router-view.element.html.au';

    // act
    let lineToken = tokenizeLine('</router-view>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
