import { AstVisitor } from "../visitor";
import { Expression } from "./Expression";
import { VariableDeclare } from "./VariableDeclare";

class Variable extends Expression {
  name: string;
  declare: VariableDeclare | null = null;

  constructor(name: string) {
    super();
    this.name = name;
  }
  public accept(visitor: AstVisitor) {
    return visitor.visitVariable(this);
  }
}

export { Variable };
