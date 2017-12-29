import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax let element', () => {

  it('must tokenize let start element with scope "let.element.html.au"', () => {

    // arrange
    let scope = 'let.element.html.au';

    // act
    let lineToken = tokenizeLine('<let>');

    // assert
    let token = getTokenOnCharRange(lineToken, 1, 4);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize let end element with scope "let.element.html.au"', () => {

    // arrange
    let scope = 'let.element.html.au';

    // act
    let lineToken = tokenizeLine('</let>');

    // assert
    let token = getTokenOnCharRange(lineToken, 2, 5);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
