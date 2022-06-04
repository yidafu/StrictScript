import { InputStream } from "../InputStream";
import { isCharacter, isCharacterDigitOrUnderScore, isDigit, isSeperator, isWhiteSpace } from "./utils";

enum TokenType {
  Keyword,
  Identifier,
  StringLiteral,
  Seperator,
  Operator,
  EOF,
}

interface Token {
  type: TokenType;
  value: string
}

type KeyWord = 'let' | 'const' | 'function' | 'class' | 'delete' | 'return' 
| 'break' | 'continue' | 'if' | 'else' | 'for' | 'try' | 'catch' | 'in' | 'this' 
| 'switch' | 'instanceof' | 'true' | 'false' | 'new' | 'default';

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
    if (isCharacter(char) || isDigit(char)) {
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
        return { type:TokenType.Seperator, value: '/' };
      }
    }

    if (char === '+') {
      this.stream.next();
      const char1 = this.stream.peek();
      if (char1 === '+') {
        this.stream.next();
        return { type: TokenType.Operator, value: '++' };
      } else if (char1 === '=') {
        return { type: TokenType.Operator, value: '+=' };
      } else {
        return { type: TokenType.Operator, value: '+' };
      }
    }

    if (char === '-') {
      this.stream.next();
      const char1 = this.stream.peek();
      if (char1 === '-') {
        this.stream.next();
        return { type: TokenType.Operator, value: '--' };
      } else if (char1 === '=') {
        return { type: TokenType.Operator, value: '-=' };
      } else {
        return { type: TokenType.Operator, value: '-' };
      }
    }

    if (char === '*') {
      this.stream.next();
      const char1 = this.stream.peek();

      if (char1 === '=') {
        return { type: TokenType.Operator, value: '*=' };
      } else {
        return { type: TokenType.Operator, value: '*' };
      }
    }

    throw new Error(`Unrecongnized pattern meeting: ${char}, at line: ${this.stream.line}, column: ${this.stream.column}`);
  }

  parseIdentifier(): Token {
    const token: Token = { type: TokenType.Identifier, value: '' };
    
    token.value += this.stream.next();

    while(!this.stream.eof() && isCharacterDigitOrUnderScore(this.stream.peek())) {
      token.value += this.stream.next();
    }

    if (token.value === 'function') {
      token.type = TokenType.Keyword;
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

export { Tokenizer, TokenType, Token };
