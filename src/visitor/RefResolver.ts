
import { FunctionCall } from "../ast-node/FunctionCall";
import { FunctionDeclare } from "../ast-node/FunctionDeclare";
import { Program } from "../ast-node/Program";
import { isBuiltinFunction, Variable, VariableDeclare } from "../ast-node";
import { AstVisitor } from "./AstVisitor";
import { SymbolType } from "./symbol";
import { Scope } from "./Scope";


class RefResolver extends AstVisitor {
  program: Program | null = null;

  scope: Scope;

  constructor(symbolTable: Scope) {
    super();
    this.scope = symbolTable;
  }

  visitFunctionCall(funcCall: FunctionCall) {
    const symbol = this.scope.lookupSymbol(funcCall.name);

    if (symbol !== null && symbol.type === SymbolType.Function) {
      funcCall.declare = symbol.decalre as FunctionDeclare;
    } else {
      if (!isBuiltinFunction(funcCall.name)) {
        throw new Error(`Error: canot find definition of function: ${funcCall.name}`);
      }
    }
  }

  visitVariable(variable: Variable): void {
    const symbol = this.scope.lookupSymbol(variable.name);
    if (symbol !== null && symbol.type === SymbolType.Variable) {
      variable.declare = symbol.decalre as VariableDeclare;
    } else {
      throw new Error(`canot find declaration of variable: ${variable.name}`);
    }
  }
}

export { RefResolver };
