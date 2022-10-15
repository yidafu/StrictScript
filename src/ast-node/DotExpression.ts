import { AstVisitor } from '../visitor';

import { Expression } from './Expression';

class DotExpression extends Expression {
  expL: Expression;

  expR: Expression;

  constructor(expL: Expression, expR: Expression, isErrorNode: boolean = false) {
    super({ beginPosition: expL.beginPosition, endPosition: expR.endPosition, isErrorNode });
    this.expL = expL;
    this.expL.parentNode = this;
    this.expR = expR;
    this.expR.parentNode = this;
  }

  accept(visitor: AstVisitor) {
    return visitor.visitDotExpression(this);
  }
}

export { DotExpression };
