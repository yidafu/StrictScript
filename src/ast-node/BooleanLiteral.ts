import { AstVisitor } from "../visitor/AstVisitor";
import { IAstNodeParameter } from "./AstNode";
import { Expression } from "./Expression";

class BooleanLiteral extends Expression {

  value: boolean;

  constructor(value: boolean, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.value = value;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitBooleanLiteral(this);
  }
}

export { BooleanLiteral };
