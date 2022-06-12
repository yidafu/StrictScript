import { FunctionDeclare, FunctionType } from "../../ast-node";
import { Symbol, SymbolType } from "./Symbol";
import { VariableSymbol } from "./VariableSymbol";

class FunctionSymbol extends Symbol {
  vars: VariableSymbol[] = [];

  variables: VariableSymbol[];

  declare: Nullable<FunctionDeclare> = null;

  // type = SymbolType.Function;

  constructor(name: string, theType: FunctionType, vars: VariableSymbol[] = []) {
    super(name, SymbolType.Function);
    this.variables = vars;
  }
}

export { FunctionSymbol };
