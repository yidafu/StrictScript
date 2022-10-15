import {
  BooleanLiteral,
  BuiltinType,
  CallSignature,
  ClassDeclare,
  DecimalLiteral,
  IntegetLiteral,
  LiteralTypeExpression,
  PredefinedTypeExpression,
  SimpleType,
  StringLiteral,
  TypeReferenceExpression,
  VariableDeclare,
} from '../ast-node';

import { AstVisitor } from './AstVisitor';

export class TypeResolver extends AstVisitor {
  visitVariableDeclare(variableDeclare: VariableDeclare) {
    if (variableDeclare.variableTypeExpression != null) {
      variableDeclare.variableType = this.visit(variableDeclare.variableTypeExpression);
    }
  }

  visitCallSignature(callSignature: CallSignature) {
    if (callSignature.returnTypeExpression) {
      callSignature.returnType = this.visit(callSignature.returnTypeExpression);
    }
    super.visitCallSignature(callSignature);
  }

  visitPredefinedTypeExpression(predefinedTypeExpression: PredefinedTypeExpression) {
    const type = predefinedTypeExpression.keyword;
    switch (type) {
      case 'boolean':
        return BuiltinType.Boolean;
      case 'number': return BuiltinType.Number;
      case 'string': return BuiltinType.String;
      case 'void': return BuiltinType.Void;
      default:
        return BuiltinType.Any;
    }
  }

  visitLiteralTypeExpression(literalTypeExpression: LiteralTypeExpression) {
    const literalExpression = literalTypeExpression.literal;
    if (literalExpression instanceof IntegetLiteral) {
      return BuiltinType.Integer;
    }
    if (literalExpression instanceof DecimalLiteral) {
      return BuiltinType.Decimal;
    }
    if (literalTypeExpression instanceof BooleanLiteral) {
      return BuiltinType.Boolean;
    }
    if (literalTypeExpression instanceof StringLiteral) {
      return BuiltinType.String;
    }
    return BuiltinType.Undefined;
  }

  visitTypeReferenceExpression(typeReferenceExpresion: TypeReferenceExpression) {
    const program = AstVisitor.getProgram(typeReferenceExpresion);
    const type = program.getType(typeReferenceExpresion.typeName);
    if (type instanceof SimpleType) {
      return type;
    }
    throw new Error(`Unknown type: ${type}`);
  }

  visitClassDeclare(classDeclare: ClassDeclare) {
    const program = AstVisitor.getProgram(classDeclare);

    const upperTypes: SimpleType[] = [];
    if (classDeclare.supperClass !== null) {
      const superType = program.getType(classDeclare.supperClass);
      if (superType instanceof SimpleType) {
        upperTypes.push(superType);
      } else {
        throw new Error(`Unknown Type '${classDeclare.supperClass}'`);
      }
    }
    const theType = new SimpleType(classDeclare.name, upperTypes);
    program.setType(classDeclare.name, theType);

    super.visitClassDeclare(classDeclare);
  }
}
