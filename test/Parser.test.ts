import {
  InputStream
} from "../src/InputStream"
import {
  Parser
} from "../src/Parser"
import {
  Tokenizer
} from "../src/Tokenizer/Tokenizer"

function parse(str: string) {
  const parser = new Parser(new Tokenizer(new InputStream(str)));
  return parser.parseProgram();
}

describe('Parser', () => {
  test('standard case', () => {
    const ast = parse(`
function hello() {
  println("hello World!");
}
hello();`);
    expect(ast).toEqual({
      "stmts": [{
          "body": {
            "stmts": [{
              "definition": null,
              "name": "println",
              "parameters": [
                "hello World!",
              ],
            }, ],
          },
          "name": "hello",
        },
        {
          "definition": null,
          "name": "hello",
          "parameters": [],
        },
      ],
    });
  });
});