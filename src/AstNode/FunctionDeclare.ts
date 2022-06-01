import { FunctionBody } from "./FunctionBody";
import { Statement } from "./Statement";

class FunctionDeclare extends Statement {
  name: string;
  body: FunctionBody;

  constructor(name: string, body: FunctionBody) {
    super();
    this.name = name;
    this.body = body;
  }
}

export { FunctionDeclare };
