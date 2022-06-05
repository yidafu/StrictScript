import { InputStream } from "../InputStream";
import { isCharacter, isCharacterDigitOrUnderScore, isDigit, isKeyword, isOperator, isSeperator, isWhiteSpace } from "./utils";

export enum TokenType {
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

interface Token {
  type: TokenType;
  value: string
}

class Tokenizer {
  stream: InputStream;

  nextToken: Token = { type: TokenType.EOF, value: ''};

  constructor(stream: InputStream) {
    this.stream = stream;
  }

  next(): Token | null {
    const lastToken = this.peek();

    this.nextToken = this.getAToken();

    return lastToken;
  }

  peek(): Token | null {
    if (this.nextToken?.type === TokenType.EOF && !this.stream.eof()) {
      this.nextToken = this.getAToken();
    }
    return this.nextToken;
  }


  getAToken(): Token {
    this.skipWhiteSpaces();
    if (this.stream.eof()) {
      return { type: TokenType.EOF, value: '' };
    }
    const char = this.stream.peek();
    if (isCharacter(char)) {
      return this.parseIdentifier();
    }

    if (char === '"') {
      return this.parseStringLiteral();
    }

    if (isSeperator(char)) {
      return { 
        type: TokenType.Seperator,
        value: this.stream.next(),
      };
    }

    if (isDigit(char)) {
      this.stream.next();
      let char1 = this.stream.peek();
      let numberLiteral = '';
      if (char === '0' && char1 !== '.') {
        if (!(char1 >= '1' && char1 <= '9')) {
          // TODO: 支持八进制、二进制、十六进制
          numberLiteral = '0';
        } else {
          throw new Error(`0 cannot followed by other digit. at line: ${this.stream.line} col: ${this.stream.column}`);
        }
      } else if ((char >= '1' && char <= '9') || (char === '0' && char1 === '.')) {
        numberLiteral += char;
        while (isDigit(char1)) {
          numberLiteral += this.stream.next();
          char1 = this.stream.peek();
        }
        if (char1 === '.') {
          numberLiteral += this.stream.next();
          char1 = this.stream.peek();
          while(isDigit(char1)) {
            numberLiteral += this.stream.next();
            char1 = this.stream.peek();
          }
          return { type: TokenType.DecimalLiteral, value: numberLiteral };
        } else {
          return { type: TokenType.IntegerLiteral, value: numberLiteral };
        }
      }
      // can't being execute
      throw new Error(`Unrecongnized pattern meeting: ${char}, at line: ${this.stream.line} col: ${this.stream.column}`);
    }

    if (char === '.') {
      this.stream.next();
      let char1 = this.stream.peek();
      if (isDigit(char1)) {
        let numberLiteral = '.';
        while (isDigit(char1)) {
          numberLiteral += this.stream.next();
          char1 = this.stream.next();
        }
        return { type: TokenType.DecimalLiteral, value: numberLiteral };
      } else if (char1 === '.') {
        this.stream.next();
        const char2 = this.stream.peek();
        if (char2 === '.') {
          return { type: TokenType.Seperator, value: '...' };
        } else {
          throw new Error('Unrecognized patter: ..., missd a . ?');
        }
      } else {
        return { type: TokenType.Seperator, value: '.' };
      }
    }

    if (isOperator(char)) {
      if (char === '/') {
        this.stream.next();
        const char1 = this.stream.peek();
        if (char1 === '*') {
          this.stream.next();
          this.skipMultipleLineComment();
          return this.getAToken();
        } else if (char === '/') {
          this.stream.next();
          this.skipSingleLineComment();
          return this.getAToken();
        } else if (char === '=') {
          this.stream.next();
          return { type: TokenType.Operator, value: '/=' };
        } else {
          return { type: TokenType.Seperator, value: '/' };
        }
      }
    }

    if (['+', '-', '*', '&', '|'].includes(char)) {
      return this.parseBinaryOperator(char, char);
    }

    if (char === '&') {
      this.stream.next();
      const char1 = this.stream.peek();
      if (char1 === '=') {
        this.stream.next();
        return { type: TokenType.Operator, value: '&=' };
      } else {
        return { type: TokenType.Operator, value: '&' };
      }
    }

    if (char === '>') {
      // TODO: >>>=, >>> 操作符
      return this.parseBinaryOperator(char, char);
    }
    if (char === '<') {
      // TODO: <<<=, <<< 操作符
      return this.parseBinaryOperator(char, char);
    }
    if (char === '^') {
      return this.parseBinaryOperator(char, '');
    }

    if (char === '!') {
      this.stream.next();
      const char1 = this.stream.peek();
      if (char1 === '=') {
        this.stream.next();
        const char2 = this.stream.peek();
        if (char2 === '=') {
          this.stream.next();
          return { type: TokenType.Operator, value: '!==' };
        } else {
          return { type: TokenType.Operator, value: '!=' };
        }
      } else {
        return { type: TokenType.Operator, value: '!' };
      }
    }

    if (char === '=') {
      this.stream.next();
      const char1 = this.stream.peek();
      if (char1 === '=') {
        this.stream.next();
        const char2 = this.stream.peek();
        if (char2 === '=') {
          this.stream.next();
          return { type: TokenType.Operator, value: '===' };
        } else {
          return { type: TokenType.Operator, value: '===' };
        }
      } else if (char1 === '>') {
        this.stream.next();
        return { type: TokenType.Operator, value: '=>' };
      } else {
        return { type: TokenType.Operator, value: '=' };
      }
    }

    if (char === '~') {
      return { type: TokenType.Operator, value: char };
    }

    throw new Error(`Unrecongnized pattern meeting: ${char}, at line: ${this.stream.line}, column: ${this.stream.column}`);
  }

