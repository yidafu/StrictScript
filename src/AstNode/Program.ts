import { AstVisitor } from "../visitor";
import { Block } from "./Block";

class Program extends Block {


  accept(visitor: AstVisitor) {
    return visitor.visitProgram(this);
  }
}

export { Program };
