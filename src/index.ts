import { Program } from "./ast-node/Program";
import { InputStream } from "./tokenizer";
import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer/Tokenizer";
import { Enter } from "./visitor/Enter";
import { RefResolver } from "./visitor/RefResolver";
import { Scope } from "./visitor/Scope";
import { Dumper } from "./visitor/Dumper";
import { LeftValueAttributor } from "./visitor/LeftValueAttributor";


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
