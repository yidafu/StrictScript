import { Expression } from "./Expression";

class IntegetLiteral extends Expression {
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }
}

export { IntegetLiteral };