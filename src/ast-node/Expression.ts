import { AstNode } from "./AstNode";
import { Type } from "./types";

export abstract class Expression extends AstNode {
  theType: Nullable<Type> = null;
  shouldBeLeftValue: boolean = false;
  isLeftValue: boolean = false;
  isConstValue: boolean = false;

  inferredType: Nullable<Type> = null;
}