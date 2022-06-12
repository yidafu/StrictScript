import { AstVisitor, FunctionSymbol } from "../visitor";
import { IAstNodeParameter } from "./AstNode";
import { Expression } from "./Expression";

class FunctionCall extends Expression {
  name: string;
  parameters:  Expression[];
  symbol: Nullable<FunctionSymbol> = null;

  constructor(name: string, parameters: Expression[], baseParam: IAstNodeParameter) {
    super(baseParam);
    this.name = name;
    this.parameters = parameters;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitFunctionCall(this);
  }
}

export { FunctionCall };
