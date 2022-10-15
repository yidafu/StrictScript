import { AstNode } from '../ast-node';

import { Symbol } from './symbol';

class Scope {
  nameSymbolMap: Map<string, Symbol> = new Map();

  enclosingScope: Scope | null = null;

  node: AstNode;

  constructor(node: AstNode, scope: Scope | null = null) {
    this.node = node;
    this.enclosingScope = scope;
  }

  getSymbol(variableName: string) {
    return this.nameSymbolMap.get(variableName) ?? null;
  }

  hasSymbol(variableName: string) {
    return this.nameSymbolMap.has(variableName);
  }

  enter(variableName: string, symbol: Symbol) {
    this.nameSymbolMap.set(variableName, symbol);
  }

  lookupSymbol(variableName: string) {
    let scope: Scope | null = this;
    while (scope !== null) {
      if (scope.nameSymbolMap.has(variableName)) {
        return scope.nameSymbolMap.get(variableName)!;
      }
      scope = scope.enclosingScope;
    }
    return null;
  }
}

export { Scope };
