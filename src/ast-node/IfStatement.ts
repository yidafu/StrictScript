import { AstVisitor } from "../visitor";
import { IAstNodeParameter } from "./AstNode";
import { Expression } from "./Expression";
import { Statement } from "./Statement";

class IfStatement extends Statement {
  condition: Expression;
  thenStatement: Statement[];
  elseStatement: Nullable<Statement[]>;

  constructor(condition: Expression, thenStatement: Statement[], elseStatement: Nullable<Statement[]>, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.condition = condition;
    this.thenStatement = thenStatement;
    this.elseStatement = elseStatement;
  }

  public accept(visitor: AstVisitor) {
      return visitor.visitIfStatement(this);
  }
}

export { IfStatement };
