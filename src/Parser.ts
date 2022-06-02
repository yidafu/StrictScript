import { FunctionBody } from "./AstNode/FunctionBody";
import { FunctionCall } from "./AstNode/FunctionCall";
import { FunctionDeclare } from "./AstNode/FunctionDeclare";
import { Program } from "./AstNode/Program";
import { Statement } from "./AstNode/Statement";
import { Tokenizer, TokenType } from "./Tokenizer/Tokenizer";

class Parser {
  tokenizer: Tokenizer;

  constructor(tokenizer: Tokenizer) {
    this.tokenizer = tokenizer;
  }

  parseProgram() {
    const stmts: Statement[] = [];
    let stmt: Statement | null = null;
    let token = this.tokenizer.peek();
    while (token !== null && token.type !== TokenType.EOF) {
      if (token.type === TokenType.Keyword && token.value === 'function') {
        stmt = this.parseFunctionDeclare();
      } else if (token.type === TokenType.Identifier){
        stmt = this.parseFunctionCall();
      }

      if (stmt !== null) {
        stmts.push(stmt);
      } else {
        throw new Error('Unrecognize Token: ' + token);
      }

      token = this.tokenizer.peek();
    }

    return new Program(stmts);
  }

  parseFunctionDeclare(): FunctionDeclare {
    this.tokenizer.next();

    const token = this.tokenizer.next();
    if (token?.type === TokenType.Identifier) {
      const token1 = this.tokenizer.next();
      if (token1?.value === '(') {
        const token2 = this.tokenizer.next();
        if (token2?.value === ')') {
          const functionBody = this.parseFunctionBody();
          if (functionBody !== null) {
            return new FunctionDeclare(token.value, functionBody);
          } else {
            throw new Error('Error in parsing FuntionBody in FunctionDeclare');
          }
        } else {
          throw new Error(`Expecting ')' in FunctionDeclare, while we got a ${token.value}`);
        }
      } else {
        throw new Error(`Expecting ')' in FunctionDeclare, while we got a ${token.value}`);
      }

    } else {
      throw new Error(`Expecting a function name, while we got a ${token?.value}`);
    }

  }

  parseFunctionBody(): FunctionBody {
    const stmts: FunctionCall[] = [];

    const token = this.tokenizer.next();
    if (token?.value === "{") {
      while (this.tokenizer.peek()?.type == TokenType.Identifier) {
        const functionCall = this.parseFunctionCall();
        if (functionCall !== null) {
          stmts.push(functionCall);
        } else {
          throw new Error('Error parsing a FunnctionCall in FunctionBody');
        }
      }
      const token1 = this.tokenizer.next();
      if (token1?.value === '}') {
        return new FunctionBody(stmts);
      } else {
        throw new Error(`Expecting '}' in FunctionBody, while we got a ${token1?.value}`);
      }
    } else {
      throw new Error(`Expecting '{' in FunctionBody, while we got a ${token?.value}`);
    }
  }

  parseFunctionCall(): FunctionCall | null {
    const params: string[] = [];
    const token = this.tokenizer.next();

    if (token?.type == TokenType.Identifier) {
      const token1 = this.tokenizer.next();
      if (token1?.value === '(') {
        let token2 = this.tokenizer.next();
        while(token2?.value !== ')') {
          if (token2?.type === TokenType.StringLiteral) {
            params.push(token2.value);
          } else {
            throw new Error(`Expecting parameter in FunctionCall, while we got a ${token2?.value}`);
          }
          token2 = this.tokenizer.next();
          if (token2?.value !== ')') {
            if (token2?.value === ',') {
              token2 = this.tokenizer.next();
            } else {
              throw new Error(`Expecting a comma in FunctionCall, while we got a ${token2?.value}`);
            }
          }
        }

        token2 = this.tokenizer.next();
        if (token2?.value === ';') {
          return new FunctionCall(token.value, params);
        } else {
          throw new Error(`Expecting a semicolon in FunctionCall, while we got a ${token2?.type}`);
        }
      }
    }

    return null;
  }
}

export { Parser };
