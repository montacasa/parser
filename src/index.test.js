/* flow */
/* global test expect */
import Parser from './';

test("should import default and find it's functions", () => {
  const isItAFunction = typeof Parser === 'function';
  expect(isItAFunction).toBeTruthy();
});

test('should parse a float', () => {
  expect(Parser.parseFloat('1.2')).toBe(1.2);
});

test('should parse an empty param', () => {
  expect(Parser.isEmptyParam('')).toBe(true);
});

test('should parse an integer', () => {
  // NOTE: Should it realy return only true or false?
  expect(Parser.isEmptyParam(1)).toBe(true);
  expect(Parser.isEmptyParam('1')).toBe(false);
});

test('should parse empty field', () => {
  expect(Parser.isNotEmpty('1')).toBe(true);
  // NOTE: Should it realy return the string in case is not empty?
  expect(Parser.isNotEmpty('')).toBe('');
});

test('should slugify', () => {
  expect(Parser.slugify('A String')).toBe('astring');
});

test('should slugify with override rule', () => {
  expect(
    Parser.slugify('A String', {lower: true, remove: null, replacement: '-'}),
  ).toBe('a-string');
});
