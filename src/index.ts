import { Program } from "./ast-node/Program";
import { InputStream } from "./tokenizer/InputStream";
import { Interpreter } from "./Interpreter";
import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer/Tokenizer";
import { Enter } from "./visitor/Enter";
import { RefResolver } from "./visitor/RefResolver";
import { Scope } from "./visitor/Scope";


function executeCode(sourceCode: string) {
  const tokenizer = new Tokenizer(new InputStream(sourceCode));

  const program: Program = new Parser(tokenizer).parseProgram();
  const globalScope = new Scope();
  new Enter(globalScope).visit(program);
  new RefResolver(globalScope).visit(program);

  const retVal = new Interpreter().visit(program);
  console.log(retVal);
}

export { executeCode };
