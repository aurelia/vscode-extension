export function normalizePath(input) {
  const isExtendedLengthPath = input.startsWith("\\\\?\\");
  const hasNonAscii = /[^\u0000-\u0080]+/.test(input);

  if (isExtendedLengthPath || hasNonAscii) {
    return input;
  }

  return input.replace(/\\/g, '/');
}
