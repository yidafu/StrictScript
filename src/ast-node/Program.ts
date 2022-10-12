import { AstVisitor, FunctionSymbol } from '../visitor';

import { Block } from './Block';

class Program extends Block {
  symbol: FunctionSymbol | null = null;

  accept(visitor: AstVisitor) {
    return visitor.visitProgram(this);
  }
}

export { Program };
