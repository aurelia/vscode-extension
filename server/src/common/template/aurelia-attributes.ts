import { AURELIA_TEMPLATE_ATTRIBUTE_KEYWORD_LIST } from '../constants';

/**
 * @example
 *   const input = 'inter-bindable.bind'
 *                                ^
 *   getAureliaAttributeKeywordIndex(input) // 14
 */
export function getAureliaAttributeKeywordIndex(input: string): number {
  let index = NaN;

  AURELIA_TEMPLATE_ATTRIBUTE_KEYWORD_LIST.find((keyword) => {
    const withDot = `.${keyword}`;
    const match = input.indexOf(withDot);
    if (match >= 0) {
      index = match;
      return true;
    }
    return false;
  });

  return index;
}

/**
 * @example
 *   const input = 'inter-bindable.bind'
 *
 *   getBindableNameFromAttritute(input) // inter-bindable
 */
export function getBindableNameFromAttritute(input: string): string {
  // Sth like: (.*)(?=.(bind|call))
  const asRegex = new RegExp(
    `(.*)(?=.(${AURELIA_TEMPLATE_ATTRIBUTE_KEYWORD_LIST.join('|')}))`
  );
  const match = asRegex.exec(input);

  if (!match) return '';

  return match[0];
}

getBindableNameFromAttritute('inter-bindable.bind');
