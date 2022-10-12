import {
  AstNode,
  BinaryExpression,
  BooleanLiteral,
  CallSignature,
  DecimalLiteral,
  ExpressionStatement,
  ForStatement,
  IfStatement,
  IntegetLiteral,
  NullLiteral,
  ParameterList,
  ReturnStatement,
  StringLiteral,
  UndefinedLiteral,
  VariableDeclare,
  VariableStatement,
  Block,
  Variable,
  ErrorExpression,
  ErrorStatement,
} from '../ast-node';
import { FunctionCall } from '../ast-node/FunctionCall';
import { FunctionDeclare } from '../ast-node/FunctionDeclare';
import { Program } from '../ast-node/Program';
import { UnaryExpression } from '../ast-node/UnaryExpression';

abstract class AstVisitor {
  visit(node: AstNode) {
    return node.accept(this);
  }

  visitProgram(program: Program) {
    let retVal;
    for (const stmt of program.stmts) {
      retVal = this.visit(stmt);
    }
    return retVal;
  }

  visitVariableStatement(variableStatement: VariableStatement) {
    return this.visit(variableStatement.variableDeclare);
  }

  visitVariableDeclare(variableDeclare: VariableDeclare) {
    if (variableDeclare.init !== null) {
      return this.visit(variableDeclare.init);
    }
  }

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    this.visit(funcDecl.callSignature);
    return this.visitBlock(funcDecl.body);
  }

  visitCallSignature(callSignature: CallSignature) {
    if (callSignature.paramters != null) {
      return this.visit(callSignature.paramters);
    }
  }

  visitParameterList(parametersList: ParameterList) {
    let retVal;
    for (const param of parametersList.parameters) {
      retVal = this.visit(param);
    }
    return retVal;
  }

  visitBlock(block: Block) {
    let retVal;
    for (const stmt of block.stmts) {
      retVal = this.visit(stmt);
    }
    return retVal;
  }

  visitExpressionStatement(stmt: ExpressionStatement) {
    return this.visit(stmt.exp);
  }

  visitReturnStatement(returnStmt: ReturnStatement) {
    if (returnStmt.exp !== null) {
      this.visit(returnStmt.exp);
    }
  }

  visitIfStatement(stmt: IfStatement) {
    this.visit(stmt.condition);
    for (const statement of stmt.thenStatement) {
      this.visit(statement);
    }
    if (stmt.elseStatement !== null) {
      for (const statement of stmt.elseStatement) {
        this.visit(statement);
      }
    }
  }

  visitForStatement(stmt: ForStatement) {
    if (stmt.init !== null) {
      this.visit(stmt.init);
    }
    if (stmt.condition !== null) {
      this.visit(stmt.condition);
    }
    if (stmt.increment !== null) {
      this.visit(stmt.increment);
    }
    for (const statement of stmt.statementList) {
      this.visit(statement);
    }
  }

  visitBinary(exp: BinaryExpression) {
    this.visit(exp.expL);
    this.visit(exp.expR);
  }

  visitUnaryExpression(exp: UnaryExpression) {
    this.visit(exp.exp);
  }

  visitIntegerLiteral(exp: IntegetLiteral): any {
    return exp.value;
  }

  visitDecimalLiteral(exp: DecimalLiteral): any {
    return exp.value;
  }

  visitStringLiteral(exp: StringLiteral) {
    return exp.value;
  }

  visitNullLiteral(exp: NullLiteral): any {
    return exp.value;
  }

  visitUndefinedLiteral(exp: UndefinedLiteral): any {
    return exp.value;
  }

  visitBooleanLiteral(exp: BooleanLiteral): any {
    return exp.value;
  }

  // eslint-disable-next-line no-unused-vars
  visitVariable(_variable: Variable): any {
    return undefined;
  }

  // eslint-disable-next-line no-unused-vars
  visitFunctionCall(funcCall: FunctionCall): any {
    for (const parm of funcCall.parameters) {
      this.visit(parm);
    }
  }

  // eslint-disable-next-line no-unused-vars
  visitErrorExpression(errExp: ErrorExpression) {

  }

  // eslint-disable-next-line no-unused-vars
  visitErrorStatement(errStmt: ErrorStatement) {

  }
}

export {
  AstVisitor,
};
