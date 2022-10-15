import { AstVisitor } from '../visitor';

import { AstNode, IAstNodeParameter } from './AstNode';
import { ParameterList } from './ParamterList';
import { TypeExpression } from './TypeExpression';
import { BuiltinType, Type } from './types';

class CallSignature extends AstNode {
  paramters: Nullable<ParameterList>;

  returnType: Type = BuiltinType.Void;

  returnTypeExpression: Nullable<TypeExpression>;

  constructor(
    paramters: Nullable<ParameterList>,
    returnTypeExpression: Nullable<TypeExpression>,
    baseParam: IAstNodeParameter,
  ) {
    super(baseParam);
    this.paramters = paramters;
    if (this.paramters) this.paramters.parentNode = this;
    this.returnTypeExpression = returnTypeExpression;
    if (this.returnTypeExpression) this.returnTypeExpression.parentNode = this;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitCallSignature(this);
  }
}

export { CallSignature };
