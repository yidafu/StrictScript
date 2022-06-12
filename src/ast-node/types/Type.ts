import { TypeVisitor } from "../../visitor";

export abstract class Type {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // eslint-disable-next-line no-unused-vars
  abstract le(type2: Type): boolean;

  // eslint-disable-next-line no-unused-vars
  abstract accept(visitor: TypeVisitor): any;

  abstract hasVoid(): any;

  abstract toString(): string;
}
