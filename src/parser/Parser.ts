import { BinaryExpression, Block, BooleanLiteral, BuiltinType, CallSignature, DecimalLiteral, Expression, ExpressionStatement, ForStatement, FunctionCall, FunctionDeclare, IfStatement, IntegetLiteral, ParameterList, Program, ReturnStatement, Statement, StringLiteral, Variable, VariableDeclare } from "../ast-node";
import { UnaryExpression } from "../ast-node/UnaryExpression";
import { Operator, Tokenizer, TokenType } from "../tokenizer";
import { getPrecedence } from "./utils";


class Parser {
  tokenizer: Tokenizer;

  constructor(tokenizer: Tokenizer) {
    this.tokenizer = tokenizer;
  }

  parseProgram() {
    const beginPosition = this.tokenizer.peek().position;
    const stmts = this.parseStatementList();
    const endPosition = this.tokenizer.peek().position;
    return new Program(stmts, { beginPosition, endPosition, isErrorNode: false });
  }

  parseStatementList(): Statement[] {
    const stmts: Statement[] = [];
    let stmt: Statement | null = null;
    let token = this.tokenizer.peek();
    while (token !== null && token.type !== TokenType.EOF && token.value !== '}') {
      stmt = this.parseStatement();
      if (stmt !== null) {
        stmts.push(stmt);
      } else {
        throw new Error('Unrecognize Token: ' + token);
      }

      token = this.tokenizer.peek();
    }
    return stmts;
  }

  parseStatement(): Statement | null {
    const token = this.tokenizer.peek();
    if (token?.type === TokenType.Keyword) {
      if (token.value === 'function') {
        return this.parseFunctionDeclare();
      }
      if (token.value === 'let') {
        return this.parseVariableDeclare();
      }
      if (token.value === 'return') {
        return this.parseReturnStatement();
      }
      if (token.value === '{') {
        return this.parseBlock();
      }
      if (token.value === 'if') {
        return this.parseIfStatement();
      }
      if (token.value === 'for') {
        return this.parseForStatement();
      }
      throw new Error(`Not support keyword ${token.value}`);
    } else if (token !== null && (
      token.type === TokenType.Identifier
      || token.type === TokenType.DecimalLiteral
      || token.type === TokenType.IntegerLiteral
      || token.type === TokenType.StringLiteral
      || token.value === '('
    )) {
      return this.parseExpressionStatement();
    } else {
      throw new Error(`cannot recognize a expression starting with ${token?.value}`);
    }
  }

  parseReturnStatement() {
    const beginPosition = this.tokenizer.peek().position;
    let exp: Nullable<Expression> = null;
    // eat return token
    this.tokenizer.next();

    const token = this.tokenizer.peek();
    if (token.type !== TokenType.Seperator && token.value !== ';') {
      exp = this.parseExpression();
    }

    const semiToken = this.tokenizer.peek();
    if (semiToken.type === TokenType.Seperator && semiToken.value === ';') {
      this.tokenizer.next();
    } else {
      throw new Error(`Expecting ';' after return stateent. ${this.tokenizer.lastPositon}`);
    }

    return new ReturnStatement(exp, { beginPosition, endPosition: this.tokenizer.lastPositon, isErrorNode: false });
  }

