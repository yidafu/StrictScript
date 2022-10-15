import { Operator } from '../tokenizer';
import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';

class UnaryExpression extends Expression {
  operator: Operator | '--' | '++';

  exp: Expression;

  ifPrefix: boolean;

  constructor(
    operator: Operator,
    exp: Expression,
    isPrefix: boolean,
    baseParam: IAstNodeParameter,
  ) {
    super(baseParam);
    this.operator = operator;
    this.exp = exp;
    this.exp.parentNode = this;
    this.ifPrefix = isPrefix;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitUnaryExpression(this);
  }
}

export { UnaryExpression };
