import { Program } from "./AstNode/Program";
import { InputStream } from "./InputStream";
import { Interpreter } from "./Interpreter";
import { Parser } from "./Parser";
import { Tokenizer } from "./Tokenizer/Tokenizer";
import { RefResolver } from "./visitor/RefResolver";

function executeCode(sourceCode: string) {
  const tokenizer = new Tokenizer(new InputStream(sourceCode));

  const program: Program = new Parser(tokenizer).parseProgram();
  new RefResolver().visitProgram(program);

  new Interpreter().visitProgram(program);
}

export { executeCode };
