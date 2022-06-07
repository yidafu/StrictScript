import { AstVisitor } from "../visitor";
import { AstNode } from "./AstNode";
import { Expression } from "./Expression";
import { FunctionDeclare } from "./FunctionDeclare";


class FunctionCall extends AstNode {

  name: string;

  parameters:  Expression[];

  declare: FunctionDeclare | null = null;

  constructor(name: string, parameters: Expression[]) {
    super();
    this.name = name;
    this.parameters = parameters;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitFunctionCall(this);
  }
}

export { FunctionCall };
