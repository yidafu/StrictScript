import { TypeVisitor } from '../../visitor';

import { BuiltinType } from './BuiltinType';
import { Type } from './Type';
import { isUnionType } from './utils';

class FunctionType extends Type {
  returnType: Type = BuiltinType.Void;

  parameterTypes: Type[];

  static index = 0;

  constructor(
    name: string,
    parmeterTypes: Type[],
    returnType: Type,
  ) {
    super(`@function${typeof name === 'string' ? name : FunctionType.index++}`);
    this.parameterTypes = parmeterTypes;
    this.returnType = returnType;
  }

  le(type2: Type): boolean {
    if (type2 === BuiltinType.Any) {
      return true;
    } if (this === type2) {
      return true;
    } if (isUnionType(type2)) {
      return type2.types.includes(this);
    }
    return false;
  }

  accept(visitor: TypeVisitor) {
    return visitor.visitFunctionType(this);
  }

  hasVoid() {
    return false;
  }

  toString(): string {
    return `FunctionType {name: ${this.name}, parameterTypes: ${this.parameterTypes}, returnType: ${this.returnType}}`;
  }
}

export { FunctionType };
