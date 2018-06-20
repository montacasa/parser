/* global test expect */
import Parser from './';

test("should import default and find it's functions", () => {
  const isItAFunction = typeof Parser === 'function';
  expect(isItAFunction).toBeTruthy();
});

test('should parse a float', () => {
  expect(Parser.parseFloat('1.2')).toBe(1.2);
});

test('should slugify', () => {
  expect(Parser.slugify('A String')).toBe('astring');
});

test('should slugify with override rule', () => {
  expect(
    Parser.slugify('A String', {lower: true, remove: null, replacement: '-'}),
  ).toBe('a-string');
});

test('should slugify with override rule to change "and" to "e"', () => {
  expect(
    Parser.slugify(
      'String & String',
      {lower: true, remove: null, replacement: '-'},
      'e',
    ),
  ).toBe('string-e-string');
});
