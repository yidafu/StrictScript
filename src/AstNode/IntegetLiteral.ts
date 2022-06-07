import { AstVisitor } from "../visitor";
import { Expression } from "./Expression";

class IntegetLiteral extends Expression {
  value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }
  public accept(visitor: AstVisitor) {
    return visitor.visitIntegerLiteral(this);
  }
}

export { IntegetLiteral };