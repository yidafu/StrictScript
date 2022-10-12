import { executeCode } from '../src';

declare global {
  type Nullable<T> = T | null;
}

executeCode(`
for (let idx = 1; idx < 3; idx++) {
  println("for loop ==>" + idx);
}`);
