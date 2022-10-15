import { Scope, AstVisitor } from '../visitor';

import { AstNode, IAstNodeParameter } from './AstNode';
import { ConstructorDeclare } from './ConstructorDeclare';
import { FunctionDeclare } from './FunctionDeclare';
import { VariableDeclare } from './VariableDeclare';

class ClassBody extends AstNode {
  propertyDeclares: VariableDeclare[];

  constructorDeclare: Nullable<ConstructorDeclare>;

  methodDeclares: FunctionDeclare[];

  scope: Nullable<Scope> = null;

  constructor(
    constructorDeclare: Nullable<ConstructorDeclare>,
    methodDeclares: FunctionDeclare[],
    propertyDeclares: VariableDeclare[],
    baseParam: IAstNodeParameter,
  ) {
    super(baseParam);
    this.constructorDeclare = constructorDeclare;
    if (this.constructorDeclare) {
      this.constructorDeclare.parentNode = this;
    }
    this.propertyDeclares = propertyDeclares;
    for (const propertyDeclare of this.propertyDeclares) {
      propertyDeclare.parentNode = this;
    }
    this.methodDeclares = methodDeclares;
    for (const methodDeclare of this.methodDeclares) {
      methodDeclare.parentNode = this;
    }
  }

  accept(visitor: AstVisitor) {
    return visitor.visitClassBody(this);
  }
}

export { ClassBody };
