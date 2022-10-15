import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';

import { TypeExpression } from './TypeExpression';

export enum ETypeOperator {
  BitOr = '|',
  BitAnd = '&',
}

export class UnionOrIntersectionTypeExpression extends TypeExpression {
  operator: ETypeOperator;

  typeExpressions: TypeExpression[];

  constructor(
    operator: ETypeOperator,
    typeExpressions: TypeExpression[],
    baseParam: IAstNodeParameter,
  ) {
    super(baseParam);
    this.operator = operator;
    this.typeExpressions = typeExpressions;
    for (const typeExpression of this.typeExpressions) {
      typeExpression.parentNode = this;
    }
  }

  public accept(visitor: AstVisitor) {
    visitor.visitUnionOrIntersectionTypeExpression(this);
  }
}
