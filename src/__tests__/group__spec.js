/* eslint-disable comma-spacing */

const GroupUtils = require('../group');
const SourceMap = require('../SourceMap');

const initializeWeather = () => [
  { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, dateTime: new Date(2020, 7, 1)  , year: 2020 },
  { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68, dateTime: new Date(2021, 3, 1)  , year: 2021 },
  { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31, dateTime: new Date(2020, 11, 1) , year: 2020 },
  { id: 3, city: 'New York', month: 'Apr', precip: 3.94, dateTime: new Date(2021, 3, 1)  , year: 2021 },
  { id: 4, city: 'New York', month: 'Aug', precip: 4.13, dateTime: new Date(2020, 7, 1)  , year: 2020 },
  { id: 5, city: 'New York', month: 'Dec', precip: 3.58, dateTime: new Date(2020, 11, 1) , year: 2020 },
  { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, dateTime: new Date(2021, 3, 1)  , year: 2021 },
  { id: 8, city: 'Chicago',  month: 'Dec', precip: 2.56, dateTime: new Date(2020, 11, 1) , year: 2020 },
  { id: 7, city: 'Chicago',  month: 'Aug', precip: 3.98, dateTime: new Date(2020, 7, 1)  , year: 2020 }
];

global.describe('group', () => {
  global.describe('by', () => {
    global.it('single diension', () => {
      const data = initializeWeather();
      const expected = new SourceMap();
      expected.source = 'city';
      expected.set('Seattle', data.filter((r) => r.city === 'Seattle'));
      expected.set('New York', data.filter((r) => r.city === 'New York'));
      expected.set('Chicago', data.filter((r) => r.city === 'Chicago'));

      const results = GroupUtils.by(data, 'city');

      global.expect(results).toStrictEqual(expected);
    });
    global.it('multiple diension', () => {
      const data = initializeWeather();
      const expected = new SourceMap();
      expected.source = 'city';
      expected.set('Seattle', new SourceMap());
      expected.get('Seattle').source = 'month';
      expected.get('Seattle').set('Aug', data.filter((r) => r.city === 'Seattle' && r.month === 'Aug'));
      expected.get('Seattle').set('Apr', data.filter((r) => r.city === 'Seattle' && r.month === 'Apr'));
      expected.get('Seattle').set('Dec', data.filter((r) => r.city === 'Seattle' && r.month === 'Dec'));
      expected.set('New York', new SourceMap());
      expected.get('New York').source = 'month';
      expected.get('New York').set('Aug', data.filter((r) => r.city === 'New York' && r.month === 'Aug'));
      expected.get('New York').set('Apr', data.filter((r) => r.city === 'New York' && r.month === 'Apr'));
      expected.get('New York').set('Dec', data.filter((r) => r.city === 'New York' && r.month === 'Dec'));
      expected.set('Chicago', new SourceMap());
      expected.get('Chicago').source = 'month';
      expected.get('Chicago').set('Aug', data.filter((r) => r.city === 'Chicago' && r.month === 'Aug'));
      expected.get('Chicago').set('Apr', data.filter((r) => r.city === 'Chicago' && r.month === 'Apr'));
      expected.get('Chicago').set('Dec', data.filter((r) => r.city === 'Chicago' && r.month === 'Dec'));

      const results = GroupUtils.by(data, 'city', 'month');

      global.expect(results).toStrictEqual(expected);
    });
    global.it('groups by dates', () => {
      const data = initializeWeather();
      const expected = new SourceMap();
      expected.source = 'dateTime';
      expected.set('2020-08-01T00:00:00.000Z', data.filter((r) => r.month === 'Aug'));
      expected.set('2021-04-01T00:00:00.000Z', data.filter((r) => r.month === 'Apr'));
      expected.set('2020-12-01T00:00:00.000Z', data.filter((r) => r.month === 'Dec'));

      const results = GroupUtils.by(data, 'dateTime');

      global.expect(JSON.stringify(results)).toBe(JSON.stringify(expected));
      global.expect(results).toEqual(expected);
    });
    global.it('throws an error if the collection is not an array', () => {
      global.expect(() => GroupUtils.by(null, 'cuca')).toThrow();
    });
  });

  global.describe('separateByFields', () => {
    global.it('throws an error if the collection is not an array', () => {
      global.expect(() => GroupUtils.separateByFields(null, 'name')).toThrow();
    });
    global.it('throws an error if no fields are requested', () => {
      global.expect(() => GroupUtils.separateByFields([{ name: 'john' }])).toThrow();
    });
    global.it('separates a series of objects by a single field', () => {
      const data = [{ city: 'Seattle', min: 0.87, max: 5.31 },
        { city: 'New York', min: 3.58, max: 4.13 },
        { city: 'Chicago', min: 2.56, max: 3.98 }];
      const expected = [
        { city: 'Seattle', min: 0.87, max: 5.31, _field: 'min', _value: 0.87 },
        { city: 'New York', min: 3.58, max: 4.13, _field: 'min', _value: 3.58 },
        { city: 'Chicago', min: 2.56, max: 3.98, _field: 'min', _value: 2.56 },
        { city: 'Seattle', min: 0.87, max: 5.31, _field: 'max', _value: 5.31 },
        { city: 'New York', min: 3.58, max: 4.13, _field: 'max', _value: 4.13 },
        { city: 'Chicago', min: 2.56, max: 3.98, _field: 'max', _value: 3.98 }];
      const results = GroupUtils.separateByFields(data, 'min', 'max');
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('rollup', () => {
    global.it('can map reduce 1 level', () => {
      const weather = initializeWeather();
      const expected = new SourceMap();
      expected.source = 'city';
      expected.set('Seattle', 3);
      expected.set('Chicago', 3);
      expected.set('New York', 3);

      const results = GroupUtils.rollup(weather, (r) => r.length, 'city');
      global.expect(results).toEqual(expected);
    });
    global.it('can map reduce 2 levels', () => {
      const weather = initializeWeather();
      const expected = new SourceMap();
      expected.source = 'city';
      const yearMap = new SourceMap();
      yearMap.source = 'year';
      yearMap.set(2020, 2);
      yearMap.set(2021, 1);
      expected.set('Seattle', new SourceMap(yearMap));
      expected.get('Seattle').source = 'year';
      expected.set('Chicago', new SourceMap(yearMap));
      expected.get('Chicago').source = 'year';
      expected.set('New York', new SourceMap(yearMap));
      expected.get('New York').source = 'year';

      const results = GroupUtils.rollup(weather, (r) => r.length, 'city', 'year');
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('index', () => {
    global.it('can index a unique array', () => {
      const weather = initializeWeather();
      const data = [
        [1, { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, dateTime: new Date(2020, 7, 1)  , year: 2020 }],
        [0, { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68, dateTime: new Date(2021, 3, 1)  , year: 2021 }],
        [2, { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31, dateTime: new Date(2020, 11, 1) , year: 2020 }],
        [3, { id: 3, city: 'New York', month: 'Apr', precip: 3.94, dateTime: new Date(2021, 3, 1)  , year: 2021 }],
        [4, { id: 4, city: 'New York', month: 'Aug', precip: 4.13, dateTime: new Date(2020, 7, 1)  , year: 2020 }],
        [5, { id: 5, city: 'New York', month: 'Dec', precip: 3.58, dateTime: new Date(2020, 11, 1) , year: 2020 }],
        [6, { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, dateTime: new Date(2021, 3, 1)  , year: 2021 }],
        [8, { id: 8, city: 'Chicago',  month: 'Dec', precip: 2.56, dateTime: new Date(2020, 11, 1) , year: 2020 }],
        [7, { id: 7, city: 'Chicago',  month: 'Aug', precip: 3.98, dateTime: new Date(2020, 7, 1)  , year: 2020 }]
      ];
      const expected = new Map(data);
      const results = GroupUtils.index(weather, 'id');
      global.expect(
        JSON.stringify(results, SourceMap.stringifyReducer)
      ).toEqual(
        JSON.stringify(expected, SourceMap.stringifyReducer)
      );
      global.expect(results).toEqual(expected);
    });

    global.it('uses an iso string for dates', () => {
      const weather = initializeWeather();
      const data = [
        ['2020-08-01T00:00:00.000Z', { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, dateTime: new Date(2020, 7, 1)  , year: 2020 }],
        ['2021-04-01T00:00:00.000Z', { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68, dateTime: new Date(2021, 3, 1)  , year: 2021 }],
        ['2020-12-01T00:00:00.000Z', { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31, dateTime: new Date(2020, 11, 1) , year: 2020 }]
      ];
      const expected = new Map(data);
      const results = GroupUtils.index(weather.filter((r) => r.city === 'Seattle'), 'dateTime');
      
      global.expect(
        JSON.stringify(results, SourceMap.stringifyReducer)
      ).toEqual(
        JSON.stringify(expected, SourceMap.stringifyReducer)
      );
      global.expect(results).toEqual(expected);
    });

    global.it('throws an error if the collection is not an array', () => {
      try {
        GroupUtils.index({}, 'id');
        global.jest.fail('Exception should be thrown if we are grouping a non array');
      } catch (err) {
        //-- do nothing
      }
    });

    global.it('throws an error if the list is not unique', () => {
      const weather = initializeWeather();
      try {
        GroupUtils.index(weather, 'city');
        global.jest.fail('Exception should be thrown');
      } catch (err) {
        //-- do nothing
      }
    });
  });
});
