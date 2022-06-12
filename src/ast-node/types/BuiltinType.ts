import { SimpleType } from "./SimpleType";

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
}

export { BuiltinType };