  parseIdentifier(): Token {
    const token: Token = { type: TokenType.Identifier, value: '' };
    
    token.value += this.stream.next();

    while(!this.stream.eof() && isCharacterDigitOrUnderScore(this.stream.peek())) {
      token.value += this.stream.next();
    }

    if (isKeyword(token.value)) {
      if (token.value === 'null') {
        token.type == TokenType.NullLiteral;
      } else if (token.value === 'true' || token.value === 'false') {
        token.type = TokenType.BooleanLiteral;
      } else {
        token.type = TokenType.Keyword;
      }
    }
    return token;
  }

  parseStringLiteral() {
    const token: Token = { type: TokenType.StringLiteral, value: '' };

    this.stream.next();

    while(!this.stream.eof() && this.stream.peek() !== '"') {
      token.value += this.stream.next();
    }
    if (this.stream.peek() === '"') {
      this.stream.next();
      return token;
    }
    throw new Error(`Expecting a " as line: ${this.stream.line}, cloumn: ${this.stream.column}`);
  }

  parseBinaryOperator(firstChar: string, secondChar: string) {
    this.stream.next();
    const char1 = this.stream.peek();
    if (char1 === secondChar) {
      this.stream.next();
      return { type: TokenType.Operator, value: firstChar + secondChar };
    } else if (char1 === '=') {
      this.stream.next();
      return { type: TokenType.Operator, value: firstChar + '=' };
    } else {
      return { type: TokenType.Operator, value: firstChar };
    }
  }

  skipMultipleLineComment(): void {
    if(!this.stream.eof()) {
      let char1 = this.stream.next();
      while(!this.stream.eof()) {
        const char2 = this.stream.next();
        if(char1 === '*' && char2 === '/') {
          return;
        }
        char1 = char2;
      }
    }
  }

  skipSingleLineComment() {
    while(!this.stream.eof() && this.stream.peek() !== '\n') {
      this.stream.next();
    }
  }

  skipWhiteSpaces() {
    while (isWhiteSpace(this.stream.peek())) {
      this.stream.next();
    }
  }
}

export { Tokenizer, Token };
