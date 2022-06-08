import { AstVisitor } from "../visitor";
import { Expression } from "./Expression";

class StringLiteral extends Expression {
  value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }
  public accept(visitor: AstVisitor) {
    return visitor.visitStringLiteral(this);
  }
}

export { StringLiteral };
