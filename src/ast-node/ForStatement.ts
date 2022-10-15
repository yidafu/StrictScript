import { AstVisitor, Scope } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';
import { Statement } from './Statement';
import { VariableDeclare } from './VariableDeclare';

class ForStatement extends Statement {
  init: Nullable<Expression | VariableDeclare>;

  condition: Nullable<Expression>;

  increment: Nullable<Expression>;

  statementList: Statement[];

  scope: Nullable<Scope>;

  constructor(
    init: Nullable<Expression | VariableDeclare>,
    condition: Nullable<Expression>,
    increment: Nullable<Expression>,
    statementList: Statement[],
    scope: Nullable<Scope>,
    baseParam: IAstNodeParameter,
  ) {
    super(baseParam);
    this.init = init;
    if (this.init) this.init.parentNode = this;
    this.condition = condition;
    if (this.condition) this.condition.parentNode = this;
    this.increment = increment;
    if (this.increment) this.increment.parentNode = this;
    this.statementList = statementList;
    if (this.statementList) {
      for (const statement of this.statementList) {
        statement.parentNode = this;
      }
    }
    this.scope = scope;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitForStatement(this);
  }
}

export { ForStatement };
