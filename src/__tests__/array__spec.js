/* eslint-disable max-len, array-bracket-spacing */

const ArrayUtils = require('../array');

const initializeWeather = () => [
  { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
  { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
  { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31 },
  { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
  { id: 4, city: 'New York', month: 'Aug', precip: 4.13 },
  { id: 5, city: 'New York', month: 'Dec', precip: 3.58 },
  { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 },
  { id: 8, city: 'Chicago',  month: 'Dec', precip: 2.56 },
  { id: 7, city: 'Chicago',  month: 'Aug', precip: 3.98 }
];

const idMap = (weather) => weather.map((r) => r.id);

describe('ArrayUtils', () => {
  global.describe('createSort', () => {
    global.it('should sort ascending by default', () => {
      const weatherToSort = initializeWeather();
      const sortFn = ArrayUtils.createSort('id');
      const sortedWeather = weatherToSort.sort(sortFn);
      const resultIds = idMap(sortedWeather);
      const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      global.expect(resultIds).toEqual(expected);
    });

    global.it('can sort with equivalent values', () => {
      const valuesToSort = [1, 0, 2, 3, 4, 5, 6, 8, 7];
      const sortFn = ArrayUtils.createSort('-');

      //-- duplicate some values
      valuesToSort.push(4);
      valuesToSort.push(6);

      const expected = [8, 7, 6, 6, 5, 4, 4, 3, 2, 1, 0];
      const results = valuesToSort.sort(sortFn);

      global.expect(results).toEqual(expected);
    });
    
    global.it('should sort descending with -', () => {
      const weatherToSort = initializeWeather();
      const sortFn = ArrayUtils.createSort('-id');
      const sortedWeather = weatherToSort.sort(sortFn);
      const resultIds = idMap(sortedWeather);
      const expected = [8, 7, 6, 5, 4, 3, 2, 1, 0];
      global.expect(resultIds).toEqual(expected);
    });

    global.it('can mix ascending', () => {
      const weatherToSort = initializeWeather();
      const sortFn = ArrayUtils.createSort('city', '-precip');
      const sortedWeather = weatherToSort.sort(sortFn);
      const resultIds = idMap(sortedWeather);
      const expected = [7, 6, 8, 4, 3, 5, 2, 0, 1];
      global.expect(resultIds).toEqual(expected);
    });

    global.it('can sort by ascending by default', () => {
      const weatherValues = initializeWeather().map((r) => r.precip);
      const expected = [ 0.87, 2.56, 2.68, 3.58, 3.62, 3.94, 3.98, 4.13, 5.31 ];
      const results = weatherValues.sort(ArrayUtils.createSort());
      global.expect(results).toEqual(expected);
    });

    global.it('can sort by ascending with an empty argument', () => {
      const weatherValues = initializeWeather().map((r) => r.precip);
      const expected = [ 0.87, 2.56, 2.68, 3.58, 3.62, 3.94, 3.98, 4.13, 5.31 ];
      const results = weatherValues.sort(ArrayUtils.createSort(null));
      global.expect(results).toEqual(expected);
    });

    global.it('can sort descending with an - sent', () => {
      const weatherValues = initializeWeather().map((r) => r.precip);
      const expected = [5.31, 4.13, 3.98, 3.94, 3.62, 3.58, 2.68, 2.56, 0.87];
      const results = weatherValues.sort(ArrayUtils.createSort('-'));
      global.expect(results).toEqual(expected);
    });

    global.it('does not sort anything with a null sortFn', () => {
      const weatherValues = initializeWeather();
      const expected = initializeWeather().sort(ArrayUtils.createSort('city'));
      const results = weatherValues.sort(ArrayUtils.createSort('city', null));
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('peekFirst', () => {
    global.it('finds the first item in an array', () => {
      const data = [0, 1, 2, 3];
      const expected = 0;
      const results = ArrayUtils.peekFirst(data);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the only item if the array has one item', () => {
      const data = [99];
      const expected = 99;
      const results = ArrayUtils.peekFirst(data);
      global.expect(results).toEqual(expected);
    });
    global.it('finds null if the array is empty', () => {
      const data = [];
      const expected = null;
      const results = ArrayUtils.peekFirst(data);
      global.expect(results).toEqual(expected);
    });
    global.it('finds null if the array is not an array', () => {
      const data = { obj: 'ect' };
      const expected = null;
      const results = ArrayUtils.peekFirst(data);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('peekLast', () => {
    global.it('finds the last item in an array', () => {
      const data = [0, 1, 2, 3];
      const expected = 3;
      const results = ArrayUtils.peekLast(data);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the only item if the array has one item', () => {
      const data = [99];
      const expected = 99;
      const results = ArrayUtils.peekLast(data);
      global.expect(results).toEqual(expected);
    });
    global.it('finds null if the array is empty', () => {
      const data = [];
      const expected = null;
      const results = ArrayUtils.peekLast(data);
      global.expect(results).toEqual(expected);
    });
    global.it('finds null if the array is not an array', () => {
      const data = { obj: 'ect' };
      const expected = null;
      const results = ArrayUtils.peekLast(data);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('pickRows', () => {
    global.describe('can pick from an array', () => {
      global.test('with array of multiple rows', () => {
        const data = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red'],
          ['ringo', 27, 'green']
        ];
  
        const rows = [0, 1];

        const expected = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red']
        ];

        const results = ArrayUtils.pickRows(data, rows);
        global.expect(results).toEqual(expected);
      });
      global.test('with params of multiple rows', () => {
        const data = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red'],
          ['ringo', 27, 'green']
        ];
  
        // const rows = [0, 1];

        const expected = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red']
        ];

        const results = ArrayUtils.pickRows(data, 0, 1);
        global.expect(results).toEqual(expected);
      });
      global.test('with array of single row', () => {
        const data = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red'],
          ['ringo', 27, 'green']
        ];
  
        const rows = [0];

        const expected = [
          ['john', 23, 'purple']
        ];

        const results = ArrayUtils.pickRows(data, rows);
        global.expect(results).toEqual(expected);
      });
      global.test('with params of single row', () => {
        const data = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red'],
          ['ringo', 27, 'green']
        ];
  
        // const rows = [0, 1];

        const expected = [
          ['john', 23, 'purple']
        ];

        const results = ArrayUtils.pickRows(data, 0);
        global.expect(results).toEqual(expected);
      });
    });
  });

  global.describe('pick columns', () => {
    global.describe('can pick from an array', () => {
      global.test('with array of multiple columns', () => {
        const data = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red'],
          ['ringo', 27, 'green']
        ];
  
        const columns = [0, 1];

        const expected = [
          ['john', 23],
          ['jane', 32],
          ['ringo', 27]
        ];

        const results = ArrayUtils.pickColumns(data, columns);
        global.expect(results).toEqual(expected);
      });
      global.test('with params of multiple columns', () => {
        const data = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red'],
          ['ringo', 27, 'green']
        ];
  
        // const columns = [0, 1];

        const expected = [
          ['john', 23],
          ['jane', 32],
          ['ringo', 27]
        ];

        const results = ArrayUtils.pickColumns(data, 0, 1);
        global.expect(results).toEqual(expected);
      });
      global.test('with array of single column', () => {
        const data = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red'],
          ['ringo', 27, 'green']
        ];
  
        const columns = [0];

        const expected = [
          ['john'],
          ['jane'],
          ['ringo']
        ];

        const results = ArrayUtils.pickColumns(data, columns);
        global.expect(results).toEqual(expected);
      });
      global.test('with params of single column', () => {
        const data = [
          ['john', 23, 'purple'],
          ['jane', 32, 'red'],
          ['ringo', 27, 'green']
        ];
  
        // const columns = [0, 1];

        const expected = [
          ['john'],
          ['jane'],
          ['ringo']
        ];

        const results = ArrayUtils.pickColumns(data, 0);
        global.expect(results).toEqual(expected);
      });
    });
  });

  global.describe('pick', () => {
    global.it('pick rows', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const rows = [0, 1];

      const expected = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red']
      ];

      const results = ArrayUtils.pick(data, { rows });
      global.expect(results).toEqual(expected);
    });
    global.it('pick columns', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const columns = [0, 1];

      const expected = [
        ['john', 23],
        ['jane', 32],
        ['ringo', 27]
      ];

      const results = ArrayUtils.pick(data, { columns });
      global.expect(results).toEqual(expected);
    });
    global.it('pick both', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const rows = [0, 1];
      const columns = [0, 1];

      const expected = [
        ['john', 23],
        ['jane', 32]
      ];

      const results = ArrayUtils.pick(data, { rows, columns });
      global.expect(results).toEqual(expected);
    });
    global.it('pick with null options returns the whole array', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const rows = null;
      const columns = null;

      const expected = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const results = ArrayUtils.pick(data, { rows, columns });
      global.expect(results).toEqual(expected);
    });
    global.it('pick with neither option returns the whole array', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const expected = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const results = ArrayUtils.pick(data, {});
      global.expect(results).toEqual(expected);
    });
    global.it('pick without any option returns the whole array', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const expected = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const results = ArrayUtils.pick(data);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('size', () => {
    global.it('creates', () => {
      const expected = [undefined, undefined, undefined, undefined, undefined];
      const results = ArrayUtils.size(5);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('creates with null', () => {
      const expected = [null, null, null, null, null];
      const results = ArrayUtils.size(5, null);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('creates with a function', () => {
      const expected = [2, 2, 2];
      const results = ArrayUtils.size(3, () => 2);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('creates with a function with an index', () => {
      const expected = [0, 1, 2];
      const results = ArrayUtils.size(3, (i) => i);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('arange', () => {
    global.it('can work instead of a for loop', () => {
      const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const results = ArrayUtils.arange(10);
      const resultsCaptured = [];
      results.forEach((val) => resultsCaptured.push(val));
      global.expect(results).toStrictEqual(expected);
      global.expect(resultsCaptured).toStrictEqual(results);
    });
    global.it('works from 110 to 115', () => {
      const expected = [110, 111, 112, 113, 114];
      const results = ArrayUtils.arange(5, 110);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can count by fives', () => {
      const expected = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
        55, 60, 65, 70, 75, 80, 85, 90, 95
      ];
      const results = ArrayUtils.arange(20, 0, 5);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('isMultiDimensional', () => {
    global.describe('is', () => {
      global.it('if sent a two dimensional array', () => {
        const testValue = [[0, 1], [2, 3]];
        const expected = true;
        const result = ArrayUtils.isMultiDimensional(testValue);
        global.expect(result).toBe(expected);
      });
      global.it('if sent a semi two dimensional array', () => {
        const testValue = [0, 1, [2, 3]];
        const expected = true;
        const result = ArrayUtils.isMultiDimensional(testValue);
        global.expect(result).toBe(expected);
      });
    });
    global.describe('is not', () => {
      global.it('if sent a non array', () => {
        const testValue = 0;
        const expected = false;
        const result = ArrayUtils.isMultiDimensional(testValue);
        global.expect(result).toBe(expected);
      });
      global.it('if sent undefined', () => {
        const testValue = undefined;
        const expected = false;
        const result = ArrayUtils.isMultiDimensional(testValue);
        global.expect(result).toBe(expected);
      });
      global.it('if sent null', () => {
        const testValue = null;
        const expected = false;
        const result = ArrayUtils.isMultiDimensional(testValue);
        global.expect(result).toBe(expected);
      });
    });
  });

  global.describe('arrayLength2d', () => {
    global.describe('has a length of zero', () => {
      global.it('if the target array is not an array', () => {
        const testValue = null;
        const expected = 0;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('if the target array is an empty array', () => {
        const testValue = [];
        const expected = 0;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('if the target array is an empty 2d array', () => {
        const testValue = [[]];
        const expected = 0;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('if the target array is an mixed 2d array', () => {
        const testValue = [23, []];
        const expected = 0;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
    });
    global.describe('longest length', () => {
      global.it('in mixed array 1', () => {
        const testValue = [23, [1]];
        const expected = 1;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('in mixed array 2', () => {
        const testValue = [23, [1, 2]];
        const expected = 2;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('in same sized arrays', () => {
        const testValue = [[1, 2], [3, 4]];
        const expected = 2;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('in different sized arrays', () => {
        const testValue = [[1, 2, 3], [4, 5]];
        const expected = 3;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('in different sized arrays 2', () => {
        const testValue = [[1, 2], [3, 4, 5]];
        const expected = 3;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('in different sized arrays with empty', () => {
        const testValue = [[1, 2], [], [3, 4, 5]];
        const expected = 3;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('in different sized arrays with null', () => {
        const testValue = [[1, 2], null, [3, 4, 5]];
        const expected = 3;
        const results = ArrayUtils.arrayLength2d(testValue);
        global.expect(results).toBe(expected);
      });
    });
  });

  global.describe('transpose', () => {
    global.it('transposes a 3x3 matrix', () => {
      const expected = [[0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]];
      const matrix = [[0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]];
      const result = ArrayUtils.transpose(matrix);
      expect(result).toStrictEqual(expected);
    });
    global.it('transposes a 3x4 matrix', () => {
      const expected = [
        [0, 4, 8],
        [1, 5, 9],
        [2, 6, 10],
        [3, 7, 11]
      ];
      const matrix = [[0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11]];
      const result = ArrayUtils.transpose(matrix);
      expect(result).toStrictEqual(expected);
    });
    global.it('transposes a 4x3 matrix', () => {
      const expected = [[0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11]
      ];
      const matrix = [
        [0, 4, 8],
        [1, 5, 9],
        [2, 6, 10],
        [3, 7, 11]
      ];
      const result = ArrayUtils.transpose(matrix);
      expect(result).toStrictEqual(expected);
    });
    global.it('transposes a mixed matrix', () => {
      const expected = [
        [undefined, 0, 3, 6],
        [undefined, 1, 4, 7],
        [undefined, 2, 5, 8]];
      const matrix = [[],
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]];
      const result = ArrayUtils.transpose(matrix);
      expect(result).toStrictEqual(expected);
    });
    global.it('transposes a mixed matrix with null', () => {
      const expected = [
        [0, undefined, 3, 6],
        [1, undefined, 4, 7],
        [2, undefined, 5, 8]
      ];
      const matrix = [
        [0, 1, 2],
        [],
        [3, 4, 5],
        [6, 7, 8]];
      const result = ArrayUtils.transpose(matrix);
      expect(result).toStrictEqual(expected);
    });
    global.it('does not transpose an empty array', () => {
      const expected = [];
      const matrix = null;
      const result = ArrayUtils.transpose(matrix);
      expect(result).toStrictEqual(expected);
    });
    global.it('transposes a 1d array', () => {
      const expected = [[0], [1], [2], [3], [4]];
      const matrix = [0, 1, 2, 3, 4];
      const result = ArrayUtils.transpose(matrix);
      expect(result).toStrictEqual(expected);
    });
    global.it('transposes a 1d vertical array', () => {
      const expected = [[0, 1, 2, 3, 4]];
      const matrix = [[0], [1], [2], [3], [4]];
      const result = ArrayUtils.transpose(matrix);
      expect(result).toStrictEqual(expected);
    });
  });

  global.describe('reshape', () => {
    global.it('can reshape a 1 dimensional array into columns', () => {
      const source = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      const results = ArrayUtils.reshape(source, 3);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can reshape even if the columns are not exact', () => {
      const source = [1, 2, 3, 4, 5, 6, 7, 8];
      const expected = [[1, 2, 3], [4, 5, 6], [7, 8]];
      const results = ArrayUtils.reshape(source, 3);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can reshape even if the source is empty', () => {
      const source = [];
      const expected = [[]];
      const results = ArrayUtils.reshape(source, 3);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('clone', () => {
    global.describe('can clone', () => {
      global.it('literal value 2', () => {
        const targetValue = 2;
        const expectedValue = 2;
        const result = ArrayUtils.clone(targetValue);
        global.expect(result).toEqual(expectedValue);
      });
      global.it('[]', () => {
        const targetValue = [];
        const expectedValue = [];
        const result = ArrayUtils.clone(targetValue);
        global.expect(result).toEqual(expectedValue);
      });
      global.it('[2]', () => {
        const targetValue = [2];
        const expectedValue = [2];
        const result = ArrayUtils.clone(targetValue);
        global.expect(result).toEqual(expectedValue);
      });
      global.it('[2, 4, 5]', () => {
        const targetValue = [2, 4, 5];
        const expectedValue = [2, 4, 5];
        const result = ArrayUtils.clone(targetValue);
        global.expect(result).toEqual(expectedValue);
      });
      global.it('[[0, 1, 2], [3, 4, 5]]', () => {
        const targetValue = [[0, 1, 2], [3, 4, 5]];
        const expectedValue = [[0, 1, 2], [3, 4, 5]];
        const result = ArrayUtils.clone(targetValue);
        global.expect(result).toEqual(expectedValue);
      });
      global.it('2', () => {
        const targetValue = '2';
        const expectedValue = '2';
        const result = ArrayUtils.clone(targetValue);
        global.expect(result).toEqual(expectedValue);
      });
      global.it('["2"]', () => {
        const targetValue = ['2'];
        const expectedValue = ['2'];
        const result = ArrayUtils.clone(targetValue);
        global.expect(result).toEqual(expectedValue);
      });
      global.it('["2", "4", "5"]', () => {
        const targetValue = ['2', '4', '5'];
        const expectedValue = ['2', '4', '5'];
        const result = ArrayUtils.clone(targetValue);
        global.expect(result).toEqual(expectedValue);
      });
      global.it('[["0", "1", "2"], ["3", "4", "5"]]', () => {
        const targetValue = [['0', '1', '2'], ['3', '4', '5']];
        const expectedValue = [['0', '1', '2'], ['3', '4', '5']];
        const result = ArrayUtils.clone(targetValue);
        global.expect(result).toEqual(expectedValue);
      });
    });
  });

  global.describe('arangeMulti', () => {
    global.it('can arrange a zero dimension cube', () => {
      const args = [];
      const expected = [];
      const results = ArrayUtils.arrangeMulti.apply(this, args);
      global.expect(results).toEqual(expected);
    });
    global.it('can arrange a 1 dimension cube: 0', () => {
      const args = [0];
      const expected = [];
      const results = ArrayUtils.arrangeMulti.apply(this, args);
      global.expect(results).toEqual(expected);
    });
    global.it('can arrange a 1 dimension cube: 2', () => {
      const args = [2];
      const expected = [0, 1];
      const results = ArrayUtils.arrangeMulti.apply(this, args);
      global.expect(results).toEqual(expected);
    });
    global.it('can arrange a 1 dimension cube: 4', () => {
      const args = [4];
      const expected = [0, 1, 2, 3];
      const results = ArrayUtils.arrangeMulti.apply(this, args);
      global.expect(results).toEqual(expected);
    });
    global.it('can arrange a 2 dimension cube: 2,2', () => {
      const args = [2, 2];
      const expected = [[0, 1], [0, 1]];
      const results = ArrayUtils.arrangeMulti.apply(this, args);
      global.expect(results).toEqual(expected);
    });
    global.it('can arrange a 2 dimension cube: 2,4', () => {
      const args = [2, 4];
      const expected = [[0, 1, 2, 3], [0, 1, 2, 3]];
      const results = ArrayUtils.arrangeMulti.apply(this, args);
      global.expect(results).toEqual(expected);
    });
    global.it('can arrange a 3 dimension cube: 2,2,2', () => {
      const args = [2, 2, 2];
      const expected = [[[0, 1], [0, 1]], [[0, 1], [0, 1]]];
      const results = ArrayUtils.arrangeMulti.apply(this, args);
      global.expect(results).toEqual(expected);
    });
    global.it('can arrange a 3 dimension cube: 2, 2,4', () => {
      const args = [2, 2, 4];
      const expected = [[[0, 1, 2, 3], [0, 1, 2, 3]], [[0, 1, 2, 3], [0, 1, 2, 3]]];
      const results = ArrayUtils.arrangeMulti.apply(this, args);
      global.expect(results).toEqual(expected);
    });
    global.it('arrange is synonym of arrange', () => {
      const args = [2, 2, 4];
      const expected = [[[0, 1, 2, 3], [0, 1, 2, 3]], [[0, 1, 2, 3], [0, 1, 2, 3]]];
      const results = ArrayUtils.arangeMulti.apply(this, args);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('indexify', () => {
    const complexMarkdown = (`
      Heading

      # Overview
      This entire list is a hierarchy of data.

      # Section A
      This describes section A

      ## SubSection 1
      With a subsection belonging to Section A

      ## SubSection 2
      And another subsection sibling to SubSection 1, but also under Section A.

      # Section B
      With an entirely unrelated section B, that is sibling to Section A

      ## SubSection 1
      And another subsection 1, but this time related to Section B.`)
      .split('\n')
      .filter((line) => line ? true : false)
      .map((line) => line.trim());
    
    const isHeader1 = (str) => str.startsWith('# ');
    const isHeader2 = (str) => str.startsWith('## ');

    global.describe('can index', () => {
      global.it('A list without indexers', () => {
        const source = complexMarkdown;
        const expected = [
          { entry: 'Heading', section: [], subIndex: 1 },
          { entry: '# Overview', section: [], subIndex: 2 },
          {
            entry: 'This entire list is a hierarchy of data.',
            section: [],
            subIndex: 3
          },
          { entry: '# Section A', section: [], subIndex: 4 },
          { entry: 'This describes section A', section: [], subIndex: 5 },
          { entry: '## SubSection 1', section: [], subIndex: 6 },
          {
            entry: 'With a subsection belonging to Section A',
            section: [],
            subIndex: 7
          },
          { entry: '## SubSection 2', section: [], subIndex: 8 },
          {
            entry: 'And another subsection sibling to SubSection 1, but also under Section A.',
            section: [],
            subIndex: 9
          },
          { entry: '# Section B', section: [], subIndex: 10 },
          {
            entry: 'With an entirely unrelated section B, that is sibling to Section A',
            section: [],
            subIndex: 11
          },
          { entry: '## SubSection 1', section: [], subIndex: 12 },
          {
            entry: 'And another subsection 1, but this time related to Section B.',
            section: [],
            subIndex: 13
          }
        ];
        const results = ArrayUtils.indexify(source);
        // console.log(results);
        global.expect(results).toStrictEqual(expected);
      });

      global.it('a list with one hierarchy level', () => {
        const source = complexMarkdown;
        const expected = [
          { entry: 'Heading', section: [ 0 ], subIndex: 1 },
          { entry: '# Overview', section: [ 1 ], subIndex: 0 },
          {
            entry: 'This entire list is a hierarchy of data.',
            section: [ 1 ],
            subIndex: 1
          },
          { entry: '# Section A', section: [ 2 ], subIndex: 0 },
          { entry: 'This describes section A', section: [ 2 ], subIndex: 1 },
          { entry: '## SubSection 1', section: [ 2 ], subIndex: 2 },
          {
            entry: 'With a subsection belonging to Section A',
            section: [ 2 ],
            subIndex: 3
          },
          { entry: '## SubSection 2', section: [ 2 ], subIndex: 4 },
          {
            entry: 'And another subsection sibling to SubSection 1, but also under Section A.',
            section: [ 2 ],
            subIndex: 5
          },
          { entry: '# Section B', section: [ 3 ], subIndex: 0 },
          {
            entry: 'With an entirely unrelated section B, that is sibling to Section A',
            section: [ 3 ],
            subIndex: 1
          },
          { entry: '## SubSection 1', section: [ 3 ], subIndex: 2 },
          {
            entry: 'And another subsection 1, but this time related to Section B.',
            section: [ 3 ],
            subIndex: 3
          }
        ];
        const results = ArrayUtils.indexify(source, isHeader1);
        // console.log(results);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('a list with two hierarchy levels', () => {
        const source = complexMarkdown;
        const expected = [
          { entry: 'Heading', section: [ 0, 0 ], subIndex: 1 },
          { entry: '# Overview', section: [ 1, 0 ], subIndex: 0 },
          {
            entry: 'This entire list is a hierarchy of data.',
            section: [ 1, 0 ],
            subIndex: 1
          },
          { entry: '# Section A', section: [ 2, 0 ], subIndex: 0 },
          { entry: 'This describes section A', section: [ 2, 0 ], subIndex: 1 },
          { entry: '## SubSection 1', section: [ 2, 1 ], subIndex: 0 },
          {
            entry: 'With a subsection belonging to Section A',
            section: [ 2, 1 ],
            subIndex: 1
          },
          { entry: '## SubSection 2', section: [ 2, 2 ], subIndex: 0 },
          {
            entry: 'And another subsection sibling to SubSection 1, but also under Section A.',
            section: [ 2, 2 ],
            subIndex: 1
          },
          { entry: '# Section B', section: [ 3, 0 ], subIndex: 0 },
          {
            entry: 'With an entirely unrelated section B, that is sibling to Section A',
            section: [ 3, 0 ],
            subIndex: 1
          },
          { entry: '## SubSection 1', section: [ 3, 1 ], subIndex: 0 },
          {
            entry: 'And another subsection 1, but this time related to Section B.',
            section: [ 3, 1 ],
            subIndex: 1
          }
        ];
        const results = ArrayUtils.indexify(source, isHeader1, isHeader2);
        // console.log(results);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can find all headers', () => {
        const source = complexMarkdown;
        const expected = [
          { entry: '# Overview', section: [ 1, 0 ], subIndex: 0 },
          { entry: '# Section A', section: [ 2, 0 ], subIndex: 0 },
          { entry: '## SubSection 1', section: [ 2, 1 ], subIndex: 0 },
          { entry: '## SubSection 2', section: [ 2, 2 ], subIndex: 0 },
          { entry: '# Section B', section: [ 3, 0 ], subIndex: 0 },
          { entry: '## SubSection 1', section: [ 3, 1 ], subIndex: 0 }
        ];
        const results = ArrayUtils.indexify(source, isHeader1, isHeader2)
          .filter((element) => element.subIndex === 0);
        // console.log(results);
        global.expect(results).toStrictEqual(expected);
      });
    });

    global.describe('throws an error', () => {
      global.it('if it is not passed an array', () => {
        const expected = 'indexify(source, ...sectionIndicatorFunctions): source must be an array';
        global.expect(() => {
          ArrayUtils.indexify('cuca', isHeader1);
        }).toThrow(expected);
      });
      global.it('if it is not passed a function to index', () => {
        const expected = 'all section indicators passed must be functions';
        global.expect(() => {
          ArrayUtils.indexify(complexMarkdown, '# headers');
        }).toThrow(expected);
      });
      global.it('if it is not passed all functions to index', () => {
        const expected = 'all section indicators passed must be functions';
        global.expect(() => {
          ArrayUtils.indexify(complexMarkdown, isHeader1, '# headers');
        }).toThrow(expected);
      });
    });
  });

  global.describe('extract', () => {
    global.it('extract rows', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const rows = [0, 1];

      const expected = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red']
      ];

      const results = ArrayUtils.extract(data, { rows });
      global.expect(results).toEqual(expected);
    });
    global.it('extract columns', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const columns = [0, 1];

      const expected = [
        ['john', 23],
        ['jane', 32],
        ['ringo', 27]
      ];

      const results = ArrayUtils.extract(data, { columns });
      global.expect(results).toEqual(expected);
    });
    global.it('extract both', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const rows = [0, 1];
      const columns = [0, 1];

      const expected = [
        ['john', 23],
        ['jane', 32]
      ];

      const results = ArrayUtils.extract(data, { rows, columns });
      global.expect(results).toEqual(expected);
    });
    global.it('extract with null options returns the whole array', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const rows = null;
      const columns = null;

      const expected = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const results = ArrayUtils.extract(data, { rows, columns });
      global.expect(results).toEqual(expected);
    });
    global.it('extract with neither option returns the whole array', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const expected = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const results = ArrayUtils.extract(data, {});
      global.expect(results).toEqual(expected);
    });
    global.it('extract without any option returns the whole array', () => {
      const data = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const expected = [
        ['john', 23, 'purple'],
        ['jane', 32, 'red'],
        ['ringo', 27, 'green']
      ];

      const results = ArrayUtils.extract(data);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('applyArrayValue', () => {
    global.describe('can set', () => {
      global.describe('on a simple array', () => {
        global.it('on item [0]', () => {
          const targetObj = [0, 0, 0, 0];
          const path = '[0]';
          const value = 1;
          const expected = [1, 0, 0, 0];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
        global.it('on item 0', () => {
          const targetObj = [0, 0, 0, 0];
          const path = '0';
          const value = 2;
          const expected = [2, 0, 0, 0];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
        global.it('on item 2', () => {
          const targetObj = [0, 0, 0, 0];
          const path = '2';
          const value = 3;
          const expected = [0, 0, 3, 0];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
        global.it('on item 3', () => {
          const targetObj = [0, 0, 0, 0];
          const path = '3';
          const value = 4;
          const expected = [0, 0, 0, 4];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
        global.it('on item 4', () => {
          const targetObj = [0, 0, 0, 0];
          const path = '4';
          const value = 5;
          const expected = [0, 0, 0, 0, 5];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
      });
      global.describe('on objects in an array', () => {
        global.it('update a property', () => {
          const targetObj = [{
            first: 'john'
          }, {
            first: 'jane'
          }];
          const path = '[1].last';
          const value = 'doe';
          const expected = [{
            first: 'john'
          }, {
            first: 'jane',
            last: 'doe'
          }];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
        global.it('deep property', () => {
          const targetObj = [{
            first: 'john'
          }, {
            first: 'jane',
            class: {}
          }];
          const path = '[1].class.name';
          const value = 'econ-101';
          const expected = [{
            first: 'john'
          }, {
            first: 'jane',
            class: {
              name: 'econ-101'
            }
          }];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
        global.it('deep property', () => {
          const targetObj = [{
            first: 'john'
          }, {
            first: 'jane',
            classes: [{ name: 'econ-101' }]
          }];
          const path = '[1].classes[0].professor';
          const value = "o'leary";
          const expected = [{
            first: 'john'
          }, {
            first: 'jane',
            classes: [{
              name: 'econ-101',
              professor: "o'leary"
            }]
          }];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
        global.it('deep non-existant child obj', () => {
          const targetObj = [{
            first: 'john'
          }, {
            first: 'jane'
          }];
          const path = '[1].class.name';
          const value = 'econ-101';
          const expected = [{
            first: 'john'
          }, {
            first: 'jane',
            class: {
              name: 'econ-101'
            }
          }];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
        global.it('deep non-existant 2x child obj', () => {
          const targetObj = [{
            first: 'john'
          }, {
            first: 'jane'
          }];
          const path = '[1].class.professor.name';
          const value = "o'leary";
          const expected = [{
            first: 'john'
          }, {
            first: 'jane',
            class: {
              professor: {
                name: "o'leary"
              }
            }
          }];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
        global.it('overwrite a property', () => {
          const targetObj = [{
            first: 'john'
          }, {
            first: 'jane'
          }];
          const path = '[1]';
          const value = { first: 'bobby' };
          const expected = [{
            first: 'john'
          }, {
            first: 'bobby'
          }];
          const result = ArrayUtils.applyArrayValue(targetObj, path, value);
          global.expect(result).toStrictEqual(expected);
        });
      });
    });
    global.describe('cannot set', () => {
      global.it('on a null object', () => {
        const targetObj = null;
        const path = 'favoriteColor';
        const value = 'blue';
        const expected = null;
        const result = ArrayUtils.applyArrayValue(targetObj, path, value);
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.it('on a null path', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101'
        }
      };
      const path = null;
      const value = 'blue';
      const expected = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101'
        }
      };
      const result = ArrayUtils.applyArrayValue(targetObj, path, value);
      global.expect(result).toStrictEqual(expected);
    });
  });

  global.describe('applyArrayValues', () => {
    global.describe('can apply', () => {
      global.it('can apply a single value to multiple objects', () => {
        const targetObj = [{ name: 'john', last: 'doe' }, { name: 'jane', last: 'doe' }];
        const path = 'age';
        const values = 25;
        const expected = [
          { name: 'john', last: 'doe', age: 25 },
          { name: 'jane', last: 'doe', age: 25 }
        ];
        const results = ArrayUtils.applyArrayValues(targetObj, path, values);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can apply separate values to multiple objects', () => {
        const targetObj = [{ name: 'john', last: 'doe' }, { name: 'jane', last: 'doe' }];
        const path = 'age';
        const values = [24, 25];
        const expected = [
          { name: 'john', last: 'doe', age: 24 },
          { name: 'jane', last: 'doe', age: 25 }
        ];
        const results = ArrayUtils.applyArrayValues(targetObj, path, values);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('will apply the 1 property if only one target provided', () => {
        const targetObj = [{ name: 'john', last: 'doe' }];
        const path = 'age';
        const values = [24, 25];
        const expected = [
          { name: 'john', last: 'doe', age: 24 }
        ];
        const results = ArrayUtils.applyArrayValues(targetObj, path, values);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('will apply the 1 property if only one value provided', () => {
        const targetObj = [{ name: 'john', last: 'doe' }, { name: 'jane', last: 'doe' }];
        const path = 'age';
        const values = [24];
        const expected = [
          { name: 'john', last: 'doe', age: 24 },
          { name: 'jane', last: 'doe' }
        ];
        const results = ArrayUtils.applyArrayValues(targetObj, path, values);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can apply a single null value to multiple objects', () => {
        const targetObj = [{ name: 'john', last: 'doe', age: 25 }, { name: 'jane', last: 'doe', age: 25 }];
        const path = 'age';
        const values = null;
        const expected = [
          { name: 'john', last: 'doe', age: null },
          { name: 'jane', last: 'doe', age: null }
        ];
        const results = ArrayUtils.applyArrayValues(targetObj, path, values);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if valueList is null', () => {
        const targetObj = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101'
          }
        };
        const path = 'class.name';
        const value = null;
        const expected = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101',
            name: null
          }
        };
        const results = ArrayUtils.applyArrayValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if valueList is undefined', () => {
        const targetObj = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101'
          }
        };
        const path = 'class.name';
        const value = undefined;
        const expected = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101',
            name: undefined
          }
        };
        const results = ArrayUtils.applyArrayValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('hanging dot .', () => {
        const targetObj = [
          [0, 0, 0],
          [0, 0, 0]
        ];
        const path = '1';
        const value = 2;
        const expected = [
          [0, 2, 0],
          [0, 2, 0]
        ];
        const results = ArrayUtils.applyArrayValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('cannot apply', () => {
      global.it('if targetObjects are null', () => {
        const targetObj = null;
        const path = 'class.name';
        const value = 'blue';
        const expected = null;
        const results = ArrayUtils.applyArrayValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if path are null', () => {
        const targetObj = null;
        const path = 'class.';
        const value = 'blue';
        const expected = null;
        const results = ArrayUtils.applyArrayValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if targetObjects is an empty array', () => {
        const targetObj = [];
        const path = 'class.name';
        const value = 'blue';
        const expected = [];
        const results = ArrayUtils.applyArrayValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if valueList is an empty array', () => {
        const targetObj = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101'
          }
        };
        const path = 'class.name';
        const value = [];
        const expected = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101'
          }
        };
        const results = ArrayUtils.applyArrayValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });

  global.describe('multiLineSubstr', () => {
    // eslint-disable-next-line operator-linebreak
    const docsStr = '' +
`id first_name last_name  city        email                        gender ip_address      airport_code car_model_year
-- ---------- ---------- ----------- ---------------------------- ------ --------------- ------------ --------------
1  Thekla     Brokenshaw Chicago     tbrokenshaw0@kickstarter.com Female 81.118.170.238  CXI          2003          
2  Lexi       Dugall     New York    ldugall1@fc2.com             Female 255.140.25.31   LBH          2005          
3  Shawna     Burghill   London      sburghill2@scribd.com        Female 149.240.166.189 GBA          2004          
4  Ginger     Tween      Lainqu      gtween3@wordpress.com        Female 132.67.225.203  EMS          1993          
5  Elbertina  Setford    Los Angeles esetford4@ted.com            Female 247.123.242.49  MEK          1989          `;
    const docsArray = [
      'id first_name last_name  city        email                        gender ip_address      airport_code car_model_year',
      '-- ---------- ---------- ----------- ---------------------------- ------ --------------- ------------ --------------',
      '1  Thekla     Brokenshaw Chicago     tbrokenshaw0@kickstarter.com Female 81.118.170.238  CXI          2003          ',
      '2  Lexi       Dugall     New York    ldugall1@fc2.com             Female 255.140.25.31   LBH          2005          ',
      '3  Shawna     Burghill   London      sburghill2@scribd.com        Female 149.240.166.189 GBA          2004          ',
      '4  Ginger     Tween      Lainqu      gtween3@wordpress.com        Female 132.67.225.203  EMS          1993          ',
      '5  Elbertina  Setford    Los Angeles esetford4@ted.com            Female 247.123.242.49  MEK          1989          '
    ];

    global.describe('with the docs example', () => {
      global.it('with an explicit start', () => {
        const expected = ['car_model_year', '--------------', '2003          ', '2005          ', '2004          ', '1993          ', '1989          '];
        const results = ArrayUtils.multiLineSubstr(docsStr, 102);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with an explicit start and end', () => {
        const expected = ['ip_address    ', '--------------', '81.118.170.238', '255.140.25.31 ', '149.240.166.18', '132.67.225.203', '247.123.242.49'];
        const results = ArrayUtils.multiLineSubstr(docsStr, 73, 14);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('can extract from a string', () => {
      global.it('with an explicit start', () => {
        const expected = ['car_model_year', '--------------', '2003          ', '2005          ', '2004          ', '1993          ', '1989          '];
        const results = ArrayUtils.multiLineSubstr(docsStr, 102);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with an explicit start and end', () => {
        const expected = ['ip_address    ', '--------------', '81.118.170.238', '255.140.25.31 ', '149.240.166.18', '132.67.225.203', '247.123.242.49'];
        const results = ArrayUtils.multiLineSubstr(docsStr, 73, 14);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with a single string', () => {
        const lineString = 'id first_name last_name  city        email                        gender ip_address      airport_code car_model_year';
        const expected = ['ip_address    '];
        const results = ArrayUtils.multiLineSubstr(lineString, 73, 14);
        // console.log(expected);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('can extract from an array of strings', () => {
      global.it('with an explicit start', () => {
        const expected = ['car_model_year', '--------------', '2003          ', '2005          ', '2004          ', '1993          ', '1989          '];
        const results = ArrayUtils.multiLineSubstr(docsArray, 102);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with an explicit start and end', () => {
        const expected = ['ip_address    ', '--------------', '81.118.170.238', '255.140.25.31 ', '149.240.166.18', '132.67.225.203', '247.123.242.49'];
        const results = ArrayUtils.multiLineSubstr(docsArray, 73, 14);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
      global.it('from the beginning', () => {
        // eslint-disable-next-line operator-linebreak
        const str = '' +
`line1
line2
line3`;
        const expected = ['line1', 'line2', 'line3'];
        const results = ArrayUtils.multiLineSubstr(str, 0);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
      global.it('past the end', () => {
        // eslint-disable-next-line operator-linebreak
        const str = '' +
`line1
line2
line3`;
        const expected = ['', '', ''];
        const results = ArrayUtils.multiLineSubstr(str, 100);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with an array of a single string', () => {
        const lineString = ['id first_name last_name  city        email                        gender ip_address      airport_code car_model_year'];
        const expected = ['ip_address    '];
        const results = ArrayUtils.multiLineSubstr(lineString, 73, 14);
        // console.log(expected);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('cant', () => {
      global.it('extract from an object', () => {
        const target = {};
        const expected = 'multiLineSubstr(target, start, length): target is assumed a multi-line string or array of strings';
        global.expect(() => ArrayUtils.multiLineSubstr(target, 0)).toThrow(expected);
      });
    });
  });
  
  global.describe('multiLineSubstring', () => {
    const docsStr = `
id first_name last_name  city        email                        gender ip_address      airport_code car_model_year
-- ---------- ---------- ----------- ---------------------------- ------ --------------- ------------ --------------
1  Thekla     Brokenshaw Chicago     tbrokenshaw0@kickstarter.com Female 81.118.170.238  CXI          2003          
2  Lexi       Dugall     New York    ldugall1@fc2.com             Female 255.140.25.31   LBH          2005          
3  Shawna     Burghill   London      sburghill2@scribd.com        Female 149.240.166.189 GBA          2004          
4  Ginger     Tween      Lainqu      gtween3@wordpress.com        Female 132.67.225.203  EMS          1993          
5  Elbertina  Setford    Los Angeles esetford4@ted.com            Female 247.123.242.49  MEK          1989          `;
    const docsArray = [
      'id first_name last_name  city        email                        gender ip_address      airport_code car_model_year',
      '-- ---------- ---------- ----------- ---------------------------- ------ --------------- ------------ --------------',
      '1  Thekla     Brokenshaw Chicago     tbrokenshaw0@kickstarter.com Female 81.118.170.238  CXI          2003          ',
      '2  Lexi       Dugall     New York    ldugall1@fc2.com             Female 255.140.25.31   LBH          2005          ',
      '3  Shawna     Burghill   London      sburghill2@scribd.com        Female 149.240.166.189 GBA          2004          ',
      '4  Ginger     Tween      Lainqu      gtween3@wordpress.com        Female 132.67.225.203  EMS          1993          ',
      '5  Elbertina  Setford    Los Angeles esetford4@ted.com            Female 247.123.242.49  MEK          1989          '
    ];

    global.describe('with the docs example', () => {
      global.it('with an explicit start', () => {
        const expected = ['car_model_year', '--------------', '2003          ', '2005          ', '2004          ', '1993          ', '1989'];
        const results = ArrayUtils.multiLineSubstring(docsStr, 102);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with an explicit start and end', () => {
        const expected = ['ip_address    ', '--------------', '81.118.170.238', '255.140.25.31 ', '149.240.166.18', '132.67.225.203', '247.123.242.49'];
        const results = ArrayUtils.multiLineSubstring(docsStr, 73, 87);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('can extract from a string', () => {
      global.it('with an explicit start', () => {
        const expected = ['car_model_year', '--------------', '2003          ', '2005          ', '2004          ', '1993          ', '1989'];
        const results = ArrayUtils.multiLineSubstring(docsStr, 102);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with an explicit start and end', () => {
        const expected = ['ip_address    ', '--------------', '81.118.170.238', '255.140.25.31 ', '149.240.166.18', '132.67.225.203', '247.123.242.49'];
        const results = ArrayUtils.multiLineSubstring(docsStr, 73, 87);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
      global.it('from the beginning', () => {
        const str = `
line1
line2
line3`;
        const expected = ['line1', 'line2', 'line3'];
        const results = ArrayUtils.multiLineSubstring(str, 0);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
      global.it('past the end', () => {
        const str = `
line1
line2
line3`;
        const expected = ['', '', ''];
        const results = ArrayUtils.multiLineSubstring(str, 100);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with a single string', () => {
        const lineString = 'id first_name last_name  city        email                        gender ip_address      airport_code car_model_year';
        const expected = ['ip_address    '];
        const results = ArrayUtils.multiLineSubstring(lineString, 73, 87);
        // console.log(expected);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('can extract from an array of strings', () => {
      global.it('with an explicit start', () => {
        const expected = ['car_model_year', '--------------', '2003          ', '2005          ', '2004          ', '1993          ', '1989          '];
        const results = ArrayUtils.multiLineSubstring(docsArray, 102);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with an explicit start and end', () => {
        const expected = ['ip_address    ', '--------------', '81.118.170.238', '255.140.25.31 ', '149.240.166.18', '132.67.225.203', '247.123.242.49'];
        const results = ArrayUtils.multiLineSubstring(docsArray, 73, 87);
        // console.log(JSON.stringify(results).replace(/"/g, "'"));
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with an array of a single string', () => {
        const lineString = ['id first_name last_name  city        email                        gender ip_address      airport_code car_model_year'];
        const expected = ['ip_address    '];
        const results = ArrayUtils.multiLineSubstring(lineString, 73, 87);
        // console.log(expected);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('cant', () => {
      global.it('extract from an object', () => {
        const target = {};
        const expected = 'multiLineSubstring(target, startPosition, endPosition): target is assumed a multi-line string or array of strings';
        global.expect(() => ArrayUtils.multiLineSubstring(target, 0)).toThrow(expected);
      });
    });
  });

  global.describe('multiStepReduce', () => {
    const simpleList = [1, 2, 3, 4, 5];
    const simpleAdd = (a, b) => a + b;
    const simpleSubtract = (a, b) => a - b;
    global.it('can add across multiple values', () => {
      const expected = [0, 1, 3, 6, 10, 15];
      const results = ArrayUtils.multiStepReduce(simpleList, simpleAdd, 0);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can subtract across multiple values', () => {
      const expected = [15, 14, 12, 9, 5, 0];
      const results = ArrayUtils.multiStepReduce(simpleList, simpleSubtract, 15);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can add strings', () => {
      const list = ['hello', ' how', ' are', ' you', '?'];
      const expected = ['', 'hello', 'hello how', 'hello how are', 'hello how are you', 'hello how are you?'];
      const results = ArrayUtils.multiStepReduce(list, simpleAdd, '');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can detect the first go round', () => {
      const list = ['0', '1', '2'];
      const expected = [undefined, 'EMPTY0', 'EMPTY01', 'EMPTY012'];
      const fn = (a, b) => {
        const cleanA = (a === undefined) ? 'EMPTY' : a;
        const cleanB = (b === undefined) ? 'EMPTY' : b;
        return `${cleanA}${cleanB}`;
      };
      const results = ArrayUtils.multiStepReduce(list, fn);
      global.expect(results).toStrictEqual(expected);
    });
    global.describe('documentation', () => {
      const sumFn = (a, b) => a + b;
      const columnWidths = [3, 11, 11, 12, 29, 7, 16, 13, 15];
      // eslint-disable-next-line operator-linebreak
      const hardSpacedString = '' +
`id first_name last_name  city        email                        gender ip_address      airport_code car_model_year
-- ---------- ---------- ----------- ---------------------------- ------ --------------- ------------ --------------
1  Thekla     Brokenshaw Chicago     tbrokenshaw0@kickstarter.com Female 81.118.170.238  CXI          2003          
2  Lexi       Dugall     New York    ldugall1@fc2.com             Female 255.140.25.31   LBH          2005          
3  Shawna     Burghill   London      sburghill2@scribd.com        Female 149.240.166.189 GBA          2004          
4  Ginger     Tween      Lainqu      gtween3@wordpress.com        Female 132.67.225.203  EMS          1993          
5  Elbertina  Setford    Los Angeles esetford4@ted.com            Female 247.123.242.49  MEK          1989          `;
      global.it('sumfn works', () => {
        const expected = 5;
        const results = sumFn(2, 3);
        global.expect(results).toBe(expected);
      });
      global.it('can sum up numbers', () => {
        const expected = [0, 3, 14, 25, 37, 66, 73, 89, 102, 117];

        const results = ArrayUtils.multiStepReduce(columnWidths, sumFn, 0);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('comes up with pairs', () => {
        const lineStops = ArrayUtils.multiStepReduce(columnWidths, sumFn, 0);
        let expected = [0, 3, 14, 25, 37, 66, 73, 89, 102, 117];
        global.expect(lineStops).toStrictEqual(expected);

        const substrPairs = columnWidths.map((value, index) => [expected[index], value]);
        expected = [[0, 3], [3, 11], [14, 11], [25, 12], [37, 29], [66, 7], [73, 16], [89, 13], [102, 15]];
        global.expect(substrPairs).toStrictEqual(expected);
      });
      global.it('can extract out strings', () => {
        const lineStops = ArrayUtils.multiStepReduce(columnWidths, sumFn, 0);
        const substrPairs = columnWidths.map((value, index) => [lineStops[index], value]);

        const expected = [['id ', '-- ', '1  ', '2  ', '3  ', '4  ', '5  '],
          ['first_name ', '---------- ', 'Thekla     ', 'Lexi       ', 'Shawna     ', 'Ginger     ', 'Elbertina  '],
          ['last_name  ', '---------- ', 'Brokenshaw ', 'Dugall     ', 'Burghill   ', 'Tween      ', 'Setford    '],
          ['city        ', '----------- ', 'Chicago     ', 'New York    ', 'London      ', 'Lainqu      ', 'Los Angeles '],
          ['email                        ', '---------------------------- ', 'tbrokenshaw0@kickstarter.com ', 'ldugall1@fc2.com             ', 'sburghill2@scribd.com        ', 'gtween3@wordpress.com        ', 'esetford4@ted.com            '],
          ['gender ', '------ ', 'Female ', 'Female ', 'Female ', 'Female ', 'Female '],
          ['ip_address      ', '--------------- ', '81.118.170.238  ', '255.140.25.31   ', '149.240.166.189 ', '132.67.225.203  ', '247.123.242.49  '],
          ['airport_code ', '------------ ', 'CXI          ', 'LBH          ', 'GBA          ', 'EMS          ', 'MEK          '],
          ['car_model_year', '--------------', '2003          ', '2005          ', '2004          ', '1993          ', '1989          ']];
        const results = substrPairs
          .map(([startingPos, length]) => ArrayUtils.multiLineSubstr(hardSpacedString, startingPos, length));
        global.expect(results).toStrictEqual(expected);
      });
    });
  });
});
