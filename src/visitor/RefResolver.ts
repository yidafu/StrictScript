import { FunctionBody } from "../AstNode/FunctionBody";
import { FunctionCall } from "../AstNode/FunctionCall";
import { FunctionDeclare } from "../AstNode/FunctionDeclare";
import { Program } from "../AstNode/Program";
import { isBuiltinFunction, isFunctionCall, isFunctionDeclare } from "../AstNode";
import { AstVisitor } from "./AstVisitor";

class RefResolver extends AstVisitor {
  program: Program | null = null;


  visitProgram(program: Program): void {
      this.program = program;
      for (const stmt of program.stmts) {
        if (isFunctionCall(stmt)) {
          this.resolveFunctionCall(program, stmt);
        } else if (isFunctionDeclare(stmt)){
          this.visitFunctionDeclare(stmt);
        }
      }
  }

  visitFunctionBody(funcBody: FunctionBody) {
    if (this.program !== null) {
      for (const stmt of funcBody.stmts) {
        return this.resolveFunctionCall(this.program, stmt);
      }
    }
  }

  resolveFunctionCall(program: Program, funcCall: FunctionCall) {
    const funcDeclare = this.findFunctionDeclare(program, funcCall.name);
    if (funcDeclare !== null) {
      funcCall.definition = funcDeclare;
    } else {
      if (!isBuiltinFunction(funcCall.name)) {
        throw new Error(`Error: canot find definition of function: ${funcCall.name}`);
      }
    }
  }

  findFunctionDeclare(program: Program, name: string): FunctionDeclare | null {
    for (const stmt of program.stmts) {
      if (isFunctionDeclare(stmt)) {
        if (stmt.name === name) {
          return stmt;
        }
      }
    }
    return null;
  }
}

export { RefResolver };
