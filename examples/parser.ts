import { Program } from "../src/AstNode";
import { InputStream } from "../src/InputStream";
import { Parser } from "../src/Parser";
import { Tokenizer } from "../src/Tokenizer";

const sourceCodes = ['let a: number = 1 + 2;', 'function foo() {\nbar();\n}'];

for (const sourceCode of sourceCodes) {
  const tokenizer = new Tokenizer(new InputStream(sourceCode));

  const program: Program = new Parser(tokenizer).parseProgram();

  console.log(program);
}