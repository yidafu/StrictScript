import { FunctionBody } from "../AstNode/FunctionBody";
import { FunctionCall } from "../AstNode/FunctionCall";
import { FunctionDeclare } from "../AstNode/FunctionDeclare";
import { Program } from "../AstNode/Program";
import { isFunctionCall, isFunctionDeclare } from "../utils";

abstract class AstVisitor {
  visitProgram(program: Program) {
    let retVal;
    for (const stmt of program.stmts) {
      if (isFunctionDeclare(stmt)) {
        retVal = this.visitFunctionDeclare(stmt);
      }
    }
    return retVal;
  }

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    return this.visitFunctionBody(funcDecl.body);
  }

  visitFunctionBody(funcBody: FunctionBody): any {
    let retVal: any;
    for (const stmt of funcBody.stmts) {
      if (isFunctionCall(stmt)) {
        retVal = this.visitFunctionCall(stmt);
      }
    }
    return retVal;
  }

  visitFunctionCall(_funcCall: FunctionCall): any {
    return;
  }
}

export {
  AstVisitor,
};