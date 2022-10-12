import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Statement } from './Statement';
import { VariableDeclare } from './VariableDeclare';

class VariableStatement extends Statement {
  variableDeclare: VariableDeclare;

  constructor(variableDeclare: VariableDeclare, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.variableDeclare = variableDeclare;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitVariableStatement(this);
  }
}

export { VariableStatement };
