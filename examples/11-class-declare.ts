import { dumpAst } from '../src';

declare global {
  type Nullable<T> = T | null;
}

dumpAst(`
let c = new Child(1, 2);
class Child extends Parent  {
  a = 0;
  b: number;
  c: number = 1;

  constructor(a: number, b: number) {
    super(a);
    this.b = b;
  }

  add() {
    super.obj.prop;
    return this.a + this.b + this.c;
  }
}
`);