
import { AstVisitor } from "../visitor";
import { AstNode, IAstNodeParameter } from "./AstNode";
import { ParameterList } from "./ParamterList";
import { Type } from "./types";

class CallSignature extends AstNode {
  paramters: Nullable<ParameterList>;
  returnType: Type;

  constructor(paramters: Nullable<ParameterList>, returnType: Type, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.paramters = paramters;
    this.returnType = returnType;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitCallSignature(this);
  }
}

export { CallSignature };
