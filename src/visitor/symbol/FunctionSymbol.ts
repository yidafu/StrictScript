import { Symbol, SymbolType } from "./Symbol";
import { VariableSymbol } from "./VariableSymbol";

class FunctionSymbol extends Symbol {
  vars: VariableSymbol[] = [];

  type = SymbolType.Function;
}

export { FunctionSymbol };
