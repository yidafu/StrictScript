import { foo } from '../src/index';

test('default pass', () => {
  foo();
  expect(true).toBeTruthy();
})