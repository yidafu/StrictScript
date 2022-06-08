import { Program } from "./AstNode/Program";
import { InputStream } from "./Tokenizer/InputStream";
import { Interpreter } from "./Interpreter";
import { Parser } from "./Parser";
import { Tokenizer } from "./Tokenizer/Tokenizer";
import { Enter } from "./visitor/Enter";
import { RefResolver } from "./visitor/RefResolver";
import { SymbolTable } from "./visitor/SymbolTable";

function executeCode(sourceCode: string) {
  const tokenizer = new Tokenizer(new InputStream(sourceCode));

  const program: Program = new Parser(tokenizer).parseProgram();
  const symTable = new SymbolTable();
  new Enter(symTable).visit(program);
  new RefResolver(symTable).visit(program);

  const retVal = new Interpreter().visit(program);
  console.log(retVal);
}

export { executeCode };
