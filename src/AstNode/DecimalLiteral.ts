import { AstVisitor } from "../visitor";
import { Expression } from "./Expression";

class DecimalLiteral extends Expression {
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitDecimalLiteral(this);
  }
}


export { DecimalLiteral };
