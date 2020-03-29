import { AttributeMap } from 'aurelia-templating-binding';

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
    lookupProperty = lookupProperty.replace('-', '');
  }

  if ((typeof auElement !== 'undefined') && lookupProperty in auElement || lookupProperty in attributeMap.allElements) {
    fixed = lookupProperty;
  } else {
    fixed = name.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
  }

  return fixed;
}
