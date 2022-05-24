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
    global.describe('pick rows', () => {
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
    global.describe('pick columns', () => {
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
    global.describe('pick both', () => {
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
});
