import { AstVisitor } from '../visitor';

import { Expression } from './Expression';
import { SimpleType } from './types';

abstract class LiteralExpression extends Expression {
  abstract value: string | null | number | boolean | undefined;

  abstract theType: SimpleType;

  public accept(visitor: AstVisitor) {
    return visitor.visitLiteralExpression(this);
  }
}

export { LiteralExpression };
