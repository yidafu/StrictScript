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
  // decalre: Declare;

  constructor(name: string, symType: SymbolType) {
    this.name = name;
    // this.decalre = symDeclare;
    this.type = symType;
  }
}

export { Symbol, SymbolType };
