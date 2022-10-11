import { executeCode } from "../src";

executeCode(`
function foo() {
  println("call foo by bar.");
}
function bar() {
  foo();
}
bar();`);