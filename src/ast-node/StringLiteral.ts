import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { LiteralExpression } from './LiteralExpression';
import { BuiltinType } from './types';

class StringLiteral extends LiteralExpression {
  value: string;

  theType = BuiltinType.String;

  constructor(value: string, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.value = value;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitStringLiteral(this);
  }
}

export { StringLiteral };
