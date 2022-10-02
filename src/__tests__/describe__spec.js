const DescribeUtil = require('../describe');

global.describe('DescribeUtil', () => {
  global.describe('StringDescription', () => {
    global.describe('fails', () => {
      global.it('if the collection is not full of numbers', () => {
        const collection = [0];
        
        global.expect(() => {
          DescribeUtil.describeStrings(collection);
        }).toThrow('describe: Value passed(0) expected to be:string, but was: number');
      });
    });
    global.describe('can describe', () => {
      global.it('a string of one', () => {
        const collection = ['a'];
        const expected = {
          count: 1,
          max: 'a',
          min: 'a',
          top: 'a',
          topFrequency: 1
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('a string of multiple different strings', () => {
        const collection = ['a', 'apple', 'bin'];
        const expected = {
          count: 3,
          max: 'apple',
          min: 'a',
          top: 'a',
          topFrequency: 1
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('with undefined in the list', () => {
        const collection = ['a', 'apple', undefined, 'bin'];
        const expected = {
          count: 3,
          max: 'apple',
          min: 'a',
          top: 'a',
          topFrequency: 1
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('with an empty string in the list', () => {
        const collection = ['a', 'apple', '', 'bin'];
        const expected = {
          count: 3,
          max: 'apple',
          min: 'a',
          top: 'a',
          topFrequency: 1
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('a string of multiple different strings', () => {
        const collection = ['a', 'apple', 'binding', 'a'];
        const expected = {
          count: 4,
          max: 'binding',
          min: 'a',
          top: 'a',
          topFrequency: 2
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('if the collection is null', () => {
        const collection = null;
        const expected = {
          count: 0,
          max: null,
          min: null,
          top: null,
          topFrequency: null
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('if the collection is empty', () => {
        const collection = [];
        const expected = {
          count: 0,
          max: null,
          min: null,
          top: null,
          topFrequency: null
        };
        const results = DescribeUtil.describeStrings(collection);
        global.expect(results).toMatchObject(expected);
      });
    });
  });

  global.describe('NumberDescription', () => {
    global.describe('fails', () => {
      global.it('if the collection is not full of numbers', () => {
        const collection = ['a'];
        
        global.expect(() => {
          DescribeUtil.describeNumbers(collection);
        }).toThrow('describe: Value passed(a) expected to be:number, but was: string');
      });
    });
    global.describe('can describe', () => {
      global.it('if the collection is null', () => {
        const collection = null;
        const expected = {
          count: 0,
          max: null,
          min: null,
          stdDeviation: 0
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('if the collection is empty', () => {
        const collection = [];
        const expected = {
          count: 0,
          max: null,
          min: null,
          stdDeviation: 0
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('a number of one', () => {
        const collection = [1];
        const expected = {
          count: 1,
          max: 1,
          min: 1,
          mean: 1,
          stdDeviation: 0
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      
      global.it('a pair of numbers: 1,3', () => {
        const collection = [1, 3];
        const expected = {
          count: 2,
          max: 3,
          min: 1,
          mean: 2,
          stdDeviation: 1
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('a pair of numbers: 3,1', () => {
        const collection = [3, 1];
        const expected = {
          count: 2,
          max: 3,
          min: 1,
          mean: 2,
          stdDeviation: 1
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('with null', () => {
        const collection = [1, null, 3];
        const expected = {
          count: 2,
          max: 3,
          min: 1,
          mean: 2,
          stdDeviation: 1
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });
      global.it('with undefined', () => {
        const collection = [1, undefined, 3];
        const expected = {
          count: 2,
          max: 3,
          min: 1,
          mean: 2,
          stdDeviation: 1
        };
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
      });

      global.it('multiple numbers:1, 3, 5, 7', () => {
        const collection = [1, 3, 5, 7];
        const expected = {
          count: 4,
          max: 7,
          min: 1,
          mean: 4
        };
        const stdDeviation = 2.23606797749979;
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
        global.expect(results.stdDeviation).toBeCloseTo(stdDeviation);
      });
      global.it('multiple numbers: 3,5,7,9,11', () => {
        const collection = [3, 5, 7, 9, 11];
        const expected = {
          count: 5,
          max: 11,
          min: 3,
          mean: 7
        };
        const stdDeviation = 2.828427;
        const results = DescribeUtil.describeNumbers(collection);
        global.expect(results).toMatchObject(expected);
        global.expect(results.stdDeviation).toBeCloseTo(stdDeviation);
      });
    });
  });

  global.describe('stdDeviation', () => {
    global.it('for one number', () => {
      const series = [1];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 0;
      global.expect(result).toBe(expected);
    });
    global.it('for one number', () => {
      const series = [1];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 0;
      global.expect(result).toBe(expected);
    });
    global.it('for two numbers', () => {
      const series = [1, 3];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 1;
      global.expect(result).toBe(expected);
    });
    global.it('for four numbers: 1, 3, 5, 7', () => {
      const series = [1, 3, 5, 7];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 2.23606797749979;
      global.expect(result).toBeCloseTo(expected);
    });
    global.it('for five numbers: 3, 5, 7, 9, 11', () => {
      const series = [3, 5, 7, 9, 11];
      const result = DescribeUtil.stdDeviation(series);
      const expected = 2.8284271247461903;
      global.expect(result).toBeCloseTo(expected);
    });
  });
});
