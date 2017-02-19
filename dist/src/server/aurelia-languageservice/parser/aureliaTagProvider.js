"use strict";
const aureliaTags_1 = require("./aureliaTags");
function getAureliaTagProvider() {
    return {
        collectAttributes: (tag, collector) => {
            if (tag) {
                let tagWithAttributes = aureliaTags_1.AURELIA_TAGS[tag];
                let attributes = aureliaTags_1.AURELIA_ATTRIBUTES[tag];
                if (tagWithAttributes) {
                    addAttributes(tagWithAttributes.attributes, collector);
                }
                else if (attributes) {
                    addAttributes(attributes, collector);
                }
                else {
                    addAttributes(aureliaTags_1.AURELIA_GLOBAL_ATTRIBUTES, collector);
                }
                let tagWithEvents = aureliaTags_1.AURELIA_EVENTS[tag];
                if (tagWithEvents) {
                    addAttributes(tagWithEvents, collector);
                }
            }
        },
        collectTags: (collector) => collectTagsDefault(collector, aureliaTags_1.AURELIA_TAGS),
        // tslint:disable-next-line:no-empty
        collectValues: (tag, attribute, collector) => {
        },
        getId: () => 'aurelia',
        isApplicable: (languageId) => languageId === 'html',
    };
}
exports.getAureliaTagProvider = getAureliaTagProvider;
function addAttributes(attributes, collector) {
    attributes.forEach(attribute => {
        if (!attribute.hasBody) {
            collector(attribute.name, 'v');
        }
        else if (!attribute.defaultAttribute) {
            collector(attribute.name, null);
        }
        if (attribute.dataBindings && attribute.dataBindings.length) {
            attribute.dataBindings.forEach(binding => collector(attribute.name + '.' + binding, null));
        }
    });
}
function collectTagsDefault(collector, tagSet) {
    for (let tag in tagSet) {
        if (tagSet.hasOwnProperty(tag)) {
            collector(tag, tagSet[tag].label);
        }
    }
}
//# sourceMappingURL=aureliaTagProvider.js.map