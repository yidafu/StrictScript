export function addPrefixPadding(str: string = '', padding = '    ') {
  if (!str) return '';
  return String(str)
    .split('\n')
    .filter(Boolean)
    .map((s: string) => padding + s)
    .join('\n');
}
