import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { LiteralExpression } from './LiteralExpression';

import { PrimaryTypeExpression } from './PrimaryTypeExpression';

export class LiteralTypeExpression extends PrimaryTypeExpression {
  literal: LiteralExpression;

  constructor(literal: LiteralExpression, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.literal = literal;
    this.literal.parentNode = this;
  }

  public accept(visitor: AstVisitor): any;
  public accept(visitor: AstVisitor, additional: any): any;
  public accept(visitor: AstVisitor, additional?: unknown): any {
    visitor.visitLiteralTypeExpression(this, additional);
  }
}
