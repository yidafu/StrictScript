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
  console.time('解析代码');
  const program: Program = new Parser(tokenizer).parseProgram();
  console.timeEnd('解析代码');
  const globalScope = new Scope();

  console.time('建立符号表');
  new Enter(globalScope).visit(program);
  console.timeEnd('建立符号表');
  console.time('解引用');
  new RefResolver(globalScope).visit(program);
  console.timeEnd('解引用');
  console.time('消除左值');
  new LeftValueAttributor().visit(program);
  console.timeEnd('消除左值');

  console.log();
  console.log();
  console.time('解释执行');
  const retVal = new Interpreter().visit(program);
  console.log();
  console.log();
  console.timeEnd('解释执行');
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
