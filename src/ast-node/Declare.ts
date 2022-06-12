import { AstNode, IAstNodeParameter } from "./AstNode";

abstract class Declare extends AstNode {
  name: string;

  constructor(name: string, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.name = name;
  }
}

export { Declare };
