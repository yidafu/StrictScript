import { FunctionDeclare } from "./FunctionDeclare";
import { Statement } from "./Statement";

class FunctionCall extends Statement {
  name: string;

  parameters:  string[];

  definition: FunctionDeclare | null = null;

  constructor(name: string, parameters: string[]) {
    super();
    this.name = name;
    this.parameters = parameters;
  }


}

export { FunctionCall };
