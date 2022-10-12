import { BuiltinType } from './BuiltinType';
import { FunctionType } from './FunctionType';
import { SimpleType } from './SimpleType';
import { Type } from './Type';
import { UnionType } from './UnionType';

export function getUpperBound(type1: Type, type2: Type): Type {
  if (type1 === BuiltinType.Any && type2 === BuiltinType.Any) {
    return BuiltinType.Any;
  }
  if (type1.le(type2)) {
    return type2;
  } if (type2.le(type1)) {
    return type1;
  }
  return new UnionType([type1, type2]);
}

export function isSimpleType(type: Type): type is SimpleType {
  return type instanceof SimpleType;
}

export function isUnionType(type: Type): type is UnionType {
  return type instanceof UnionType;
}

export function isFunctionType(type: Type): type is FunctionType {
  return type instanceof FunctionType;
}
