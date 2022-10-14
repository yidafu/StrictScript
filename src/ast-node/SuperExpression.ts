import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';

class SuperExpression extends Expression {
  ifPrefix: boolean;

  constructor(
    baseParam: IAstNodeParameter,
  ) {
    super(baseParam);
    this.ifPrefix = true;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitSuperExpression(this);
  }
}

export { SuperExpression };
