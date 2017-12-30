import { AttributeMap } from 'aurelia-templating-binding';
import {AttributeDefinition, TagDefinition } from './../server/DocumentParser';

export function attributeInvalidCaseFix(attribute: AttributeDefinition, element: TagDefinition) {

  if (!attribute.binding) {
    return undefined;
  }

  const attributeMap = new AttributeMap({
    isStandardSvgAttribute: () => false
  });
  
  let fixed;
  const auElement = attributeMap.elements[element.name];

  // only replace dashes in non data-* and aria-* attributes
  let lookupProperty = attribute.name.toLowerCase();
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
    fixed = attribute.name.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
  }

  return fixed;

}
