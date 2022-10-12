import { FunctionCall } from './FunctionCall';
import { FunctionDeclare } from './FunctionDeclare';
import { Statement } from './Statement';

export function isFunctionDeclare(stmt: Statement): stmt is FunctionDeclare {
  if (stmt instanceof FunctionDeclare) {
    return true;
  }
  return false;
}

export function isFunctionCall(stmt: Statement): stmt is FunctionCall {
  return stmt instanceof FunctionCall;
}

export function isBuiltinFunction(name: string): boolean {
  return ['println'].includes(name);
}
