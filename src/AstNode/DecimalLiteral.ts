import { Expression } from "./Expression";

class DecimalLiteral extends Expression {
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }
}


export { DecimalLiteral };
