import { AstVisitor } from "../visitor";
import { IAstNodeParameter } from "./AstNode";
import { Expression } from "./Expression";

class StringLiteral extends Expression {
  value: string;

  constructor(value: string, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.value = value;
  }
  public accept(visitor: AstVisitor) {
    return visitor.visitStringLiteral(this);
  }
}

export { StringLiteral };
