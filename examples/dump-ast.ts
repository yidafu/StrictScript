import { dumpAst } from "../src";

declare global {
  type Nullable<T> = T | null;
}

dumpAst(`let name: string = "1234";`);

dumpAst(`function echo(name: string): void {
  let msg: string = "hello " + name;
  println(msg);
}
echo("xiaoming");
`);

dumpAst(`
if (flag === true) {
  let name = "xxx";
  println("xxx" + name);
} else {
  let name = "xx";
  println("xxx");
}`);

dumpAst(`
for (let index = 1; index <= 10; index++) {
  let name = "xxx";
  println("string");
}`);