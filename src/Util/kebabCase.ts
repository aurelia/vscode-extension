/**
 * https://gist.github.com/thevangelist/8ff91bac947018c9f3bfaad6487fa149#gistcomment-3041633
 */
export function kebabCase(str: string): string {
  const result = str.replace(
    /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
    match => `-${  match.toLowerCase()}`
  );
  return (str[0] === str[0].toUpperCase())
    ? result.substring(1)
    : result;
}
