import { Expression } from "./Expression";

class StringLiteral extends Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }
}

export { StringLiteral };
