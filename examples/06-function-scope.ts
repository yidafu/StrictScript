import { executeCode } from "../src";

executeCode(`
let name: string = "StrictScript";
function hello() {
  let prefix: string = "Hello ";
  println(prefix + name);
}
hello();`);