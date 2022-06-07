import { FunctionDeclare, VariableDeclare } from "../AstNode";
import { AstVisitor } from "./AstVisitor";
import { SymbolTable, SymbolType } from "./SymbolTable";


class Enter extends AstVisitor {
  symbolTable: SymbolTable;

  constructor(symbolTable: SymbolTable) {
    super();
    this.symbolTable = symbolTable;
  }

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    if (this.symbolTable.hasSymbol(funcDecl.name)) {
      throw new Error(`Duplicate symbol: ${funcDecl.name}`);
    }
    this.symbolTable.enter(funcDecl.name, funcDecl, SymbolType.Function);
  }

  visitVariableDeclare(variableDeclare: VariableDeclare) {
    
    if (this.symbolTable.hasSymbol(variableDeclare.name)) {
      throw new Error(`Duplicate symbol: ${variableDeclare.name}`);
    }
    this.symbolTable.enter(variableDeclare.name, variableDeclare, SymbolType.Variable);
  }
}

export {
  Enter,
}