import { AstNode } from "./AstNode";
import { Statement } from "./Statement";

class Program extends AstNode {
  stmts: Statement[];

  constructor(stmts: Statement[]) {
    super();
    this.stmts = stmts;
  }
}

export { Program };
