import {
  BinaryExpression,
  Block,
  ForStatement,
  FunctionDeclare,
  IfStatement,
  isFunctionDeclare,
  ReturnStatement,
  Variable,
  VariableDeclare,
} from '../ast-node';
import { FunctionCall } from '../ast-node/FunctionCall';
import { UnaryExpression } from '../ast-node/UnaryExpression';
import {
  isVariableSymbol,
  Symbol,
  VariableSymbol,
} from '../visitor';
import { AstVisitor } from '../visitor/AstVisitor';

import { ReturnValue } from './ReturnValue';
import { StackFrame } from './StackFrame';

class Interpreter extends AstVisitor {
  values: Map<string, any> = new Map();

  callStack: StackFrame[] = [];

  currentFrame: StackFrame;

  constructor() {
    super();
    this.currentFrame = new StackFrame();
    this.callStack.push(this.currentFrame);
  }

  pushFrame(frame: StackFrame) {
    this.callStack.push(frame);
    this.currentFrame = frame;
  }

  popFrame() {
    if (this.callStack.length > 1) {
      const frame = this.callStack[this.callStack.length - 2];
      this.callStack.pop();
      this.currentFrame = frame;
    }
  }

  visitBlock(block: Block) {
    let retVal: any;
    for (const stmt of block.stmts) {
      retVal = this.visit(stmt);
      if (retVal && ReturnValue.isReturnValue(retVal)) {
        return retVal;
      }
    }

    return retVal;
  }

  visitReturnStatement(returnStmt: ReturnStatement): any {
    const retVal: ReturnValue = new ReturnValue();
    if (returnStmt.exp !== null) {
      retVal.setValue(this.visit(returnStmt.exp));
    }
    this.setReturnValue(retVal);
    return retVal;
  }

  setReturnValue(retVal: ReturnValue) {
    const frame = this.callStack[this.callStack.length - 2];
    frame.retVal = retVal;
  }

  visitIfStatement(stmt: IfStatement): void {
    const conditionValue = this.visit(stmt.condition);
    if (conditionValue) {
      for (const statement of stmt.thenStatement) {
        this.visit(statement);
      }
    } else if (stmt.elseStatement !== null) {
      for (const statement of stmt.elseStatement) {
        this.visit(statement);
      }
    }
  }

  visitForStatement(forStmt: ForStatement): void {
    if (forStmt.init !== null) {
      this.visit(forStmt.init);
    }

    let notTerminate = true;
    if (forStmt.condition !== null) {
      notTerminate = this.visit(forStmt.condition);
    }

    while (notTerminate) {
      let retVal: any;
      for (const statement of forStmt.statementList) {
        retVal = this.visit(statement);
      }
      // TODO: return value
      if (forStmt.increment !== null) {
        this.visit(forStmt.increment);
      }

      notTerminate = true;
      if (forStmt.condition !== null) {
        notTerminate = this.visit(forStmt.condition);
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  visitFunctionDeclare(_funcDecl: FunctionDeclare) { }

  visitFunctionCall(funcCall: FunctionCall) {
    if (funcCall.name === 'println') {
      if (funcCall.parameters.length > 0) {
        let retVal: ReturnValue | undefined;
        for (const parameter of funcCall.parameters) {
          retVal = this.visit(parameter);
        }
        // if (retVal && typeof (retVal as LeftValue).variable === 'object') {
        //   retVal = this.getVariableValue((retVal as LeftValue).variable.symbol);
        // }
        console.log(retVal);
      } else {
        console.log(0);
      }
      return 0;
    }

    if (funcCall.symbol !== null) {
      this.currentFrame.retVal = undefined;
      const frame = new StackFrame();

      const funDecl = funcCall.symbol.declare;
      if (funDecl && isFunctionDeclare(funDecl)) {
        const params = funDecl.callSignature.paramters;

        if (params !== null) {
          for (let idx = 0; idx < params.parameters.length; idx++) {
            const varDeclare = params.parameters[idx];
            const paramVal = this.visit(funcCall.parameters[idx]);
            frame.setValue(varDeclare.symbol!, paramVal);
          }
        }

        this.pushFrame(frame);

        this.visit(funDecl.body);

        this.popFrame();

        return this.currentFrame.retVal.value;
      }
    } else {
      throw new Error(`Runtime error, canot find declaration of ${funcCall.name}`);
    }
  }

  visitVariableDeclare(variableDeclare: VariableDeclare) {
    if (variableDeclare.init !== null) {
      const val = this.visit(variableDeclare.init);

      this.setVariableValue(variableDeclare.symbol!, val);
      return val;
    }
  }

  visitVariable(variable: Variable) {
    if (variable.isLeftValue) {
      return variable.symbol;
    }
    return this.getVariableValue(variable.symbol);
  }

  getVariableValue(varSymbol?: Symbol) {
    if (varSymbol) {
      return this.currentFrame.getValue(varSymbol);
    }
    return undefined;
  }

  setVariableValue(varialbeSymbol: Symbol, value: any) {
    return this.currentFrame.setValue(varialbeSymbol, value);
  }

  visitBinary(exp: BinaryExpression): void {
    let ret: any;

    let valueL = this.visit(exp.expL);
    let valueR = this.visit(exp.expR);

    // if (isVariableSymbol(valueL)) {
    //   valueL = this.getVariableValue(valueL);
    // }
    // if (isVariableSymbol(valueR)) {
    //   valueR = this.getVariableValue(valueR);
    // }
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
      case '==':
        ret = valueL === valueR;
        break;
      case '&&':
        ret = valueL + valueR;
        break;
      case '||':
        ret = valueL + valueR;
        break;
      case '=':
        if (valueL instanceof VariableSymbol) {
          this.setVariableValue(valueL, valueR);
        } else {
          throw new Error('Assignment need a lfet value');
        }
        break;
      default:
        throw new Error(`unsupport binary operator: ${exp.operator}`);
    }
    return ret;
  }

  visitUnaryExpression(exp: UnaryExpression): any {
    const val = this.visit(exp.exp);

    switch (exp.operator) {
      case '++': {
        const varSymbol: VariableSymbol = val;
        const value = this.getVariableValue(varSymbol);
        this.setVariableValue(varSymbol, value + 1);
        if (exp.ifPrefix) {
          return value + 1;
        }
        return value;
      }

      case '--': {
        const varSymbol: VariableSymbol = val;
        const value = this.getVariableValue(varSymbol);
        this.setVariableValue(varSymbol, value - 1);
        if (exp.ifPrefix) {
          return value - 1;
        }
        return value;
      }
      case '+': {
        return val;
      }
      case '-': {
        return -val;
      }
      default:
        throw new Error(`Unsupported unary operator: ${exp.operator}`);
    }
  }
}

export { Interpreter };
