import {
  BinaryExpression, Block, BooleanLiteral, CallSignature, DecimalLiteral, ErrorExpression, ErrorStatement, ExpressionStatement, ForStatement, FunctionCall, FunctionDeclare, IfStatement, IntegetLiteral, NullLiteral, ParameterList, Program, ReturnStatement, StringLiteral, UndefinedLiteral, Variable, VariableDeclare, VariableStatement,
} from '../ast-node';
import { UnaryExpression } from '../ast-node/UnaryExpression';

import { AstVisitor } from './AstVisitor';

function addPrefixPadding(str: string, padding = '\t') {
  return str.split('\n').filter(Boolean).map((s: string) => padding + s).join('\n');
}

class Dumper extends AstVisitor {
  visitProgram(program: Program) {
    let output = 'Program\n';
    for (const stmt of program.stmts) {
      output += `${addPrefixPadding(this.visit(stmt))}\n`;
    }
    console.log(output);
  }

  visitVariableStatement(variableStatement: VariableStatement): string {
    return `VariableStatement\n${addPrefixPadding(this.visit(variableStatement.variableDeclare))}\n`;
  }

  visitVariableDeclare(variableDeclare: VariableDeclare) {
    let output = `VariableDeclare: ${variableDeclare.name}: ${variableDeclare.variableType?.name}\n`;
    if (variableDeclare.init !== null) {
      output += addPrefixPadding(this.visit(variableDeclare.init));
    } else {
      output += '\tno initialization\n';
    }
    return output;
  }

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    return `FunctionDeclare: ${funcDecl.name}\n${addPrefixPadding(this.visit(funcDecl.callSignature))
    }\n${addPrefixPadding(this.visit(funcDecl.body))}`;
  }

  visitCallSignature(callSignature: CallSignature) {
    let output = `Return Type: ${callSignature.returnType.name}\n`;
    if (callSignature.paramters != null) {
      output += addPrefixPadding(this.visit(callSignature.paramters));
    }

    return output;
  }

  visitParameterList(parametersList: ParameterList) {
    let output = `Parameter List: ${parametersList.parameters.length || 'none'}\n`;
    for (const parameter of parametersList.parameters) {
      output += `${addPrefixPadding(this.visit(parameter))}\n`;
    }
    return output;
  }

  visitBlock(block: Block) {
    let output = 'Block:';
    for (const stmt of block.stmts) {
      output += `${addPrefixPadding(this.visit(stmt))}\n`;
    }
    return output;
  }

  visitExpressionStatement(stmt: ExpressionStatement) {
    return `ExpressionSatement\n${addPrefixPadding(this.visit(stmt.exp))}\n`;
  }

  visitReturnStatement(stmt: ReturnStatement): string {
    return `ReturenStatement\n${stmt.exp !== null && addPrefixPadding(this.visit(stmt.exp))}`;
  }

  visitIfStatement(stmt: IfStatement): string {
    let output = 'IfStatement\n';

    output += `${addPrefixPadding(`Condition:\n${addPrefixPadding(this.visit(stmt.condition))}`)}\n`;
    output += `${addPrefixPadding(`Then:\n${addPrefixPadding(
      stmt.thenStatement.map((st) => this.visit(st)).join('\n'),
    )}`)}\n`;
    if (stmt.elseStatement !== null) {
      output += `${addPrefixPadding(`Else:\n${addPrefixPadding(
        stmt.elseStatement.map((st) => this.visit(st)).join('\n'),
      )}`)}\n`;
    }

    return output;
  }

  visitForStatement(stmt: ForStatement): string {
    let output = 'ForStatement\n';
    if (stmt.init !== null) {
      output += `${addPrefixPadding(`Init:\n${addPrefixPadding(this.visit(stmt.init))}`)}\n`;
    }
    if (stmt.condition !== null) {
      output += `${addPrefixPadding(`Condition:\n${addPrefixPadding(this.visit(stmt.condition))}`)}\n`;
    }
    if (stmt.increment !== null) {
      output += `${addPrefixPadding(`Increment:\n${addPrefixPadding(this.visit(stmt.increment))}`)}\n`;
    }
    if (stmt.statementList !== null) {
      output += `${addPrefixPadding(`Body:\n${addPrefixPadding(stmt.statementList.map((st) => (this.visit(st))).join('\n'))}`)}\n`;
    }
    return output;
  }

  visitBinary(exp: BinaryExpression): string {
    return `Binary: ${exp.operator} ${exp.theType?.name}\n${addPrefixPadding(this.visit(exp.expL))
    }\n${addPrefixPadding(this.visit(exp.expR))}`;
  }

  visitUnaryExpression(exp: UnaryExpression): string {
    return `${exp.ifPrefix ? 'Prefix' : 'Postfix'} Unary: ${exp.operator} ${exp.theType?.name
    }\n${addPrefixPadding(this.visit(exp.exp))}`;
  }

  visitIntegerLiteral(exp: IntegetLiteral): string {
    return `IntegerLiteral: ${exp.value}`;
  }

  visitDecimalLiteral(exp: DecimalLiteral): string {
    return `DecimalLiteral: ${exp.value}`;
  }

  visitStringLiteral(exp: StringLiteral): string {
    return `StringLiteral: ${exp.value}`;
  }

  visitBooleanLiteral(exp: BooleanLiteral): string {
    return `BooleanLiteral: ${exp.value}`;
  }

  visitNullLiteral(exp: NullLiteral) {
    return `NullLiteral: ${exp.value}`;
  }

  visitUndefinedLiteral(exp: UndefinedLiteral) {
    return `UndefinedLiteral: ${exp.value}`;
  }

  visitVariable(variable: Variable) {
    return `Varable: ${variable.name}(${variable.theType?.name})\n`;
  }

  visitFunctionCall(funcCall: FunctionCall) {
    let output = `Function Call: ${funcCall.name}\n`;

    for (const parameter of funcCall.parameters) {
      output += `${addPrefixPadding(this.visit(parameter))}\n`;
    }

    return output;
  }

  // eslint-disable-next-line no-unused-vars
  visitErrorExpression(errExp: ErrorExpression): string {
    return `ErrorExpression\n`;
  }

  // eslint-disable-next-line no-unused-vars
  visitErrorStatement(errStmt: ErrorStatement): string {
    return `ErrorStatement\n`;
  }
}

export { Dumper };
