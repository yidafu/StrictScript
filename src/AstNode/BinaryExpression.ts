import { Expression } from "./Expression";

class BinaryExpression extends Expression {
  operator: string;

  expL: Expression;

  expR: Expression;

  constructor(operator: string, expL: Expression, expR: Expression) {
    super();
    this.operator = operator;
    this.expL = expL;
    this.expR = expR;
  }

  accept() {}
}

export { BinaryExpression };
