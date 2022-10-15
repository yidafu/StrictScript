import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { PrimaryTypeExpression } from './PrimaryTypeExpression';
import { TypeExpression } from './TypeExpression';

export class ParenthesizedPrimaryTypeExpression extends PrimaryTypeExpression {
  typeExpression: TypeExpression;

  constructor(typeExpression: TypeExpression, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.typeExpression = typeExpression;
    this.typeExpression.parentNode = this;
  }

  public accept(visitor: AstVisitor) {
    visitor.visitParenthesizedPrimaryTypeExpression(this);
  }
}
