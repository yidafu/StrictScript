import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { LiteralExpression } from './LiteralExpression';
import { BuiltinType } from './types';

class IntegetLiteral extends LiteralExpression {
  value: number;

  theType = BuiltinType.Integer;

  constructor(value: number, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.value = value;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitIntegerLiteral(this);
  }
}

export { IntegetLiteral };
