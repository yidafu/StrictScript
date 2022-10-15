import { AstVisitor } from '../visitor';

import { LiteralExpression } from './LiteralExpression';
import { BuiltinType } from './types';

class UndefinedLiteral extends LiteralExpression {
  value: undefined = undefined;

  theType = BuiltinType.Undefined;

  public accept(visitor: AstVisitor) {
    return visitor.visitUndefinedLiteral(this);
  }
}

export { UndefinedLiteral };
