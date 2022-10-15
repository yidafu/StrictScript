import { AstVisitor } from '../visitor';

import { Expression } from './Expression';
import { LiteralExpression } from './LiteralExpression';
import { BuiltinType } from './types';

class NullLiteral extends LiteralExpression {
  value: null = null;

  theType = BuiltinType.Null;

  public accept(visitor: AstVisitor) {
    return visitor.visitNullLiteral(this);
  }
}

export { NullLiteral };
