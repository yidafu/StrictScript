import { AstVisitor } from '../visitor';

import { Expression } from './Expression';

class UndefinedLiteral extends Expression {
  value: undefined = undefined;

  public accept(visitor: AstVisitor) {
    return visitor.visitUndefinedLiteral(this);
  }
}

export { UndefinedLiteral };
