
import { FunctionCall } from "../AstNode/FunctionCall";
import { FunctionDeclare } from "../AstNode/FunctionDeclare";
import { Program } from "../AstNode/Program";
import { isBuiltinFunction, Variable, VariableDeclare } from "../AstNode";
import { AstVisitor } from "./AstVisitor";
import { SymbolTable, SymbolType } from "./SymbolTable";

class RefResolver extends AstVisitor {
  program: Program | null = null;

  symbolTable: SymbolTable;

  constructor(symbolTable: SymbolTable) {
    super();
    this.symbolTable = symbolTable;
  }

  visitFunctionCall(funcCall: FunctionCall) {
    let symbol = this.symbolTable.getSymbol(funcCall.name);

    if (symbol !== null && symbol.type === SymbolType.Function) {
      funcCall.definition = symbol.decalre as FunctionDeclare;
    } else {
      if (!isBuiltinFunction(funcCall.name)) {
        throw new Error(`Error: canot find definition of function: ${funcCall.name}`);
      }
    }
  }

  visitVariable(variable: Variable): void {
    const symbol = this.symbolTable.getSymbol(variable.name);
    if (symbol !== null && symbol.type === SymbolType.Variable) {
      variable.declare = symbol.decalre as VariableDeclare;
    } else {
      throw new Error(`canot find declaration of variable: ${variable.name}`);
    }
  }
}

export { RefResolver };
