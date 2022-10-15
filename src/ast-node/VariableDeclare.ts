import { AstVisitor, VariableSymbol } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Declare } from './Declare';
import { Expression } from './Expression';
import { TypeExpression } from './TypeExpression';
import { BuiltinType, Type } from './types';

class VariableDeclare extends Declare {
  variableType: Type = BuiltinType.Any;

  variableTypeExpression: Nullable<TypeExpression> = null;

  init: Nullable<Expression> = null;

  symbol: Nullable<VariableSymbol> = null;

  inferredType: Type = BuiltinType.Any;

  constructor(
    name: string,
    variableTypeExpression: Nullable<TypeExpression>,
    initExp: Expression | null,
    baseParam: IAstNodeParameter,
  ) {
    super(name, baseParam);
    this.variableTypeExpression = variableTypeExpression;
    if (this.variableTypeExpression) this.variableTypeExpression.parentNode = this;
    this.init = initExp;
    if (this.init) this.init.parentNode = this;
  }

  accept(visitor: AstVisitor) {
    return visitor.visitVariableDeclare(this);
  }
}

export { VariableDeclare };
