import { Type, VariableDeclare } from '../../ast-node';

import { Symbol, SymbolType } from './Symbol';

class VariableSymbol extends Symbol {
  variableType: Type;

  declare: Nullable<VariableDeclare> = null;

  constructor(name: string, variableType: Type) {
    super(name, SymbolType.Variable);
    this.type = SymbolType.Variable;
    this.variableType = variableType;
  }

  static isVariableSymbol(symbol: Symbol): symbol is VariableSymbol {
    return symbol instanceof VariableSymbol;
  }
}

export { VariableSymbol };
