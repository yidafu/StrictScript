import { AstVisitor } from '../visitor';

import { AstNode, IAstNodeParameter } from './AstNode';
import { VariableDeclare } from './VariableDeclare';

class ParameterList extends AstNode {
  parameters: VariableDeclare[];

  constructor(parameters: VariableDeclare[], baseParam: IAstNodeParameter) {
    super(baseParam);
    this.parameters = parameters;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitParameterList(this);
  }
}

export { ParameterList };
