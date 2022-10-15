import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { PrimaryTypeExpression } from './PrimaryTypeExpression';

export class TypeReferenceExpression extends PrimaryTypeExpression {
  typeName: string;

  constructor(typeName: string, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.typeName = typeName;
  }

  public accept(visitor: AstVisitor) {
    visitor.visitTypeReferenceExpression(this);
  }
}
