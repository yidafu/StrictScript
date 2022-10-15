import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';

class ThisExpression extends Expression {
  public accept(visitor: AstVisitor) {
    return visitor.visitThisExpression(this);
  }
}

export { ThisExpression };
