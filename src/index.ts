import { Program } from './ast-node/Program';
import { Interpreter } from './interpreter';
import { Parser } from './parser';
import { InputStream } from './tokenizer';
import { Tokenizer } from './tokenizer/Tokenizer';
import { SemanticAnalyer } from './visitor/SemanticAnalyer';
import { Dumper } from './visitor/dumper/AstDumper';

function executeCode(sourceCode: string) {
  const tokenizer = new Tokenizer(new InputStream(sourceCode));
  console.time('解析代码');
  const program: Program = new Parser(tokenizer).parseProgram();
  console.timeEnd('解析代码');

  console.log('================ dump AST ===============');
  new Dumper().visit(program);
  console.log('================ dump AST ===============');

  console.time('语言分析');
  const semanticAnalyer = new SemanticAnalyer();
  semanticAnalyer.execute(program);
  console.timeEnd('语言分析');

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
}

export {
  executeCode,
  dumpAst,
};
