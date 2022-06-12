import { AstVisitor } from "../visitor";
import { Expression } from "./Expression";

class ErrorExpression extends Expression {
  isErrorNode = true;

  public accept(visitor: AstVisitor) {
      return visitor.visitErrorExpression(this);
  }
}

export { ErrorExpression };
