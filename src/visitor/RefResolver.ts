import assert from 'assert';

import { Block, Variable, VariableDeclare } from '../ast-node';
import { FunctionCall } from '../ast-node/FunctionCall';
import { FunctionDeclare } from '../ast-node/FunctionDeclare';
import { Program } from '../ast-node/Program';

import { Scope } from './Scope';
import { SemanticAstVisitor } from './SemanticAstVisitor';
import { BuiltIn } from './builtIn';
import {
  FunctionSymbol, isFunctionSymbol, isVariableSymbol, VariableSymbol,
} from './symbol';

class RefResolver extends SemanticAstVisitor {
  program: Program | null = null;

  scope: Nullable<Scope> = null;

  declareVariableMap: Map<Scope, Map<string, VariableSymbol>> = new Map();

  constructor(symbolTable: Scope) {
    super();
    this.scope = symbolTable;
  }

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    const oldScope = this.scope;
    this.scope = funcDecl.scope;
    assert(this.scope !== null, 'Scope must not be null');
    assert(oldScope !== null, 'Scope must not be null');

    this.declareVariableMap.set(this.scope, new Map());

    super.visitFunctionDeclare(funcDecl);

    this.scope = oldScope;
  }

  visitFunctionCall(funcCall: FunctionCall) {
    const currentScope = this.scope;
    assert(currentScope !== null, 'Scope must not be null');

    if (BuiltIn.has(funcCall.name)) {
      funcCall.symbol = BuiltIn.get(funcCall.name) as FunctionSymbol;
    } else {
      const symbol = currentScope.lookupSymbol(funcCall.name);
      if (symbol !== null && isFunctionSymbol(symbol)) {
        funcCall.symbol = symbol;
      } else {
        throw new Error('Expecting a FunctionSymbol');
      }
    }

    super.visitFunctionCall(funcCall);
  }

  visitBlock(block: Block) {
    const oldScope = this.scope;

    this.scope = block.scope;

    assert(this.scope !== null, 'Scope must not be null');

    this.declareVariableMap.set(this.scope, new Map());

    super.visitBlock(block);

    this.scope = oldScope;
  }

  visitVariableDeclare(variableDeclare: VariableDeclare): void {
    const currentScope = this.scope;
    assert(currentScope !== null, 'Scope must not be null');
    const decalreMap = this.declareVariableMap.get(currentScope);

    const symbol = currentScope.getSymbol(variableDeclare.name);
    if (symbol && isVariableSymbol(symbol)) {
      decalreMap?.set(variableDeclare.name, symbol);
    }

    super.visitVariableDeclare(variableDeclare);
  }

  visitVariable(variable: Variable) {
    assert(this.scope !== null, 'Scope must not be null');
    const symbol = this.scope.lookupSymbol(variable.name);
    if (symbol && isVariableSymbol(symbol)) {
      variable.symbol = symbol;
    } else {
      throw new Error(`Variable: ${variable.name} is used before declaration`);
    }
  }
}

export { RefResolver };
