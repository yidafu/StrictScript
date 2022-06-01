import { AstNode } from "./AstNode";
import { FunctionCall } from "./FunctionCall";

class FunctionBody  extends AstNode {
  stmts: FunctionCall[];
  constructor(stmts: FunctionCall[]) {
    super();
    this.stmts = stmts;
  }
}

export { FunctionBody };
