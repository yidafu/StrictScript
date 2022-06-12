import { executeCode } from "../src";

declare global {
  type Nullable<T> = T | null;
}

executeCode(`
let flag = true;
if (flag) {
  println("truth case");
} else {
  println("never unreachable");
}`);