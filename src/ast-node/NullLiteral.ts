import { AstVisitor } from '../visitor';

import { Expression } from './Expression';

class NullLiteral extends Expression {
  value: null = null;

  public accept(visitor: AstVisitor) {
    return visitor.visitNullLiteral(this);
  }
}

export { NullLiteral };
