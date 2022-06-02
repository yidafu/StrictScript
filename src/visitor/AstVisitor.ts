import { FunctionBody } from "../AstNode/FunctionBodyy";
import { FunctionCall } from "../AstNode/FunctionCalll";
import { FunctionDeclare } from "../AstNode/FunctionDeclaree";
import { Program } from "../AstNode/Programm";
import { isFunctionCall, isFunctionDeclare } from "../utils";

abstract class AstVisitor {
  visitProgram(program: Program) {
    let retVal;
    for (const stmt of program.stmts) {
      if (isFunctionDeclare(stmt)) {
        this.visitFunctionDeclare(stmt);
      }
    }
  }

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    return this.visitFunctionBody(funcDecl.body);
  }

  visitFunctionBody(funcBody: FunctionBody) {
    let retVal: any;
    for (const stmt of funcBody.stmts) {
      if (isFunctionCall(stmt)) {
        this.visitFunctionCall(stmt);
      }
    }
  }

  visitFunctionCall(funcCall: FunctionCall): any {
    return;
  }
}

export {
  AstVisitor,
}