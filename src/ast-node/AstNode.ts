import { AstVisitor } from "../visitor/AstVisitor";

abstract class AstNode {
  public abstract accept(visitor: AstVisitor): any;
}

export { AstNode };
