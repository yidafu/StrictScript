import {
  BinaryExpression,
  Block,
  BooleanLiteral,
  BuiltinType,
  CallSignature,
  DecimalLiteral,
  Expression,
  ExpressionStatement,
  ForStatement,
  FunctionCall,
  FunctionDeclare,
  IfStatement,
  IntegetLiteral,
  LiteralTypeExpression,
  NullLiteral,
  ParameterList,
  PredefinedTypeExpression,
  Program,
  ReturnStatement,
  Statement,
  StringLiteral,
  SuperCall,
  ThisExpression,
  TypeExpression,
  TypeReferenceExpression,
  Variable,
  VariableDeclare,
} from '../ast-node';
import { ClassBody } from '../ast-node/ClassBody';
import { ClassDeclare } from '../ast-node/ClassDeclare';
import { ConstructorCall } from '../ast-node/ConstructorCall';
import { ConstructorDeclare } from '../ast-node/ConstructorDeclare';
import { DotExpression } from '../ast-node/DotExpression';
import { SuperExpression } from '../ast-node/SuperExpression';
import { TypeofExpression } from '../ast-node/TypeofExpression';
import { UnaryExpression } from '../ast-node/UnaryExpression';
import {
  KeyWord,
  Operator, Position, Tokenizer, TokenType,
} from '../tokenizer';

