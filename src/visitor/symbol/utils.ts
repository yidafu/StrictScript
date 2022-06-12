import { FunctionSymbol } from "./FunctionSymbol";
import { Symbol } from "./Symbol";
import { VariableSymbol } from "./VariableSymbol";

export function isFunctionSymbol(symbol: Symbol): symbol is FunctionSymbol {
  return symbol instanceof FunctionSymbol;
}

export function isVariableSymbol(symbol: Symbol): symbol is VariableSymbol {
  return symbol instanceof VariableSymbol;
}