import { AstVisitor } from "../visitor";
import { AstNode } from "./AstNode";
import { Statement } from "./Statement";

class Block extends AstNode {
  stmts: Statement[];

  constructor(stmts: Statement[]) {
    super();
    this.stmts = stmts;
  }

  accept(visitor: AstVisitor) {
    return visitor.visitBlock(this);
  }
}

export { Block };