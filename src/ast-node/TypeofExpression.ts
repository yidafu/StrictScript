import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';

class TypeofExpression extends Expression {
  exp: Expression;

  ifPrefix: boolean;

  constructor(
    exp: Expression,
    baseParam: IAstNodeParameter,
  ) {
    super(baseParam);
    this.exp = exp;
    this.exp.parentNode = exp;
    this.ifPrefix = true;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitTypeofExpression(this);
  }
}

export { TypeofExpression };
