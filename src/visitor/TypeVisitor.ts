import { FunctionType, SimpleType, Type, UnionType } from "../ast-node";

abstract class TypeVisitor {
  visit(type: Type) {
    return type.accept(this);
  }

  abstract visitSimpleType(type: SimpleType): any;
  abstract visitUnionType(type: UnionType): any;
  abstract visitFunctionType(type: FunctionType): any;
}

export { TypeVisitor };
