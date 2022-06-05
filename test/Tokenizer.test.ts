import {
  InputStream
} from "../src/InputStream";
import {
  Tokenizer,
  TokenType
} from "../src/Tokenizer";

import testCase from './tokenizer-case.json';

function getAllTokens(sourceCode: string) {
  const tokenizer = new Tokenizer(new InputStream(sourceCode));
  const results = [];
  while (tokenizer.peek()?.type !== TokenType.EOF) {
    results.push(tokenizer.next()!);
  }

  return results;
}
describe('InputStream', () => {

  testCase.forEach(cases => {
    test(cases.name, () => {
      const tokens = getAllTokens(cases.sourceCode);
      expect(tokens).toEqual(cases.tokens);
    });
  });

});