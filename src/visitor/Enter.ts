import { Block, BuiltinType, FunctionDeclare, FunctionType, Program, Type, Variable, VariableDeclare } from "../ast-node";
import { AstVisitor } from "./AstVisitor";
import { FunctionSymbol, VariableSymbol } from "./symbol";
import { Scope } from "./Scope";


class Enter extends AstVisitor {
  scope: Scope;

  functionSym?: FunctionSymbol;

  constructor(scope: Scope) {
    super();
    this.scope = scope;
  }
  visitProgram(program: Program) {
    const symbol = new FunctionSymbol('main', new FunctionType('main', [], BuiltinType.Integer));
    program.symbol = symbol;

    this.functionSym = symbol;
    return super.visitProgram(program);
  }

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    const currentScope = this.scope;
    const paramTypes: Type[] = [];

    if (funcDecl.callSignature.paramters !== null) {
      for (const parameter of funcDecl.callSignature.paramters.parameters) {
        paramTypes.push(parameter.variableType);
      }
    }

    const symbol = new FunctionSymbol(funcDecl.name, new FunctionType(funcDecl.name, paramTypes));
    symbol.declare = funcDecl;
    funcDecl.symbol = symbol;

    if (currentScope.hasSymbol(funcDecl.name)) {
      throw new Error(`Duplicate symbol: ${funcDecl.name}`);
    } else {
      currentScope.enter(funcDecl.name, symbol);
    }

    const lastFunctionSymbol = this.functionSym;
    this.functionSym = symbol;
    const oldScrope = currentScope;
    this.scope = new Scope(oldScrope);
    funcDecl.scope = this.scope;
    super.visitFunctionDeclare(funcDecl);

    this.functionSym = lastFunctionSymbol;

    this.scope = oldScrope;
  }

  visitVariable(variable: Variable) {
    const symbol = this.scope.lookupSymbol(variable.name);
    if (symbol !== null && VariableSymbol.isVariableSymbol(symbol)) {
      variable.symbol = symbol;
    } else {
      throw new Error(`Cannot find declaration of variable ${variable.name}`);
    }
  }

  visitVariableDeclare(variableDeclare: VariableDeclare) {
    const currentScope = this.scope;

    if (currentScope.hasSymbol(variableDeclare.name)) {
      throw new Error(`Duplicate symbol: ${variableDeclare.name}`);
    }

    const sym = new VariableSymbol(variableDeclare.name, variableDeclare.variableType);
    variableDeclare.symbol = sym;
    sym.declare = variableDeclare;

    this.scope.enter(variableDeclare.name, sym);

    this.functionSym?.vars.push(sym);
  }

  visitBlock(block: Block) {
    const oldScope = this.scope;
    this.scope = new Scope(oldScope);

    block.scope = this.scope;

    super.visitBlock(block);

    this.scope = oldScope;
  }
}

export {
  Enter,
};
