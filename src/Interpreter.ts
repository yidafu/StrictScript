import { FunctionCall } from "./ast-node/FunctionCall";
import { BinaryExpression, FunctionDeclare, Variable, VariableDeclare } from "./ast-node";
import { AstVisitor } from "./visitor/AstVisitor";

class Interpreter extends AstVisitor {
  values: Map<string, any> = new Map();

  // eslint-disable-next-line no-unused-vars
  visitFunctionDeclare(_funcDecl: FunctionDeclare) {}

  visitFunctionCall(funcCall: FunctionCall) {
    if (funcCall.name === 'println') {
      if (funcCall.parameters.length > 0) {
        let retVal = this.visit(funcCall.parameters[0]);
        if (typeof (retVal as LeftValue).variable === 'object') {
          retVal = this.getVariableValue((retVal as LeftValue).variable.name);
        }
        console.log(retVal);
      } else {
        console.log(0);
      }
      return 0;
    } else {
      if (funcCall.declare !== null) {
        return this.visitBlock(funcCall.declare.body);
      }
    }
  }

  visitVariableDeclare(variableDeclare: VariableDeclare) {
    if (variableDeclare.init !== null) {
      let val = this.visit(variableDeclare.init);
      if (this.isLeftValue(val)) {
        val = this.getVariableValue((val as LeftValue).variable.name);
      }
      this.setVariableValue(variableDeclare.name, val);
      return val;
    }
  }

  visitVariable(variable: Variable) {
    return new LeftValue(variable);
  }

  getVariableValue(variableName: string) {
    return this.values.get(variableName);
  }

  setVariableValue(variableName: string, value: any) {
    return this.values.set(variableName, value);
  }

  isLeftValue(value: any): value is LeftValue {
    return value instanceof LeftValue;
  }

  visitBinary(exp: BinaryExpression): void {
      let ret: any;

      let valueL = this.visit(exp.expL);
      let valueR = this.visit(exp.expR);

      if (this.isLeftValue(valueL)) {
         valueL = this.getVariableValue(valueL.variable.name);
      }
      if (this.isLeftValue(valueR)) {
        valueR = this.getVariableValue(valueR.variable.name);
      }
      switch (exp.operator) {
        case '+':
          ret = valueL + valueR;
          break;
        case '-':
          ret = valueL - valueR;
          break;
        case '*':
          ret = valueL * valueR;
          break;
        case '/':
          ret = valueL / valueR;
          break;
        case '%':
          ret = valueL % valueR;
          break;
        case '>':
          ret = valueL > valueR;
          break;
        case '>=':
          ret = valueL >= valueR;
          break;
        case '<':
          ret = valueL < valueR;
          break;
        case '<=':
          ret = valueL <= valueR;
          break;
        case '&&':
          ret = valueL + valueR;
          break;
        case '||':
          ret = valueL + valueR;
          break;
        case '=':
          if (valueL !== null) {
            this.setVariableValue(valueL.variable.name, valueR);
          } else {
            throw new Error('Assignment need a lfet value');
          }
          break;
        default:
          throw new Error(`unsupport binary operator: ${exp.operator}`);
      }
      return ret;
  }
}

class LeftValue {
  variable: Variable;

  constructor(variable: Variable) {
    this.variable = variable;
  }
}

export { Interpreter };