import { getPrecedence } from './utils';

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
        throw new Error(`Unrecognize Token: ${token}`);
      }

      token = this.tokenizer.peek();
    }
    return stmts;
  }

  parseStatement(): Statement | null {
    const token = this.tokenizer.peek();

    if (token.isKeyworkd('function')) {
      return this.parseFunctionDeclare();
    }

    if (token.isKeyworkd('let') || token.isKeyworkd('const')) {
      return this.parseVariableDeclare();
    }

    if (token.isKeyworkd('return')) {
      return this.parseReturnStatement();
    }

    if (token.isKeyworkd('if')) {
      return this.parseIfStatement();
    }

    if (token.isKeyworkd('for')) {
      return this.parseForStatement();
    }

    if (token.isKeyworkd('class')) {
      return this.parseClassDeclare();
    }

    if (token.isSeperator('{')) {
      return this.parseBlock();
    }

    if (token !== null && (
      token.type === TokenType.Identifier
      || token.type === TokenType.DecimalLiteral
      || token.type === TokenType.IntegerLiteral
      || token.type === TokenType.StringLiteral
      || token.isSeperator('(')
      || token.isKeyworkd('this')
      || token.isKeyworkd('super')
    )) {
      return this.parseExpressionStatement();
    }

    // if (token.isKeyworkd('super')) {
    //   const token1 = this.tokenizer.peek2();
    //   if (token1.isSeperator('(')) {
    //     const superCall = this.parseSuperCall();
    //     const closeParenthesisToken = this.tokenizer.peek();
    //     if (closeParenthesisToken.isSeperator(';')) {
    //       this.tokenizer.next();
    //     }
    //     return superCall;
    //   } else {
    //     return this.parseExpressionStatement();
    //   }
    // }

    throw new Error(`cannot recognize a expression starting with ${token?.value} ${this.tokenizer.lastPositon}`);
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

    return new ReturnStatement(exp, {
      beginPosition, endPosition: this.tokenizer.lastPositon, isErrorNode: false,
    });
  }

  parseVariableDeclare() {
    const beginPosition = this.tokenizer.peek().position;
    this.tokenizer.next();
    return this.parseVariableDeclareWithoutDeclarator(beginPosition);
  }

  parseVariableDeclareWithoutDeclarator(beginPosition: Position) {
    const token = this.tokenizer.next();
    if (token?.type === TokenType.Identifier) {
      const variableName = token.value;
      let typeExpression: Nullable<TypeExpression> = null;
      let initExpression: Expression | null = null;

      const colonToken = this.tokenizer.peek();
      if (colonToken?.type === TokenType.Seperator && colonToken.value === ':') {
        typeExpression = this.parseTypeAnnotation();
      }

      const equalSignToken = this.tokenizer.peek();
      if (equalSignToken?.type === TokenType.Operator && equalSignToken.value === '=') {
        this.tokenizer.next();
        initExpression = this.parseExpression();
      }

      const semicolonToken = this.tokenizer.peek();
      if (semicolonToken?.type === TokenType.Seperator && semicolonToken.value === ';') {
        this.tokenizer.next();
        return new VariableDeclare(variableName, typeExpression, initExpression, {
          beginPosition,
          endPosition: this.tokenizer.lastPositon,
          isErrorNode: false,
        });
      }
      throw new Error(`Expecting ; at the end of variable declaretion, while we meet ${semicolonToken?.value}`);
    } else {
      throw new Error(`Expecting variable name in variable declaretion, but we meet ${token?.value}`);
    }
  }

  parseType() {
    // const beginPosition = this.tokenizer.postToken;

    const types: TypeExpression[] = [];
    types.push(this.parsePrimaryTypeExpression());

    // TODO: 支持解析联合类型

    return types[0];
  }

  parsePrimaryTypeExpression() {
    const beginPosition = this.tokenizer.peek().position;

    const token = this.tokenizer.peek();
    if (token.type === TokenType.Identifier) {
      this.tokenizer.next();
      return new TypeReferenceExpression(token.value, {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    }
    if (
      token.isKeyworkd('any')
      || token.isKeyworkd('boolean')
      || token.isKeyworkd('number')
      || token.isKeyworkd('string')
      || token.isKeyworkd('void')
    ) {
      this.tokenizer.next();
      return new PredefinedTypeExpression(
        token.value as KeyWord,
        { beginPosition, endPosition: this.tokenizer.lastPositon },
      );
    }

    if (token.isLiterator()) {
      const literal = this.parseLiteral();
      return new LiteralTypeExpression(literal, {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    }
    // TODO: (number|string)   string[]
    throw new Error('unknow type expression');
  }

  parseLiteral() {
    const token = this.tokenizer.peek();
    const beginPosition = token.position;
    if (token.type === TokenType.IntegerLiteral) {
      this.tokenizer.next();
      return new IntegetLiteral(
        parseInt(token.value, 10),
        { beginPosition, endPosition: this.tokenizer.lastPositon },
      );
    }
    if (token.type === TokenType.DecimalLiteral) {
      this.tokenizer.next();
      return new DecimalLiteral(
        parseFloat(token.value),
        { beginPosition, endPosition: this.tokenizer.lastPositon },
      );
    }
    if (token.type === TokenType.NullLiteral) {
      this.tokenizer.next();
      return new NullLiteral({
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    }

    if (token.type === TokenType.BooleanLiteral) {
      return new BooleanLiteral(token.value === 'true', {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    }
    this.tokenizer.next();
    return new StringLiteral(token.value, {
      beginPosition, endPosition: this.tokenizer.lastPositon,
    });
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

    while (token.type === TokenType.Operator && tPrec === assignPrec) {
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
      return new UnaryExpression(token.value as Operator, exp, true, {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    }
    const exp = this.parsePrimary();
    const token1 = this.tokenizer.peek();
    if (token1.type === TokenType.Operator && (token1.value === '--' || token1.value === '++')) {
      this.tokenizer.next();
      return new UnaryExpression(token1.value as Operator, exp, false, {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    }
    return exp;
  }

  parsePrimary(): Expression {
    const token = this.tokenizer.peek();
    const beginPosition = token.position;

    let expL: Nullable<Expression> = null;

    if (token?.type === TokenType.Identifier) {
      if (this.tokenizer.peek2().value === '(') {
        expL = this.parseFunctionCall();
      }
      this.tokenizer.next();
      expL = new Variable(token.value, { beginPosition, endPosition: this.tokenizer.lastPositon });
    } else if (token?.type === TokenType.IntegerLiteral) {
      this.tokenizer.next();
      expL = new IntegetLiteral(parseInt(token.value, 10), {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    } else if (token?.type === TokenType.DecimalLiteral) {
      this.tokenizer.next();
      expL = new DecimalLiteral(parseFloat(token.value), {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    } else if (token?.type === TokenType.StringLiteral) {
      this.tokenizer.next();
      expL = new StringLiteral(token.value, {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    } else if (token?.type === TokenType.BooleanLiteral) {
      this.tokenizer.next();
      expL = new BooleanLiteral(token.value === 'true', { beginPosition, endPosition: this.tokenizer.lastPositon });
    } else if (token?.type === TokenType.Seperator && token.value === '(') {
      this.tokenizer.next();
      const exp = this.parseExpression();
      const closeParenthesisToken = this.tokenizer.peek();
      if (closeParenthesisToken?.type === TokenType.Seperator && closeParenthesisToken.value === ')') {
        this.tokenizer.next();
        expL = exp;
      }
      throw new Error(`Expecting a ')' ad the end of a primary expression, but we got a ${token.value}`);
    } else if (token?.isKeyworkd('typeof')) {
      this.tokenizer.next(); // eat typeof keyword
      const exp = this.parseExpression();
      expL = new TypeofExpression(exp, {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    } else if (token?.isKeyworkd('this')) {
      this.tokenizer.next(); // eat this
      expL = new ThisExpression({
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    } else if (token?.isKeyworkd('super')) {
      const token1 = this.tokenizer.peek2();
      if (token1.isSeperator('(')) {
        expL = this.parseSuperCall();
      } else {
        this.tokenizer.next(); // eat super keyword
        expL = new SuperExpression({
          beginPosition, endPosition: this.tokenizer.lastPositon,
        });
      }
    } else if (token?.isKeyworkd('new')) {
      this.tokenizer.next(); // eat new keywork
      expL = this.parseContructorCall();
    } else {
      throw new Error(`cannot recognize a primary expression starting with: ${token?.value}`);
    }

    let seperatorToken = this.tokenizer.peek();
    while (seperatorToken.isSeperator('.')) {
      this.tokenizer.next();
      const expR = this.parsePrimary();
      expL = new DotExpression(expL, expR);

      seperatorToken = this.tokenizer.peek();
    }

    return expL;
  }

  parseFunctionDeclare(): FunctionDeclare {
    const beginPosition = this.tokenizer.peek().position;
    this.tokenizer.next();
    return this.parseMethodDeclare(beginPosition);
  }

  parseMethodDeclare(beginPosition: Position) {
    const token = this.tokenizer.next();
    if (token?.type === TokenType.Identifier) {
      const token1 = this.tokenizer.peek();
      if (token1?.value === '(') {
        const callSignature: CallSignature = this.parseCallSignature();

        const openBraceToken = this.tokenizer.peek();
        if (openBraceToken.type === TokenType.Seperator && openBraceToken.value === '{') {
          const functionBody = this.parseBlock();
          return new FunctionDeclare(token.value, callSignature, functionBody, {
            beginPosition,
            endPosition: this.tokenizer.lastPositon,
            isErrorNode: false,
          });
        }
        throw new Error(`Expecting '{' in Function Declare, while we got a ${openBraceToken.value} ${this.tokenizer.lastPositon}`);

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

      let returnType: Nullable<TypeExpression> = null;
      const colonToken = this.tokenizer.peek();
      if (colonToken.type === TokenType.Seperator && colonToken.value === ':') {
        returnType = this.parseTypeAnnotation();
      }

      return new CallSignature(parameterList, returnType, {
        beginPosition, endPosition: this.tokenizer.lastPositon, isErrorNode: false,
      });
    }
    throw new Error(`Expecting a ')' after a call signature ${this.tokenizer.lastPositon}`);
  }

  parseParameterList() {
    const parameterList: VariableDeclare[] = [];

    let token = this.tokenizer.peek();
    const beginPosition = token.position;
    while (token.type !== TokenType.Seperator && token.value !== ')') {
      if (token.type === TokenType.Identifier) {
        this.tokenizer.next();
        let varType: Nullable<TypeExpression> = null;
        const colonToken = this.tokenizer.peek();
        if (colonToken.type === TokenType.Seperator && colonToken.value === ':') {
          varType = this.parseTypeAnnotation();
        }
        parameterList.push(
          new VariableDeclare(token.value, varType, null, {
            beginPosition, endPosition: this.tokenizer.lastPositon, isErrorNode: false,
          }),
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

    return new ParameterList(parameterList, {
      beginPosition, endPosition: this.tokenizer.lastPositon, isErrorNode: false,
    });
  }

  parseTypeAnnotation() {
    this.tokenizer.next(); // eat :

    return this.parseType();
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
    }
    throw new Error(`Expecting '}' while parsing a block, but we got a ${closeBrace.value} ${this.tokenizer.lastPositon}`);
  }

  parseExpressionStatement() {
    const beginPosition = this.tokenizer.peek().position;
    const exp = this.parseExpression();
    const stmt = new ExpressionStatement(exp, {
      beginPosition, endPosition: this.tokenizer.lastPositon,
    });

    const semiToken = this.tokenizer.peek();
    if (semiToken.type === TokenType.Seperator && semiToken.value === ';') {
      this.tokenizer.next();
    } else {
      throw new Error(`Expecting a semicolon at the end of an expression statement, bug we got a ${semiToken.value} ${this.tokenizer.lastPositon}`);
    }
    return stmt;
  }

  parseContructorCall() {
    const funcCall = this.parseFunctionCall();
    return new ConstructorCall(funcCall.parameters, {
      beginPosition: funcCall.beginPosition, endPosition: funcCall.endPosition,
    });
  }

  parseSuperCall() {
    const funcCall = this.parseFunctionCall();
    return new SuperCall(funcCall.parameters, {
      beginPosition: funcCall.beginPosition, endPosition: funcCall.endPosition,
    });
  }

  parseFunctionCall(): FunctionCall {
    const params: Expression[] = [];
    const token = this.tokenizer.next();
    const beginPosition = token.position;

    this.tokenizer.next(); // eat function name
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

    return new FunctionCall(token.value, params, {
      beginPosition, endPosition: this.tokenizer.lastPositon,
    });
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

        return new IfStatement(condition, thenStmts, elseStmts, {
          beginPosition, endPosition: this.tokenizer.lastPositon,
        });
      }
      throw new Error(`Expecting ')' at the end of if condition, but we got ${closeParenToken.value} ${this.tokenizer.lastPositon}`);
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
      }
      throw new Error(`Expecting '{' while parsing if block, but we got ${openBracketToken.value} ${this.tokenizer.lastPositon}`);
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
            return new ForStatement(initExp, conditionExp, incrementExp, stmts, null, {
              beginPosition, endPosition: this.tokenizer.lastPositon,
            });
          }
          throw new Error(`Expecting '{' while parsing for block, but we got ${openBracketToken.value} ${this.tokenizer.lastPositon}`);
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
      }
      expression = this.parseExpression();
    }
    const semiToken = this.tokenizer.peek();
    if (semiToken.type === TokenType.Seperator && (semiToken.value === ';' || semiToken.value === ')')) {
      if (semiToken.value === ';') {
        this.tokenizer.next();
      }
      return expression;
    }
    throw new Error(`Expecting ';' while pareing for expression, but we got ${semiToken.value} ${this.tokenizer.lastPositon}`);
  }

  parseClassDeclare() {
    const beginPosition = this.tokenizer.peek().position;
    // eat class keyword
    this.tokenizer.next();
    const token = this.tokenizer.peek();
    let className = '';
    if (token.type === TokenType.Identifier) {
      className = token.value;
      this.tokenizer.next();
    }
    let superClass: Nullable<string> = null;
    const token2 = this.tokenizer.peek();
    if (token2.type === TokenType.Keyword && token2.value === 'extends') {
      this.tokenizer.next(); // eat extends keyword
      const superClassToken = this.tokenizer.peek();
      if (superClassToken.type === TokenType.Identifier) {
        superClass = superClassToken.value;
        this.tokenizer.next();
      } else {
        throw new Error(`Expecting a indetifier after extends keyword, but we got ${superClassToken.value} ${this.tokenizer.lastPositon}`);
      }
    }
    const openBraceToken = this.tokenizer.peek();
    if (openBraceToken.type === TokenType.Seperator && openBraceToken.value === '{') {
      const classBody = this.parseClassBody();
      return new ClassDeclare(className, superClass, classBody, {
        beginPosition, endPosition: this.tokenizer.lastPositon,
      });
    }
    throw new Error(`Expecting Class body start with '{', but we got ${openBraceToken.value} ${this.tokenizer.lastPositon}`);
  }

  parseClassBody(): ClassBody {
    const topBeginPosition = this.tokenizer.peek().position;
    this.tokenizer.next(); // eat {
    const beginPosition = this.tokenizer.peek().position;
    let token = this.tokenizer.peek();
    let constructorDeclare: Nullable<ConstructorDeclare> = null;
    const propertyDeclares: VariableDeclare[] = [];
    const methodDeclares: FunctionDeclare[] = [];
    while (
      (token.type === TokenType.Keyword && token.value === 'constructor')
      || (token.type === TokenType.Identifier)
    ) {
      if (token.type === TokenType.Keyword && token.value === 'constructor') {
        constructorDeclare = this.parseConstructorDeclare();
      } else if (token.type === TokenType.Identifier) {
        // 分两种情况：属性和方法
        const token1 = this.tokenizer.peek2();
        if (token1.type === TokenType.Seperator && token1.value === '(') { // 方法
          const methodDeclare = this.parseMethodDeclare(beginPosition);
          methodDeclares.push(methodDeclare);
        } else { // 属性
          const propertyDeclare = this.parseVariableDeclareWithoutDeclarator(beginPosition);
          propertyDeclares.push(propertyDeclare);
        }
      }
      token = this.tokenizer.peek();
    }

    const closeBraceToken = this.tokenizer.peek();
    if (closeBraceToken.type === TokenType.Seperator && closeBraceToken.value === '}') {
      this.tokenizer.next();
      return new ClassBody(constructorDeclare, methodDeclares, propertyDeclares, {
        beginPosition: topBeginPosition,
        endPosition: this.tokenizer.lastPositon,
      });
    }
    throw new Error(`Expection Class Body endwith '}', but wo got ${closeBraceToken.value} ${this.tokenizer.lastPositon}`);
  }

  parseConstructorDeclare(): ConstructorDeclare {
    const beginPosition = this.tokenizer.peek().position;
    this.tokenizer.next(); // eat constructor keyword
    const token1 = this.tokenizer.peek();
    if (token1.type === TokenType.Seperator && token1.value === '(') {
      const callSignature = this.parseCallSignature();
      const openBraceToken = this.tokenizer.peek();
      if (openBraceToken.type === TokenType.Seperator && openBraceToken.value === '{') {
        const functionBody = this.parseBlock();
        return new ConstructorDeclare('constructor', callSignature, functionBody, {
          beginPosition,
          endPosition: this.tokenizer.lastPositon,
          isErrorNode: false,
        });
      }
      throw new Error(`Expecting '{' in Constructor Declare, while we got a ${openBraceToken.value} ${this.tokenizer.lastPositon}`);
    } else {
      throw new Error(`Expecting ')' in Constructor Declare, while we got a ${token1.value}`);
    }
  }
}

export { Parser };
