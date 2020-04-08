import { assert } from 'chai';
import { getTokenOnCharRange, hasScope, tokenizeLine } from './test.utils';

describe('The Aurelia HTML syntax view attribute', () => {

  it(`must tokenize view='' attribute with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'view.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<tr repeat.for="r of [\'A\',\'B\',\'A\',\'B\']" as-element="compose" view=\'./template_${r}.html\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 61, 65);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize view="" attribute with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'view.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<tr repeat.for="r of [\'A\',\'B\',\'A\',\'B\']" as-element="compose" view="./template_${r}.html">');

    // assert
    const token = getTokenOnCharRange(lineToken, 61, 65);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize view="" attribute with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'view.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<tr repeat.for="r of [\'A\',\'B\',\'A\',\'B\']" as-element="compose" view="./template_${r}.html">');

    // assert
    const token = getTokenOnCharRange(lineToken, 61, 65);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize as-element="compose"view="" attribute with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'entity.other.attribute-name.html';

    // act
    const lineToken = await tokenizeLine('<tr as-element="compose"view="./template_${r}.html">');

    // assert
    const token = getTokenOnCharRange(lineToken, 24, 28);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize class="(view)" with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.block.any.html';

    // act
    const lineToken = await tokenizeLine('<div class="view">');

    // assert
    const token = getTokenOnCharRange(lineToken, 12, 16);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize class='(view)' with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.block.any.html';

    // act
    const lineToken = await tokenizeLine('<div class=\'view\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 12, 16);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize some(view)="" with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<compose someview="" />');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize some(view)='' with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<compose someview=\'\' />');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (view)some="" with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<compose viewsome="" />');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize (view)some='' with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<compose viewsome=\'\' />');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 17);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize some-view="" with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<compose some-view="" />');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize some-view='' with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<compose some-view=\'\' />');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize view-some="" with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<compose view-some="" />');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must not tokenize view-some='' with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'meta.tag.inline.any.html';

    // act
    const lineToken = await tokenizeLine('<compose view-some=\'\' />');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 18);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize (view).ref="foo"> attribute with scope "view.attribute.html.au"', async () => {

    // arrange
    const scope = 'view.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<compose view.ref="foo">');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it('must tokenize (view).ref="foo" > attribute with scope "view.attribute.html.au"', async () => {

    // arrange
    const scope = 'view.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<compose view.ref="foo" >');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view).ref='foo'> attribute with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'view.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<compose view.ref=\'foo\'>');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

  it(`must tokenize (view).ref='foo' > attribute with scope "view.attribute.html.au"`, async () => {

    // arrange
    const scope = 'view.attribute.html.au';

    // act
    const lineToken = await tokenizeLine('<compose view.ref=\'foo\' >');

    // assert
    const token = getTokenOnCharRange(lineToken, 9, 13);
    assert.isOk(hasScope(token.scopes, scope));

  });

});
