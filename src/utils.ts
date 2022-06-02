import { FunctionCall } from "./AstNode/FunctionCall";
import { FunctionDeclare } from "./AstNode/FunctionDeclare";
import { Statement } from "./AstNode/Statement";

export function isFunctionDeclare(stmt: Statement): stmt is FunctionDeclare {
  if (stmt instanceof FunctionDeclare) {
    return true;
  }
  return false
}

export function isFunctionCall(stmt: Statement): stmt is FunctionCall {
  return stmt instanceof FunctionCall;
}