import { AstVisitor } from "../visitor";
import { AstNode } from "./AstNode";
import { FunctionDeclare } from "./FunctionDeclare";


class FunctionCall extends AstNode {

  name: string;

  parameters:  string[];

  definition: FunctionDeclare | null = null;

  constructor(name: string, parameters: string[]) {
    super();
    this.name = name;
    this.parameters = parameters;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitFunctionCall(this);
  }
}

export { FunctionCall };
