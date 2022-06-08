import { AstVisitor } from "../visitor";
import { VariableSymbol } from "../visitor/VariableSymbol";
import { Expression } from "./Expression";
import { VariableDeclare } from "./VariableDeclare";

class Variable extends Expression {
  name: string;
  declare: VariableDeclare | null = null;
  symbol?: VariableSymbol;

  constructor(name: string) {
    super();
    this.name = name;
  }
  public accept(visitor: AstVisitor) {
    return visitor.visitVariable(this);
  }
}

export { Variable };
