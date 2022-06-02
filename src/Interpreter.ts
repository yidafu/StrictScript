import { FunctionBody } from "./AstNode/FunctionBody";
import { FunctionCall } from "./AstNode/FunctionCall";
import { Program } from "./AstNode/Program";
import { isFunctionCall } from "./utils";
import { AstVisitor } from "./visitor/AstVisitor";

class Interpreter extends AstVisitor {
  visitProgram(program: Program): any {
      let retVal;
      for (const stmt of program.stmts) {
        if (isFunctionCall(stmt)) {
          retVal = this.runFunction(stmt);
        }
      }
      return retVal;
  }

  visitFunctionBody(funcBody: FunctionBody): any {
      let retVal;
      for (const stmt of funcBody.stmts) {
        retVal = this.runFunction(stmt);
      }
      return retVal;
  }

  runFunction(funcCall: FunctionCall) {
    if (funcCall.name === 'println') {
      console.log(...funcCall.parameters);
      return 0;
    } else {
      if (funcCall.definition != null) {
        this.visitFunctionBody(funcCall.definition.body);
      }
    }
    return;
  }
}

export { Interpreter };
