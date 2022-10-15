import {
  Block,
  ClassBody,
  ClassDeclare,
  ConstructorDeclare,
  FunctionDeclare,
  Program,
  VariableDeclare,
} from '../../ast-node';
import { AstVisitor } from '../AstVisitor';
import { Scope } from '../Scope';

import { addPrefixPadding } from './utils';

export class ScopeDumper extends AstVisitor {
  visitProgram(program: Program) {
    console.log(this.visitBlock(program));
  }

  visitFunctionDeclare(funcDecl: FunctionDeclare) {
    let output = `Scope of function => ${funcDecl.name}\n`;
    output += `${addPrefixPadding(`Scope Symbol List:\n${
      addPrefixPadding(this.dumpScope(funcDecl.scope))
    }\n`)}\n`;
    output += `${addPrefixPadding(this.visit(funcDecl.body))}`;

    return output;
  }

  visitConstructorDeclare(constructorDeclare: ConstructorDeclare): string {
    return `Scope of Constructor => ${constructorDeclare.name}\n${addPrefixPadding(`Scope Symbol List:\n${addPrefixPadding(this.dumpScope(constructorDeclare.scope))
    }\n`)}\n`;
  }

  visitVariableDeclare(variableDeclare: VariableDeclare) {
    return '';
  }

  visitBlock(block: Block) {
    let output = `Scope of Block:\n${
      addPrefixPadding(this.dumpScope(block.scope))
    }\n`;
    for (const stmt of block.stmts) {
      const str = this.visit(stmt);
      if (str) {
        output += `${addPrefixPadding(str)}\n`;
      }
    }
    return output;
  }

  visitClassDeclare(classDeclare: ClassDeclare): string {
    return `Class ${classDeclare.name}:\n${addPrefixPadding(this.visitClassBody(classDeclare.classBobdy))}`;
  }

  visitClassBody(classBobdy: ClassBody): string {
    let output = `Scope of Class Body:\n${
      addPrefixPadding(this.dumpScope(classBobdy.scope))
    }\n`;

    if (classBobdy.constructorDeclare) {
      output += `constructor scope:\n${addPrefixPadding(this.visit(classBobdy.constructorDeclare))}\n`;
    }
    for (const methodDeclare of classBobdy.methodDeclares) {
      output += `method scope:\n${addPrefixPadding(this.visit(methodDeclare))}\n`;
    }
    return output;
  }

  dumpScope(scope: Nullable<Scope>): string {
    if (scope === null) return 'Empty Scope';
    let output = '';
    for (const [name, symbol] of scope.nameSymbolMap.entries()) {
      output += `name: ${name}  symbol: ${symbol.type}\n`;
    }
    return output;
  }
}
