import { FunctionCall } from "../AstNode/FunctionCall";
import { FunctionDeclare } from "../AstNode/FunctionDeclare";
import { Program } from "../AstNode/Program";
import { BinaryExpression, BooleanLiteral, DecimalLiteral, ExpressionStatement, IntegetLiteral, NullLiteral, StringLiteral, UndefinedLiteral, VariableDeclare } from "../AstNode";
import { AstNode } from "../AstNode";
import { Block } from "../AstNode/Block";
import { Variable } from "../AstNode/Variable";

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

  visitVariable(variable: Variable) {
    return undefined;
  }

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