import { InputStream } from "../src/InputStream";
import { Tokenizer } from "../src/Tokenizer";

describe('InputStream', () => {
  test('variable declare', () => {
    const tokenizer = new Tokenizer(new InputStream('let name: string = ""'));
    
    const tokens = tokenizer.next();
  })
});