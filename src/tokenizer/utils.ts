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

const SEPERATOR = ['(', ')', '{', '}', ';', ',', ':', '?', '@'];

export function isSeperator(char: string) {
  return SEPERATOR.includes(char);
}

/**
 * 缺失的关键字: with
 */
export type KeyWord =
  // 变量申明
  'let' | 'const' | 'function' | 'class'
  // 流程控制
  | 'if' | 'else' | 'for' | 'do' | 'while' | 'switch' | 'case' | 'throw' | 'try' | 'catch' | 'finally'
  | 'return' | 'break' | 'continue'
  // 内置操作符
  | 'in' | 'instanceof' | 'yield' | 'typeof' | 'delete' | 'debugger'
  // module
  | 'default' | 'import' | 'export'
  // 内置变量
  | 'true' | 'false' | 'null' | 'undefined'
  // 对象
  | 'this' | 'new' | 'implements' | 'extends' | 'interface' | 'private' | 'protected' | 'public' | 'static' | 'prackage';

export const KEY_WORDS = new Set<KeyWord>([
  // 变量申明
  'let', 'const', 'function', 'class', 'if', 'else', 'for', 'do', 'while', 'switch', 'case',
  'throw', 'try', 'catch', 'finally', 'return', 'break', 'continue', 'in', 'instanceof', 'yield',
  'typeof', 'delete', 'debugger', 'default', 'import', 'export', 'true', 'false', 'null',
  'undefined', 'this', 'new', 'implements', 'extends', 'interface', 'private', 'protected',
  'public', 'static', 'prackage',
]);

export function isKeyword(str: string): str is KeyWord {
  return KEY_WORDS.has(str as any);
}

export type Operator = '-' |'+' |'*' |'/' |
  '&' |'^' |'|' |'!' |
  '>' |'<' | '.'
export const OPERATOR: Operator[] = [
  '-', '+', '*', '/',
  '&', '^', '|', '!',
  '>', '<', '.'
];

export function isOperator(char: string): char is Operator {
  return OPERATOR.includes(char as Operator);
}
