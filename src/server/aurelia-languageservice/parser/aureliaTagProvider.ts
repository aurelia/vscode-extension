import { IHTMLTagProvider } from '../services/htmlCompletion';

export function getAureliaTagProvider(): IHTMLTagProvider {
	return {
		getId: () => 'aurelia',
		isApplicable: (languageId) => languageId === 'html',
		collectTags: (collector: (tag: string, label: string) => void) => collectTagsDefault(collector, AURELIA_TAGS),
		collectAttributes: (tag: string, collector: (attribute: string, type: string) => void) => {
      if (tag) {
        let tagWithAttributes = AURELIA_TAGS[tag];
        let attributes = AURELIA_ATTRIBUTES[tag];
				if (tagWithAttributes) {
          addAttributes(tagWithAttributes.attributes, collector);
				} else if (attributes) {
          addAttributes(attributes, collector);
        }
			} else {
        addAttributes(AURELIA_GLOBAL_ATTRIBUTES, collector);
      }
		},
		collectValues: (tag: string, attribute: string, collector: (value: string) => void) => {
		}
	};
}

function addAttributes(attributes: Array<HTMLAttributeSpecification>, collector) {
  attributes.forEach(attribute => {
    if (!attribute.hasBody) {
      collector(attribute.name, 'v');
    } else {
      collector(attribute.name, null);  
    }

    if (attribute.dataBindings && attribute.dataBindings.length) {
      attribute.dataBindings.forEach(binding => collector(attribute.name + '.' + binding, null));
    }   
  });
}

function collectTagsDefault(collector: (tag: string, label: string) => void, tagSet: ITagSet): void {
	for (let tag in tagSet) {
		collector(tag, tagSet[tag].label);
	}
}

export interface ITagSet {
	[tag: string]: HTMLTagSpecification;
}
export interface IAttributeSet {
	[tag: string]: Array<HTMLAttributeSpecification>;
}
export interface IEventSet {
	[tag: string]: Array<AureliaEventSpecification>;
}
export class HTMLAttributeSpecification {
  constructor(public name: string, public dataBindings = [], public hasBody = true ) { }
}
export class AureliaEventSpecification {
  constructor(public name: string) { }
}
export class HTMLTagSpecification {
	constructor(public label: string, public attributes: HTMLAttributeSpecification[] = []) { }
}
export const AURELIA_TAGS: ITagSet = {
  'require' : new HTMLTagSpecification(`"import" or "require" various resources into a view. Equivalent of the ES 2015 "import" syntax`, [
    new HTMLAttributeSpecification('from'), 
    new HTMLAttributeSpecification('as') ]),
  'router-view': new HTMLTagSpecification(`Placeholder for the router content`, [
    new HTMLAttributeSpecification('name'), 
    new HTMLAttributeSpecification('layout-view'),
    new HTMLAttributeSpecification( 'layout-view-model'),
    new HTMLAttributeSpecification('layout-model')]),
  'compose': new HTMLTagSpecification(`Composes the view in the current position`, [
    new HTMLAttributeSpecification('view')]),
  'slot': new HTMLTagSpecification(`Shadow DOM slot element, Aurelia will project the element's content in to the <slot></slot> element.`, [
    new HTMLAttributeSpecification('name'),
    new HTMLAttributeSpecification('slot')])
};

const defaultBindings = ['bind', 'one-way', 'two-way', 'one-time'];
export const AURELIA_ATTRIBUTES: IAttributeSet = {
    'select'  : [ new HTMLAttributeSpecification('matcher', defaultBindings) ],
    'option'  : [ new HTMLAttributeSpecification('model', defaultBindings) ],
    'input'   : [
      new HTMLAttributeSpecification('value', defaultBindings), 
      new HTMLAttributeSpecification('checked' ,defaultBindings),
      new HTMLAttributeSpecification('model', defaultBindings)],
    'compose' : [
      new HTMLAttributeSpecification('view', defaultBindings),
      new HTMLAttributeSpecification('view-model', defaultBindings),
      new HTMLAttributeSpecification('model', defaultBindings)],
    'template': [
      new HTMLAttributeSpecification('replaceable', [], false),
      new HTMLAttributeSpecification('replace-part', defaultBindings),
      new HTMLAttributeSpecification('bindable', defaultBindings)],
    'a': [ new HTMLAttributeSpecification('route-href', defaultBindings)],
    'slot': [ new HTMLAttributeSpecification('name', defaultBindings) ]
}

export const AURELIA_GLOBAL_ATTRIBUTES: Array<HTMLAttributeSpecification> = [
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
