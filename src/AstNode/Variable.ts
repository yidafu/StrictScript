import { Expression } from "./Expression";
import { VariableDeclare } from "./VariableDeclare";

class Variable extends Expression {
  name: string;
  declare: VariableDeclare | null = null;

  constructor(name: string) {
    super();
    this.name = name;
  }

  accept() {}
}

export { Variable };
