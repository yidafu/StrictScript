import { FunctionBody } from "../AstNode/FunctionBody";
import { FunctionCall } from "../AstNode/FunctionCall";
import { FunctionDeclare } from "../AstNode/FunctionDeclare";
import { Program } from "../AstNode/Program";
import { Statement } from "../AstNode/Statement";
import { Tokenizer, TokenType } from "../Tokenizer/Tokenizer";
import { getPrecedence } from "./utils";

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
      if(token.type == TokenType.Keyword) {
        if (token.value === 'function') {
          stmt = this.parseFunctionDeclare();
        } else if (token.value === 'let') {
          stmt = this.parseVariableDeclare();
        }
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

  parseVariableDeclare() {
    this.tokenizer.next();

    const token = this.tokenizer.next();
    if (token?.type === TokenType.Identifier) {
      const variableName = token.value;
      let variableType = 'any';
      let initExpression: Expression | null = null;

      const colonToken = this.tokenizer.peek();
      if (colonToken?.type === TokenType.Seperator && colonToken.value === ':') {
        this.tokenizer.next();
        const typeToken = this.tokenizer.peek();
        if (typeToken?.type === TokenType.Identifier) {
          this.tokenizer.next();
          variableType = typeToken.value;
        } else {
          throw new Error('Error parsing type annotation in VariableDeclare');
        }
      }

      const equalSignToken = this.tokenizer.peek();
      if (equalSignToken?.type === TokenType.Operator && equalSignToken.value === '=') {
        this.tokenizer.next();
        initExpression = this.parseExpression();
      }

      const semicolonToken = this.tokenizer.peek();
      if (semicolonToken?.type === TokenType.Seperator && semicolonToken.value === ';') {
        this.tokenizer.next();
        return new VariableDeclare(variableName, variableType, initExpression);
      } else {
        throw new Error(`Expecting ; at the end of variable declaretion, while we meet ${semicolonToken?.value}`);
      }
    } else {
      throw new Error(`Expecting variable name in variable declaretion, but we meet ${token?.value}`);
    }
  }

  parseExpression(): Expression | null {
    return this.parseBinary(0);
  }

  parseBinary(precedence: number) {
    let exp1 = this.parsePrimary();
    if (exp1 !== null) {
      const token = this.tokenizer.peek();
      if (token?.type === TokenType.Operator) {
        let targetPrecedence = getPrecedence(token.value);

        while (token.type === TokenType.Operator && targetPrecedence > precedence) {
          this.tokenizer.next();
          const exp2 = this.parseBinary(targetPrecedence);
          if (exp2 !== null) {
            let exp: Binary = new Binary(token.value, exp1, exp2);
            exp1 = exp;
            token = this.tokenizer.peek();
            targetPrecedence = getPrecedence(token?.value);
          } else {
            throw new Error(`cannot recognize a expression starting with: ${token?.value}`);
          }
        }
      }
      return exp1;
    }
    throw new Error(`cannot recognize a expression starting with: ${this.tokenizer.peek()?.value}`);
  }

  parsePrimary() {
    const token = this.tokenizer.peek();
    if (token?.type === TokenType.Identifier) {
      if (this.tokenizer.peek2().value === '(') {
        return this.parseFunctionCall();
      } else {
        this.tokenizer.next();
        return new Varialble(token.value);
      }
    } else if (token?.type === TokenType.IntegerLiteral) {
      this.tokenizer.next();
      return new IntegerLiteral(parseInt(token.value));
    } else if (token?.type === TokenType.DecimalLiteral) {
      this.tokenizer.next();
      return new DecimalLiteral(parseFloat(token.value));
    } else if (token?.type === TokenType.StringLiteral) {
      this.tokenizer.next();
      return new StringLiteral(token.value);
    } else if (token?.type === TokenType.BooleanLiteral) {
      this.tokenizer.next();
      return new BooleanLiteral(token.value === 'true');
    } else if (token?.type === TokenType.Seperator && token.value === '(') {
      this.tokenizer.next();
      const exp = this.parseExpression();
      const closeParenthesisToken = this.tokenizer.peek();
      if (closeParenthesisToken?.type === TokenType.Seperator && closeParenthesisToken.value === ')') {
        this.tokenizer.next();
        return exp;
      } else {
        throw new Error(`Expecting a ')' ad the end of a primary expression, but we got a ${token.value}`);
      }
    } else {
      throw new Error(`cannot recognize a primary expression starting with: ${token?.value}`);
    }
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
