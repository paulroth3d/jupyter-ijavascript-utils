/* eslint-disable prefer-destructuring */

const { utils } = require('@svgdotjs/svg.js'); // eslint-disable-line
const chain = require('../chain');
const { mockConsole, removeConsoleMock } = require('../__testHelper__/ijsContext');

global.describe('Chain', () => {
  global.describe('can get a value from a chain', () => {
    global.it('number 9', () => {
      const value = 9;
      const expected = 9;
      const result = chain(value).value;
      global.expect(result).toBe(expected);
    });
    global.it('null', () => {
      const value = null;
      const expected = null;
      const result = chain(value).value;
      global.expect(result).toBe(expected);
    });
    global.it('undefined', () => {
      const value = undefined;
      const expected = undefined;
      const result = chain(value).value;
      global.expect(result).toBe(expected);
    });
    global.it('string hello', () => {
      const value = 'hello';
      const expected = 'hello';
      const result = chain(value).value;
      global.expect(result).toBe(expected);
    });
  });
  global.describe('can chain a value', () => {
    global.it('a simple add', () => {
      const addTwo = (value) => value + 2;
      global.expect(addTwo(2)).toBe(4);

      const value = 3;
      const expected = 5;
      const result = chain(value)
        .chain(addTwo)
        .value;
      
      global.expect(result).toBe(expected);
    });
  });
  global.describe('chainMap', () => {
    global.it('can apply a map to an array', () => {
      const addTwo = (value) => value + 2;
      global.expect(addTwo(2)).toBe(4);

      const value = [1, 2, 3];
      const expected = [3, 4, 5];
      const result = chain(value)
        .chainMap(addTwo)
        .value;

      global.expect(result).toStrictEqual(expected);
    });
    global.it('throws an error with a single value', () => {
      const addTwo = (value) => value + 2;
      const value = 3;
      const expectedError = 'chainMap expected an array, but was passed:3';

      global.expect(() => chain(value).chainMap(addTwo))
        .toThrow(expectedError);
    });
    global.it('can chain a map after a value', () => {
      const initializeCount = (size) => Array.from(Array(size)).map((val, index) => index);
      global.expect(initializeCount(3)).toStrictEqual([0, 1, 2]);
      const addTwo = (value) => value + 2;
      global.expect(addTwo(2)).toBe(4);

      const value = 3;
      const expected = [2, 3, 4];
      const result = chain(value)
        .chain(initializeCount)
        .chainMap(addTwo)
        .value;

      global.expect(result).toStrictEqual(expected);
    });
  });
  global.describe('chainForEach', () => {
    global.describe('can execute', () => {
      global.it('calls jest fn and returns value', () => {
        const fn = jest.fn(() => 'a');
        const result = fn();
        const expected = 'a';
        global.expect(result).toBe(expected);
        global.expect(fn).toHaveBeenCalled();
        global.expect(fn).toHaveBeenCalledTimes(1);
      });
      global.it('calls the functions', () => {
        const fn = jest.fn(() => 'a');
        const values = [11, 12, 13];
        const expected = [11, 12, 13]; // results from fn never are applied.

        const results = chain(values)
          .chainForEach(fn)
          .close();
        
        global.expect(results).toEqual(expected);
        global.expect(fn).toHaveBeenCalled();
        global.expect(fn).toHaveBeenCalledTimes(values.length);

        let call = fn.mock.calls[0];
        let callExpect = [11, 0, [11, 12, 13]];
        global.expect(call).toEqual(callExpect);

        call = fn.mock.calls[1];
        callExpect = [12, 1, [11, 12, 13]];
        global.expect(call).toEqual(callExpect);

        call = fn.mock.calls[2];
        callExpect = [13, 2, [11, 12, 13]];
        global.expect(call).toEqual(callExpect);
      });
      global.it('works if you pass a set', () => {
        const fn = jest.fn(() => 'a');
        const values = new Set([11, 12, 13]);
        const expected = new Set([11, 12, 13]); // results from fn never are applied.

        const results = chain(values)
          .chainForEach(fn)
          .close();
        
        global.expect(results).toEqual(expected);
        global.expect(fn).toHaveBeenCalled();
        global.expect(fn).toHaveBeenCalledTimes(3);

        let call = fn.mock.calls[0];
        let callExpect = [11, 11, new Set([11, 12, 13])];
        global.expect(call).toEqual(callExpect);

        call = fn.mock.calls[1];
        callExpect = [12, 12, new Set([11, 12, 13])];
        global.expect(call).toEqual(callExpect);

        call = fn.mock.calls[2];
        callExpect = [13, 13, new Set([11, 12, 13])];
        global.expect(call).toEqual(callExpect);
      });
      global.it('works if you pass a set', () => {
        const fn = jest.fn(() => 'a');
        const values = new Set([11, 12, 13]);
        const expected = new Set([11, 12, 13]); // results from fn never are applied.

        const results = chain(values)
          .chainForEach(fn)
          .close();
        
        global.expect(results).toEqual(expected);
        global.expect(fn).toHaveBeenCalled();
        global.expect(fn).toHaveBeenCalledTimes(3);

        let call = fn.mock.calls[0];
        let callExpect = [11, 11, new Set([11, 12, 13])];
        global.expect(call).toEqual(callExpect);

        call = fn.mock.calls[1];
        callExpect = [12, 12, new Set([11, 12, 13])];
        global.expect(call).toEqual(callExpect);

        call = fn.mock.calls[2];
        callExpect = [13, 13, new Set([11, 12, 13])];
        global.expect(call).toEqual(callExpect);
      });
      global.it('works if you pass a map', () => {
        const fn = jest.fn(() => 'a');
        const values = new Map([['eleven', 11], ['twelve', 12], ['thirteen', 13]]);
        const expected = new Map([['eleven', 11], ['twelve', 12], ['thirteen', 13]]); // results from fn never are applied.

        const results = chain(values)
          .chainForEach(fn)
          .close();
        
        global.expect(results).toEqual(expected);
        global.expect(fn).toHaveBeenCalled();
        global.expect(fn).toHaveBeenCalledTimes(3);

        let call = fn.mock.calls[0];
        let callExpect = [11, 'eleven', new Map([['eleven', 11], ['twelve', 12], ['thirteen', 13]])];
        global.expect(call).toEqual(callExpect);

        call = fn.mock.calls[1];
        callExpect = [12, 'twelve', new Map([['eleven', 11], ['twelve', 12], ['thirteen', 13]])];
        global.expect(call).toEqual(callExpect);

        call = fn.mock.calls[2];
        callExpect = [13, 'thirteen', new Map([['eleven', 11], ['twelve', 12], ['thirteen', 13]])];
        global.expect(call).toEqual(callExpect);
      });
    });
    global.describe('fails', () => {
      global.it('if the value passed is a string', () => {
        const fn = jest.fn(() => 'a');
        const values = 1;
        const expectedError = 'chainForEach expects an array, but was passed:1';

        global.expect(() => chain(values).chainForEach(fn)).toThrow(expectedError);
      });
    });
  });
  global.describe('chainReduce', () => {
    global.it('reduce works as expected', () => {
      const reduceArray = (result, value) => result + value;
      const value = [1, 2, 3];
      global.expect(value.reduce(reduceArray, 0)).toBe(6);
    });
    global.it('can reduce an array', () => {
      const reduceArray = (result, value) => result + value;
      
      const value = [1, 2, 3];
      global.expect(value.reduce(reduceArray, 0)).toBe(6);

      const expected = 6;
      const result = chain(value)
        .chainReduce(reduceArray, 0)
        .value;

      global.expect(result).toStrictEqual(expected);
    });
    global.it('throws an error with a single value', () => {
      const reduceArray = (result, value) => result + value;
      const value = 3;
      const expectedError = 'chainReduce expected an array, but was passed:3';

      global.expect(() => chain(value).chainReduce(reduceArray))
        .toThrow(expectedError);
    });
    global.it('can chain a map after a value', () => {
      const initializeCount = (size) => Array.from(Array(size)).map((val, index) => index);
      global.expect(initializeCount(3)).toStrictEqual([0, 1, 2]);
      const reduceArray = (result, value) => result + value;
      global.expect([1, 2, 3].reduce(reduceArray, 0)).toBe(6);
      const addTwo = (value) => value + 2;
      global.expect(addTwo(2)).toBe(4);

      const value = 3;
      const expected = 9;
      const result = chain(value)
        .chain(initializeCount)
        .chainMap(addTwo)
        .chainReduce(reduceArray, 0)
        .value;

      global.expect(result).toStrictEqual(expected);
    });
  });
  global.describe('debug', () => {
    const ORIGINAL_CONSOLE = global.console;

    global.beforeEach(() => {
      // prepareWindow();
      mockConsole();
    });
    global.afterEach(() => {
      // restoreWindow();
      removeConsoleMock();
    });
    global.afterAll(() => {
      global.console = ORIGINAL_CONSOLE;
    });
    global.it('can detect console', () => {
      console.log('test');
      global.expect(console.log).toHaveBeenCalled();
    });
    global.it('can detect it not being called', () => {
      global.expect(console.log).not.toHaveBeenCalled();
    });
    global.it('can debug a value', () => {
      const value = 3;
      const expected = 6;
      const results = chain(value)
        .chain((v) => v + 3)
        .debug()
        .value;
      global.expect(console.log).toHaveBeenCalled();
      global.expect(console.log.mock.calls[0][0]).toBe(6);

      global.expect(results).toBe(expected);
    });
    global.it('can support a custom debug', () => {
      const fnMock = jest.fn();
      const value = 3;
      const expected = 6;
      const results = chain(value)
        .chain((v) => v + 3)
        .debug(fnMock)
        .value;
      global.expect(fnMock).toHaveBeenCalled();
      global.expect(fnMock.mock.calls[0][0]).toBe(6);

      global.expect(results).toBe(expected);
    });
    global.it('example', () => {
      const addTwo = (val) => val + 2;
      global.expect(addTwo(3)).toBe(5);

      const expected = 10;
      const results = chain(3)
        .chain(addTwo)
        .chain(addTwo)
        .debug()
        .chain((value) => value + 3)
        .value;
      
      global.expect(results).toBe(expected);

      global.expect(console.log.mock.calls[0][0]).toBe(7);
    });
  });
  global.describe('close', () => {
    global.it('returns the value', () => {
      const value = 234;
      const expected = 234;
      const result = chain(value).close();
      global.expect(result).toBe(expected);
    });
  });
  global.describe('errorHandler', () => {
    const ORIGINAL_CONSOLE = global.console;

    global.beforeEach(() => {
      // prepareWindow();
      mockConsole();
    });
    global.afterEach(() => {
      // restoreWindow();
      removeConsoleMock();
    });
    global.afterAll(() => {
      global.console = ORIGINAL_CONSOLE;
    });
    global.it('still closes even if no error handler', () => {
      const customError = Error('CustomError');
      const throwError = () => {
        throw customError;
      };

      const value = 2;
      const c = chain(value);
      
      global.expect(
        () => c.chain(throwError)
      ).toThrow('CustomError');
    });
    global.it('can use custom error handling', () => {
      let customErrorFlag = false;
      const catchCustomError = jest.fn(() => {
        customErrorFlag = true;
      });
      const customError = Error('CustomError');
      const throwError = () => {
        throw customError;
      };

      const value = 2;
      const c = chain(value)
        .errorHandler(catchCustomError);
      
      global.expect(
        () => c.chain(throwError)
      ).toThrow('CustomError');

      global.expect(catchCustomError).toHaveBeenCalled();
      global.expect(catchCustomError.mock.calls[0][0]).toBe(customError);

      global.expect(customErrorFlag).toBe(true);
    });
    global.describe('errorHandlers are passed down', () => {
      global.it('onChain', () => {
        let customErrorFlag = false;
        const catchCustomError = jest.fn(() => {
          customErrorFlag = true;
        });
        const customError = Error('CustomError');
        const throwError = () => {
          throw customError;
        };

        const identity = (v) => v;

        const value = 2;
        const c = chain(value)
          .chain(identity)
          .errorHandler(catchCustomError);
        
        global.expect(
          () => c.chain(throwError)
        ).toThrow('CustomError');

        global.expect(catchCustomError).toHaveBeenCalled();
        global.expect(catchCustomError.mock.calls[0][0]).toBe(customError);

        global.expect(customErrorFlag).toBe(true);
      });
      global.it('on chainMap', () => {
        let customErrorFlag = false;
        const catchCustomError = jest.fn(() => {
          customErrorFlag = true;
        });
        const customError = Error('CustomError');
        const throwError = () => {
          throw customError;
        };

        const identity = (v) => v;

        const value = [2];
        const c = chain(value)
          .chainMap(identity)
          .errorHandler(catchCustomError);
        
        global.expect(
          () => c.chain(throwError)
        ).toThrow('CustomError');

        global.expect(catchCustomError).toHaveBeenCalled();
        global.expect(catchCustomError.mock.calls[0][0]).toBe(customError);

        global.expect(customErrorFlag).toBe(true);
      });
      global.it('on chainReduce', () => {
        let customErrorFlag = false;
        const catchCustomError = jest.fn(() => {
          customErrorFlag = true;
        });
        const customError = Error('CustomError');
        const throwError = () => {
          throw customError;
        };

        const value = [2];
        const c = chain(value)
          .chainReduce((result, v) => result + v, 0)
          .errorHandler(catchCustomError);
        
        global.expect(
          () => c.chain(throwError)
        ).toThrow('CustomError');

        global.expect(catchCustomError).toHaveBeenCalled();
        global.expect(catchCustomError.mock.calls[0][0]).toBe(customError);

        global.expect(customErrorFlag).toBe(true);
      });
    });
  });
  global.describe('clone', () => {
    global.describe('errorHandler', () => {
      const ORIGINAL_CONSOLE = global.console;
  
      global.beforeEach(() => {
        // prepareWindow();
        mockConsole();
      });
      global.afterEach(() => {
        // restoreWindow();
        removeConsoleMock();
      });
      global.afterAll(() => {
        global.console = ORIGINAL_CONSOLE;
      });
      global.it('passes the value along', () => {
        const value = 234;
        const expected = 234;
        
        const c = chain(value);

        const c2 = c.clone();

        const result = c2.close();

        global.expect(result).toBe(expected);
      });
      global.it('can use custom error handling', () => {
        let customErrorFlag = false;
        const catchCustomError = jest.fn(() => {
          customErrorFlag = true;
        });
        const customError = Error('CustomError');
        const throwError = () => {
          throw customError;
        };
  
        const value = 2;
        const c = chain(value)
          .errorHandler(catchCustomError);

        const c2 = c.clone();
        
        global.expect(
          () => c2.chain(throwError)
        ).toThrow('CustomError');
  
        global.expect(catchCustomError).toHaveBeenCalled();
        global.expect(catchCustomError.mock.calls[0][0]).toBe(customError);
  
        global.expect(customErrorFlag).toBe(true);
      });
    });
  });
  global.describe('console to string overrides', () => {
    global.it('toString', () => {
      const val = 2;
      const expected = '{"value":2}';
      const results = chain(val).toString();
      global.expect(results).toBe(expected);
    });
    global.it('inspect', () => {
      const val = 2;
      const expected = '{"value":2}';
      const results = chain(val).inspect();
      global.expect(results).toBe(expected);
    });
    global.it('toJSON', () => {
      const val = 2;
      const results = chain(val).toJSON();
      global.expect(results.value).toBe(val);
    });
  });

  global.describe('chainFilter', () => {
    global.it('filters values', () => {
      const val = [0, 1, 2, 3, 4];
      const expected = [2, 3, 4];

      const filterLessThan2 = (value) => value >= 2;
      global.expect(filterLessThan2(1)).toBe(false);
      global.expect(filterLessThan2(2)).toBe(true);
      global.expect(filterLessThan2(3)).toBe(true);

      const result = chain(val)
        .chainFilter(filterLessThan2)
        .close();

      global.expect(result).toStrictEqual(expected);
    });
    global.it('example', () => {
      const val = [1, 2, 3, 4];
      const expected = [1, 2];

      const exampleFilter = (value) => value < 3;
      global.expect(exampleFilter(1)).toBe(true);
      global.expect(exampleFilter(2)).toBe(true);
      global.expect(exampleFilter(3)).toBe(false);

      const result = chain(val)
        .chainFilter(exampleFilter)
        .close();

      global.expect(result).toStrictEqual(expected);
    });
    global.it('fails if not an array', () => {
      const expectedError = 'chainFilter expects an array, but was passed:2';
      const val = 2;
      const filterLessThan2 = (value) => value >= 2;
      global.expect(filterLessThan2(1)).toBe(false);
      global.expect(filterLessThan2(2)).toBe(true);
      global.expect(filterLessThan2(3)).toBe(true);

      global.expect(() => chain(val).chainFilter(filterLessThan2))
        .toThrow(expectedError);
    });
  });

  global.describe('chainFlatMap', () => {
    global.it('fails if not an array', () => {
      const expectedError = 'chainFlatMap expects an array, but was passed:2';
      const val = 2;

      const exampleFn = (value) => value;

      global.expect(() => chain(val).chainFlatMap(exampleFn))
        .toThrow(expectedError);
    });
    global.it('can chain returning a literal value', () => {
      const val = [3];
      const expected = [3];

      const exampleFn = (value) => value;

      global.expect(exampleFn(3)).toStrictEqual(3);

      const results = chain(val).chainFlatMap(exampleFn).close();

      global.expect(results).toStrictEqual(expected);
    });
    global.it('can chain filtering values', () => {
      const val = [0, 1, 2, 3, 4, 5];
      const expected = [0, 2, 4];

      const exampleFn = (value) => value % 2 === 0 ? [value] : [];
      global.expect(exampleFn(0)).toStrictEqual([0]);
      global.expect(exampleFn(1)).toStrictEqual([]);
      global.expect(exampleFn(2)).toStrictEqual([2]);
      global.expect(exampleFn(3)).toStrictEqual([]);
      global.expect(exampleFn(4)).toStrictEqual([4]);
      global.expect(exampleFn(5)).toStrictEqual([]);

      const results = chain(val).chainFlatMap(exampleFn).close();

      global.expect(results).toStrictEqual(expected);
    });
    global.it('can chain returning an array', () => {
      const val = [3];
      const expected = [0, 1, 2];

      const exampleFn = (size) => Array.from(Array(size)).map((_, index) => index);
      global.expect(exampleFn(3)).toStrictEqual([0, 1, 2]);

      const results = chain(val).chainFlatMap(exampleFn).close();

      global.expect(results).toStrictEqual(expected);
    });
    global.it('can chain expanding the results', () => {
      const val = [1, 2, 3];
      const expected = [0, 0, 1, 0, 1, 2];

      const exampleFn = (size) => Array.from(Array(size)).map((_, index) => index);
      global.expect(exampleFn(3)).toStrictEqual([0, 1, 2]);

      const results = chain(val).chainFlatMap(exampleFn).close();

      global.expect(results).toStrictEqual(expected);
    });
  });
  global.describe('execute', () => {
    global.it('calls jest fn and returns value', () => {
      const fn = jest.fn(() => 'a');
      const result = fn();
      const expected = 'a';
      global.expect(result).toBe(expected);
      global.expect(fn).toHaveBeenCalled();
      global.expect(fn).toHaveBeenCalledTimes(1);
    });
    global.it('can execute a value without modifying the value', () => {
      const value = 3;
      const fn = jest.fn(() => 9);
      const expected = 3;

      const results = chain(value)
        .execute(fn)
        .close();

      global.expect(results).toBe(expected);

      global.expect(fn).toHaveBeenCalled();
      global.expect(fn).toHaveBeenCalledTimes(1);

      const callArgs = fn.mock.calls[0];
      const callExpected = [3];
      global.expect(callArgs).toEqual(callExpected);
    });
  });
  global.describe('replace', () => {
    global.it('can replace the value in the chain', () => {
      const value = 3;
      const expected = 9;
      const results = chain(value)
        .replace(expected)
        .close();
      global.expect(results).toBe(expected);
    });
  });
});
