import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';
import { Statement } from './Statement';

class IfStatement extends Statement {
  condition: Expression;

  thenStatement: Statement[];

  elseStatement: Nullable<Statement[]>;

  constructor(
    condition: Expression,
    thenStatement: Statement[],
    elseStatement: Nullable<Statement[]>,
    baseParam: IAstNodeParameter,
  ) {
    super(baseParam);
    this.condition = condition;
    this.condition.parentNode = this;
    this.thenStatement = thenStatement;
    for (const statement of this.thenStatement) {
      statement.parentNode = this;
    }
    this.elseStatement = elseStatement;
    if (this.elseStatement) {
      for (const statement of this.elseStatement) {
        statement.parentNode = this;
      }
    }
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitIfStatement(this);
  }
}

export { IfStatement };
