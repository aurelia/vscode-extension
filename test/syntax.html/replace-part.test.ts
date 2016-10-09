import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine, writeOut } from './test.utils';

describe('The Aurelia HTML syntax replace-part attribute', () => {

  it(`must tokenize (replace-part)="item-template" attribute with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replace-part.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template replace-part="item-template">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 22);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (replace-part)='item-template' attribute with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replace-part.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template replace-part=\'item-template\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 22);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (replace-part) attribute with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replace-part.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template replace-part>');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 22);
    assert.isOk(!hasScope(token.scopes, scope));

  });

  it(`must not tokenize class="replace-part" attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div class="replace-part">');

    // assert
    let token = getTokenOnCharRange(lineToken, 12, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });  

  it(`must not tokenize class='replace-part' attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<div class=\'replace-part\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 12, 24);
    assert.isOk(!hasScope(token.scopes, scope));

  });  

  it(`must not tokenize (somereplace-part)="item-template" attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template somereplace-part="item-template">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 26);
    assert.isOk(!hasScope(token.scopes, scope));

  }); 

  it(`must not tokenize (somereplace-part)='item-template' attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template somereplace-part=\'item-template\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 26);
    assert.isOk(!hasScope(token.scopes, scope));

  }); 

  it(`must not tokenize (replace-partsome)="item-template" attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template replace-partsome="item-template">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 26);
    assert.isOk(!hasScope(token.scopes, scope));

  }); 

  it(`must not tokenize (replace-partsome)='item-template' attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template replace-partsome=\'item-template\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 26);
    assert.isOk(!hasScope(token.scopes, scope));

  }); 

  it(`must not tokenize (replace-part-some)="item-template" attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template replace-part-some="item-template">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isOk(!hasScope(token.scopes, scope));

  }); 

  it(`must not tokenize (replace-part-some)='item-template' attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template replace-part-some=\'item-template\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isOk(!hasScope(token.scopes, scope));

  }); 

  it(`must not tokenize (some-replace-part)="item-template" attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template some-replace-part="item-template">');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isOk(!hasScope(token.scopes, scope));

  }); 

  it(`must not tokenize (some-replace-part)='item-template' attribute body with scope "replace-part.attribute.html.au"`, () => {

    // arrange
    let scope = 'replaceable.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<template some-replace-part=\'item-template\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 10, 27);
    assert.isOk(!hasScope(token.scopes, scope));

  });
 
});
