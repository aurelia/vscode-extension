"use strict";
const models_1 = require('./models');
exports.AURELIA_TAGS = {
    'require': new models_1.HTMLTagSpecification(`"import" or "require" various resources into a view. Equivalent of the ES 2015 "import" syntax`, [
        new models_1.HTMLAttributeSpecification('from', [], true, false),
        new models_1.HTMLAttributeSpecification('as', [], true, false)]),
    'router-view': new models_1.HTMLTagSpecification(`Placeholder for the router content`, [
        new models_1.HTMLAttributeSpecification('name'),
        new models_1.HTMLAttributeSpecification('layout-view', [], true, false),
        new models_1.HTMLAttributeSpecification('layout-view-model', [], true, false),
        new models_1.HTMLAttributeSpecification('layout-model', [], true, false)]),
    'compose': new models_1.HTMLTagSpecification(`Composes the view in the current position`, [
        new models_1.HTMLAttributeSpecification('view', [], true, false)]),
    'slot': new models_1.HTMLTagSpecification(`Shadow DOM slot element, Aurelia will project the element's content in to the <slot></slot> element.`, [
        new models_1.HTMLAttributeSpecification('name'),
        new models_1.HTMLAttributeSpecification('slot')])
};
const defaultBindings = ['bind', 'one-way', 'two-way', 'one-time'];
exports.AURELIA_ATTRIBUTES = {
    'select': [new models_1.HTMLAttributeSpecification('matcher', defaultBindings, true, false)],
    'option': [new models_1.HTMLAttributeSpecification('model', defaultBindings, true, false)],
    'input': [
        new models_1.HTMLAttributeSpecification('value', defaultBindings),
        new models_1.HTMLAttributeSpecification('checked', defaultBindings),
        new models_1.HTMLAttributeSpecification('model', defaultBindings, true, false)
    ],
    'compose': [
        new models_1.HTMLAttributeSpecification('view', defaultBindings, true, false),
        new models_1.HTMLAttributeSpecification('view-model', defaultBindings, true, false),
        new models_1.HTMLAttributeSpecification('model', defaultBindings, true, false)
    ],
    'template': [
        new models_1.HTMLAttributeSpecification('replaceable', [], false),
        new models_1.HTMLAttributeSpecification('replace-part', defaultBindings, true, false),
        new models_1.HTMLAttributeSpecification('bindable', defaultBindings, true, false)
    ],
    'a': [new models_1.HTMLAttributeSpecification('route-href', defaultBindings, true, false)],
    'slot': [new models_1.HTMLAttributeSpecification('name', defaultBindings)]
};
exports.AURELIA_GLOBAL_ATTRIBUTES = [
    new models_1.HTMLAttributeSpecification('repeat.for'),
    new models_1.HTMLAttributeSpecification('as-element', defaultBindings),
    new models_1.HTMLAttributeSpecification('view', defaultBindings, true, false),
    new models_1.HTMLAttributeSpecification('ref'),
    new models_1.HTMLAttributeSpecification('element.ref'),
    new models_1.HTMLAttributeSpecification('view-model.ref'),
    new models_1.HTMLAttributeSpecification('view.ref'),
    new models_1.HTMLAttributeSpecification('controller.ref'),
    new models_1.HTMLAttributeSpecification('innerhtml', defaultBindings, true, false),
    new models_1.HTMLAttributeSpecification('textcontent', defaultBindings, true, false),
    new models_1.HTMLAttributeSpecification('style', defaultBindings),
    new models_1.HTMLAttributeSpecification('show', defaultBindings, true, false),
    new models_1.HTMLAttributeSpecification('if', defaultBindings, true, false),
    new models_1.HTMLAttributeSpecification('naive-if', defaultBindings, true, false),
    new models_1.HTMLAttributeSpecification('with', defaultBindings),
    new models_1.HTMLAttributeSpecification('slot'),
    new models_1.HTMLAttributeSpecification('containerless', [], true),
    new models_1.HTMLAttributeSpecification('view-spy', [], true),
    new models_1.HTMLAttributeSpecification('compile-spy', [], true),
];
const actionRedirectOptions = ['delegate', 'trigger', 'call'];
exports.AURELIA_EVENTS = {
    'form': [
        new models_1.HTMLAttributeSpecification('submit', actionRedirectOptions),
        new models_1.HTMLAttributeSpecification('reset', actionRedirectOptions)
    ],
    'input': [
        new models_1.HTMLAttributeSpecification('click', defaultBindings),
        new models_1.HTMLAttributeSpecification('blur', defaultBindings),
        new models_1.HTMLAttributeSpecification('focus', defaultBindings),
        new models_1.HTMLAttributeSpecification('change', defaultBindings),
        new models_1.HTMLAttributeSpecification('keydown', defaultBindings),
        new models_1.HTMLAttributeSpecification('keypress', defaultBindings),
        new models_1.HTMLAttributeSpecification('keyup', defaultBindings),
        new models_1.HTMLAttributeSpecification('input', defaultBindings),
        new models_1.HTMLAttributeSpecification('change', defaultBindings),
    ],
    'textarea': [
        new models_1.HTMLAttributeSpecification('input', defaultBindings),
        new models_1.HTMLAttributeSpecification('change', defaultBindings),
    ],
    'select': [
        new models_1.HTMLAttributeSpecification('change', defaultBindings),
    ]
};
//# sourceMappingURL=aureliaTags.js.map