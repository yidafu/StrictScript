export function isWhiteSpace(char: string): boolean {
  return [' ', '\n', '\t'].includes(char);
}


export function isCharacter(char: string) {
  return ((char>='A' && char <='Z') || (char>= 'a' && char <='z'));
}

export function isDigit(char: string) {
  return char >= '0' && char <= '9';
}

export function isCharacterDigitOrUnderScore(char: string): boolean {
  return isCharacter(char) || isDigit(char) || char === '_';
}

const SEPERATOR = ['(', ')', '{', '}', ','];

export function isSeperator(char: string) {
  return SEPERATOR.includes(char);
}