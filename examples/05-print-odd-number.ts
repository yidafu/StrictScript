import { executeCode } from '../src';

declare global {
  type Nullable<T> = T | null;
}

executeCode(`
function printOddNumber(n: number) {
  for (let idx = 1; idx <= n; idx++) {
    if (idx % 2 == 1) {
      println("odd number ==> " + idx);
    } else {
      println("skip even number");
    }
  }
}
printOddNumber(10);
`);
