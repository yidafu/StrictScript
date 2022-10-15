import { AstVisitor, FunctionSymbol } from '../visitor';

import { Block } from './Block';
import { SimpleType } from './types';

class Program extends Block {
  symbol: FunctionSymbol | null = null;

  name2Type = new Map<string, SimpleType>();

  accept(visitor: AstVisitor) {
    return visitor.visitProgram(this);
  }

  getType(name: string) {
    return this.name2Type.get(name) ?? null;
  }

  setType(name: string, type: SimpleType) {
    this.name2Type.set(name, type);
  }
}

export { Program };
