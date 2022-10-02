const DescribeUtil = require('../describe');

global.describe('DescribeUtil', () => {
  global.describe('StringDescription', () => {
    global.describe('fails', () => {
      global.it('if the collection is null', () => {
        const collection = null;
        
        global.expect(() => {
          DescribeUtil.describeStrings(collection);
        }).toThrow('describeStrings(collection): collection must be an array of strings');
      });
      global.it('if the collection is empty', () => {
        const collection = [];
        
        global.expect(() => {
          DescribeUtil.describeStrings(collection);
        }).toThrow('describeStrings(collection): collection must be an array of strings');
      });
      global.it('if the collection is not full of numbers', () => {
        const collection = [0];
        
        global.expect(() => {
          DescribeUtil.describeStrings(collection);
        }).toThrow('describeStrings(collection): collection must be an array of strings');
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
    });
  });

  global.describe('NumberDescription', () => {
    global.describe('fails', () => {
      global.it('if the collection is null', () => {
        const collection = null;
        
        global.expect(() => {
          DescribeUtil.describeNumbers(collection);
        }).toThrow('describeNumbers(collection): collection must be an array of numbers');
      });
      global.it('if the collection is empty', () => {
        const collection = [];
        
        global.expect(() => {
          DescribeUtil.describeNumbers(collection);
        }).toThrow('describeNumbers(collection): collection must be an array of numbers');
      });
      global.it('if the collection is not full of numbers', () => {
        const collection = ['a'];
        
        global.expect(() => {
          DescribeUtil.describeNumbers(collection);
        }).toThrow('describeNumbers(collection): collection must be an array of numbers');
      });
    });
    global.describe('can describe', () => {
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
      
      global.it('a pair of numbers', () => {
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
  });
});
