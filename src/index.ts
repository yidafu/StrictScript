import { Program } from './ast-node/Program';
import { Interpreter } from './interpreter';
import { Parser } from './parser';
import { InputStream } from './tokenizer';
import { Tokenizer } from './tokenizer/Tokenizer';
import { Dumper } from './visitor/Dumper';
import { Enter } from './visitor/Enter';
import { LeftValueAttributor } from './visitor/LeftValueAttributor';
import { RefResolver } from './visitor/RefResolver';
import { Scope } from './visitor/Scope';

function executeCode(sourceCode: string) {
  const tokenizer = new Tokenizer(new InputStream(sourceCode));

  const program: Program = new Parser(tokenizer).parseProgram();
  const globalScope = new Scope();
  new Enter(globalScope).visit(program);
  new RefResolver(globalScope).visit(program);
  new LeftValueAttributor().visit(program);

  const retVal = new Interpreter().visit(program);
  console.log(retVal);
}

function dumpAst(sourceCode: string) {
  const tokenizer = new Tokenizer(new InputStream(sourceCode));

  const program: Program = new Parser(tokenizer).parseProgram();
  new Dumper().visit(program);
}

export {
  executeCode,
  dumpAst,
};
