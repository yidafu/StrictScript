import { Declare } from "./Declare";
import { FunctionBody } from "./FunctionBody";

class FunctionDeclare extends Declare {
  body: FunctionBody;

  constructor(name: string, body: FunctionBody) {
    super(name);
    this.body = body;
  }

  public accept() {}

}

export { FunctionDeclare };
