"use strict";
class HTMLAttributeSpecification {
    constructor(name, dataBindings = [], hasBody = true, defaultAttribute = true) {
        this.name = name;
        this.dataBindings = dataBindings;
        this.hasBody = hasBody;
        this.defaultAttribute = defaultAttribute;
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
//# sourceMappingURL=models.js.map