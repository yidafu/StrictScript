import { AstVisitor, ClassSymbol, FunctionSymbol } from '../visitor';

import { IAstNodeParameter } from './AstNode';
import { ClassBody } from './ClassBody';
import { Declare } from './Declare';

class ClassDeclare extends Declare {
  classBobdy: ClassBody;

  supperClass: string | null;

  symbol: ClassSymbol | null = null;

  constructor(
    name: string,
    supperClass: string | null,
    classBobdy: ClassBody,
    baseParam: IAstNodeParameter,
  ) {
    super(name, baseParam);
    this.supperClass = supperClass;
    this.classBobdy = classBobdy;
    this.classBobdy.parentNode = this;
  }

  public accept(visitor: AstVisitor) {
    return visitor.visitClassDeclare(this);
  }
}

export { ClassDeclare };
