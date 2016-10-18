import { IHTMLTagProvider } from '../services/htmlCompletion';

export function getAureliaTagProvider(): IHTMLTagProvider {
	let customTags: { [tag: string]: string[] } = {
    'require': ['from', 'as'],
    'router-view' : ['name', 'layout-view', 'layout-view-model', 'layout-model'],
    'select': ['matcher'],
    'option' : ['model.bind'],
    'input' : ['value.bind', 'checked.bind', 'model.bind'],
    'compose' : ['view.bind', 'view-model.bind', 'model.bind'],
    'template': [':replaceable', 'replace-part', 'bindable'],
    'a': ['route-href'],
    'slot': ['name']
	};

	let globalAttributes = [
    'repeat.for', 'as-element', 'view', 'ref', 'element.ref', 'view-model.ref', 'view.ref', 'controller.ref',
    'innerhtml.bind', 'textcontent.bind', 'style.bind', 'show.bind', 'if.bind', 'naive-if.bind', 'with.bind', 'slot',

    ':containerless', ':view-spy', ':compile-spy'
  ];
	let eventHandlers = ['abort', 'blur', 'canplay', 'canplaythrough', 'change', 'click', 'contextmenu', 'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart',
		'drop', 'durationchange', 'emptied', 'ended', 'error', 'focus', 'formchange', 'forminput', 'input', 'invalid', 'keydown', 'keypress', 'keyup', 'load', 'loadeddata', 'loadedmetadata',
		'loadstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'pause', 'play', 'playing', 'progress', 'ratechange', 'reset', 'resize', 'readystatechange', 'scroll',
		'seeked', 'seeking', 'select', 'show', 'stalled', 'submit', 'suspend', 'timeupdate', 'volumechange', 'waiting'];

	return {
		getId: () => 'aurelia',
		isApplicable: (languageId) => languageId === 'html',
		collectTags: (collector: (tag: string, label: string) => void) => collectTagsDefault(collector, AURELIA_TAGS),
		collectAttributes: (tag: string, collector: (attribute: string, type: string) => void) => {
			
      if (tag) {
				let attributes = customTags[tag];
				if (attributes) {
          addAttributes(attributes, collector);
				}
			}

      addAttributes(globalAttributes, collector);

      if (tag !== 'require' && tag !== 'template' && tag !== 'slot' && tag !== 'compose') {
        eventHandlers.forEach(handler => {
          collector(handler, 'event');
          collector(handler + '.trigger', 'event');
          collector(handler + '.delegate', 'event');
          collector(handler + '.call', 'event');
        });
      }
		},
		collectValues: (tag: string, attribute: string, collector: (value: string) => void) => {
		}
	};
}

function addAttributes(attributes, collector) {
  attributes.forEach(attribute => {
    let bindAttributePos = attribute.indexOf('.bind');
    let emptyAttribute = attribute.substring(0, 1) === ':';
  
    if (emptyAttribute) {
      collector(attribute.substring(1, attribute.length), 'v');
    } else if (bindAttributePos > -1) {
        let actualAttribute = attribute.substring(0, bindAttributePos);
        collector(actualAttribute, null);
        collector(actualAttribute + '.bind' , null);
        collector(actualAttribute + '.one-way', null);
        collector(actualAttribute + '.two-way', null);
        collector(actualAttribute + '.one-time', null);
    } else {
      collector(attribute, null);
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
export class HTMLTagSpecification {
	constructor(public label: string, public attributes: string[] = []) { }
}
export const AURELIA_TAGS: ITagSet = {
  'require' : new HTMLTagSpecification(`"import" or "require" various resources into a view. Equivalent of the ES 2015 "import" syntax`, ['from']),
  'router-view': new HTMLTagSpecification(`Placeholder for the router content`, ['name', 'layout-view', 'layout-view-model', 'layout-model']),
  'compose': new HTMLTagSpecification(`Composes the view in the current position`, ['view']),
  'slot': new HTMLTagSpecification(`Shadow DOM slot element, Aurelia will project the element's content in to the <slot></slot> element.`, ['name', 'slot'])
};

