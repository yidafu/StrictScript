import { Block, FunctionDeclare, Variable, VariableDeclare } from "../ast-node";
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

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    if (this.scope.lookupSymbol(funcDecl.name)) {
      throw new Error(`Duplicate symbol: ${funcDecl.name}`);
    }
    const symbol = new FunctionSymbol(funcDecl.name, funcDecl);
    this.scope.enter(funcDecl.name, symbol);

    this.visitBlock(funcDecl.body);
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

    if (this.scope.hasSymbol(variableDeclare.name)) {
      throw new Error(`Duplicate symbol: ${variableDeclare.name}`);
    }

    const sym = new VariableSymbol(variableDeclare.name, variableDeclare.variableType, variableDeclare);
    this.scope.enter(variableDeclare.name, sym);

    this.functionSym?.vars.push(sym);
  }

  visitBlock(block: Block) {
    const currentScope = new Scope(this.scope);

    this.scope = currentScope;

    super.visitBlock(block);

    if (this.scope.enclosingScope != null) {
      this.scope = this.scope.enclosingScope;
    }

    return currentScope;
  }
}

export {
  Enter,
};
