const AggregateUtils = require('../aggregate');

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

const floatEpsilon = (number, isAbove) => number + (isAbove ? 1 : -1) * 0.000001;

global.describe('AggregateUtils', () => {
  global.describe('extent', () => {
    global.it('finds a min value, with a property', () => {
      const source = initializeWeather();
      const expected = { min: 0.87, max: 5.31 };
      const results = AggregateUtils.extent(source, 'precip');
      global.expect(results).toEqual(expected);
    });
    global.it('finds a extent value, with no argument sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = { min: 0.87, max: 5.31 };
      const results = AggregateUtils.extent(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a extent value, with null sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = { min: 0.87, max: 5.31 };
      const results = AggregateUtils.extent(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a extent value, with a function sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = { min: 0.87, max: 5.31 };
      const results = AggregateUtils.extent(source, (r) => r);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('min', () => {
    global.it('finds a min value, with a property', () => {
      const source = initializeWeather();
      const expected = 0.87;
      const results = AggregateUtils.min(source, 'precip');
      global.expect(results).toEqual(expected);
    });
    global.it('finds a minimum value, with no argument sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 0.87;
      const results = AggregateUtils.min(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a minimum value, with null sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 0.87;
      const results = AggregateUtils.min(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a minimum value, with a function sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 0.87;
      const results = AggregateUtils.min(source, (r) => r);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('max', () => {
    global.it('finds a max value, with a property', () => {
      const source = initializeWeather();
      const expected = 5.31;
      const results = AggregateUtils.max(source, 'precip');
      global.expect(results).toEqual(expected);
    });
    global.it('finds a maximum value, with no argument sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 5.31;
      const results = AggregateUtils.max(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a maximum value, with null sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 5.31;
      const results = AggregateUtils.max(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a maximum value, with a function sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 5.31;
      const results = AggregateUtils.max(source, (r) => r);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('sum', () => {
    global.it('finds the sum value, with a property', () => {
      const source = initializeWeather();
      const expected = 30.67;
      const results = AggregateUtils.sum(source, 'precip');
      global.expect(results).toBeLessThan(floatEpsilon(expected, true));
      global.expect(results).toBeGreaterThan(floatEpsilon(expected, false));
    });
    global.it('finds the sum value, with no argument sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 30.67;
      const results = AggregateUtils.sum(source);
      global.expect(results).toBeLessThan(floatEpsilon(expected, true));
      global.expect(results).toBeGreaterThan(floatEpsilon(expected, false));
    });
    global.it('finds the sum value, with null sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 30.67;
      const results = AggregateUtils.sum(source, null);
      global.expect(results).toBeLessThan(floatEpsilon(expected, true));
      global.expect(results).toBeGreaterThan(floatEpsilon(expected, false));
    });
    global.it('finds the sum value, with a function sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 30.67;
      const results = AggregateUtils.sum(source, (r) => r);
      global.expect(results).toBeLessThan(floatEpsilon(expected, true));
      global.expect(results).toBeGreaterThan(floatEpsilon(expected, false));
    });
  });

  global.describe('difference', () => {
    global.it('finds the difference in numbers, with a property', () => {
      const source = initializeWeather();
      const expected = 4.44;
      const results = AggregateUtils.difference(source, 'precip');
      global.expect(results).toBeLessThan(floatEpsilon(expected, true));
      global.expect(results).toBeGreaterThan(floatEpsilon(expected, false));
    });
    global.it('finds the difference in numbers, with no argument sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 4.44;
      const results = AggregateUtils.difference(source);
      global.expect(results).toBeLessThan(floatEpsilon(expected, true));
      global.expect(results).toBeGreaterThan(floatEpsilon(expected, false));
    });
    global.it('finds the difference in numbers, with null sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 4.44;
      const results = AggregateUtils.difference(source, null);
      global.expect(results).toBeLessThan(floatEpsilon(expected, true));
      global.expect(results).toBeGreaterThan(floatEpsilon(expected, false));
    });
    global.it('finds the difference in numbers, with a function sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 4.44;
      const results = AggregateUtils.difference(source, (r) => r);
      global.expect(results).toBeLessThan(floatEpsilon(expected, true));
      global.expect(results).toBeGreaterThan(floatEpsilon(expected, false));
    });
  });

  global.describe('first', () => {
    global.it('finds the first value, with a property', () => {
      const source = initializeWeather();
      const expected = 0.87;
      const results = AggregateUtils.first(source, 'precip');
      global.expect(results).toEqual(expected);
    });
    global.it('finds the first value, with no argument sent', () => {
      const source = [0.87, 2.68, 5.33, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 0.87;
      const results = AggregateUtils.first(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the first value, with a new first value', () => {
      const source = [5.33, 0.87, 2.68, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 5.33;
      const results = AggregateUtils.first(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the first value, with a few nulls before', () => {
      const source = [null, null, 5.33, 0.87, 2.68, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 5.33;
      const results = AggregateUtils.first(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds null if no values found', () => {
      const source = [];
      const expected = null;
      const results = AggregateUtils.first(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds null if only nulls are found', () => {
      const source = [null, null];
      const expected = null;
      const results = AggregateUtils.first(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a first value, with null sent', () => {
      const source = [0.87, 2.68, 5.33, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 0.87;
      const results = AggregateUtils.first(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a first value, with a function sent', () => {
      const source = [0.87, 2.68, 5.33, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 0.87;
      const results = AggregateUtils.first(source, (r) => r);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('avgMean', () => {
    global.it('finds a mean average value, with a property', () => {
      const source = initializeWeather();
      const expected = 3.4078;
      const results = AggregateUtils.avgMean(source, 'precip');
      global.expect(results).toBeLessThan(expected + 0.001);
      global.expect(results).toBeGreaterThan(expected - 0.001);
    });
    global.it('finds the mean average value, with no argument sent', () => {
      const source = [0.87, 2.68, 5.33, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 3.41;
      const results = AggregateUtils.avgMean(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a mean average value, with null sent', () => {
      const source = [0.87, 2.68, 5.33, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 3.41;
      const results = AggregateUtils.avgMean(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a mean average value, with a function sent', () => {
      const source = [0.87, 2.68, 5.33, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 3.41;
      const results = AggregateUtils.avgMean(source, (r) => r);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('avMedian', () => {
    global.it('finds a median average value, with a property', () => {
      const source = initializeWeather();
      const expected = 3.62;
      const results = AggregateUtils.avgMedian(source, 'precip');
      global.expect(results).toEqual(expected);
    });
    global.it('finds the median average value, with no argument sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 3.62;
      const results = AggregateUtils.avgMedian(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a median average value, with null sent', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 3.62;
      const results = AggregateUtils.avgMedian(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a median average value, with an odd number of rows', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 3.62;
      const results = AggregateUtils.avgMedian(source, (r) => r);
      global.expect(results).toEqual(expected);
    });
    global.it('finds a median average value, with an even number of rows', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56];
      const expected = 3.6;
      const results = AggregateUtils.avgMedian(source, (r) => r);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('length', () => {
    global.it('finds the length of an array', () => {
      const source = [0.87, 2.68, 5.31, 3.94, 4.13, 3.58, 3.62, 2.56, 3.98];
      const expected = 9;
      const results = AggregateUtils.length(source);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('unique', () => {
    global.it('finds the unique values, with a property', () => {
      const source = initializeWeather();
      const expected = ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.unique(source, 'city');
      global.expect(results).toEqual(expected);
    });
    global.it('finds the unique values, with a uniquifier passed', () => {
      const source = [
        { id: 1, ts: new Date(2022, 2, 1, 9, 0) }, { id: 1, ts: new Date(2022, 2, 1, 10, 0) },
        { id: 1, ts: new Date(2022, 2, 2, 9, 0) }, { id: 1, ts: new Date(2022, 2, 2, 10, 0) },
        { id: 1, ts: new Date(2022, 2, 3, 9, 0) }, { id: 1, ts: new Date(2022, 2, 3, 10, 0) },
        { id: 1, ts: null }
      ];

      //-- using dates won't work because they are Objects
      //-- and new Date(2022,2,2) !== new Date(2022,2,2)

      const uniquifier = (d) => d ? d.toISOString().slice(0, 10) : null;

      const expected = ['2022-03-01', '2022-03-02', '2022-03-03', null];

      const results = AggregateUtils.unique(source, 'ts', uniquifier);

      global.expect(results).toEqual(expected);
    });
    global.it('finds the unique values, with property', () => {
      const source = initializeWeather();
      const expected = ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.unique(source, 'city');
      global.expect(results).toEqual(expected);
    });
    global.it('finds the unique values, with no argument sent', () => {
      const source = initializeWeather().map((r) => r.city);
      const expected = ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.unique(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the unique values, with null sent', () => {
      const source = initializeWeather().map((r) => r.city);
      const expected = ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.unique(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the unique values, with a function sent', () => {
      const source = initializeWeather();
      const expected = ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.unique(source, (r) => r.city);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('distinct', () => {
    global.it('counts the unique values, with a property', () => {
      const source = initializeWeather();
      const expected = 3; // ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.distinct(source, 'city');
      global.expect(results).toEqual(expected);
    });
    global.it('counts the unique values, with a uniquifier passed', () => {
      const source = [
        { id: 1, ts: new Date(2022, 2, 1, 9, 0) }, { id: 1, ts: new Date(2022, 2, 1, 10, 0) },
        { id: 1, ts: new Date(2022, 2, 2, 9, 0) }, { id: 1, ts: new Date(2022, 2, 2, 10, 0) },
        { id: 1, ts: new Date(2022, 2, 3, 9, 0) }, { id: 1, ts: new Date(2022, 2, 3, 10, 0) },
        { id: 1, ts: null }
      ];

      //-- using dates won't work because they are Objects
      //-- and new Date(2022,2,2) !== new Date(2022,2,2)

      const uniquifier = (d) => d ? d.toISOString().slice(0, 10) : null;

      const expected = 4; // ['2022-03-01', '2022-03-02', '2022-03-03', null];

      const results = AggregateUtils.distinct(source, 'ts', uniquifier);

      global.expect(results).toEqual(expected);
    });
    global.it('counts the unique values, with property', () => {
      const source = initializeWeather();
      const expected = 3; // ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.distinct(source, 'city');
      global.expect(results).toEqual(expected);
    });
    global.it('counts the unique values, with no argument sent', () => {
      const source = initializeWeather().map((r) => r.city);
      const expected = 3; // ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.distinct(source);
      global.expect(results).toEqual(expected);
    });
    global.it('counts the unique values, with null sent', () => {
      const source = initializeWeather().map((r) => r.city);
      const expected = 3; // ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.distinct(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('counts the unique values, with a function sent', () => {
      const source = initializeWeather();
      const expected = 3; // ['Seattle', 'New York', 'Chicago'];
      const results = AggregateUtils.distinct(source, (r) => r.city);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('countMap', () => {
    global.it('does not blow up if the collection is empty', () => {
      const source = [];
      const expected = new Map();
      const results = AggregateUtils.countMap(source);
      global.expect(results).toEqual(expected);
    });
    global.it('counts null values and single values', () => {
      const source = [null, undefined, 'a', null, 'a'];
      const expected = new Map([[null, 3], ['a', 2]]);
      const results = AggregateUtils.countMap(source);
      global.expect(results).toEqual(expected);
    });
    global.it('can count unique values', () => {
      const source = ['apple', 'orange', 'banana'];
      const expected = new Map([['apple', 1], ['orange', 1], ['banana', 1]]);
      const results = AggregateUtils.countMap(source);
      global.expect(results).toEqual(expected);
    });
    global.it('can count duplicate values', () => {
      const source = ['apple', 'orange', 'banana', 'orange', 'banana'];
      const expected = new Map([['apple', 1], ['orange', 2], ['banana', 2]]);
      const results = AggregateUtils.countMap(source);
      global.expect(results).toEqual(expected);
    });
    global.it('can count duplicate dates', () => {
      const source = [
        new Date(2022, 0, 1, 9),
        new Date(2022, 0, 1, 9, 30),
        new Date(2022, 0, 1, 10, 0),
        new Date(2022, 0, 2, 9),
        new Date(2022, 0, 2, 9, 30),
        new Date(2022, 0, 2, 10, 0),
        new Date(2022, 0, 3, 10, 0),
      ];
      const expected = new Map([['2022-01-01', 3], ['2022-01-02', 3], ['2022-01-03', 1]]);
      const results = AggregateUtils.countMap(source, (d) => d.toISOString().slice(0, 10));
      global.expect(results).toEqual(expected);
    });
    global.it('can count dates with uniquifier', () => {
      const source = [
        new Date(2022, 0, 1, 9),
        new Date(2022, 0, 1, 9, 30),
        new Date(2022, 0, 1, 10, 0),
        new Date(2022, 0, 2, 9),
        new Date(2022, 0, 2, 9, 30),
        new Date(2022, 0, 2, 10, 0),
        new Date(2022, 0, 3, 10, 0),
        new Date(2022, 0, 3, 10, 0)
      ];
      const uniquifier = (d) => !d ? null : d.toISOString().slice(0, 10);
      const expected = new Map([['2022-01-01', 3], ['2022-01-02', 3], ['2022-01-03', 2]]);
      const results = AggregateUtils.countMap(source, null, uniquifier);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('count', () => {
    global.it('finds the count values, with a property', () => {
      const source = initializeWeather();
      const expected = { Seattle: 3, 'New York': 3, Chicago: 3 };
      const results = AggregateUtils.count(source, 'city');
      global.expect(results).toEqual(expected);
    });
    global.it('finds the count values, with no argument sent', () => {
      const source = [
        'Chicago', 'Seattle', 'New York', 'Chicago', 'Seattle', 'New York',
        'Chicago', 'Seattle', 'New York', 'Amsterdam'
      ];
      const expected = { Seattle: 3, 'New York': 3, Chicago: 3, Amsterdam: 1 };
      const results = AggregateUtils.count(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the count values, with null sent', () => {
      const source = [
        'Chicago', 'Seattle', 'New York', 'Chicago', 'Seattle', 'New York',
        'Chicago', 'Seattle', 'New York', 'Amsterdam'
      ];
      const expected = { Seattle: 3, 'New York': 3, Chicago: 3, Amsterdam: 1 };
      const results = AggregateUtils.count(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the count values, with a function sent', () => {
      const source = initializeWeather();
      const expected = { Seattle: 3, 'New York': 3, Chicago: 3 };
      const results = AggregateUtils.count(source, (r) => r.city);
      global.expect(results).toEqual(expected);
    });
  });
  global.describe('duplicate', () => {
    global.it('finds the duplicate values, with a property', () => {
      const source = [
        { city: 'Chicago' }, { city: 'Seattle' }, { city: 'New York' },
        { city: 'Chicago' }, { city: 'Seattle' }, { city: 'AmsterDam' }
      ];
      const expected = ['Chicago', 'Seattle'];
      const results = AggregateUtils.duplicates(source, 'city');
      global.expect(results).toEqual(expected);
    });
    global.it('finds the duplicate values, with no argument sent', () => {
      const source = [
        'Chicago', 'Seattle', 'New York', 'Chicago', 'Seattle', 'New York', 'Amsterdam'
      ];
      const expected = ['Chicago', 'Seattle', 'New York'];
      const results = AggregateUtils.duplicates(source);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the duplicate values, with null sent', () => {
      const source = [
        'Chicago', 'Seattle', 'New York', 'Chicago', 'Seattle', 'New York', 'Amsterdam'
      ];
      const expected = ['Chicago', 'Seattle', 'New York'];
      const results = AggregateUtils.duplicates(source, null);
      global.expect(results).toEqual(expected);
    });
    global.it('finds the duplicate values, with a function sent', () => {
      const source = [
        { city: 'Chicago' }, { city: 'Seattle' }, { city: 'New York' },
        { city: 'Chicago' }, { city: 'Seattle' }, { city: 'AmsterDam' }
      ];
      const expected = ['Chicago', 'Seattle'];
      const results = AggregateUtils.duplicates(source, (r) => r.city);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('deferCollection', () => {
    global.it('can defer a collection method to later', () => {
      const data = [{ val: 12 }, { val: 4 }, { val: 1 }, { val: 3 }, { val: 5 },
        { val: 2 }, { val: 15 }, { val: 3 }, { val: 6 }, { val: -1 }, { val: 23 }];
      const minFn = AggregateUtils.deferCollection(AggregateUtils.min, 'val');
      const result = minFn(data);
      global.expect(result).toBe(-1);
    });
    global.it('throws an error if deferCollection isnt passed a function', () => {
      //-- same line as above but `AggregateUtils` not `AggregateUtils.min`
      global.expect(() => AggregateUtils.deferCollection(AggregateUtils, 'val'))
        .toThrow();
    });
  });

  global.describe('notIn', () => {
    global.it('can determine if a collection of array values are within a set', () => {
      const superSet = new Set([1, 2, 3, 4, 5]);
      const data = [{ val: 12 }, { val: 4 }, { val: 1 }, { val: 3 }, { val: 5 },
        { val: 2 }, { val: 15 }, { val: 3 }, { val: 6 }, { val: -1 }, { val: 23 }];
      const results = AggregateUtils.notIn(data, 'val', superSet);
      const expected = new Set([-1, 12, 15, 23, 6]);
      global.expect(results).toStrictEqual(expected);
    });
    //-- check on floats too
    global.it('can determine if floats are in those values', () => {
      const superSet = new Set([1.0, 1.5, 2.0]);
      const data = [{ val: 1.0 }, { val: 1.5 }, { val: 2.0 }];
      const results = AggregateUtils.notIn(data, 'val', superSet);
      const expected = new Set();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can determine if strings are in those values', () => {
      const superSet = new Set(['a', 'b', 'c']);
      const data = [{ val: 'a' }, { val: 'b' }, { val: 'c' }, { val: 'd' }];
      const results = AggregateUtils.notIn(data, 'val', superSet);
      const expected = new Set(['d']);
      global.expect(results).toStrictEqual(expected);
    });
    global.it(', with a function sent', () => {
      const superSet = new Set([1, 2, 3, 4, 5]);
      const data = [{ val: 12 }, { val: 4 }, { val: 1 }, { val: 3 }, { val: 5 },
        { val: 2 }, { val: 15 }, { val: 3 }, { val: 6 }, { val: -1 }, { val: 23 }];
      const results = AggregateUtils.notIn(data, (r) => r.val, superSet);
      const expected = new Set([-1, 12, 15, 23, 6]);
      global.expect(results).toStrictEqual(expected);
    });
  });
  global.describe('unique', () => {
    global.it('is unique, with a property', () => {
      const data = [{ val: 'a' }, { val: 'b' }, { val: 'c' }, { val: 'd' }];
      const results = AggregateUtils.isUnique(data, 'val');
      const expected = true;
      global.expect(results).toBe(expected);
    });
    global.it('can detect duplicate, with a number', () => {
      const data = [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 3 }];
      const results = AggregateUtils.isUnique(data, 'val');
      const expected = false;
      global.expect(results).toBe(expected);
    });
    global.it('can detect duplicate, with a float', () => {
      const data = [{ val: 1.0 }, { val: 1.5 }, { val: 2.0 }, { val: 2.0 }];
      const results = AggregateUtils.isUnique(data, 'val');
      const expected = false;
      global.expect(results).toBe(expected);
    });
    global.it('can detect duplicates, with no argument sent', () => {
      const data = ['a', 'b', 'c', 'd', 'a'];
      const results = AggregateUtils.isUnique(data);
      const expected = false;
      global.expect(results).toBe(expected);
    });
    global.it('can detect duplicates, with null sent for a direct list', () => {
      const data = ['a', 'b', 'c', 'd', 'a'];
      const results = AggregateUtils.isUnique(data, null);
      const expected = false;
      global.expect(results).toBe(expected);
    });
    global.it('can still mark unique with null values', () => {
      const data = ['a', 'b', null, 'c', null, 'd', null];
      const results = AggregateUtils.isUnique(data, null);
      const expected = false;
      global.expect(results).toBe(expected);
    });
    global.it('can detect duplicates, with a function sent', () => {
      const data = [{ val: 'a' }, { val: 'b' }, { val: 'c' }, { val: 'd' }, { val: 'a' }];
      const results = AggregateUtils.isUnique(data, (r) => r.val);
      const expected = false;
      global.expect(results).toBe(expected);
    });
  });
  /*
    global.it(', with a property', () => {
    })
    global.it(', with no argument sent', () => {
    });
    global.it(', with null sent', () => {
    });
    global.it(', with a function sent', () => {
    });
 */
});

global.describe('property', () => {
  global.it('accesses a property from a list', () => {
    const data = [{ record: 'jobA', val: 1 }, { record: 'jobA', val: 2 },
      { record: 'jobA', val: 3 }, { record: 'jobA', val: 4 },
      { record: 'jobA', val: 5 }, { record: 'jobA', val: 6 },
      { record: 'jobA', val: 7 }, { record: 'jobA', val: 8 },
      { record: 'jobA', val: 9 }, { record: 'jobA', val: 10 }
    ];
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = AggregateUtils.property(data, 'val');
    global.expect(results).toStrictEqual(expected);
  });
  global.it('accesses a function from a list', () => {
    const data = [{ record: 'jobA', val: 1 }, { record: 'jobA', val: 2 },
      { record: 'jobA', val: 3 }, { record: 'jobA', val: 4 },
      { record: 'jobA', val: 5 }, { record: 'jobA', val: 6 },
      { record: 'jobA', val: 7 }, { record: 'jobA', val: 8 },
      { record: 'jobA', val: 9 }, { record: 'jobA', val: 10 }
    ];
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = AggregateUtils.property(data, (r) => r.val);
    global.expect(results).toStrictEqual(expected);
  });
  global.it('accesses values from a list', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = AggregateUtils.property(data);
    global.expect(results).toStrictEqual(expected);
  });
  global.it('does not fail if not sent a list', () => {
    const data = 1;
    const expected = [];
    const results = AggregateUtils.property(data, 'val');
    global.expect(results).toStrictEqual(expected);
  });
  global.it('does not fail if sent a null list', () => {
    const data = null;
    const expected = [];
    const results = AggregateUtils.property(data, 'val');
    global.expect(results).toStrictEqual(expected);
  });
  global.it('does not fail if sent an empty list', () => {
    const data = [];
    const expected = [];
    const results = AggregateUtils.property(data, 'val');
    global.expect(results).toStrictEqual(expected);
  });
});

global.describe('percentile', () => {
  global.describe('gets the 50th percentile', () => {
    global.it('from a property', () => {
      const data = [{ record: 'jobA', val: 1 }, { record: 'jobA', val: 2 },
        { record: 'jobA', val: 3 }, { record: 'jobA', val: 4 },
        { record: 'jobA', val: 5 }, { record: 'jobA', val: 6 },
        { record: 'jobA', val: 7 }, { record: 'jobA', val: 8 },
        { record: 'jobA', val: 9 }, { record: 'jobA', val: 10 }
      ];
      const percentile = 50;
      const expected = 5;
      const result = AggregateUtils.percentile(data, 'val', percentile);
      global.expect(result).toBe(expected);
    });
    global.it('from a function', () => {
      const data = [{ record: 'jobA', val: 1 }, { record: 'jobA', val: 2 },
        { record: 'jobA', val: 3 }, { record: 'jobA', val: 4 },
        { record: 'jobA', val: 5 }, { record: 'jobA', val: 6 },
        { record: 'jobA', val: 7 }, { record: 'jobA', val: 8 },
        { record: 'jobA', val: 9 }, { record: 'jobA', val: 10 }
      ];
      const percentile = 50;
      const expected = 5;
      const result = AggregateUtils.percentile(data, (r) => r.val, percentile);
      global.expect(result).toBe(expected);
    });
    global.it('from a decimal', () => {
      const data = [{ record: 'jobA', val: 1 }, { record: 'jobA', val: 2 },
        { record: 'jobA', val: 3 }, { record: 'jobA', val: 4 },
        { record: 'jobA', val: 5 }, { record: 'jobA', val: 6 },
        { record: 'jobA', val: 7 }, { record: 'jobA', val: 8 },
        { record: 'jobA', val: 9 }, { record: 'jobA', val: 10 }
      ];
      const percentile = 0.5;
      const expected = 5;
      const result = AggregateUtils.percentile(data, (r) => r.val, percentile);
      global.expect(result).toBe(expected);
    });
  });
  global.describe('does not fail', () => {
    global.it('if the property is not found', () => {
      const data = [{ record: 'jobA', val: 1 }, { record: 'jobA', val: 2 },
        { record: 'jobA', val: 3 }, { record: 'jobA', val: 4 },
        { record: 'jobA', val: 5 }, { record: 'jobA', val: 6 },
        { record: 'jobA', val: 7 }, { record: 'jobA', val: 8 },
        { record: 'jobA', val: 9 }, { record: 'jobA', val: 10 }
      ];
      const percentile = 0.5;
      const expected = undefined;
      const result = AggregateUtils.percentile(data, 'invalidProp', percentile);
      global.expect(result).toBe(expected);
    });
    global.it('if data is an empty array', () => {
      const data = [];
      const percentile = 0.5;
      const expected = undefined;
      const result = AggregateUtils.percentile(data, 'invalidProp', percentile);
      global.expect(result).toBe(expected);
    });
    global.it('if data is not an array', () => {
      const data = 2;
      const percentile = 0.5;
      const expected = undefined;
      const result = AggregateUtils.percentile(data, 'invalidProp', percentile);
      global.expect(result).toBe(expected);
    });
    global.it('if data is null', () => {
      const data = 2;
      const percentile = 0.5;
      const expected = undefined;
      const result = AggregateUtils.percentile(data, 'invalidProp', percentile);
      global.expect(result).toBe(expected);
    });
  });

  global.describe('percentile_n', () => {
    global.it('01th percentile', () => {
      const data = Array.from(new Array(101)).map((v, i) => i);
      const expected = 1;
      const result = AggregateUtils.percentile_01(data);
      global.expect(result).toBe(expected);
    });
    global.it('05th percentile', () => {
      const data = Array.from(new Array(101)).map((v, i) => i);
      const expected = 5;
      const result = AggregateUtils.percentile_05(data);
      global.expect(result).toBe(expected);
    });
    global.it('10th percentile', () => {
      const data = Array.from(new Array(101)).map((v, i) => i);
      const expected = 10;
      const result = AggregateUtils.percentile_10(data);
      global.expect(result).toBe(expected);
    });
    global.it('25th percentile', () => {
      const data = Array.from(new Array(101)).map((v, i) => i);
      const expected = 25;
      const result = AggregateUtils.percentile_25(data);
      global.expect(result).toBe(expected);
    });
    global.it('50th percentile', () => {
      const data = Array.from(new Array(101)).map((v, i) => i);
      const expected = 50;
      const result = AggregateUtils.percentile_50(data);
      global.expect(result).toBe(expected);
    });
    global.it('75th percentile', () => {
      const data = Array.from(new Array(101)).map((v, i) => i);
      const expected = 75;
      const result = AggregateUtils.percentile_75(data);
      global.expect(result).toBe(expected);
    });
    global.it('90th percentile', () => {
      const data = Array.from(new Array(101)).map((v, i) => i);
      const expected = 90;
      const result = AggregateUtils.percentile_90(data);
      global.expect(result).toBe(expected);
    });
    global.it('95th percentile', () => {
      const data = Array.from(new Array(101)).map((v, i) => i);
      const expected = 95;
      const result = AggregateUtils.percentile_95(data);
      global.expect(result).toBe(expected);
    });
    global.it('99th percentile', () => {
      const data = Array.from(new Array(101)).map((v, i) => i);
      const expected = 99;
      const result = AggregateUtils.percentile_99(data);
      global.expect(result).toBe(expected);
    });
  });
});

global.describe('topValues', () => {
  global.describe('gets top values', () => {
    global.it('3 precipitation -> month', () => {
      const collection = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 },
        { id: 3, month: '2021-Nov', precip: 3.94 },
        { id: 4, month: '2021-Dec', precip: 4.13 },
        { id: 5, month: '2022-Jan', precip: 3.58 },
        { id: 6, month: '2022-Feb', precip: 3.62 },
        { id: 8, month: '2022-Mar', precip: 2.56 },
        { id: 7, month: '2022-Apr', precip: 3.98 }
      ];
      const expected = ['2021-Oct', '2021-Dec', '2022-Apr'];
      const results = AggregateUtils.topValues(collection, 3, 'month', '-precip');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('5 precipitation -> month', () => {
      const collection = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 },
        { id: 3, month: '2021-Nov', precip: 3.94 },
        { id: 4, month: '2021-Dec', precip: 4.13 },
        { id: 5, month: '2022-Jan', precip: 3.58 },
        { id: 6, month: '2022-Feb', precip: 3.62 },
        { id: 7, month: '2022-Mar', precip: 3.98 },
        { id: 8, month: '2022-Apr', precip: 2.56 }
      ];
      const expected = ['2021-Oct', '2021-Dec', '2022-Mar', '2021-Nov', '2022-Feb'];
      const results = AggregateUtils.topValues(collection, 5, 'month', '-precip');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('5 precipitation', () => {
      const collection = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 },
        { id: 3, month: '2021-Nov', precip: 3.94 },
        { id: 4, month: '2021-Dec', precip: 4.13 },
        { id: 5, month: '2022-Jan', precip: 3.58 },
        { id: 6, month: '2022-Feb', precip: 3.62 },
        { id: 7, month: '2022-Mar', precip: 3.98 },
        { id: 8, month: '2022-Apr', precip: 2.56 }
      ];
      const expected = [5.31, 4.13, 3.98, 3.94, 3.62];
      const results = AggregateUtils.topValues(collection, 5, 'precip', '-precip');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('3 most recent', () => {
      const collection = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 },
        { id: 3, month: '2021-Nov', precip: 3.94 },
        { id: 4, month: '2021-Dec', precip: 4.13 },
        { id: 5, month: '2022-Jan', precip: 3.58 },
        { id: 6, month: '2022-Feb', precip: 3.62 },
        { id: 7, month: '2022-Mar', precip: 3.98 },
        { id: 8, month: '2022-Apr', precip: 2.56 }
      ];
      const expected = [2.56, 3.98, 3.62];
      const results = AggregateUtils.topValues(collection, 3, 'precip', '-id');
      global.expect(results).toStrictEqual(expected);
    });
  });
  global.describe('gets lowest values', () => {
    global.it('3 lowest', () => {
      const collection = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 },
        { id: 3, month: '2021-Nov', precip: 3.94 },
        { id: 4, month: '2021-Dec', precip: 4.13 },
        { id: 5, month: '2022-Jan', precip: 3.58 },
        { id: 6, month: '2022-Feb', precip: 3.62 },
        { id: 7, month: '2022-Mar', precip: 3.98 },
        { id: 8, month: '2022-Apr', precip: 2.56 }
      ];
      const expected = [0.87, 2.56, 2.68];
      const results = AggregateUtils.topValues(collection, 3, 'precip', 'precip');
      global.expect(results).toStrictEqual(expected);
    });
  });
  global.describe('can use literal values', () => {
    global.it('top 5', () => {
      const collection = [
        2.68,
        0.87,
        5.31,
        3.94,
        4.13,
        3.58,
        3.62,
        3.98,
        2.56
      ];
      const expected = [5.31, 4.13, 3.98, 3.94, 3.62];
      const results = AggregateUtils.topValues(collection, 5);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('top 5 explicit', () => {
      const collection = [
        2.68,
        0.87,
        5.31,
        3.94,
        4.13,
        3.58,
        3.62,
        3.98,
        2.56
      ];
      const expected = [5.31, 4.13, 3.98, 3.94, 3.62];
      const results = AggregateUtils.topValues(collection, 5, null, '-');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('bottom 5', () => {
      const collection = [
        2.68,
        0.87,
        5.31,
        3.94,
        4.13,
        3.58,
        3.62,
        3.98,
        2.56
      ];
      const expected = [0.87, 2.56, 2.68, 3.58, 3.62];
      const results = AggregateUtils.topValues(collection, 5, null, '');
      global.expect(results).toStrictEqual(expected);
    });
  });
  global.describe('does not fail', () => {
    global.it('if the collection is null', () => {
      const collection = null;
      const expected = [];
      const results = AggregateUtils.topValues(collection, 3, 'precip', 'precip');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('if the sort fields are empty on object collections', () => {
      const collection = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 },
        { id: 3, month: '2021-Nov', precip: 3.94 },
        { id: 4, month: '2021-Dec', precip: 4.13 },
        { id: 5, month: '2022-Jan', precip: 3.58 },
        { id: 6, month: '2022-Feb', precip: 3.62 },
        { id: 7, month: '2022-Mar', precip: 3.98 },
        { id: 8, month: '2022-Apr', precip: 2.56 }
      ];
      const expected = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 }
      ];
      const results = AggregateUtils.topValues(collection, 3);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('if the return count is more records than we have', () => {
      const collection = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 },
        { id: 3, month: '2021-Nov', precip: 3.94 },
        { id: 4, month: '2021-Dec', precip: 4.13 },
        { id: 5, month: '2022-Jan', precip: 3.58 },
        { id: 6, month: '2022-Feb', precip: 3.62 },
        { id: 7, month: '2022-Mar', precip: 3.98 },
        { id: 8, month: '2022-Apr', precip: 2.56 }
      ];
      const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const results = AggregateUtils.topValues(collection, 100, 'id', 'id');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('if the return count is negative', () => {
      const collection = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 },
        { id: 3, month: '2021-Nov', precip: 3.94 },
        { id: 4, month: '2021-Dec', precip: 4.13 },
        { id: 5, month: '2022-Jan', precip: 3.58 },
        { id: 6, month: '2022-Feb', precip: 3.62 },
        { id: 7, month: '2022-Mar', precip: 3.98 },
        { id: 8, month: '2022-Apr', precip: 2.56 }
      ];
      const expected = [0, 1, 2, 3, 4, 5, 6];
      const results = AggregateUtils.topValues(collection, -2, 'id', 'id');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('if the return count is 0', () => {
      const collection = [
        { id: 0, month: '2021-Sep', precip: 2.68 },
        { id: 1, month: '2021-Aug', precip: 0.87 },
        { id: 2, month: '2021-Oct', precip: 5.31 },
        { id: 3, month: '2021-Nov', precip: 3.94 },
        { id: 4, month: '2021-Dec', precip: 4.13 },
        { id: 5, month: '2022-Jan', precip: 3.58 },
        { id: 6, month: '2022-Feb', precip: 3.62 },
        { id: 7, month: '2022-Mar', precip: 3.98 },
        { id: 8, month: '2022-Apr', precip: 2.56 }
      ];
      const expected = [];
      const results = AggregateUtils.topValues(collection, 0, 'id', 'id');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('with the default number of values', () => {
      const collection = [
        2.68,
        0.87,
        5.31,
        3.94,
        4.13,
        3.58,
        3.62,
        3.98,
        2.56
      ];
      const expected = [5.31, 4.13, 3.98, 3.94, 3.62];
      const results = AggregateUtils.topValues(collection);
      global.expect(results).toStrictEqual(expected);
    });
  });
});
