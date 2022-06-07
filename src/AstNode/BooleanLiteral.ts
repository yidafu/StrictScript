import { AstVisitor } from "../visitor/AstVisitor";
import { Expression } from "./Expression";

class BooleanLiteral extends Expression {

  value: boolean;

  constructor(value: boolean) {
    super();
    this.value = value;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitBooleanLiteral(this);
  }
}

export { BooleanLiteral };
