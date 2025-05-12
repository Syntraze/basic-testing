import { simpleCalculator, Action } from './index';

describe('simpleCalculator', () => {
  describe('valid operations', () => {
    test.each([
      { a: 1, b: 2, action: Action.Add, expected: 3 },
      { a: 2, b: 2, action: Action.Add, expected: 4 },
      { a: 5, b: 3, action: Action.Subtract, expected: 2 },
      { a: 7, b: 10, action: Action.Subtract, expected: -3 },
      { a: 3, b: 4, action: Action.Multiply, expected: 12 },
      { a: 6, b: 2, action: Action.Divide, expected: 3 },
      { a: 8, b: 2, action: Action.Divide, expected: 4 },
      { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
      { a: 5, b: 0, action: Action.Exponentiate, expected: 1 },
    ])('returns $expected for $a $action $b', ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    });
  });

  describe('invalid operations or inputs', () => {
    test.each([
      { a: 1, b: 2, action: '%', expected: null }, // invalid action
      { a: '5', b: 2, action: Action.Add, expected: null }, // a is string
      { a: 5, b: null, action: Action.Multiply, expected: null }, // b is null
      { a: null, b: null, action: Action.Divide, expected: null }, // both invalid
      { a: 5, b: 2, action: undefined, expected: null }, // action undefined
    ])(
      'returns null for invalid input ($a, $b, $action)',
      ({ a, b, action, expected }) => {
        expect(simpleCalculator({ a, b, action })).toBe(expected);
      },
    );
  });
});
