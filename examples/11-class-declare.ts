import { dumpAst } from '../src';

declare global {
  type Nullable<T> = T | null;
}

dumpAst(`
class Child extends Parent  {
  b: number;
  c: number = 1;

  constructor(b: number) {
  }

  add() {

  }
}
`);
