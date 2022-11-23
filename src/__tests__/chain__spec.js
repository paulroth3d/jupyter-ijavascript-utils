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
});
