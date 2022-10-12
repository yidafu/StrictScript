import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';
import { Statement } from './Statement';

class ExpressionStatement extends Statement {
  exp: Expression;

  constructor(exp: Expression, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.exp = exp;
  }

  accept(visitor: AstVisitor) {
    return visitor.visitExpressionStatement(this);
  }
}

export { ExpressionStatement };
