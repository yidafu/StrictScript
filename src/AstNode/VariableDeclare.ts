import { AstVisitor } from "../visitor";
import { Declare } from "./Declare";
import { Expression } from "./Expression";

class VariableDeclare extends Declare {
  variableType: string;

  init: Expression | null = null;

  constructor(name: string, variableType: string, initExp: Expression | null) {
    super(name);
    this.variableType = variableType;
    this.init = initExp;
  }


  accept(visitor: AstVisitor) {
    return visitor.visitVariableDeclare(this);
  }
}

export { VariableDeclare };