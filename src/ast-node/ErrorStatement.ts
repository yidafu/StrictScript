import { AstVisitor } from '../visitor';

import { Statement } from './Statement';

class ErrorStatement extends Statement {
  isErrorNode = true;

  public accept(visitor: AstVisitor) {
    return visitor.visitErrorStatement(this);
  }
}

export { ErrorStatement };
