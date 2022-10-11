import { executeCode, dumpAst } from "../src";

/// <reference path="../src/global.d.ts" />

declare global {
  type Nullable<T> = T | null;
}

executeCode(`
function sum(a: number, b: number) {
  let total = a + b;
  return total;
}
println(sum(1, 2));
`);
