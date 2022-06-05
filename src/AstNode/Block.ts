import { AstNode } from "./AstNode";
import { Statement } from "./Statement";

class Block extends AstNode {
  stmts: Statement[];

  constructor(stmts: Statement[]) {
    super();
    this.stmts = stmts;
  }

  accept() {}
}

export { Block };