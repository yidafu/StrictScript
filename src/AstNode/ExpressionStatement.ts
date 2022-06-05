import { Expression } from "./Expression";
import { Statement } from "./Statement";

class ExpressionStatement extends Statement {
  exp: Expression;

  constructor(exp: Expression) {
    super();
    this.exp = exp;
  }

  accept() {}
}

export { ExpressionStatement };
