import { ClassDeclare, FunctionDeclare, Type } from '../../ast-node';

import { FunctionSymbol } from './FunctionSymbol';
import { Symbol, SymbolType } from './Symbol';
import { VariableSymbol } from './VariableSymbol';

export class ClassSymbol extends Symbol {
  classDeclare: ClassDeclare;

  theType: Type;

  constructorSymbol: Nullable<FunctionSymbol>;

  propertySymbols: VariableSymbol[];

  methodSymbols: FunctionSymbol[];

  supperCalss: Nullable<ClassSymbol>;

  constructor(
    classDeclare: ClassDeclare,
    theType: Type,
    constructorSymbol: Nullable<FunctionSymbol>,
    propertySymbols: VariableSymbol[],
    methodSymbols: FunctionSymbol[],
    supperCalss: Nullable<ClassSymbol>,
  ) {
    super(classDeclare.name, SymbolType.Class);
    this.classDeclare = classDeclare;
    this.theType = theType;
    this.constructorSymbol = constructorSymbol;
    this.propertySymbols = propertySymbols;
    this.methodSymbols = methodSymbols;
    this.supperCalss = supperCalss;
  }
}