  parseVariableDeclare() {
    const beginPosition = this.tokenizer.peek().position;
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
        return new VariableDeclare(variableName, this.parseType(variableType), initExpression, {
          beginPosition
          , endPosition: this.tokenizer.lastPositon, isErrorNode: false
        });
      } else {
        throw new Error(`Expecting ; at the end of variable declaretion, while we meet ${semicolonToken?.value}`);
      }
    } else {
      throw new Error(`Expecting variable name in variable declaretion, but we meet ${token?.value}`);
    }
  }

  parseType(varType: string) {
    switch (varType) {
      case 'any':
        return BuiltinType.Any;
      case 'number':
        return BuiltinType.Number;
      case 'string':
        return BuiltinType.String;
      case 'boolean':
        return BuiltinType.Boolean;
      case 'null':
        return BuiltinType.Null;
      case 'undefined':
        return BuiltinType.Undefined;
      case 'integet':
        return BuiltinType.Integer;
      case 'decimal':
        return BuiltinType.Decimal;
      default:
        return BuiltinType.Any;
    }
  }
  parseExpression(): Expression {
    return this.parseAssignment();
  }

  parseAssignment() {
    const assignPrec = getPrecedence('=');
    const expL = this.parseBinaryExpression(assignPrec);

    let token = this.tokenizer.peek();
    let tPrec = getPrecedence(token.value);

    const expStack: Expression[] = [];
    expStack.push(expL);

    const operatorStack: Operator[] = [];

    while (token.type === TokenType.Operator && tPrec == assignPrec) {
      operatorStack.push(token.value as Operator);
      this.tokenizer.next();
      const exp = this.parseBinaryExpression(assignPrec);
      expStack.push(exp);
      token = this.tokenizer.peek();
      tPrec = getPrecedence(token.value);
    }

    let exp = expStack[expStack.length - 1];
    if (operatorStack.length > 0) {
      for (let idx = expStack.length - 2; idx >= 0; idx--) {
        exp = new BinaryExpression(operatorStack[idx], expStack[idx], exp);
      }
    }
    return exp;
  }

  parseBinaryExpression(precedence: number): Expression {
    let exp1 = this.parseUnaryExpression();
    if (exp1 !== null) {
      let token = this.tokenizer.peek();
      if (token !== null) {
        let targetPrecedence = getPrecedence(token.value);

        while (token?.type === TokenType.Operator && targetPrecedence > precedence) {
          this.tokenizer.next();
          const exp2 = this.parseBinaryExpression(targetPrecedence);
          if (exp2 !== null) {
            const exp: BinaryExpression = new BinaryExpression(token.value, exp1, exp2);
            exp1 = exp;
            token = this.tokenizer.peek();
            targetPrecedence = getPrecedence(token?.value!);
          } else {
            throw new Error(`cannot recognize a expression starting with: ${token?.value}`);
          }
        }
      }
      return exp1;
    }
    throw new Error(`cannot recognize a expression starting with: ${this.tokenizer.peek()?.value}`);
  }

  parseUnaryExpression(): Expression {
    const token = this.tokenizer.peek();
    const beginPosition = token.position;

    if (token.type === TokenType.Operator) {
      this.tokenizer.next();
      const exp = this.parseUnaryExpression();
      return new UnaryExpression(token.value as Operator, exp, true, { beginPosition, endPosition: this.tokenizer.lastPositon });
    } else {
      const exp = this.parsePrimary();
      const token = this.tokenizer.peek();
      if (token.type === TokenType.Operator && (token.value === '--' || token.value === '++')) {
        this.tokenizer.next();
        return new UnaryExpression(token.value as Operator, exp, false, { beginPosition, endPosition: this.tokenizer.lastPositon });
      } else {
        return exp;
      }
    }
  }

  parsePrimary(): Expression {
    const token = this.tokenizer.peek();
    const beginPosition = token.position;
    if (token?.type === TokenType.Identifier) {
      if (this.tokenizer.peek2().value === '(') {
        return this.parseFunctionCall();
      } else {
        this.tokenizer.next();
        return new Variable(token.value, { beginPosition, endPosition: this.tokenizer.lastPositon });
      }
    } else if (token?.type === TokenType.IntegerLiteral) {
      this.tokenizer.next();
      return new IntegetLiteral(parseInt(token.value), { beginPosition, endPosition: this.tokenizer.lastPositon });
    } else if (token?.type === TokenType.DecimalLiteral) {
      this.tokenizer.next();
      return new DecimalLiteral(parseFloat(token.value), { beginPosition, endPosition: this.tokenizer.lastPositon });
    } else if (token?.type === TokenType.StringLiteral) {
      this.tokenizer.next();
      return new StringLiteral(token.value, { beginPosition, endPosition: this.tokenizer.lastPositon });
    } else if (token?.type === TokenType.BooleanLiteral) {
      this.tokenizer.next();
      return new BooleanLiteral(token.value === 'true', { beginPosition, endPosition: this.tokenizer.lastPositon });
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
    const beginPosition = this.tokenizer.peek().position;
    this.tokenizer.next();

    const token = this.tokenizer.next();
    if (token?.type === TokenType.Identifier) {
      const token1 = this.tokenizer.peek();
      if (token1?.value === '(') {

        const callSignature: CallSignature = this.parseCallSignature();

        const openBraceToken = this.tokenizer.peek();
        if (openBraceToken.type === TokenType.Seperator && openBraceToken.value === '{') {
          const functionBody = this.parseBlock();
          return new FunctionDeclare(token.value, callSignature, functionBody, {
            beginPosition
            , endPosition: this.tokenizer.lastPositon, isErrorNode: false
          });

        } else {
          throw new Error(`Expecting '{' in Function Declare, while we got a ${openBraceToken.value} ${this.tokenizer.lastPositon}`);
        }
        // if (token2?.value === ')') {

        // } else {
        //   throw new Error(`Expecting ')' in FunctionDeclare, while we got a ${token.value}`);
        // }
      } else {
        throw new Error(`Expecting ')' in FunctionDeclare, while we got a ${token.value}`);
      }

    } else {
      throw new Error(`Expecting a function name, while we got a ${token?.value}`);
    }

  }

  parseCallSignature() {
    const beginPosition = this.tokenizer.peek().position;
    this.tokenizer.next();
    let parameterList = null;

    const token = this.tokenizer.peek();
    if (token.type !== TokenType.Seperator && token.value !== ')') {
      parameterList = this.parseParameterList();
    }
    const closeParanToken = this.tokenizer.peek();
    if (closeParanToken.type === TokenType.Seperator && closeParanToken.value === ')') {
      this.tokenizer.next();

      let returnType = 'any';
      const colonToken = this.tokenizer.peek();
      if (colonToken.type === TokenType.Seperator && colonToken.value === ':') {
        returnType = this.parseTypeAnnotation();
      }

      return new CallSignature(parameterList, this.parseType(returnType), { beginPosition, endPosition: this.tokenizer.lastPositon, isErrorNode: false });
    } else {
      throw new Error(`Expecting a ')' after a call signature ${this.tokenizer.lastPositon}`);
    }
  }

  parseParameterList() {
    const parameterList: VariableDeclare[] = [];

    let token = this.tokenizer.peek();
    const beginPosition = token.position;
    while (token.type !== TokenType.Seperator && token.value !== ')') {
      if (token.type === TokenType.Identifier) {
        this.tokenizer.next();
        let varType = 'any';
        const colonToken = this.tokenizer.peek();
        if (colonToken.type === TokenType.Seperator && colonToken.value === ':') {
          varType = this.parseTypeAnnotation();
        }
        parameterList.push(
          new VariableDeclare(token.value, this.parseType(varType), null, { beginPosition, endPosition: this.tokenizer.lastPositon, isErrorNode: false }),
        );

        token = this.tokenizer.peek();

        if (token.type === TokenType.Seperator && token.value !== ')') {
          if (token.value === ',') {
            this.tokenizer.next();
            token = this.tokenizer.peek();
          } else {
            throw new Error(`Expecting a ',', or ')' after a parameter ${this.tokenizer.lastPositon}`);
          }

        }
      } else {
        throw new Error(`Expecting an indentifier as name of a parameter ${this.tokenizer.lastPositon}`);
      }
    }

    return new ParameterList(parameterList, { beginPosition, endPosition: this.tokenizer.lastPositon, isErrorNode: false });
  }

  parseTypeAnnotation() {
    let theType = 'any';

    this.tokenizer.next();

    const token = this.tokenizer.peek();

    if (token.type === TokenType.Identifier) {
      this.tokenizer.next();
      theType = token.value;
    } else {
      throw new Error(`Expecting a type name in type annotation ${this.tokenizer.lastPositon}`);
    }
    return theType;
  }

  parseBlock() {
    const token = this.tokenizer.peek();
    const beginPosition = token.position;

    this.tokenizer.next();

    const stmts = this.parseStatementList();

    const closeBrace = this.tokenizer.peek();
    if (closeBrace.type === TokenType.Seperator && closeBrace.value === '}') {
      this.tokenizer.next();
      return new Block(stmts, { beginPosition, endPosition: this.tokenizer.lastPositon });
    } else {
      throw new Error(`Expecting '}' while parsing a block, but we got a ${closeBrace.value} ${this.tokenizer.lastPositon}`);
    }
  }

  parseExpressionStatement() {
    const beginPosition = this.tokenizer.peek().position;
    const exp = this.parseExpression();
    const stmt = new ExpressionStatement(exp, { beginPosition, endPosition: this.tokenizer.lastPositon });

    const semiToken = this.tokenizer.peek();
    if (semiToken.type === TokenType.Seperator && semiToken.value === ';') {
      this.tokenizer.next();
    } else {
      throw new Error(`Expecting a semicolon at the end of an expression statement, bug we got a ${semiToken.value} ${this.tokenizer.lastPositon}`);
    }
    return stmt;
  }

  parseFunctionCall(): FunctionCall {
    const params: Expression[] = [];
    const token = this.tokenizer.next();
    const beginPosition = token.position;

    this.tokenizer.next();
    // if (token1?.value === '(') {
    let token2 = this.tokenizer.peek();
    if (token2?.type === TokenType.Seperator && token.value !== ')') {
      this.tokenizer.next();
    } else {
      while (token2?.value !== ')' && token2.type !== TokenType.EOF) {
        const exp = this.parseExpression();
        if (exp !== null) {
          params.push(exp);
        } else {
          throw new Error(`Expecting parameter in FunctionCall, while we got a ${token2?.value}`);
        }
        token2 = this.tokenizer.peek();
        if (token2?.value !== ')') {
          if (token2?.value === ',') {
            token2 = this.tokenizer.next();
          } else {
            throw new Error(`Expecting a comma in FunctionCall, while we got a ${token2?.value}`);
          }
        }
      }
      // eat )
      this.tokenizer.next();
    }


    return new FunctionCall(token.value, params, { beginPosition, endPosition: this.tokenizer.lastPositon });
    // token2 = this.tokenizer.next();
    // if (token2?.value === ';') {
    // } else {
    //   throw new Error(`Expecting a semicolon in FunctionCall, while we got a ${token2?.type}`);
    // }
  }

  parseIfStatement() {
    const beginPosition = this.tokenizer.peek().position;
    this.tokenizer.next(); // skip if token

    const openParenToken = this.tokenizer.peek();
    if (openParenToken.type === TokenType.Seperator && openParenToken.value === '(') {
      this.tokenizer.next(); // skip ( token
      const condition = this.parseExpression();
      const closeParenToken = this.tokenizer.peek();
      if (closeParenToken.type === TokenType.Seperator && closeParenToken.value === ')') {
        this.tokenizer.next(); // skip ) token
        const thenStmts = this.parseIfStatementList();

        const elseToken = this.tokenizer.peek();
        let elseStmts: Nullable<Statement[]> = null;
        if (elseToken.type === TokenType.Keyword && elseToken.value === 'else') {
          this.tokenizer.next(); // skip else token
          const openBracketToken = this.tokenizer.peek();
          if (openBracketToken.type === TokenType.Seperator && openBracketToken.value === '{') {
            elseStmts = this.parseIfStatementList();
            // this.tokenizer.next(); // skip { token
          } else {
            throw new Error(`Expecting '{' while parsing else block, but we got ${openBracketToken.value} ${this.tokenizer.lastPositon}`);
          }
        }

        return new IfStatement(condition, thenStmts, elseStmts, { beginPosition, endPosition: this.tokenizer.lastPositon });
      } else {
        throw new Error(`Expecting ')' at the end of if condition, but we got ${closeParenToken.value} ${this.tokenizer.lastPositon}`);
      }
    } else {
      throw new Error(`Expecting '(' after if keyword, but we got ${openParenToken.value} ${this.tokenizer.lastPositon}`);
    }
  }

  parseIfStatementList() {
    const openBracketToken = this.tokenizer.peek();
    if (openBracketToken.type === TokenType.Seperator && openBracketToken.value === '{') {
      this.tokenizer.next(); // skip { token
      const thenStmts = this.parseStatementList();
      const closeBraceToken = this.tokenizer.peek();
      if (closeBraceToken.type === TokenType.Seperator && closeBraceToken.value === '}') {
        this.tokenizer.next(); // skio } token
        return thenStmts;
      } else {
        throw new Error(`Expecting '{' while parsing if block, but we got ${openBracketToken.value} ${this.tokenizer.lastPositon}`);
      }
    } else {
      throw new Error(`Expecting '}' while parsing if block, but we got ${openBracketToken.value} ${this.tokenizer.lastPositon}`);
    }
  }

  parseForStatement(): ForStatement {
    const beginPosition = this.tokenizer.peek().position;
    this.tokenizer.next(); // skip for token

    const openParenToken = this.tokenizer.peek();

    if (openParenToken.type === TokenType.Seperator && openParenToken.value === '(') {
      this.tokenizer.next();
      const initExp = this.parseForExpression();
      const conditionExp = this.parseForExpression() as Nullable<Expression>;
      const incrementExp = this.parseForExpression() as Nullable<Expression>;

      const closeParanToken = this.tokenizer.peek();
      if (closeParanToken.type === TokenType.Seperator && closeParanToken.value === ')') {
        this.tokenizer.next();
        const openBracketToken = this.tokenizer.peek();
        if (openBracketToken.type === TokenType.Seperator && openBracketToken.value === '{') {
          this.tokenizer.next(); // skip { token
          const stmts = this.parseStatementList();
          const closeBraceToken = this.tokenizer.peek();
          if (closeBraceToken.type === TokenType.Seperator && closeBraceToken.value === '}') {
            this.tokenizer.next(); // skio } token
            return new ForStatement(initExp, conditionExp, incrementExp, stmts, null, { beginPosition, endPosition: this.tokenizer.lastPositon });
          } else {
            throw new Error(`Expecting '{' while parsing for block, but we got ${openBracketToken.value} ${this.tokenizer.lastPositon}`);
          }
        } else {
          throw new Error(`Expecting '}' while parsing for block, but we got ${openBracketToken.value} ${this.tokenizer.lastPositon}`);
        }
      } else {
        throw new Error(`Expecting ')' while parsing for statement, but we got ${closeParanToken.value} ${this.tokenizer.lastPositon}`);
      }
    } else {
      throw new Error(`Expecting '(' while parsing for statement, but we got ${openParenToken.value} ${this.tokenizer.lastPositon}`);
    }
  }

  parseForExpression() {
    // this.tokenizer.next(); // skip ( token
    let expression: Nullable<Expression | VariableDeclare> = null;
    const token = this.tokenizer.peek();
    if (token.type !== TokenType.Seperator && token.value !== ';') {
      if (token.type === TokenType.Keyword && token.value === 'let') {
        return this.parseVariableDeclare();
      } else {
        expression = this.parseExpression();
      }
    }
    const semiToken = this.tokenizer.peek();
    if (semiToken.type === TokenType.Seperator && (semiToken.value === ';' || semiToken.value === ')')) {
      if (semiToken.value === ';') {
        this.tokenizer.next();
      }
      return expression;
    } else {
      throw new Error(`Expecting ';' while pareing for expression, but we got ${semiToken.value} ${this.tokenizer.lastPositon}`);
    }

  }
}

export { Parser };
