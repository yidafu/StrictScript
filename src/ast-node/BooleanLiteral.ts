import { AstVisitor } from '../visitor/AstVisitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';
import { BuiltinType } from './types';

class BooleanLiteral extends Expression {
  value: boolean;

  theType = BuiltinType.Boolean;

  constructor(value: boolean, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.value = value;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitBooleanLiteral(this);
  }
}

export { BooleanLiteral };
