import { BinaryExpression, FunctionCall, isFunctionType, Variable } from "../ast-node";
import { UnaryExpression } from "../ast-node/UnaryExpression";
import { Operator } from "../tokenizer";
import { SemanticAstVisitor } from "./SemanticAstVisitor";

class LeftValueAttributor extends SemanticAstVisitor {
  parentOperator: Nullable<Operator> = null;

  visitBinary(exp: BinaryExpression): void {
      if (exp.operator || exp.operator === '.') {
        const lastParentOperator = this.parentOperator;
        this.parentOperator = exp.operator as Operator;

        this.visit(exp.expL);
        if (!exp.expL.isLeftValue) {
          throw new Error(`Left child of operator ${exp.operator} need a left value ${exp.expL}`);
        }
        this.parentOperator = lastParentOperator;

        this.visit(exp.expR);
      } else {
        super.visitBinary(exp);
      }
  }


  visitUnaryExpression(unaryExp: UnaryExpression): void {
      if (unaryExp.operator === '++' || unaryExp.operator === '--') {

        const lastParentOperator = this.parentOperator;
        this.parentOperator = unaryExp.operator as Operator;

        this.visit(unaryExp.exp);
        if (!unaryExp.exp.isLeftValue) {
          throw new Error(`Unary operator ${unaryExp.operator} can only apply to a left value ${unaryExp}`);
        }

        this.parentOperator = lastParentOperator;
      } else {
        super.visitUnaryExpression(unaryExp);
      }
  }

  visitVariable(variable: Variable) {
    if (this.parentOperator !== null) {
      const varType = variable.theType;
      if (!varType?.hasVoid()) {
        variable.isLeftValue = true;
      }
    }
  }

  visitFunctionCall(funcCall: FunctionCall) {
      if (this.parentOperator === '.') {
        const funcType = funcCall.theType;
        if (funcType !== null && isFunctionType(funcType) && !funcType.returnType.hasVoid()) {
          funcCall.isLeftValue = true;
        }
      }
  }
}

export { LeftValueAttributor };
