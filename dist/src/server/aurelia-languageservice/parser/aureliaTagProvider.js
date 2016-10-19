"use strict";
function getAureliaTagProvider() {
    return {
        getId: () => 'aurelia',
        isApplicable: (languageId) => languageId === 'html',
        collectTags: (collector) => collectTagsDefault(collector, exports.AURELIA_TAGS),
        collectAttributes: (tag, collector) => {
            if (tag) {
                let tagWithAttributes = exports.AURELIA_TAGS[tag];
                let attributes = exports.AURELIA_ATTRIBUTES[tag];
                if (tagWithAttributes) {
                    addAttributes(tagWithAttributes.attributes, collector);
                }
                else if (attributes) {
                    addAttributes(attributes, collector);
                }
            }
            else {
                addAttributes(exports.AURELIA_GLOBAL_ATTRIBUTES, collector);
            }
        },
        collectValues: (tag, attribute, collector) => {
        }
    };
}
exports.getAureliaTagProvider = getAureliaTagProvider;
function addAttributes(attributes, collector) {
    attributes.forEach(attribute => {
        if (!attribute.hasBody) {
            collector(attribute.name, 'v');
        }
        else {
            collector(attribute.name, null);
        }
        if (attribute.dataBindings && attribute.dataBindings.length) {
            attribute.dataBindings.forEach(binding => collector(attribute.name + '.' + binding, null));
        }
    });
}
function collectTagsDefault(collector, tagSet) {
    for (let tag in tagSet) {
        collector(tag, tagSet[tag].label);
    }
}
class HTMLAttributeSpecification {
    constructor(name, dataBindings = [], hasBody = true) {
        this.name = name;
        this.dataBindings = dataBindings;
        this.hasBody = hasBody;
    }
}
exports.HTMLAttributeSpecification = HTMLAttributeSpecification;
class AureliaEventSpecification {
    constructor(name) {
        this.name = name;
    }
}
exports.AureliaEventSpecification = AureliaEventSpecification;
class HTMLTagSpecification {
    constructor(label, attributes = []) {
        this.label = label;
        this.attributes = attributes;
    }
}
exports.HTMLTagSpecification = HTMLTagSpecification;
exports.AURELIA_TAGS = {
    'require': new HTMLTagSpecification(`"import" or "require" various resources into a view. Equivalent of the ES 2015 "import" syntax`, [
        new HTMLAttributeSpecification('from'),
        new HTMLAttributeSpecification('as')]),
    'router-view': new HTMLTagSpecification(`Placeholder for the router content`, [
        new HTMLAttributeSpecification('name'),
        new HTMLAttributeSpecification('layout-view'),
        new HTMLAttributeSpecification('layout-view-model'),
        new HTMLAttributeSpecification('layout-model')]),
    'compose': new HTMLTagSpecification(`Composes the view in the current position`, [
        new HTMLAttributeSpecification('view')]),
    'slot': new HTMLTagSpecification(`Shadow DOM slot element, Aurelia will project the element's content in to the <slot></slot> element.`, [
        new HTMLAttributeSpecification('name'),
        new HTMLAttributeSpecification('slot')])
};
const defaultBindings = ['bind', 'one-way', 'two-way', 'one-time'];
exports.AURELIA_ATTRIBUTES = {
    'select': [new HTMLAttributeSpecification('matcher', defaultBindings)],
    'option': [new HTMLAttributeSpecification('model', defaultBindings)],
    'input': [
        new HTMLAttributeSpecification('value', defaultBindings),
        new HTMLAttributeSpecification('checked', defaultBindings),
        new HTMLAttributeSpecification('model', defaultBindings)],
    'compose': [
        new HTMLAttributeSpecification('view', defaultBindings),
        new HTMLAttributeSpecification('view-model', defaultBindings),
        new HTMLAttributeSpecification('model', defaultBindings)],
    'template': [
        new HTMLAttributeSpecification('replaceable', [], false),
        new HTMLAttributeSpecification('replace-part', defaultBindings),
        new HTMLAttributeSpecification('bindable', defaultBindings)],
    'a': [new HTMLAttributeSpecification('route-href', defaultBindings)],
    'slot': [new HTMLAttributeSpecification('name', defaultBindings)]
};
exports.AURELIA_GLOBAL_ATTRIBUTES = [
    new HTMLAttributeSpecification('repeat.for'),
    new HTMLAttributeSpecification('as-element', defaultBindings),
    new HTMLAttributeSpecification('view', defaultBindings),
    new HTMLAttributeSpecification('ref'),
    new HTMLAttributeSpecification('element.ref'),
    new HTMLAttributeSpecification('view-model.ref'),
    new HTMLAttributeSpecification('view.ref'),
    new HTMLAttributeSpecification('controller.ref'),
    new HTMLAttributeSpecification('innerhtml', defaultBindings),
    new HTMLAttributeSpecification('textcontent', defaultBindings),
    new HTMLAttributeSpecification('style', defaultBindings),
    new HTMLAttributeSpecification('show', defaultBindings),
    new HTMLAttributeSpecification('if', defaultBindings),
    new HTMLAttributeSpecification('naive-if', defaultBindings),
    new HTMLAttributeSpecification('with', defaultBindings),
    new HTMLAttributeSpecification('slot'),
    new HTMLAttributeSpecification('containerless', [], true),
    new HTMLAttributeSpecification('view-spy', [], true),
    new HTMLAttributeSpecification('compile-spy', [], true),
];
//# sourceMappingURL=aureliaTagProvider.js.map