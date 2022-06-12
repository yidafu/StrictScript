import { AstVisitor } from "../visitor";
import { IAstNodeParameter } from "./AstNode";
import { Expression } from "./Expression";
import { Statement } from "./Statement";

class ReturnStatement extends Statement {
  exp: Nullable<Expression> = null;

  constructor(exp: Nullable<Expression>, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.exp = exp;
  }

  public accept(visitor: AstVisitor) {
      return visitor.visitReturnStatement(this);
  }
}

export { ReturnStatement };
