import { Position } from './Position';
import { KeyWord, Operator as TOperator, TSeperator } from './utils';

enum TokenType {
  Keyword = 'keyword',
  Identifier = 'identifier',
  StringLiteral = 'string-literal',
  NullLiteral = 'null-literal',
  UndefinedLiteral = 'undefined-literal',
  BooleanLiteral = 'boolean-literal',
  DecimalLiteral = 'decimal-literal',
  IntegerLiteral = 'integer-literal',
  Seperator = 'seperator',
  Operator = 'operator',
  EOF = 'eof',
}

class Token {
  type: TokenType;

  value: string;

  position: Position;

  constructor(type: TokenType, value: string, position: Position) {
    this.type = type;
    this.value = value;
    this.position = position;
  }

  toString() {
    return `Token@${this.position.toString()}\ttype: ${this.type}\t${this.value}`;
  }

  isKeyworkd(keyword: KeyWord) {
    return this.type === TokenType.Keyword && this.value === keyword;
  }

  isOperator(operator: TOperator) {
    return this.type === TokenType.Operator && this.value === operator;
  }

  isSeperator(seperator: TSeperator) {
    return this.type === TokenType.Seperator && this.value === seperator;
  }

  isIentifier(identifier: string) {
    return this.type === TokenType.Identifier && this.value === identifier;
  }

  isLiterator() {
    return this.type === TokenType.StringLiteral
    || this.type === TokenType.BooleanLiteral
    || this.type === TokenType.DecimalLiteral
    || this.type === TokenType.NullLiteral
    || this.type === TokenType.IntegerLiteral
    || this.type === TokenType.UndefinedLiteral;
  }
}

export { Token, TokenType };
