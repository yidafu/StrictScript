import { AstVisitor, Scope } from '../visitor';

import { AstNode, IAstNodeParameter } from './AstNode';
import { Statement } from './Statement';

class Block extends AstNode {
  stmts: Statement[];

  scope: Nullable<Scope> = null;

  constructor(stmts: Statement[], baseParam: IAstNodeParameter) {
    super(baseParam);
    this.stmts = stmts;
  }

  accept(visitor: AstVisitor) {
    return visitor.visitBlock(this);
  }
}

export { Block };
