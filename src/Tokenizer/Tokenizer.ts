import { CharStream } from "../CharStream";
import { isCharacter, isCharacterDigitOrUnderScore, isDigit, isSeperator, isWhiteSpace } from "./utils";

enum TokenType {
  Keyword,
  Identifier,
  StringLiteral,
  Seperator,
  Operator,
  EOF
}

interface Token {
  type: TokenType;
  value: string
}



class Tokenizer {
  stream: CharStream;

  nextToken: Tokenizer;

  constructor(stream: CharStream) {
    this.stream = stream;
  }

  next(): Token {}

  peek(): Token {}


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
      this.parseStringLiteral();
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
      token.type === TokenType.Keyword;
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
    throw new Error(`Expecting a \" as line: ${this.stream.line}, cloumn: ${this.stream.column}`);
  }

  skipMultipleLineComment(): void {
    if(!this.stream.eof()) {
      let char1 = this.stream.next();
      while(!this.stream.eof()) {
        let char2 = this.stream.next();
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