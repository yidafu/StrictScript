import { Declare } from "../../ast-node";

enum SymbolType {
  Variable = 'variable',
  Function = 'Function',
  Class = 'class',
  Interface = 'interface',
  Unkown = 'unkown',
}


class Symbol {
  type: SymbolType;

  name: string;
  decalre: Declare;


  constructor(name: string, symDeclare: Declare) {
    this.name = name;
    this.decalre = symDeclare;
    this.type = SymbolType.Unkown;
  }


}

export { Symbol, SymbolType };