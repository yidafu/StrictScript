import { AstVisitor, VariableSymbol } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Declare } from './Declare';
import { Expression } from './Expression';
import { Type } from './types';

class VariableDeclare extends Declare {
  variableType: Type;

  init: Expression | null = null;

  symbol: VariableSymbol | null = null;

  inferredType: Type | null = null;

  constructor(name: string, variableType: Type, initExp: Expression | null, baseParam: IAstNodeParameter) {
    super(name, baseParam);
    this.variableType = variableType;
    this.init = initExp;
  }

  accept(visitor: AstVisitor) {
    return visitor.visitVariableDeclare(this);
  }
}

export { VariableDeclare };
