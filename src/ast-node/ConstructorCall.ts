import { AstVisitor, FunctionSymbol } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Expression } from './Expression';

class ConstructorCall extends Expression {
  name: string;

  parameters: Expression[];

  symbol: Nullable<FunctionSymbol> = null;

  constructor(parameters: Expression[], baseParam: IAstNodeParameter) {
    super(baseParam);
    this.name = 'constructor';
    this.parameters = parameters;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitConstructorCall(this);
  }
}

export { ConstructorCall };
