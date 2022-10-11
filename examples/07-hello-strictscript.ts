import { executeCode } from "../src";

executeCode(`
let name: string = "StrictScript";
function hello() {
  println("Hello " + name);
}
hello();`);