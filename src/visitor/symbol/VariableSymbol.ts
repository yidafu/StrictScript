import { VariableDeclare } from '../../ast-node';
import { Symbol, SymbolType } from './Symbol';

class VariableSymbol extends Symbol {
  variableType: string;
  constructor(name: string, variableType: string, variableDecalre: VariableDeclare) {
    super(name,  variableDecalre);
    this.type = SymbolType.Variable;
    this.variableType = variableType;
  }

  static isVariableSymbol(symbol: Symbol): symbol is VariableSymbol {
    return symbol instanceof VariableSymbol;
  }
}

export { VariableSymbol };