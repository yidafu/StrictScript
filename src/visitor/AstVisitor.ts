import { FunctionCall } from "../ast-node/FunctionCall";
import { FunctionDeclare } from "../ast-node/FunctionDeclare";
import { Program } from "../ast-node/Program";
import { BinaryExpression, BooleanLiteral, DecimalLiteral, ExpressionStatement, IntegetLiteral, NullLiteral, StringLiteral, UndefinedLiteral, VariableDeclare } from "../ast-node";
import { AstNode } from "../ast-node";
import { Block } from "../ast-node/Block";
import { Variable } from "../ast-node/Variable";

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

  visitVariableDeclare(variableDeclare: VariableDeclare) {
    if (variableDeclare.init !== null) {
      return this.visit(variableDeclare.init);
    }
  }

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    return this.visitBlock(funcDecl.body);
  }

  visitExpressionStatement(stmt: ExpressionStatement) {
    return this.visit(stmt.exp);
  }

  visitBinary(exp: BinaryExpression) {
    this.visit(exp.expL);
    this.visit(exp.expR);
  }

  visitIntegerLiteral(exp: IntegetLiteral) {
    return exp.value;
  }

  visitDecimalLiteral(exp: DecimalLiteral) {
    return exp.value;
  }

  visitStringLiteral(exp: StringLiteral) {
    return exp.value;
  }

  visitNullLiteral(exp: NullLiteral) {
    return exp.value;
  }

  visitUndefinedLiteral(exp: UndefinedLiteral) {
    return exp.value;
  }

  visitBooleanLiteral(exp: BooleanLiteral) {
    return exp.value;
  }

  // eslint-disable-next-line no-unused-vars
  visitVariable(_variable: Variable): any {
    return undefined;
  }

  // eslint-disable-next-line no-unused-vars
  visitFunctionCall(_funcCall: FunctionCall): any {
    return;
  }

  visitBlock(block: Block) {
    let retVal;
    for (const stmt of block.stmts) {
      retVal = this.visit(stmt);
    }
    return retVal;
  }
}

export {
  AstVisitor,
};