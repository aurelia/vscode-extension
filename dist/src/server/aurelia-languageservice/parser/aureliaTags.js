"use strict";
const models_1 = require('./models');
exports.AURELIA_TAGS = {
    'require': new models_1.HTMLTagSpecification(`"import" or "require" various resources into a view. Equivalent of the ES 2015 "import" syntax`, [
        new models_1.HTMLAttributeSpecification('from'),
        new models_1.HTMLAttributeSpecification('as')]),
    'router-view': new models_1.HTMLTagSpecification(`Placeholder for the router content`, [
        new models_1.HTMLAttributeSpecification('name'),
        new models_1.HTMLAttributeSpecification('layout-view'),
        new models_1.HTMLAttributeSpecification('layout-view-model'),
        new models_1.HTMLAttributeSpecification('layout-model')]),
    'compose': new models_1.HTMLTagSpecification(`Composes the view in the current position`, [
        new models_1.HTMLAttributeSpecification('view')]),
    'slot': new models_1.HTMLTagSpecification(`Shadow DOM slot element, Aurelia will project the element's content in to the <slot></slot> element.`, [
        new models_1.HTMLAttributeSpecification('name'),
        new models_1.HTMLAttributeSpecification('slot')])
};
const defaultBindings = ['bind', 'one-way', 'two-way', 'one-time'];
exports.AURELIA_ATTRIBUTES = {
    'select': [new models_1.HTMLAttributeSpecification('matcher', defaultBindings)],
    'option': [new models_1.HTMLAttributeSpecification('model', defaultBindings)],
    'input': [
        new models_1.HTMLAttributeSpecification('value', defaultBindings),
        new models_1.HTMLAttributeSpecification('checked', defaultBindings),
        new models_1.HTMLAttributeSpecification('model', defaultBindings)],
    'compose': [
        new models_1.HTMLAttributeSpecification('view', defaultBindings),
        new models_1.HTMLAttributeSpecification('view-model', defaultBindings),
        new models_1.HTMLAttributeSpecification('model', defaultBindings)],
    'template': [
        new models_1.HTMLAttributeSpecification('replaceable', [], false),
        new models_1.HTMLAttributeSpecification('replace-part', defaultBindings),
        new models_1.HTMLAttributeSpecification('bindable', defaultBindings)],
    'a': [new models_1.HTMLAttributeSpecification('route-href', defaultBindings)],
    'slot': [new models_1.HTMLAttributeSpecification('name', defaultBindings)]
};
exports.AURELIA_GLOBAL_ATTRIBUTES = [
    new models_1.HTMLAttributeSpecification('repeat.for'),
    new models_1.HTMLAttributeSpecification('as-element', defaultBindings),
    new models_1.HTMLAttributeSpecification('view', defaultBindings),
    new models_1.HTMLAttributeSpecification('ref'),
    new models_1.HTMLAttributeSpecification('element.ref'),
    new models_1.HTMLAttributeSpecification('view-model.ref'),
    new models_1.HTMLAttributeSpecification('view.ref'),
    new models_1.HTMLAttributeSpecification('controller.ref'),
    new models_1.HTMLAttributeSpecification('innerhtml', defaultBindings),
    new models_1.HTMLAttributeSpecification('textcontent', defaultBindings),
    new models_1.HTMLAttributeSpecification('style', defaultBindings),
    new models_1.HTMLAttributeSpecification('show', defaultBindings),
    new models_1.HTMLAttributeSpecification('if', defaultBindings),
    new models_1.HTMLAttributeSpecification('naive-if', defaultBindings),
    new models_1.HTMLAttributeSpecification('with', defaultBindings),
    new models_1.HTMLAttributeSpecification('slot'),
    new models_1.HTMLAttributeSpecification('containerless', [], true),
    new models_1.HTMLAttributeSpecification('view-spy', [], true),
    new models_1.HTMLAttributeSpecification('compile-spy', [], true),
];
//# sourceMappingURL=aureliaTags.js.map