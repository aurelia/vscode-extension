import { HTMLTagProvider } from '../services/htmlCompletion';
import { AURELIA_ATTRIBUTES, AURELIA_TAGS, AURELIA_GLOBAL_ATTRIBUTES, AURELIA_EVENTS } from './aureliaTags';
import { HTMLAttributeSpecification, TagSet } from './models';

export function getAureliaTagProvider(): HTMLTagProvider {
  return {
    collectAttributes: (tag: string, collector: (attribute: string, type: string) => void) => {
      if (tag) {
        let tagWithAttributes = AURELIA_TAGS[tag];
        let attributes = AURELIA_ATTRIBUTES[tag];

        if (tagWithAttributes) {
          addAttributes(tagWithAttributes.attributes, collector);
        } else if (attributes) {
          addAttributes(attributes, collector);
        } else {
          addAttributes(AURELIA_GLOBAL_ATTRIBUTES, collector);
        }

        let tagWithEvents = AURELIA_EVENTS[tag];
        if (tagWithEvents) {
          addAttributes(tagWithEvents, collector);
        }
      }
    },
    collectTags: (collector: (tag: string, label: string) => void) => collectTagsDefault(collector, AURELIA_TAGS),
    // tslint:disable-next-line:no-empty
    collectValues: (tag: string, attribute: string, collector: (value: string) => void) => {
    },
    getId: () => 'aurelia',
    isApplicable: (languageId) => languageId === 'html',
  };
}

function addAttributes(attributes: Array<HTMLAttributeSpecification>, collector) {
  attributes.forEach(attribute => {

    if (!attribute.hasBody) {
      collector(attribute.name, 'v');
    } else if (!attribute.defaultAttribute) {
      collector(attribute.name, null);
    }

    if (attribute.dataBindings && attribute.dataBindings.length) {
      attribute.dataBindings.forEach(binding => collector(attribute.name + '.' + binding, null));
    }
  });
}

function collectTagsDefault(collector: (tag: string, label: string) => void, tagSet: TagSet): void {
  for (let tag in tagSet) {
    if (tagSet.hasOwnProperty(tag)) {
      collector(tag, tagSet[tag].label);
    }
  }
}
