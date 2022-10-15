import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';
import { BuiltinType } from './types';

class DecimalLiteral extends Expression {
  value: number;

  theType = BuiltinType.Decimal;

  constructor(value: number, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.value = value;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitDecimalLiteral(this);
  }
}

export { DecimalLiteral };
