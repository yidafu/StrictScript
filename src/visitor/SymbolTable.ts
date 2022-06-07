import { Declare } from "../AstNode";

class SymbolTable {
  table: Map<string, Symbol> = new Map();
  
  enter(name: string, declare: Declare, symbolType: SymbolType) {
    this.table.set(name, new Symbol(name, declare, symbolType));
  }

  hasSymbol(name: string): boolean {
    return this.table.has(name);
  }

  getSymbol(name: string): Symbol | null {
    let symbol = this.table.get(name);
    if (symbol instanceof Symbol) {
      return symbol;
    }
    return null;
  }
}

class Symbol {
  name: string;
  decalre: Declare;
  type: SymbolType;

  constructor(name: string, symDeclare: Declare, symType: SymbolType) {
    this.name = name;
    this.decalre = symDeclare;
    this.type = symType;
  }
}

enum SymbolType {
  Variable = 'variable',
  Function = 'Function',
  Class = 'class',
  Interface = 'interface',
}

export {
  Symbol, SymbolTable, SymbolType,
}