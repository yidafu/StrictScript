import { Position } from './Position';

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
}

export { Token, TokenType };
