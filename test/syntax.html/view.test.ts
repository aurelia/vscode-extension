import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax view attribute', () => {

  it(`must tokenize view='' attribute with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<tr repeat.for="r of [\'A\',\'B\',\'A\',\'B\']" as-element="compose" view=\'./template_${r}.html\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 61, 65);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize view="" attribute with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<tr repeat.for="r of [\'A\',\'B\',\'A\',\'B\']" as-element="compose" view="./template_${r}.html">');

    // assert
    let token = getTokenOnCharRange(lineToken, 61, 65);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize view="" attribute with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<tr repeat.for="r of [\'A\',\'B\',\'A\',\'B\']" as-element="compose" view="./template_${r}.html">');

    // assert
    let token = getTokenOnCharRange(lineToken, 61, 65);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize as-element="compose"view="" attribute with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'entity.other.attribute-name.html';

    // act
    let lineToken = tokenizeLine('<tr as-element="compose"view="./template_${r}.html">');

    // assert
    let token = getTokenOnCharRange(lineToken, 24, 28);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize class="(view)" with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.block.any.html';

    // act
    let lineToken = tokenizeLine('<div class="view">');

    // assert
    let token = getTokenOnCharRange(lineToken, 12, 16);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize class='(view)' with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.block.any.html';

    // act
    let lineToken = tokenizeLine('<div class=\'view\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 12, 16);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize some(view)="" with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.inline.any.html';

    // act
    let lineToken = tokenizeLine('<compose someview="" />');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize some(view)='' with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.inline.any.html';

    // act
    let lineToken = tokenizeLine('<compose someview=\'\' />');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (view)some="" with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.inline.any.html';

    // act
    let lineToken = tokenizeLine('<compose viewsome="" />');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (view)some='' with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.inline.any.html';

    // act
    let lineToken = tokenizeLine('<compose viewsome=\'\' />');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize some-view="" with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.inline.any.html';

    // act
    let lineToken = tokenizeLine('<compose some-view="" />');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize some-view='' with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.inline.any.html';

    // act
    let lineToken = tokenizeLine('<compose some-view=\'\' />');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize view-some="" with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.inline.any.html';

    // act
    let lineToken = tokenizeLine('<compose view-some="" />');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize view-some='' with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'meta.tag.inline.any.html';

    // act
    let lineToken = tokenizeLine('<compose view-some=\'\' />');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize (view).ref="foo"> attribute with scope "view.attribute.html.au"', () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<compose view.ref="foo">');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize (view).ref="foo" > attribute with scope "view.attribute.html.au"', () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<compose view.ref="foo" >');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view).ref='foo'> attribute with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<compose view.ref=\'foo\'>');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view).ref='foo' > attribute with scope "view.attribute.html.au"`, () => {

    // arrange
    let scope = 'view.attribute.html.au';

    // act
    let lineToken = tokenizeLine('<compose view.ref=\'foo\' >');

    // assert
    let token = getTokenOnCharRange(lineToken, 9, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
