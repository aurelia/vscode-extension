import { AttributeMap } from 'aurelia-templating-binding';
import {AttributeDefinition, TagDefinition } from './../FileParser/HTMLDocumentParser';

export function attributeInvalidCaseFix(name: string, elementName: string) {

  // TODO: find a way to detect if this element is a svg element
  const attributeMap = new AttributeMap({
    isStandardSvgAttribute: () => false
  });
  
  let fixed;
  const auElement = attributeMap.elements[elementName];

  // only replace dashes in non data-* and aria-* attributes
  let lookupProperty = name.toLowerCase();
  if (/^(?!(data|aria)-).*$/g.test(lookupProperty)) {
    lookupProperty = lookupProperty.replace('-','');
  }

  if (auElement && lookupProperty in auElement) {
    fixed = auElement[lookupProperty];
  }
  else if (lookupProperty in attributeMap.allElements) {
    fixed = attributeMap.allElements[lookupProperty];
  }
  else {
    fixed = name.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
  }

  return fixed;
}
