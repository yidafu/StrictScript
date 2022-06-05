import { Expression } from "./Expression";

class StringLiteral extends Expression {
  value: boolean;

  constructor(value: boolean) {
    super();
    this.value = value;
  }
}

export { StringLiteral };
