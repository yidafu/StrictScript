import { Program } from '../src/ast-node';
import { Parser } from '../src/parser';
import { InputStream, Tokenizer } from '../src/tokenizer';

const sourceCodes = ['let a: number = 1 + 2;', 'function foo() {\nbar();\n}'];

for (const sourceCode of sourceCodes) {
  const tokenizer = new Tokenizer(new InputStream(sourceCode));

  const program: Program = new Parser(tokenizer).parseProgram();

  console.log(program);
}
