/* @flow */
import slugify from 'slugify';
import TurndownService from 'turndown';

/**
 * App Support
 * @module app/Utils/Support
 */

/**
 * Parser class
 * @class Parser
 * @classdesc Parser class
 */
class Parser {
  static parseFloat(str: string = ''): number {
    if (!isNaN(parseFloat(str))) {
      return Number(str);
    }

    if (!isNaN(Number(str))) {
      return Number(str);
    }

    str = str.trim();

    let last = str.substr(-1, 1);

    if (last === '.' || last === ',') {
      str += '0';
    }

    str = str.replace(/\D/g, '.');
    let arr = str.split('.');

    if (arr[arr.length - 1] === '') {
      arr[arr.length - 1] = '0';
    }

    arr = arr.filter(value => value !== '');

    let dec = arr.length > 1 ? arr.pop() : 0;

    str = arr.join('') + '.' + dec;

    if (!isNaN(Number(str))) {
      return Number(str);
    }

    return 0;
  }

  static isEmptyParam(param: any): boolean {
    return (
      !param ||
      typeof param !== 'string' ||
      param.trim() === '-1' ||
      param.trim() === 'undefined'
    );
  }

  static parseInt(param: any): any {
    try {
      let number = Number.parseInt(param, 10);
      return !isNaN(number) && typeof number === 'number' ? number : null;
    } catch (error) {
      console.log(error.message);
    }
    return null;
  }

  static isNotEmpty(param: any): any {
    return (
      param &&
      typeof param !== 'undefined' &&
      typeof param === 'string' &&
      param.trim() !== ''
    );
  }

  static mapConverter(): any {
    return new Map();
  }

  /**
   * Set anonymous parser functions in map converter attribute
   */
  static loadParser() {
    this.mapConverter.set('boolean', this.booleanParser());
    this.mapConverter.set('string', this.stringParser());
    this.mapConverter.set('number', this.numberParser());
    this.mapConverter.set('object', this.objectParser());
    this.mapConverter.set('float', this.floatParser());
  }

  /**
   * To manage anonymous parsers methods to convert received values
   * @param type {string} - type to convert
   * @param value {string} - value that will be parsed and converted
   * @returns {*}
   */
  static parse(type: string, value: string): any {
    try {
      if (typeof type !== 'string') {
        throw new Error('Type not accepted!');
      }
      this.loadParser();
      let fn = this.mapConverter.get(type);
      if (typeof fn === 'function') {
        return fn(value);
      }
    } catch (error) {
      console.error(error.message);
      throw error;
    }
    throw new Error(`Parse function not yet implemented for the type: ${type}`);
  }

  /**
   * Returns anonymous function to parse boolean param
   * @returns {function(*=)}
   */
  static booleanParser(): Function {
    return v => {
      if (v === null || typeof v === 'undefined') {
        return v;
      }

      if (typeof v === 'boolean') {
        return v;
      }

      if (
        (typeof v === 'number' && v === 1) ||
        (typeof v === 'string' && (v.trim() === 'true' || v.trim() === '1'))
      ) {
        return true;
      }

      if (
        (typeof v === 'number' && v === 0) ||
        (typeof v === 'string' && (v.trim() === 'false' || v.trim() === '0'))
      ) {
        return false;
      }

      return v;
    };
  }

  /**
   * Returns anonymous function to parse string param
   * @returns {function(*=)}
   */
  static stringParser(): Function {
    return v => {
      if (v === null || typeof v === 'undefined') {
        return v;
      }

      if (typeof v === 'string' || typeof v === 'number') {
        return String(v).trim();
      }

      if (typeof v === 'object') {
        return JSON.stringify(v);
      }

      return v;
    };
  }

  /**
   * Returns anonymous function to parse floats param
   * @returns {function(*=)}
   */
  static floatParser(): Function {
    return v => {
      v = !v || typeof v === 'undefined' ? '0' : v;
      return this.parseFloat(v);
    };
  }

  /**
   * Returns anonymous function to number objects param
   * @returns {function(*=)}
   */
  static numberParser(): Function {
    return v => {
      if (v === null || typeof v === 'undefined') {
        return v;
      }

      if (typeof v === 'number') {
        return v;
      }

      if (
        typeof v === 'string' &&
        v.trim() !== '' &&
        !isNaN(v) &&
        !Array.isArray(v)
      ) {
        return JSON.parse(v);
      }

      return v;
    };
  }

  /**
   * Returns anonymous function to parse objects param
   * @returns {function(*=)}
   */
  static objectParser(): Function {
    return v => {
      try {
        if (v === null || typeof v === 'undefined') {
          return v;
        }

        if (typeof v === 'object') {
          return v;
        }

        if (typeof v === 'string' && v.trim() !== '' && isNaN(v)) {
          try {
            return JSON.parse(v);
          } catch (error) {
            return null;
          }
        }
      } catch (error) {
        console.error(error.message);
      }
      return null;
    };
  }

  /**
   * Transliterate text
   * @param text {string} - text
   * @param newRule {object} - object override rule
   * @returns {text} - Returns text transliterated
   */
  static slugify(text: string, newRule: Object): string {
    try {
      if (typeof text !== 'string') {
        throw new Error(
          `Slugify can not be generated from ${text} param. It should be a string!`,
        );
      }
      // Default rule:
      const rule = {lower: true, remove: /[^\w\-]+/g};
      if (newRule) {
        Object.assign(rule, newRule);
      }
      return slugify(text, rule);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Convert html to markdown
   * @param text {string} - text
   * @param keepStrong {string} - rule to keep strong tags
   * @returns {text} - Returns text converted
   */
  static toMarkdown(text: string, keepStrong: boolean = false) {
    try {
      if (typeof text === 'string') {
        const turndownService = new TurndownService({headingStyle: 'atx'});
        if (keepStrong) {
          turndownService.keep(['strong', 'a']);
          turndownService.remove(['h1', 'h2', 'h3', 'p']);
        }
        text = turndownService.turndown(text).toLowerCase();
        return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
      }
      return text;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Parser;

/**
 * @see {@link https://www.npmjs.com/package/slugify|Slugify transliterator package}
 */
