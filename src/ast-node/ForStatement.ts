import { AstVisitor, Scope } from "../visitor";
import { IAstNodeParameter } from "./AstNode";
import { Expression } from "./Expression";
import { Statement } from "./Statement";
import { VariableDeclare } from "./VariableDeclare";

class ForStatement extends Statement {
  init: Nullable<Expression | VariableDeclare>;
  condition: Nullable<Expression>;
  increment: Nullable<Expression>;
  statementList: Statement[];
  scope: Nullable<Scope>;

  constructor(init: Nullable<Expression | VariableDeclare>, condition: Nullable<Expression>, increment: Nullable<Expression>, statementList: Statement[], scope: Nullable<Scope>, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.init = init;
    this.condition = condition;
    this.increment = increment;
    this.statementList = statementList;
    this.scope = scope;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitForStatement(this);
  }
}

export { ForStatement };