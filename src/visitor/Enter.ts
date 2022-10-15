import assert from 'assert';

import {
  Block,
  ClassBody,
  ClassDeclare,
  ConstructorDeclare,
  FunctionDeclare,
  FunctionType,
  Type,
  Variable,
  VariableDeclare,
} from '../ast-node';

import { AstVisitor } from './AstVisitor';

import { Scope } from './Scope';
import { SemanticAstVisitor } from './SemanticAstVisitor';
import { ClassSymbol, FunctionSymbol, VariableSymbol } from './symbol';

class Enter extends SemanticAstVisitor {
  scope: Nullable<Scope> = null;

  functionSym?: FunctionSymbol;

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    const currentScope = this.scope;
    assert(currentScope, 'Scope cannot be null');

    const paramTypes: Type[] = [];

    if (funcDecl.callSignature.paramters !== null) {
      for (const parameter of funcDecl.callSignature.paramters.parameters) {
        paramTypes.push(parameter.variableType);
      }
    }

    const symbol = new FunctionSymbol(
      funcDecl.name,
      new FunctionType(
        funcDecl.name,
        paramTypes,
        funcDecl.callSignature.returnType,
      ),
    );
    symbol.declare = funcDecl;
    funcDecl.symbol = symbol;

    if (currentScope.hasSymbol(funcDecl.name)) {
      throw new Error(`Duplicate symbol: ${funcDecl.name}`);
    }

    currentScope.enter(funcDecl.name, symbol);

    const lastFunctionSymbol = this.functionSym;
    this.functionSym = symbol;
    const oldScrope = currentScope;
    this.scope = new Scope(funcDecl, oldScrope);
    funcDecl.scope = this.scope;
    super.visitFunctionDeclare(funcDecl);

    this.functionSym = lastFunctionSymbol;

    this.scope = oldScrope;
  }

  visitVariable(variable: Variable) {
    const symbol = this.scope!.lookupSymbol(variable.name);
    if (symbol !== null && VariableSymbol.isVariableSymbol(symbol)) {
      variable.symbol = symbol;
    } else {
      throw new Error(`Cannot find declaration of variable ${variable.name}`);
    }
  }

  visitVariableDeclare(variableDeclare: VariableDeclare) {
    const currentScope = this.scope;
    assert(currentScope, 'Scope cannot be null');

    if (currentScope.hasSymbol(variableDeclare.name)) {
      throw new Error(`Duplicate symbol: ${variableDeclare.name}`);
    }

    const sym = new VariableSymbol(variableDeclare.name, variableDeclare.variableType);
    variableDeclare.symbol = sym;
    sym.declare = variableDeclare;

    currentScope.enter(variableDeclare.name, sym);

    this.functionSym?.vars.push(sym);
  }

  visitBlock(block: Block) {
    const oldScope = this.scope;
    this.scope = new Scope(block, oldScope);

    block.scope = this.scope;

    super.visitBlock(block);

    this.scope = oldScope;
  }

  visitClassBody(classBobdy: ClassBody): void {
    const oldScope = this.scope;
    this.scope = new Scope(classBobdy, oldScope);

    classBobdy.scope = this.scope;

    super.visitClassBody(classBobdy);

    this.scope = oldScope;
  }

  visitConstructorDeclare(constructorDeclare: ConstructorDeclare): void {
    const currentScope = this.scope;
    assert(currentScope, 'Scope cannot be null');

    const paramTypes: Type[] = [];
    console.log(constructorDeclare.name);
    if (constructorDeclare.callSignature.paramters !== null) {
      for (const parameter of constructorDeclare.callSignature.paramters.parameters) {
        paramTypes.push(parameter.variableType);
      }
    }

    const symbol = new FunctionSymbol(
      constructorDeclare.name,
      new FunctionType(
        constructorDeclare.name,
        paramTypes,
        constructorDeclare.callSignature.returnType,
      ),
    );
    symbol.declare = constructorDeclare;
    constructorDeclare.symbol = symbol;

    if (currentScope.hasSymbol(constructorDeclare.name)) {
      throw new Error(`Duplicate symbol: ${constructorDeclare.name}`);
    }

    currentScope.enter(constructorDeclare.name, symbol);

    const lastFunctionSymbol = this.functionSym;
    this.functionSym = symbol;
    const oldScrope = currentScope;
    this.scope = new Scope(constructorDeclare, oldScrope);
    constructorDeclare.scope = this.scope;
    super.visitFunctionDeclare(constructorDeclare);

    this.functionSym = lastFunctionSymbol;

    this.scope = oldScrope;
  }

  visitClassDeclare(classDeclare: ClassDeclare) {
    super.visitClassDeclare(classDeclare);
    const currentScope = this.scope;

    assert(currentScope, 'Scope cannot be null');

    if (currentScope.hasSymbol(classDeclare.name)) {
      throw new Error(`Duplicate Symbol: ${classDeclare.name}`);
    }

    const program = AstVisitor.getProgram(classDeclare);

    const topScope = program.scope!;

    let superClassSymbol: Nullable<ClassSymbol> = null;
    if (classDeclare.supperClass !== null) {
      const maybeClassSymbol = topScope.getSymbol(classDeclare.supperClass);
      if (maybeClassSymbol instanceof ClassSymbol) {
        superClassSymbol = maybeClassSymbol;
      } else {
        throw new Error(`Connot find class symbol of ${classDeclare.supperClass}`);
      }
    }

    let constructorSymbol: Nullable<FunctionSymbol> = null;
    const propertySymbols: VariableSymbol[] = [];
    const methodSymbols: FunctionSymbol[] = [];

    const classScope = classDeclare.classBobdy.scope;
    for (const propertyOrMethod of classScope!.nameSymbolMap.keys()) {
      const symbol = classScope!.getSymbol(propertyOrMethod)!;
      if (propertyOrMethod === 'constructor') {
        if (symbol instanceof FunctionSymbol) {
          constructorSymbol = symbol;
        } else {
          throw new Error('keyword \'constructor\' must be a function');
        }
      } else if (symbol instanceof FunctionSymbol) {
        methodSymbols.push(symbol);
      } else if (symbol instanceof VariableSymbol) {
        propertySymbols.push(symbol);
      }
    }

    const theType = program.getType(classDeclare.name);
    if (!theType) throw new Error(`Unknow type for class '${classDeclare.name}'`);
    const classSymbol = new ClassSymbol(
      classDeclare,
      theType,
      constructorSymbol,
      propertySymbols,
      methodSymbols,
      superClassSymbol,
    );

    classDeclare.symbol = classSymbol;
    currentScope.enter(classDeclare.name, classSymbol);
  }
}

export {
  Enter,
};
