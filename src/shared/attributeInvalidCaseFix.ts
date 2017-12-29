import { AttributeMap } from 'aurelia-templating-binding';

export function attributeInvalidCaseFix(elementName, attributeText) {

  const attributeMap = new AttributeMap({
    isStandardSvgAttribute: () => false
  });

  const kebabCaseValidationRegex = /(.*)\.(bind|one-way|two-way|one-time|from-view|to-view|ref|call|delegate|trigger)/;
  const match = kebabCaseValidationRegex.exec(attributeText);
  if (match) {
    const attribute = match[1];
    const command = match[2];
  
    let fixed;
    const element = attributeMap.elements[elementName];
  
    // only replace dashes in non data-* and aria-* attributes
    let lookupProperty = attribute.toLowerCase();
    if (/^(?!(data|aria)-).*$/g.test(lookupProperty)) {
      lookupProperty = lookupProperty.replace('-','');
    }
  
    if (element && lookupProperty in element) {
      fixed = element[lookupProperty];
    }
    else if (lookupProperty in attributeMap.allElements) {
      fixed = attributeMap.allElements[lookupProperty];
    }
    else {
      fixed = attribute.split(/(?=[A-Z])/).map(s => s.toLowerCase()).join('-');
    }

    return {
      attribute,
      command,
      fixed
    };
  }
  
  return {
    attribute: attributeText,
    command: undefined,
    fixed: undefined
  };
}
