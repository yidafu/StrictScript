# StrictScript

A typescript subset Implement. Only implement some features of `Typescript`, which I think should preserve.

## Motivation

I want learn hwo to implement a language, and `Typescript` is the best example of imitation. I want implement a language like `Typescript`/`JavaScript`, and can compile to binary code, I call it `StrictScript`.

First, I will implement a Interpreter with `Typescript` including most language features (Function Scope, Object/Array Literal ect.). Then, I will try to using Rust to implement `StrictScript` again, and compile source code to WebAssembly.

Good luck to me :).

## Example

see more in  `examples/`

```js
import { executeCode } from "./src";

const sourceCode = `
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
`

executeCode(sourceCode);
// ==> Hello StrictScript
```

## Reference

+ <https://gitee.com/richard-gong/craft-a-language>