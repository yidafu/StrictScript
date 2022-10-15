import { AstVisitor } from '../visitor';

import { Expression } from './Expression';

class BinaryExpression extends Expression {
  operator: string;

  expL: Expression;

  expR: Expression;

  constructor(operator: string, expL: Expression, expR: Expression, isErrorNode: boolean = false) {
    super({ beginPosition: expL.beginPosition, endPosition: expR.endPosition, isErrorNode });
    this.operator = operator;
    this.expL = expL;
    this.expR = expR;
    this.expL.parentNode = this;
    this.expR.parentNode = this;
  }

  accept(visitor: AstVisitor) {
    return visitor.visitBinary(this);
  }
}

export { BinaryExpression };
