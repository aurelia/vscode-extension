export function normalizePath(input: string): string {
  const isExtendedLengthPath = input.startsWith("\\\\?\\");
  // eslint-disable-next-line no-control-regex
  const hasNonAscii = /[^\u0000-\u0080]+/.test(input);

  if (isExtendedLengthPath || hasNonAscii) {
    return input;
  }

  return input.replace(/\\/g, '/');
}
