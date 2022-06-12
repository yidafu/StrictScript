import { InputStream } from "./InputStream";
import { Position } from "./Position";
import { Token, TokenType } from "./Token";
import { isCharacter, isCharacterDigitOrUnderScore, isDigit, isKeyword, isOperator, isSeperator, isWhiteSpace } from "./utils";


class Tokenizer {
  stream: InputStream;

  currToken: Token = new Token(TokenType.EOF, '', new Position(0, 0, 0, 0));
  postToken: Token = new Token(TokenType.EOF, '', new Position(0, 0, 0, 0));

  lastPositon: Position = new Position(0, 0, 0, 0);

  constructor(stream: InputStream) {
    this.stream = stream;
  }

  next(): Token {
    const lastToken = this.peek();
    if (this.postToken.type !== TokenType.EOF) {
      this.currToken = this.postToken;
      this.postToken = new Token(TokenType.EOF,'', new Position(0, 0, 0,0) );
    } else {
      this.currToken = this.getAToken();
    }
    this.lastPositon =  lastToken.position;
    return lastToken;
  }

  peek(): Token {
    if (this.currToken?.type === TokenType.EOF && !this.stream.eof()) {
      this.currToken = this.getAToken();
    }
    return this.currToken;
  }

  peek2() {
    if (this.postToken.type === TokenType.EOF && !this.stream.eof()) {
      this.postToken = this.getAToken();
    }
    return this.postToken;
  }


  getAToken(): Token {
    this.skipWhiteSpaces();
    const pos = this.stream.getPosition();
    if (this.stream.eof()) {
      return new Token(TokenType.EOF, '', pos);
    }
    const char = this.stream.peek();
    if (isCharacter(char)) {
      return this.parseIdentifier();
    }

    if (char === '"') {
      return this.parseStringLiteral();
    }

    if (isSeperator(char)) {
      return new Token(TokenType.Seperator, this.stream.next(), pos);
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
          return new Token(TokenType.DecimalLiteral, numberLiteral, pos);
        } else {
          return new Token(TokenType.IntegerLiteral, numberLiteral, pos);
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
        return new Token(TokenType.DecimalLiteral, numberLiteral, pos);
      } else if (char1 === '.') {
        this.stream.next();
        const char2 = this.stream.peek();
        if (char2 === '.') {
          return new Token(TokenType.Seperator, '...', pos);
        } else {
          throw new Error('Unrecognized patter: ..., missd a . ?');
        }
      } else {
        return new Token(TokenType.Seperator, '.', pos);
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
          return new Token(TokenType.Operator, '/=', pos);
        } else {
          return new Token(TokenType.Operator, '/', pos);
        }
      }
    }

    if (['+', '-', '*', '&', '|', '%'].includes(char)) {
      return this.parseBinaryOperator(char, char);
    }

    if (char === '&') {
      this.stream.next();
      const char1 = this.stream.peek();
      if (char1 === '=') {
        this.stream.next();
        pos.end = this.stream.position + 1;
        return new Token(TokenType.Operator, '&=', pos);
      } else {
        return new Token(TokenType.Operator, '&', pos);
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
          pos.renewEnd(this.stream);
          return new Token(TokenType.Operator, '!==', pos);
        } else {
          pos.renewEnd(this.stream);
          return new Token(TokenType.Operator, '!=', pos);
        }
      } else {
        return new Token(TokenType.Operator, '!', pos);
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
          pos.renewEnd(this.stream);
          return new Token(TokenType.Operator, '===', pos);
        } else {
          pos.renewEnd(this.stream);
          return new Token(TokenType.Operator, '==', pos);
        }
      } else if (char1 === '>') {
        this.stream.next();
        pos.renewEnd(this.stream);
        return new Token(TokenType.Operator, '=>', pos);
      } else {
        return new Token(TokenType.Operator, '=', pos);
      }
    }

    if (char === '~') {
      return new Token(TokenType.Operator, char, pos);
    }

    throw new Error(`Unrecongnized pattern meeting: ${char}, at line: ${this.stream.line}, column: ${this.stream.column}`);
  }

  parseIdentifier(): Token {
    const pos = this.stream.getPosition();
    const token: Token = new Token(TokenType.Identifier, '', pos);
    
    token.value += this.stream.next();

    while(!this.stream.eof() && isCharacterDigitOrUnderScore(this.stream.peek())) {
      token.value += this.stream.next();
    }
    pos.renewEnd(this.stream);

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
    const pos = this.stream.getPosition();
    const token: Token = new Token(TokenType.StringLiteral, '', pos);

    this.stream.next();

    while(!this.stream.eof() && this.stream.peek() !== '"') {
      token.value += this.stream.next();
    }
    pos.renewEnd(this.stream);

    if (this.stream.peek() === '"') {
      this.stream.next();
      return token;
    }
    throw new Error(`Expecting a " as line: ${this.stream.line}, cloumn: ${this.stream.column}`);
  }

  parseBinaryOperator(firstChar: string, secondChar: string) {
    const pos = this.stream.getPosition();
    this.stream.next();
    const char1 = this.stream.peek();
    if (char1 === secondChar) {
      this.stream.next();
      pos.end = this.stream.position + 1;
      return new Token(TokenType.Operator, firstChar + secondChar, pos);
    } else if (char1 === '=') {
      this.stream.next();
      pos.end = this.stream.position + 1;
      return new Token(TokenType.Operator, firstChar + '=', pos);
    } else {
      return new Token(TokenType.Operator, firstChar, pos);
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
