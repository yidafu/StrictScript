import { SimpleType } from './SimpleType';
import { Type } from './Type';

class BuiltinType {
  static Any = new SimpleType('any', []);

  static String = new SimpleType('string', [BuiltinType.Any]);

  static Number = new SimpleType('number', [BuiltinType.Any]);

  static Boolean = new SimpleType('Boolean', [BuiltinType.Any]);

  static Null = new SimpleType('Null');

  static Undefined = new SimpleType('Undefined');

  static Void = new SimpleType('void', []);

  static Integer = new SimpleType('integer', [BuiltinType.Number]);

  static Decimal = new SimpleType('decimal', [BuiltinType.Number]);

  static isBuiltinType(type: Type) {
    return type === BuiltinType.Any
      || type === BuiltinType.String
      || type === BuiltinType.Number
      || type === BuiltinType.Boolean
      || type === BuiltinType.Null
      || type === BuiltinType.Undefined
      || type === BuiltinType.Void
      || type === BuiltinType.Integer
      || type === BuiltinType.Decimal;
  }
}

export { BuiltinType };
