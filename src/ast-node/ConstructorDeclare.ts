import { AstVisitor, FunctionSymbol, Scope } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { Block } from './Block';
import { CallSignature } from './CallSignature';
import { Declare } from './Declare';

class ConstructorDeclare extends Declare {
  callSignature: CallSignature;

  body: Block;

  scope: Scope | null = null;

  symbol: FunctionSymbol | null = null;

  constructor(
    name: string,
    callSignature: CallSignature,
    body: Block,
    baseParam: IAstNodeParameter,
  ) {
    super(name, baseParam);
    this.callSignature = callSignature;
    this.body = body;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitConstructorDeclare(this);
  }
}

export { ConstructorDeclare };
