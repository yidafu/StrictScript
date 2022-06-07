import { AstVisitor } from "../visitor";
import { Block } from "./Block";
import { Declare } from "./Declare";

class FunctionDeclare extends Declare {
  body: Block;

  constructor(name: string, body: Block) {
    super(name);
    this.body = body;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitFunctionDeclare(this);
  }
}

export { FunctionDeclare };
