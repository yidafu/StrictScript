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
    this.propertyDeclares = propertyDeclares;
    this.methodDeclares = methodDeclares;
  }

  accept(visitor: AstVisitor) {
    return visitor.visitClassBody(this);
  }
}

export { ClassBody };
