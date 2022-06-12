import { TypeVisitor } from "../../visitor";
import { BuiltinType } from "./BuiltinType";
import { Type } from "./Type";
import { isUnionType } from "./utils";

class UnionType extends Type {

  types: Type[];
  static index: number = 0;

  constructor(types: Type[], name?: string) {
    super(`@union${typeof name ==='string' ? name : UnionType.index++}`);
    this.types = types;
  }
  hasVoid() {
    for (const type of this.types) {
      if (type.hasVoid()) {
        return true;
      }
    }
    return false;
  }

  toString(): string {
      return `UnionType {name: ${this.name}, types: [${this.types.map(type => type.name).join(',')}]}`;
  }

  le(type2: Type): boolean {
    if (type2 === BuiltinType.Any) {
      return true;
    } else if (isUnionType(type2)) {
      for (const type of this.types) {
        if (!type2.types.find(t => type.le(t))) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  accept(visitor: TypeVisitor) {
    return visitor.visitUnionType(this);
  }
}

export { UnionType };
