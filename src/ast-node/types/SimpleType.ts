import { TypeVisitor } from "../../visitor";
import { BuiltinType } from "./BuiltinType";
import { Type } from "./Type";
import { isSimpleType, isUnionType } from "./utils";

class SimpleType extends Type {

  upperTypes: SimpleType[] = [];
  constructor(name: string, upperTypes: SimpleType[] = []) {
    super(name);
    this.upperTypes = upperTypes;
  }

  le(type2: Type): boolean {
    if(type2 === BuiltinType.Any) {
      return true;
    } else  if (this === BuiltinType.Any) {
      return false;
    } else if (this === type2) {
      return true;
    } else if (isSimpleType(type2)) {
      if (this.upperTypes.includes(type2)) {
        return true;
      } else {
        for (const upperType of this.upperTypes) {
          if (upperType.le(type2)) {
            return true;
          }
        }
        return false;
      }
    } else if (isUnionType(type2)) {
      if (type2.types.includes(this)) {
        return true;
      } else {
        for (const type of type2.types) {
          if (this.le(type)) {
            return true;
          }
        }
        return false;
      }
    } else {
      return false;
    }
  }


  accept(visitor: TypeVisitor) {
    return visitor.visitSimpleType(this);
  }
  hasVoid() {
    if (this === BuiltinType.Void) {
      return BuiltinType.Void;
    } else {
      for (const upperType of this.upperTypes) {
        if (upperType.hasVoid()) {
          return true;
        }
      }
      return false;
    }
  }
  toString(): string {
    return `SimpleType {name: ${this.name}, upperTypes: [${
      this.upperTypes.map(type => type.name).join(',')}]}`;
  }
}

export { SimpleType };
