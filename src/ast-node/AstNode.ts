import { Position } from '../tokenizer';
import { AstVisitor } from '../visitor/AstVisitor';

interface IAstNodeParameter {
  beginPosition: Position;
  endPosition: Position;
  isErrorNode?: boolean;
}

abstract class AstNode {
  beginPosition: Position;

  endPosition: Position;

  isErrorNode: boolean;

  parentNode: Nullable<AstNode> = null;

  constructor(parameter: IAstNodeParameter) {
    this.beginPosition = parameter.beginPosition;
    this.endPosition = parameter.endPosition;
    this.isErrorNode = parameter.isErrorNode ?? false;
  }

  public abstract accept(visitor: AstVisitor): any;
  public abstract accept(visitor: AstVisitor, additional: any): any;
}

export { AstNode, IAstNodeParameter };
