import { KeyWord } from '../tokenizer';
import { AstVisitor } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { TypeExpression } from './TypeExpression';

export class PredefinedTypeExpression extends TypeExpression {
  keyword: KeyWord;

  constructor(keyword: KeyWord, baseParam: IAstNodeParameter) {
    super(baseParam);
    this.keyword = keyword;
  }

  public accept(visitor: AstVisitor): any {
    visitor.visitPredefinedTypeExpression(this);
  }
}
