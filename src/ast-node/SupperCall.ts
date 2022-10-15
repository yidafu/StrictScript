import { AstVisitor, FunctionSymbol } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';

class SuperCall extends Expression {
  name: string;

  parameters: Expression[];

  symbol: Nullable<FunctionSymbol> = null;

  constructor(parameters: Expression[], baseParam: IAstNodeParameter) {
    super(baseParam);
    this.name = 'super';
    this.parameters = parameters;
    for (const parameter of this.parameters) {
      parameter.parentNode = this;
    }
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitSuperCall(this);
  }
}

export { SuperCall };
