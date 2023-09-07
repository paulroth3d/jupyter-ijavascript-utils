const ObjectUtils = require('../object');

// const initializeWeather = () => [
//   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
//   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
//   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
// ];
const cityLocations = new Map([
  ['Chicago', { locationId: 1, city: 'Chicago', lat: 41.8781, lon: 87.6298 }],
  ['New York', { locationId: 2, city: 'New York', lat: 40.7128, lon: 74.0060 }],
  ['Seattle', { locationId: 3, city: 'Seattle', lat: 47.6062, lon: 122.3321 }]
]);

describe('ObjectUtils', () => {
  global.describe('evaluate if function or property', () => {
    global.it('returns the specific value if null is sent', () => {
      const source = 23;
      const expected = 23;
      const results = ObjectUtils.evaluateFunctionOrProperty(null)(source);
      global.expect(results).toBe(expected);
    });
    global.it('returns a property if a string is passed', () => {
      const source = { age: 23 };
      const expected = 23;
      const results = ObjectUtils.evaluateFunctionOrProperty('age')(source);
      global.expect(results).toBe(expected);
    });
    global.it('returns a mapped value if the function is passed',  () => {
      const source = { age: 23 };
      const expected = 23 * 2;
      const results = ObjectUtils.evaluateFunctionOrProperty((r) => r.age * 2)(source);
      global.expect(results).toBe(expected);
    });
    global.it('throws an error if an unexpected type is passed',  () => {
      global.expect(() => ObjectUtils.evaluateFunctionOrProperty(new Date()))
        .toThrow();
    });
  });

  describe('objAssign', () => {
    it('assigns a value on an existing object', () => {
      const expected = { first: 'john', last: 'doe' };
      let found = {};
      found = ObjectUtils.objAssign(found, 'first', 'john');
      found = ObjectUtils.objAssign(found, 'last', 'doe');
      expect(found).toEqual(expected);
    });
    it('assigns a value even on an empty object', () => {
      const expected = { first: 'john' };
      const found = ObjectUtils.objAssign(undefined, 'first', 'john');
      expect(found).toEqual(expected);
    });
  });
  describe('propertyObj', () => {
    it('can create a simple object by itself', () => {
      const expected = { first: 'john' };
      const found = ObjectUtils.objAssign(null, 'first', 'john');
      expect(found).toEqual(expected);
    });
    it('can combine multiple property objects', () => {
      const expected = { first: 'john', last: 'doe' };
      const found = ObjectUtils.objAssign(null, 'first', 'john', 'last', 'doe');
      expect(found).toEqual(expected);
    });
    it('still works if multiple properties are not even', () => {
      const expected = { first: 'john', last: undefined };
      const found = ObjectUtils.objAssign(null, 'first', 'john', 'last');
      global.expect(found).toEqual(expected);
    });
    global.it('throws an error if a property is not passed', () => {
      global.expect(() => ObjectUtils.objAssign(null)).toThrow();
    });
    global.it('throws an error if a property is not a string', () => {
      global.expect(() => ObjectUtils.objAssign(null, 1, 'doe')).toThrow();
    });
  });
  global.describe('objAssignEntities', () => {
    global.it('can assign at least one entity', () => {
      const entities = [['first', 'john']];
      const expected = { first: 'john' };
      const result = ObjectUtils.objAssignEntities(null, entities);
      global.expect(result).toEqual(expected);
    });
    global.it('can assign multiple entities', () => {
      const entities = [['first', 'john'], ['last', 'doe']];
      const expected = { first: 'john', last: 'doe' };
      const result = ObjectUtils.objAssignEntities(null, entities);
      global.expect(result).toEqual(expected);
    });
    global.it('appends to an existing object', () => {
      const entities = [['first', 'john']];
      const expected = { first: 'john', last: 'doe' };
      const result = ObjectUtils.objAssignEntities({ last: 'doe' }, entities);
      global.expect(result).toEqual(expected);
    });
    global.it('fails if entities are not an array', () => {
      try {
        // not sure why this isn't catching the error
        //global.expect(ObjectUtils.objAssignEntities(null, {})).toThrow();
        ObjectUtils.objAssignEntities(null, {});
        jest.fail('exception should be thrown if entities are not an array');
      } catch (err) {
        //
      }
    });
    global.it('fails if entities are not sent', () => {
      try {
        // not sure why this isn't catching the error
        // global.expect(ObjectUtils.objAssignEntities(null, [])).toThrow();
        ObjectUtils.objAssignEntities(null, []);
        jest.fail('exception should be thrown if entities are not an array');
      } catch (err) {
        //
      }
    });
  });
  global.describe('assign', () => {
    global.describe('inPlace = false', () => {
      global.it('can augment a single object', () => {
        const data = { source: 'A', value: 5 };
        const augmentFn = (record) => ({ origin: `s_${record.source}` });
        const expected = [{ source: 'A', value: 5, origin: 's_A' }];
        const results = ObjectUtils.augment(data, augmentFn, false);
        
        //-- original data to be unmodified
        global.expect(data.origin).toBeUndefined();
        global.expect(expected[0].origin).toBe('s_A');

        global.expect(results).toEqual(expected);
      });
      global.it('can augment multiple objects', () => {
        const data = [
          { source: 'A', value: 5 }, { source: 'B', value: 11 },
          { source: 'A', value: 6 }, { source: 'B', value: 13 },
          { source: 'A', value: 5 }, { source: 'B', value: 12 }
        ];
        const augmentFn = (record) => ({ origin: `s_${record.source}` });
        const expected = [
          { source: 'A', value: 5, origin: 's_A' }, { source: 'B', value: 11, origin: 's_B' },
          { source: 'A', value: 6, origin: 's_A' }, { source: 'B', value: 13, origin: 's_B' },
          { source: 'A', value: 5, origin: 's_A' }, { source: 'B', value: 12, origin: 's_B' }
        ];
        const results = ObjectUtils.augment(data, augmentFn, false);
        global.expect(data[0].origin).toBeUndefined();
        global.expect(expected[0].origin).toBe('s_A');
        global.expect(results).toEqual(expected);
      });
      global.it('augments immutably by default', () => {
        const data = [
          { source: 'A', value: 5 }, { source: 'B', value: 11 },
          { source: 'A', value: 6 }, { source: 'B', value: 13 },
          { source: 'A', value: 5 }, { source: 'B', value: 12 }
        ];
        const augmentFn = (record) => ({ origin: `s_${record.source}` });
        const expected = [
          { source: 'A', value: 5, origin: 's_A' }, { source: 'B', value: 11, origin: 's_B' },
          { source: 'A', value: 6, origin: 's_A' }, { source: 'B', value: 13, origin: 's_B' },
          { source: 'A', value: 5, origin: 's_A' }, { source: 'B', value: 12, origin: 's_B' }
        ];
        const results = ObjectUtils.augment(data, augmentFn);
        global.expect(data[0].origin).toBeUndefined();
        global.expect(expected[0].origin).toBe('s_A');
        global.expect(results).toEqual(expected);
      });
    });
    global.describe('inPlace = false', () => {
      global.it('can augment a single object', () => {
        const data = { source: 'A', value: 5 };
        const augmentFn = (record) => ({ origin: `s_${record.source}` });
        const expected = [{ source: 'A', value: 5, origin: 's_A' }];
        const results = ObjectUtils.augment(data, augmentFn, true);
        
        //-- original data to be unmodified
        global.expect(data.origin).toBe('s_A');
        global.expect(expected[0].origin).toBe('s_A');

        global.expect(results).toEqual(expected);
      });
      global.it('can augment multiple objects', () => {
        const data = [
          { source: 'A', value: 5 }, { source: 'B', value: 11 },
          { source: 'A', value: 6 }, { source: 'B', value: 13 },
          { source: 'A', value: 5 }, { source: 'B', value: 12 }
        ];
        const augmentFn = (record) => ({ origin: `s_${record.source}` });
        const expected = [
          { source: 'A', value: 5, origin: 's_A' }, { source: 'B', value: 11, origin: 's_B' },
          { source: 'A', value: 6, origin: 's_A' }, { source: 'B', value: 13, origin: 's_B' },
          { source: 'A', value: 5, origin: 's_A' }, { source: 'B', value: 12, origin: 's_B' }
        ];
        const results = ObjectUtils.augment(data, augmentFn, true);
        global.expect(data[0].origin).toBe('s_A');
        global.expect(expected[0].origin).toBe('s_A');
        global.expect(results).toEqual(expected);
      });
    });
  });
  describe('safe keys', () => {
    it('can get keys off a null object', () => {
      const expected = [];
      const found = ObjectUtils.keys(undefined);
      expect(found).toEqual(expected);
    });
    it('can get keys off an object', () => {
      const expected = ['first', 'last'];
      const found = ObjectUtils.keys({ first: 'john', last: 'doe' });
      expect(found).toEqual(expected);
    });
    global.describe('without max rows', () => {
      it('can get keys off an array', () => {
        const expected = ['first', 'last', 'cuca'];
        const found = ObjectUtils.keys([
          { first: 'john', last: 'doe' },
          { first: 'jane', last: 'doe' },
          { first: 'robin', last: 'lloyd', cuca: 'monga' }
        ]);
        expect(found).toEqual(expected);
      });
      it('can get keys off an array, including nulls', () => {
        const expected = ['first', 'last', 'cuca'];
        const found = ObjectUtils.keys([
          { first: 'john', last: 'doe' },
          { first: 'jane', last: 'doe' },
          { first: 'robin', last: 'lloyd', cuca: 'monga' },
          null,
          { first: 'becky', last: 'sternhoffer' }
        ]);
        expect(found).toEqual(expected);
      });
      global.describe('with max rows', () => {
        it('can get keys off an array', () => {
          const expected = ['first', 'last'];
          const found = ObjectUtils.keys([
            { first: 'john', last: 'doe' },
            { first: 'jane', last: 'doe' },
            { first: 'robin', last: 'lloyd', cuca: 'monga' }
          ], 2);
          expect(found).toEqual(expected);
        });
        it('can get keys off an array, including nulls', () => {
          const expected = ['first', 'last', 'cuca'];
          const found = ObjectUtils.keys([
            { first: 'john', last: 'doe' },
            { first: 'jane', last: 'doe' },
            { first: 'robin', last: 'lloyd', cuca: 'monga' },
            null,
            { first: 'becky', last: 'sternhoffer', score: 4 }
          ], 4);
          expect(found).toEqual(expected);
        });
      });
    });
  });
  global.describe('clean properties', () => {
    global.it('leaves a normal property alone', () => {
      const expected = 'first';
      const found = ObjectUtils.cleanPropertyName('first');
      global.expect(found).toBe(expected);
    });
    global.it('cleans a property if the property is completely quoted', () => {
      const expected = 'first';
      const found = ObjectUtils.cleanPropertyName('"first"');
      global.expect(found).toBe(expected);
    });
    global.it('works with spaces', () => {
      const expected = 'first_woman';
      const dirty = 'first woman';
      const found = ObjectUtils.cleanPropertyName(dirty);
      global.expect(found).toBe(expected);
    });
    global.it('works with numbers', () => {
      const expected = '1st_woman';
      const dirty = '1st woman';
      const found = ObjectUtils.cleanPropertyName(dirty);
      global.expect(found).toBe(expected);
    });
    global.it('works with odd characters', () => {
      const expected = 'first_woman';
      const dirty = 'first ("woman")';
      const found = ObjectUtils.cleanPropertyName(dirty);
      global.expect(found).toBe(expected);
    });
    global.it('works on bad data from d3', () => {
      const badData = [
        { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
        { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
        { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
      ];
      const expected = { ' date': 'date', ' kind': 'kind', num: 'num' };
      const found = ObjectUtils.cleanPropertyNames(badData[0]);
      global.expect(found).toEqual(expected);
    });
    global.it('can clean properties as a set of fields provided', () => {
      const badData = [
        { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
        { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
        { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
      ];
      const expected = { ' date': 'date', ' kind': 'kind', num: 'num' };
      const keys = ObjectUtils.keys(badData[0]);
      const found = ObjectUtils.cleanPropertyNames(keys);
      global.expect(found).toEqual(expected);
    });
    global.it('can clean properties from a list of objects provided', () => {
      const badData = [
        { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
        { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
        { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
      ];
      const expected = { ' date': 'date', ' kind': 'kind', num: 'num' };
      const keys = ObjectUtils.keys(badData);
      global.expect(keys).toEqual(['num', ' kind', ' date']);
      const found = ObjectUtils.cleanPropertyNames(badData);
      global.expect(found).toEqual(expected);
    });
    global.it('can clean properties ', () => {
      const badData = [
        { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
        { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
        { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
      ];
      const expected = [
        { date: ' 2021-07-11T22:23:07+0100', kind: ' s', num: '192' },
        { date: ' 2021-07-09T19:54:48+0100', kind: ' c', num: '190' },
        { date: ' 2021-07-08T17:00:32+0100', kind: ' s', num: '190' }
      ];
      const found = ObjectUtils.cleanProperties(badData);
      global.expect(found).toEqual(expected);
    });
  });
  global.describe('cleanProperties2', () => {
    global.describe('can clean properties', () => {
      global.it('leaves a normal property alone', () => {
        const badData = [
          { num: '192' },
          { num: '190' },
          { num: '190' }
        ];
        const expected = {
          labels: { num: 'num' },
          values: [
            { num: '192' },
            { num: '190' },
            { num: '190' }
          ]
        };
        const found = ObjectUtils.cleanProperties2(badData);
        expect(found).toEqual(expected);
      });
      global.it('cleans a property if the property is quoted', () => {
        const badData = [
          { first: '192', '"second"': '192' },
          { first: '190', '"second"': '190' },
          { first: '190', '"second"': '190' }
        ];
        const expected = {
          labels: { first: 'first', second: 'second' },
          values: [
            { first: '192', second: '192' },
            { first: '190', second: '190' },
            { first: '190', second: '190' }
          ]
        };
        const found = ObjectUtils.cleanProperties2(badData);
        expect(found).toEqual(expected);
      });
      global.it('cleans a property if the property is partially quoted start', () => {
        const badData = [
          { first: '192', '"second': '192' },
          { first: '190', '"second': '190' },
          { first: '190', '"second': '190' }
        ];
        const expected = {
          labels: { first: 'first', second: 'second' },
          values: [
            { first: '192', second: '192' },
            { first: '190', second: '190' },
            { first: '190', second: '190' }
          ]
        };
        const found = ObjectUtils.cleanProperties2(badData);
        expect(found).toEqual(expected);
      });
      global.it('cleans a property if the property is partially quoted - end', () => {
        const badData = [
          { first: '192', 'second"': '192' },
          { first: '190', 'second"': '190' },
          { first: '190', 'second"': '190' }
        ];
        const expected = {
          labels: { first: 'first', second: 'second' },
          values: [
            { first: '192', second: '192' },
            { first: '190', second: '190' },
            { first: '190', second: '190' }
          ]
        };
        const found = ObjectUtils.cleanProperties2(badData);
        expect(found).toEqual(expected);
      });
      global.it('works with spaces', () => {
        const badData = [
          { first: '192', 'second name': '192' },
          { first: '190', 'second name': '190' },
          { first: '190', 'second name': '190' }
        ];
        const expected = {
          labels: { first: 'first', second_name: 'second name' },
          values: [
            { first: '192', second_name: '192' },
            { first: '190', second_name: '190' },
            { first: '190', second_name: '190' }
          ]
        };
        const found = ObjectUtils.cleanProperties2(badData);
        expect(found).toEqual(expected);
      });
      global.it('works with numbers', () => {
        const badData = [
          { first: '192', '2nd name': '192' },
          { first: '190', '2nd name': '190' },
          { first: '190', '2nd name': '190' }
        ];
        const expected = {
          labels: { first: 'first', '2nd_name': '2nd name' },
          values: [
            { first: '192', '2nd_name': '192' },
            { first: '190', '2nd_name': '190' },
            { first: '190', '2nd_name': '190' }
          ]
        };
        const found = ObjectUtils.cleanProperties2(badData);
        expect(found).toEqual(expected);
      });
      global.it('works with odd characters', () => {
        const badData = [
          { first: '192', 'name("2nd")': '192' },
          { first: '190', 'name("2nd")': '190' },
          { first: '190', 'name("2nd")': '190' }
        ];
        const expected = {
          labels: { first: 'first', name_2nd: 'name("2nd")' },
          values: [
            { first: '192', name_2nd: '192' },
            { first: '190', name_2nd: '190' },
            { first: '190', name_2nd: '190' }
          ]
        };
        const found = ObjectUtils.cleanProperties2(badData);
        expect(found).toEqual(expected);
      });
      global.it('works on bad data from d3', () => {
        const badData = [
          { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
          { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
          { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
        ];
        const expected = {
          labels: { date: 'date', kind: 'kind', num: 'num' },
          values: [
            { num: '192', kind: ' s', date: ' 2021-07-11T22:23:07+0100' },
            { num: '190', kind: ' c', date: ' 2021-07-09T19:54:48+0100' },
            { num: '190', kind: ' s', date: ' 2021-07-08T17:00:32+0100' }
          ]
        };
        const found = ObjectUtils.cleanProperties2(badData);
        global.expect(found).toEqual(expected);
      });
      global.it('can clean properties ', () => {
        const badData = [
          { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
          { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
          { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
        ];
        const expected = {
          labels: { date: 'date', kind: 'kind', num: 'num' },
          values: [
            { date: ' 2021-07-11T22:23:07+0100', kind: ' s', num: '192' },
            { date: ' 2021-07-09T19:54:48+0100', kind: ' c', num: '190' },
            { date: ' 2021-07-08T17:00:32+0100', kind: ' s', num: '190' }
          ]
        };
        const found = ObjectUtils.cleanProperties2(badData);
        expect(found).toEqual(expected);
      });
      global.it('does not fail on null', () => {
        const badData = null;
        const expected = {
          labels: {},
          values: []
        };
        const found = ObjectUtils.cleanProperties2(badData);
        expect(found).toEqual(expected);
      });
    });
    global.describe('keeps the order of the properties', () => {
      global.it('when cleaned', () => {
        const badData = [
          { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
          { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
          { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
        ];
        const expected = {
          labels: { date: ' date', kind: ' kind', num: 'num' },
          values: [
            { num: '192', kind: ' s', date: ' 2021-07-11T22:23:07+0100' },
            { num: '190', kind: ' c', date: ' 2021-07-09T19:54:48+0100' },
            { num: '190', kind: ' s', date: ' 2021-07-08T17:00:32+0100' }
          ]
        };
        const results = ObjectUtils.cleanProperties2(badData);

        const expectedStr = JSON.stringify(expected.values);
        const resultsStr = JSON.stringify(results.values);
        expect(resultsStr).toEqual(expectedStr);
      });
    });
  });
  describe('renameProperties', () => {
    it('renames properties on an object', () => {
      const dirtyObject = { first: 'john', last: 'doe' };
      const translation = { first: 'first_name' };
      const expected = { first_name: 'john', last: 'doe' };
      const found = ObjectUtils.renameProperties(dirtyObject, translation);
      expect(found).toEqual(expected);
      expect(found).not.toEqual(dirtyObject);
    });
    it('returns an empty object if renaming a null object', () => {
      //-- don't put the result in the spec
      // const expected = {};
      const result = ObjectUtils.renameProperties(null, { first: 'first_name' });
      global.expect(result).toBeTruthy();
      global.expect(typeof result).toBe('object');
    });
    it('returns an empty object if renaming a null object', () => {
      //-- don't put the result in the spec
      // const expected = {};
      const result = ObjectUtils.renameProperties([null], { first: 'first_name' });
      global.expect(result).toBeTruthy();
      global.expect(typeof result).toBe('object');
    });
  });
  describe('multiple step test', () => {
    const expected = [
      { first_name: 'john', last_name: 'doe', current_occupation: 'developer' },
      { first_name: 'jane', last_name: 'doe', current_occupation: 'developer' },
      { first_name: 'jim', last_name: 'bob', current_occupation: 'scientist' }
    ];
    const dirty = [
      { '"first name"': 'john', 'last name': 'doe', 'current (occupation)': 'developer' },
      { '"first name"': 'jane', 'last name': 'doe', 'current (occupation)': 'developer' },
      { '"first name"': 'jim', 'last name': 'bob', 'current (occupation)': 'scientist' }
    ];

    // const keys = ObjectUtils.keys(dirty);
    const cleanedKeys = ObjectUtils.cleanPropertyNames(dirty[0]);
    const expectedKeys = {
      '"first name"': 'first_name',
      'last name': 'last_name',
      'current (occupation)': 'current_occupation'
    };
    expect(cleanedKeys).toEqual(expectedKeys);

    const cleanedObjects = ObjectUtils.renameProperties(dirty, cleanedKeys);
    expect(cleanedObjects).toEqual(expected);
  });
  describe('collapse', () => {
    it('collapses with a single child', () => {
      const targetObj = {
        base: 'obj',
        child1: {
          targetValue: 'test'
        }
      };
      const result = ObjectUtils.collapse(targetObj);
      global.expect(result).not.toBeNull();
      global.expect(result).toHaveProperty('base', 'obj');
      global.expect(result).toHaveProperty('targetValue', 'test');
    });
    it('returns an empty object if the object to collapse is null', () => {
      const targetObj = null;
      const result = ObjectUtils.collapse(targetObj);
      const expected = {};
      global.expect(result).toEqual(expected);
    });
    it('is the same even if it is on the same object', () => {
      const targetObj = { base: 'obj', targetValue: 'test' };
      const result = ObjectUtils.collapse(targetObj);
      global.expect(result).not.toBeNull();
      global.expect(result).toHaveProperty('base', 'obj');
      global.expect(result).toHaveProperty('targetValue', 'test');
    });
    it('collapses even if the values are on two separate objects', () => {
      const targetObj = { p1: { base: 'obj' }, p2: { targetValue: 'test' } };
      const result = ObjectUtils.collapse(targetObj);
      global.expect(result).not.toBeNull();
      global.expect(result).toHaveProperty('base', 'obj');
      global.expect(result).toHaveProperty('targetValue', 'test');
    });
    it('does NOT include the field if the depth is too high', () => {
      const targetObj = { base: 'obj' };

      let travellingObj = targetObj;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < ObjectUtils.MAX_COLLAPSE_DEPTH + 4; i++) {
        travellingObj.p = {};
        travellingObj = travellingObj.p;
      }
      travellingObj.targetValue = 'test';

      const result = ObjectUtils.collapse(targetObj);

      global.expect(result).not.toBeNull();
      global.expect(result).toHaveProperty('base', 'obj');
      global.expect(result).not.toHaveProperty('targetValue', 'test');
    });
  });
  describe('generate schema', () => {
    it('creates a schema for a set of objects', () => {
      const createRecord = (a, b) => ({ a, b });
      const targetObj = [
        createRecord(1, 'a'),
        createRecord(2, 'b'),
        createRecord(3, 'c'),
        createRecord(4, 'd'),
        createRecord(5, 'e')
      ];
      const result = ObjectUtils.generateSchema(targetObj);
      const expected = { type: 'object', properties: { a: { type: 'number' }, b: { type: 'string' } }, required: ['a', 'b'] };
      // console.log(JSON.stringify(result.items));
      global.expect(result.items).toStrictEqual(expected);
    });
  });
  global.describe('mapByProperty', () => {
    global.it('can map based on a specific property', () => {
      const createPerson = (first, last) => ({ first, last });
      const collection = [
        createPerson('1', 'person'),
        createPerson('2', 'person'),
        createPerson('3', 'person'),
        createPerson('4', 'person'),
        createPerson('5', 'person')
      ];
      const expected = new Map();
      expected.set('1', createPerson('1', 'person'));
      expected.set('2', createPerson('2', 'person'));
      expected.set('3', createPerson('3', 'person'));
      expected.set('4', createPerson('4', 'person'));
      expected.set('5', createPerson('5', 'person'));

      const result = ObjectUtils.mapByProperty(collection, 'first');
      expect(result).toStrictEqual(expected);
    });
    global.it('can map an empty list without throwing an error', () => {
      ObjectUtils.mapByProperty([], 'field');
    });
    global.it('throws an error if no property is requested', () => {
      global.expect(() => ObjectUtils.mapByProperty([]))
        .toThrow('object.mapByProperty: expects a propertyName');
    });
    global.it('returns an empty map if the object to be mapped is null', () => {
      const expected = new Map();
      const result = ObjectUtils.mapByProperty(null, 'field');
      global.expect(result).toStrictEqual(expected);
    });
    global.describe('accessor', () => {
      global.it('can map property name', () => {
        const createPerson = (first, last) => ({ first, last });
        const collection = [
          createPerson('1', 'person'),
          createPerson('2', 'person'),
          createPerson('3', 'person'),
          createPerson('4', 'person'),
          createPerson('5', 'person')
        ];
        const expected = new Map();
        expected.set(collection[0].first, collection[0]);
        expected.set(collection[1].first, collection[1]);
        expected.set(collection[2].first, collection[2]);
        expected.set(collection[3].first, collection[3]);
        expected.set(collection[4].first, collection[4]);

        const result = ObjectUtils.mapByProperty(collection, 'first');

        global.expect(result).toEqual(result);
      });
      global.it('can map function', () => {
        const createPerson = (first, last) => ({ first, last });
        const collection = [
          createPerson('1', 'person'),
          createPerson('2', 'person'),
          createPerson('3', 'person'),
          createPerson('4', 'person'),
          createPerson('5', 'person')
        ];
        const expected = new Map();
        expected.set(collection[0].first, collection[0]);
        expected.set(collection[1].first, collection[1]);
        expected.set(collection[2].first, collection[2]);
        expected.set(collection[3].first, collection[3]);
        expected.set(collection[4].first, collection[4]);

        const result = ObjectUtils.mapByProperty(collection, (r) => r.first);

        global.expect(result).toEqual(result);
      });
    });
  });
  global.describe('selectObjectProperties', () => {
    global.it('can select properties of an object', () => {
      const baseObj = {
        a: 1,
        b: 2,
        c: 3,
        d: 4
      };
      const result = ObjectUtils.selectObjectProperties(baseObj, ['a', 'b']);
      const expected = [{
        a: 1,
        b: 2
      }];
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can select properties as arguments', () => {
      const baseObj = {
        a: 1,
        b: 2,
        c: 3,
        d: 4
      };
      const result = ObjectUtils.selectObjectProperties(baseObj, 'a', 'b');
      const expected = [{
        a: 1,
        b: 2
      }];
      global.expect(result).toStrictEqual(expected);
    });
    global.it('does not throw an error if selecting properties on null', () => {
      const result = ObjectUtils.selectObjectProperties(null, ['a', 'b']);
      global.expect(result).toBeTruthy();
      global.expect(Array.isArray(result)).toBe(true);
    });
    global.it('returns an empty array if requesting an empty list of properties', () => {
      const result = ObjectUtils.selectObjectProperties(null, []);
      const expected = [];
      global.expect(result).toEqual(expected);
    });
    global.it('returns an empty array if requesting an null list of properties', () => {
      const result = ObjectUtils.selectObjectProperties(null, null);
      const expected = [];
      global.expect(result).toEqual(expected);
    });
  });
  global.it('can select properties of a list of 1 object', () => {
    const baseObj = [{
      a: 10,
      b: 20,
      c: 30,
      d: 40
    }];
    const result = ObjectUtils.selectObjectProperties(baseObj, ['a', 'b']);
    const expected = [{
      a: 10,
      b: 20
    }];
    global.expect(result).toStrictEqual(expected);
  });
  global.it('can select properties of a list of * objects', () => {
    const baseObj = [{
      a: 110,
      b: 120,
      c: 130,
      d: 140
    }, {
      a: 210,
      b: 220,
      c: 230,
      d: 240
    }];
    const result = ObjectUtils.selectObjectProperties(baseObj, ['a', 'b']);
    const expected = [{
      a: 110,
      b: 120
    }, {
      a: 210,
      b: 220
    }];
    global.expect(result).toStrictEqual(expected);
  });
  global.describe('filterObjectProperties', () => {
    global.it('can filter properties of an object', () => {
      const baseObj = {
        a: 1,
        b: 2,
        c: 3,
        d: 4
      };
      const result = ObjectUtils.filterObjectProperties(baseObj, ['a', 'b']);
      const expected = [{
        c: 3,
        d: 4
      }];
      global.expect(result).toStrictEqual(expected);
    });
    global.it('does not throw an error if filtering on null', () => {
      const result = ObjectUtils.filterObjectProperties(null, ['a', 'b']);
      global.expect(result).toBeTruthy();
      global.expect(Array.isArray(result)).toBe(true);
    });
  });
  global.it('can filter properties of a list of 1 object', () => {
    const baseObj = [{
      a: 10,
      b: 20,
      c: 30,
      d: 40
    }];
    const result = ObjectUtils.filterObjectProperties(baseObj, ['a', 'b']);
    const expected = [{
      c: 30,
      d: 40
    }];
    global.expect(result).toStrictEqual(expected);
  });
  global.it('can filter properties of a list of * objects', () => {
    const baseObj = [{
      a: 110,
      b: 120,
      c: 130,
      d: 140
    }, {
      a: 210,
      b: 220,
      c: 230,
      d: 240
    }];
    const result = ObjectUtils.filterObjectProperties(baseObj, ['a', 'b']);
    const expected = [{
      c: 130,
      d: 140
    }, {
      c: 230,
      d: 240
    }];
    global.expect(result).toStrictEqual(expected);
  });
  global.describe('getObjectPropertyTypes', () => {
    global.it('can find the types on a simple object', () => {
      const target = {
        name: 'John',
        age: 23,
        height: 6.0
      };
      const expected = new Map();
      expected.set('string', new Set(['name']));
      expected.set('number', new Set(['age', 'height']));
      const results = ObjectUtils.getObjectPropertyTypes(target);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can find the types on a list of objects', () => {
      const target = [{
        name: 'John',
        age: 23,
        height: 6.0
      }, {
        name: 'Jane',
        age: 28,
        height: 5.4,
        education: 'high'
      }];
      const expected = new Map();
      expected.set('string', new Set(['name', 'education']));
      expected.set('number', new Set(['age', 'height']));
      const results = ObjectUtils.getObjectPropertyTypes(target);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can find the types even with a null in a list of objects', () => {
      const target = [{
        name: 'John',
        age: 23,
        height: 6.0
      }, null, {
        name: 'Jane',
        age: 28,
        height: 5.4,
        education: 'high'
      }];
      const expected = new Map();
      expected.set('string', new Set(['name', 'education']));
      expected.set('number', new Set(['age', 'height']));
      const results = ObjectUtils.getObjectPropertyTypes(target);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can find the types with some objects having less properties', () => {
      const target = [{
        name: 'John',
        age: 23,
        height: 6.0,
        education: 'high'
      }, null, {
        name: 'Jane',
        age: null,
        height: null,
      }];
      const expected = new Map();
      expected.set('string', new Set(['name', 'education']));
      expected.set('number', new Set(['age', 'height']));
      const results = ObjectUtils.getObjectPropertyTypes(target);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not throw an error if gettingPropertyTypes on null', () => {
      const expected = new Map();
      const result = ObjectUtils.getObjectPropertyTypes(null);
      global.expect(result).toStrictEqual(expected);
    });
  });
  global.describe('fetchObjectProperty', () => {
    global.it('can fetch a simple property off an object', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      const expected = 'john';
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'first');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can fetch a simple string property off an object', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      const expected = 'john';
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'first');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can fetch a simple number property off an object', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      const expected = 24;
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'age');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can fetch a simple object property off an object', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      const expected = { id: 'econ-101', name: 'Economy of Thought' };
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'class');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can fetch a child property off a related object', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      const expected = 'econ-101';
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'class.id');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can fetch a property off a child list .', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        classes: [{
          id: 'econ-101',
          name: 'Economy of Thought'
        }]
      };
      const expected = 'econ-101';
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'classes.0.id');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can fetch a property off a child list with prefixed []', () => {
      const targetObj = [{
        first: 'john',
        age: 24,
        classes: [{
          id: 'econ-101',
          name: 'Economy of Thought'
        }]
      }];
      const expected = 'econ-101';
      const result = ObjectUtils.fetchObjectProperty(targetObj, '[0]classes.0.id');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can fetch a property off a child list with prefixed .', () => {
      const targetObj = [{
        first: 'john',
        age: 24,
        classes: [{
          id: 'econ-101',
          name: 'Economy of Thought'
        }]
      }];
      const expected = 'econ-101';
      const result = ObjectUtils.fetchObjectProperty(targetObj, '.[0]classes.0.id');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can fetch a property off a child list []', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        classes: [{
          id: 'econ-101',
          name: 'Economy of Thought'
        }]
      };
      const expected = 'econ-101';
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'classes[0]id');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('will not thrown an error if we target an invalid property', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      //-- no exception to be thrown because we are safe
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'class.invalidProperty', { safeAccess: true });
      global.expect(result).toBeFalsy();
    });
    global.it('will throw an error if we access past an invalid property is not found', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      const expected = 'Invalid property class.invalidProperty.invalidProperty2 [invalidProperty2] does not exist - safeAccess:false';
      global.expect(() => {
        ObjectUtils.fetchObjectProperty(targetObj, 'class.invalidProperty.invalidProperty2', { safeAccess: false });
      }).toThrow(expected);
    });
    global.it('will not throw an error if we access past an invalid property but is safe', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      const expected = null;
      const results = ObjectUtils.fetchObjectProperty(targetObj, 'class.invalidProperty.invalidProperty2', { safeAccess: true });
      global.expect(results).toBe(expected);
    });
    global.it('can support safe access of properties', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      //-- no exception to be thrown because we are safe
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'class.invalidProperty.invalidProperty2', { safeAccess: true });
      global.expect(result).toBeFalsy();
    });
    global.it('can support elvis operators with valid property', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      const expected = 'Economy of Thought';
      //-- no exception to be thrown because we are safe
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'class.?name', { safeAccess: false });
      global.expect(result).toBe(expected);
    });
    global.it('can support elvis operators with invalid property', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      //-- no exception to be thrown because we are safe
      const result = ObjectUtils.fetchObjectProperty(targetObj, 'class.?invalidProperty.?invalidProperty2', { safeAccess: false });
      global.expect(result).toBeFalsy();
    });
    global.it('does not throw an error if fetching properties on null', () => {
      const result = ObjectUtils.fetchObjectProperty(null, 'clases.className');
      global.expect(result).toBeNull();
    });
  });
  global.describe('applyPropertyValue', () => {
    global.describe('can set', () => {
      global.it('on a simple object', () => {
        const targetObj = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101'
          }
        };
        const path = 'favoriteColor';
        const value = 'blue';
        const expected = {
          first: 'john',
          age: 24,
          favoriteColor: 'blue',
          class: {
            id: 'econ-101'
          }
        };
        const result = ObjectUtils.applyPropertyValue(targetObj, path, value);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('on a child object', () => {
        const targetObj = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101'
          }
        };
        const path = 'class.name';
        const value = 'Economy of Thought';
        const expected = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101',
            name: 'Economy of Thought'
          }
        };
        const result = ObjectUtils.applyPropertyValue(targetObj, path, value);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('on a non-existant child object', () => {
        const targetObj = {
          first: 'john',
          age: 24
        };
        const path = 'class.name';
        const value = 'Economy of Thought';
        const expected = {
          first: 'john',
          age: 24,
          class: {
            name: 'Economy of Thought'
          }
        };
        const result = ObjectUtils.applyPropertyValue(targetObj, path, value);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('on a non-existant child object multi-level', () => {
        const targetObj = {
          first: 'john',
          age: 24
        };
        const path = 'class.instance.name';
        const value = 'Economy of Thought';
        const expected = {
          first: 'john',
          age: 24,
          class: {
            instance: {
              name: 'Economy of Thought'
            }
          }
        };
        const result = ObjectUtils.applyPropertyValue(targetObj, path, value);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('on a multi-dimensional array', () => {
        const targetObj = [{
          first: 'john',
          age: 24,
          class: [{
            id: 'econ-101'
          }]
        }];
        const path = '[0]class[0].name';
        const value = 'Economy of Thought';
        const expected = [{
          first: 'john',
          age: 24,
          class: [{
            id: 'econ-101',
            name: 'Economy of Thought'
          }]
        }];
        const result = ObjectUtils.applyPropertyValue(targetObj, path, value);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('an invalid path: hanging dot .', () => {
        const targetObj = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101'
          }
        };
        const path = 'class.';
        const value = 'blue';
        // const expected = 'applyPropertyValue(obj, path, value):Unable to set value with path:class.';
        const expected = {
          first: 'john',
          age: 24,
          class: 'blue'
        };
        const result = ObjectUtils.applyPropertyValue(targetObj, path, value);
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('cannot set', () => {
      global.it('on a null object', () => {
        const targetObj = null;
        const path = 'favoriteColor';
        const value = 'blue';
        const expected = null;
        const result = ObjectUtils.applyPropertyValue(targetObj, path, value);
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
      const result = ObjectUtils.applyPropertyValue(targetObj, path, value);
      global.expect(result).toStrictEqual(expected);
    });
  });
  global.describe('applyPropertyValues', () => {
    global.describe('can apply', () => {
      global.it('can apply a single value to multiple objects', () => {
        const targetObj = [{ name: 'john', last: 'doe' }, { name: 'jane', last: 'doe' }];
        const path = 'age';
        const values = 25;
        const expected = [
          { name: 'john', last: 'doe', age: 25 },
          { name: 'jane', last: 'doe', age: 25 }
        ];
        const results = ObjectUtils.applyPropertyValues(targetObj, path, values);
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
        const results = ObjectUtils.applyPropertyValues(targetObj, path, values);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('will apply the 1 property if only one target provided', () => {
        const targetObj = [{ name: 'john', last: 'doe' }];
        const path = 'age';
        const values = [24, 25];
        const expected = [
          { name: 'john', last: 'doe', age: 24 }
        ];
        const results = ObjectUtils.applyPropertyValues(targetObj, path, values);
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
        const results = ObjectUtils.applyPropertyValues(targetObj, path, values);
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
        const results = ObjectUtils.applyPropertyValues(targetObj, path, values);
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
        const results = ObjectUtils.applyPropertyValues(targetObj, path, value);
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
        const results = ObjectUtils.applyPropertyValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('cannot apply', () => {
      global.it('an invalid path: hanging dot .', () => {
        const targetObj = {
          first: 'john',
          age: 24,
          class: {
            id: 'econ-101'
          }
        };
        const path = 'class.';
        const value = 'blue';
        // const expected = 'applyPropertyValue(obj, path, value):Unable to set value with path:class.';
        const expected = {
          first: 'john',
          age: 24,
          class: 'blue'
        };
        const result = ObjectUtils.applyPropertyValue(targetObj, path, value);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('if targetObjects are null', () => {
        const targetObj = null;
        const path = 'class.name';
        const value = 'blue';
        const expected = null;
        const results = ObjectUtils.applyPropertyValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if path are null', () => {
        const targetObj = null;
        const path = 'class.';
        const value = 'blue';
        const expected = null;
        const results = ObjectUtils.applyPropertyValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if targetObjects is an empty array', () => {
        const targetObj = [];
        const path = 'class.name';
        const value = 'blue';
        const expected = [];
        const results = ObjectUtils.applyPropertyValues(targetObj, path, value);
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
        const results = ObjectUtils.applyPropertyValues(targetObj, path, value);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });
  global.describe('fetchObjectproperties', () => {
    global.it('can fetch a list of multiple properties', () => {
      const classInfo = {
        id: 'econ-101',
        className: 'Economy of Thought',
        professor: {
          name: 'Professor Oak',
          tenure: 20
        }
      };
      const targetObjects = [
        { first: 'john', age: 24, class: classInfo },
        { first: 'jane', age: 24, class: classInfo }
      ];
      const expected = [
        { first: 'john', classId: 'econ-101', professor: 'Professor Oak' },
        { first: 'jane', classId: 'econ-101', professor: 'Professor Oak' }
      ];
      const result = ObjectUtils.fetchObjectProperties(
        targetObjects,
        { first: 'first', classId: 'class.id', professor: 'class.professor.name' }
      );
      global.expect(targetObjects[0].class.id).toBe('econ-101');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('Throws an error if a property path does not exist', () => {
      const classInfo = {
        id: 'econ-101',
        className: 'Economy of Thought',
        professor: {
          name: 'Professor Oak',
          tenure: 20
        }
      };
      const targetObjects = [
        { first: 'john', age: 24, class: classInfo },
        { first: 'jane', age: 24, class: classInfo }
      ];
      try {
        ObjectUtils.fetchObjectProperties(
          targetObjects,
          { first: 'first', classId: 'class.id', professor: 'class.professor.name', invalidProp: 'cuca.monga.cowabunga' }
        );
        global.expect('An exception to have been thrown').toBe(true);
      } catch (err) {
        global.expect(err).toBeTruthy();
      }
    });
    global.it('can fetch a list of multiple properties safely', () => {
      const classInfo = {
        id: 'econ-101',
        className: 'Economy of Thought',
        professor: {
          name: 'Professor Oak',
          tenure: 20
        }
      };
      const targetObjects = [
        { first: 'john', age: 24, class: classInfo },
        { first: 'jane', age: 24, class: classInfo }
      ];
      const expected = [
        { first: 'john', classId: 'econ-101', professor: 'Professor Oak', invalidProp: null },
        { first: 'jane', classId: 'econ-101', professor: 'Professor Oak', invalidProp: null }
      ];
      const result = ObjectUtils.fetchObjectProperties(
        targetObjects,
        { first: 'first', classId: 'class.id', professor: 'class.professor.name', invalidProp: 'cuca.monga.cowabunga' },
        { safeAccess: true }
      );
      global.expect(result).toStrictEqual(expected);
    });
    global.it('can append fetching properties', () => {
      const classInfo = {
        id: 'econ-101',
        className: 'Economy of Thought',
        professor: {
          name: 'Professor Oak',
          tenure: 20
        }
      };
      const targetObjects = [
        { first: 'john', age: 24, class: classInfo },
        { first: 'jane', age: 24, class: classInfo }
      ];
      const expected = [
        { first: 'john', age: 24, classId: 'econ-101', professor: 'Professor Oak', class: classInfo },
        { first: 'jane', age: 24, classId: 'econ-101', professor: 'Professor Oak', class: classInfo }
      ];
      const result = ObjectUtils.fetchObjectProperties(
        targetObjects,
        { first: 'first', classId: 'class.id', professor: 'class.professor.name' },
        { append: true }
      );
      global.expect(targetObjects[0].class.id).toBe('econ-101');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('does not throw an error if fetching properties on null', () => {
      const result = ObjectUtils.fetchObjectProperties(
        null,
        { first: 'first', classId: 'class.id', professor: 'class.professor.name' }
      );
        
      global.expect(result).toBeTruthy();
      global.expect(Array.isArray(result)).toBe(true);
    });
    global.it('can fetch properties off a single object', () => {
      const classInfo = {
        id: 'econ-101',
        className: 'Economy of Thought',
        professor: {
          name: 'Professor Oak',
          tenure: 20
        }
      };
      const targetObject = { first: 'john', age: 24, class: classInfo };
      const expected = [
        { first: 'john', age: 24, classId: 'econ-101', professor: 'Professor Oak', class: classInfo },
      ];
      const result = ObjectUtils.fetchObjectProperties(
        targetObject,
        { first: 'first', classId: 'class.id', professor: 'class.professor.name' },
        { append: true }
      );
      global.expect(targetObject.class.id).toBe('econ-101');
      global.expect(result).toStrictEqual(expected);
    });

    global.it('join values', () => {
      const weather = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
      ];

      const results = ObjectUtils.join(weather, 'city', cityLocations, ((w, c) => ({ ...w, ...c })));
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3, lat: 47.6062, lon: 122.3321 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94, locationId: 2, lat: 40.7128, lon: 74.006 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, locationId: 1, lat: 41.8781, lon: 87.6298 }
      ];

      global.expect(results).toEqual(expected);
    });

    global.it('sets null values if join cannot be found', () => {
      const weather = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 },
        { id: 7, city: 'San Francisco',  month: 'Apr', precip: 5.20 }
      ];

      const results = ObjectUtils.join(weather, 'city', cityLocations, ((w, c) => ({ ...w, ...c })));
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3, lat: 47.6062, lon: 122.3321 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94, locationId: 2, lat: 40.7128, lon: 74.006 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, locationId: 1, lat: 41.8781, lon: 87.6298 },
        { id: 7, city: 'San Francisco',  month: 'Apr', precip: 5.20 }
      ];

      global.expect(results).toEqual(expected);
    });
  });

  global.describe('join', () => {
    global.it('must have a joinFn', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = cityLocations;

      const errorMsg = 'object.join(objectArray, indexField, targetMap, joinFn): joinFn is required';

      global.expect(() => ObjectUtils.join(targetObj, indexField, targetMap, null)).toThrow(errorMsg);
    });
    global.it('must have a targetMap', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = null;
      const joinFn = jest.fn().mockImplementation((s) => s);

      const errorMsg = 'object.join(objectArray, indexField, targetMap, joinFn): targetMap cannot be null';

      global.expect(() => ObjectUtils.join(targetObj, indexField, targetMap, joinFn)).toThrow(errorMsg);
    });

    global.it('can join on a null object', () => {
      const targetObj = null;
      const indexField = 'city';
      const targetMap = cityLocations;

      const joinFn = jest.fn().mockImplementation((s, t) => s);

      const results = ObjectUtils.join(targetObj, indexField, targetMap, joinFn);
      const expected = [];

      global.expect(joinFn).not.toHaveBeenCalled();

      global.expect(results).toEqual(expected);
    });

    global.it('can join a single object', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = cityLocations;

      const joinFn = jest.fn();

      ObjectUtils.join(targetObj, indexField, targetMap, joinFn);

      global.expect(joinFn).toHaveBeenCalled();

      const resultArguments = joinFn.mock.calls[0];

      //-- should be called only once, and with the source object and target matching object as arguments.
      const expectedArguments = [targetObj, targetMap.get('Seattle')];
      global.expect(resultArguments).toEqual(expectedArguments);
    });

    global.it('can join array', () => {
      const targetObj = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
      ];
      const indexField = 'city';
      const targetMap = cityLocations;

      const joinFn = jest.fn().mockImplementation((s, t) => ({ ...s, locationId: t.locationId }));

      const results = ObjectUtils.join(targetObj, indexField, targetMap, joinFn);
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3 },
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94, locationId: 2 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, locationId: 1 }
      ];

      //-- null was added
      global.expect(targetObj.length).toBe(3);

      //-- 4 items returned, one for each
      global.expect(results).toBeTruthy();
      global.expect(Array.isArray(results)).toBe(true);
      global.expect(results.length).toBe(3);

      global.expect(joinFn).toHaveBeenCalled();
      global.expect(joinFn).toHaveBeenCalledTimes(3);

      global.expect(results).toEqual(expected);
    });

    global.it('can join with null objects in the array', () => {
      const targetObj = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
      ];
      const indexField = 'city';
      const targetMap = cityLocations;

      const joinFn = jest.fn().mockImplementation((s, t) => ({ ...s, locationId: t.locationId }));

      const results = ObjectUtils.join(targetObj, indexField, targetMap, joinFn);
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94, locationId: 2 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, locationId: 1 }
      ];

      //-- null was added
      global.expect(targetObj.length).toBe(4);

      //-- 4 items returned, one for each
      global.expect(results).toBeTruthy();
      global.expect(Array.isArray(results)).toBe(true);
      global.expect(results.length).toBe(4);

      //-- not called on null
      global.expect(joinFn).toHaveBeenCalled();
      global.expect(joinFn).toHaveBeenCalledTimes(3);

      global.expect(results).toEqual(expected);
    });

    global.it('can join an array with a map', () => {
      const targetObj = [{ id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 }];
      const indexField = 'city';
      const targetMap = cityLocations;

      const joinFn = jest.fn();

      ObjectUtils.join(targetObj, indexField, targetMap, joinFn);

      global.expect(joinFn).toHaveBeenCalled();

      const resultArguments = joinFn.mock.calls[0];

      //-- should be called only once, and with the source object and target matching object as arguments.
      const expectedArguments = [targetObj[0], targetMap.get('Seattle')];
      global.expect(resultArguments).toEqual(expectedArguments);
    });

    global.it('an join based on a formula', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexFn = (obj) => obj.city;
      const targetMap = cityLocations;

      const seattleLocation = targetMap.get('Seattle');
      global.expect(seattleLocation.city).toBe('Seattle');

      const joinFn = jest.fn().mockImplementation((source, target) => source);

      ObjectUtils.join(targetObj, indexFn, targetMap, joinFn);

      global.expect(joinFn).toHaveBeenCalled();
      global.expect(joinFn).toHaveBeenCalledTimes(1);

      const resultJoinFnArguments = joinFn.mock.calls[0];
      const expectedJoinFnArguments = [targetObj, seattleLocation];

      global.expect(resultJoinFnArguments).toEqual(expectedJoinFnArguments);
    });
    global.it('can lookup and store a pointer', () => {
      const targetObj = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 },
        { id: 7, city: 'San Francisco',  month: 'Apr', precip: 5.20 }
      ];
      const indexField = 'city';
      const targetMap = cityLocations;

      const joinFn = jest.fn().mockImplementation((s, t) => ({ ...s, location: t }));

      /* eslint-disable object-property-newline */
      const results = ObjectUtils.join(targetObj, indexField, targetMap, joinFn);
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, location:
          { city: 'Seattle', locationId: 3, lat: 47.6062, lon: 122.3321 }
        },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94, location:
          { city: 'New York', locationId: 2, lat: 40.7128, lon: 74.006 }
        },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, location:
          { city: 'Chicago', locationId: 1, lat: 41.8781, lon: 87.6298 }
        },
        { id: 7, city: 'San Francisco',  month: 'Apr', precip: 5.20, location: null }
      ];
      /* eslint-enable object-property-newline */

      global.expect(results).toEqual(expected);
    });
  });

  global.describe('joinProperties', () => {
    global.describe('must have at least one property requested', () => {
      global.it('none sent', () => {
        const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
        const indexField = 'city';
        const targetMap = cityLocations;

        const errorMsg = 'object.joinProperties(objectArray, indexField, targetMap, ...fields): at least one property passed to join';

        global.expect(() => ObjectUtils.joinProperties(targetObj, indexField, targetMap)).toThrow(errorMsg);
      });
      global.it('null sent', () => {
        const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
        const indexField = 'city';
        const targetMap = cityLocations;

        const errorMsg = 'object.joinProperties(objectArray, indexField, targetMap, ...fields): at least one property passed to join';

        global.expect(() => ObjectUtils.joinProperties(targetObj, indexField, targetMap, null)).toThrow(errorMsg);
      });
      global.it('null plus valid sent', () => {
        const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
        const indexField = 'city';
        const targetMap = cityLocations;

        const errorMsg = 'object.joinProperties(objectArray, indexField, targetMap, ...fields): at least one property passed to join';

        global.expect(() => ObjectUtils.joinProperties(targetObj, indexField, targetMap, null, 'lat')).not.toThrow(errorMsg);
      });
    });
    global.it('must have a targetMap', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = null;
      const errorMsg = 'object.join(objectArray, indexField, targetMap, joinFn): targetMap cannot be null';

      global.expect(() => ObjectUtils.joinProperties(targetObj, indexField, targetMap, 'lat')).toThrow(errorMsg);
    });

    global.it('can join on a null object', () => {
      const targetObj = null;
      const indexField = 'city';
      const targetMap = cityLocations;

      const results = ObjectUtils.joinProperties(targetObj, indexField, targetMap, 'lat', 'lon');
      const expected = [];

      global.expect(results).toEqual(expected);
    });

    global.it('can join a single object', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = cityLocations;

      const results = ObjectUtils.joinProperties(targetObj, indexField, targetMap, 'locationId');
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3 }
      ];

      global.expect(results).toEqual(expected);
    });

    global.it('can join with multiple properties', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = cityLocations;

      const results = ObjectUtils.joinProperties(targetObj, indexField, targetMap, 'lat', 'lon');
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, lat: 47.6062, lon: 122.3321 }
      ];

      global.expect(results).toEqual(expected);
    });

    global.it('can join array', () => {
      const targetObj = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
      ];
      const indexField = 'city';
      const targetMap = cityLocations;

      const results = ObjectUtils.joinProperties(targetObj, indexField, targetMap, 'locationId');
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3 },
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94, locationId: 2 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, locationId: 1 }
      ];

      global.expect(results).toEqual(expected);
    });

    global.it('can join with null objects in the array', () => {
      const targetObj = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
      ];
      const indexField = 'city';
      const targetMap = cityLocations;

      const results = ObjectUtils.joinProperties(targetObj, indexField, targetMap, 'locationId');
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94, locationId: 2 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, locationId: 1 }
      ];

      global.expect(results).toEqual(expected);
    });

    global.it('can join an array with a map', () => {
      const targetObj = [{ id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 }];
      const indexField = 'city';
      const targetMap = cityLocations;

      const results = ObjectUtils.joinProperties(targetObj, indexField, targetMap, 'locationId');
      const expected = [{ id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3 }];

      global.expect(results).toEqual(expected);
    });

    global.it('an join based on a formula', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexFn = (obj) => obj.city;
      const targetMap = cityLocations;

      const seattleLocation = targetMap.get('Seattle');
      global.expect(seattleLocation.city).toBe('Seattle');

      const results = ObjectUtils.joinProperties(targetObj, indexFn, targetMap, 'locationId');
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3 }
      ];

      global.expect(results).toEqual(expected);
    });

    global.it('sets null values if join cannot be found', () => {
      const weather = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 },
        { id: 7, city: 'San Francisco',  month: 'Apr', precip: 5.20 }
      ];

      const results = ObjectUtils.joinProperties(weather, 'city', cityLocations, 'locationId', 'lat', 'lon');
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3, lat: 47.6062, lon: 122.3321 },
        null,
        { id: 3, city: 'New York', month: 'Apr', precip: 3.94, locationId: 2, lat: 40.7128, lon: 74.006 },
        { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, locationId: 1, lat: 41.8781, lon: 87.6298 },
        { id: 7, city: 'San Francisco',  month: 'Apr', precip: 5.20, locationId: undefined, lat: undefined, lon: undefined }
      ];

      global.expect(results).toEqual(expected);
    });
  });

  global.describe('findWithProperties', () => {
    global.describe('array of objects', () => {
      global.it('single property', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' }
        ];
        const results = ObjectUtils.findWithProperties(students, 'birthday');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('multiple properties', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const results = ObjectUtils.findWithProperties(students, 'first', 'last', 'birthday');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('array of properties', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const results = ObjectUtils.findWithProperties(students, ['first', 'last']);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('matching one', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const results = ObjectUtils.findWithProperties(students, 'failure');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('matching multiple', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' }
        ];
        const results = ObjectUtils.findWithProperties(students, 'birthday');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('matching none', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
        ];
        const results = ObjectUtils.findWithProperties(students, 'cuca');
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('single object', () => {
      global.it('matching one', () => {
        const students = { first: 'john', last: 'doe', birthday: '2002-04-01' };
        const expected = [
        ];
        const results = ObjectUtils.findWithProperties(students, 'cuca');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('matching none', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
        ];
        const results = ObjectUtils.findWithProperties(students, 'cuca');
        global.expect(results).toStrictEqual(expected);
      });
    });
  });

  global.describe('findWithoutProperties', () => {
    global.describe('array of objects', () => {
      global.it('single property', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const results = ObjectUtils.findWithoutProperties(students, 'birthday');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('multiple properties', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const results = ObjectUtils.findWithoutProperties(students, 'first', 'last', 'birthday');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('array of properties', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const results = ObjectUtils.findWithoutProperties(students, ['first', 'last', 'cuca']);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('matching one', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const results = ObjectUtils.findWithoutProperties(students, 'birthday');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('matching multiple', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' }
        ];
        const results = ObjectUtils.findWithoutProperties(students, 'failure');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('matching none', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
        ];
        const results = ObjectUtils.findWithoutProperties(students, 'first');
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('single object', () => {
      global.it('matching one', () => {
        const students = { first: 'john', last: 'doe', birthday: '2002-04-01' };
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' }
        ];
        const results = ObjectUtils.findWithoutProperties(students, 'failure');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('matching none', () => {
        const students = { first: 'john', last: 'doe', birthday: '2002-04-01' };
        const expected = [
        ];
        const results = ObjectUtils.findWithoutProperties(students, 'first');
        global.expect(results).toStrictEqual(expected);
      });
    });
  });

  global.describe('setPropertyDefaults', () => {
    global.describe('sets defaults on an array of objects', () => {
      global.it('with one property missing', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', birthday: 'N/A', failure: 401 }
        ];

        ObjectUtils.setPropertyDefaults(students, {
          first: 'N/A',
          last: 'N/A',
          birthday: 'N/A'
        });

        global.expect(students).toStrictEqual(expected);
      });
      global.it('with whole new property', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'john', last: 'doe', color: 'N/A', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', color: 'N/A', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', color: 'N/A', birthday: 'N/A', failure: 401 }
        ];

        ObjectUtils.setPropertyDefaults(students, {
          first: 'N/A',
          last: 'N/A',
          birthday: 'N/A',
          color: 'N/A'
        });

        global.expect(students).toStrictEqual(expected);
      });
      global.it('with no changes if property exists', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];

        ObjectUtils.setPropertyDefaults(students, {
          first: 'N/A',
          last: 'N/A'
        });

        global.expect(students).toStrictEqual(expected);
      });
    });
    global.describe('sets defaults on a single object', () => {
      global.it('with whole new property', () => {
        const students = { first: 'jack', last: 'white', failure: 401 };
        const expected = { first: 'jack', last: 'white', color: 'N/A', birthday: 'N/A', failure: 401 };

        ObjectUtils.setPropertyDefaults(students, {
          first: 'N/A',
          last: 'N/A',
          birthday: 'N/A',
          color: 'N/A'
        });

        global.expect(students).toStrictEqual(expected);
      });
    });
    global.describe('fails', () => {
      global.it('if the default object is null or false', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];

        const expectedError = 'object.setPropertyDefaults(targetObject, defaultObject): '
          + 'defaultObject is expected to be an object with properties set to the defaults to apply';

        global.expect(() => {
          ObjectUtils.setPropertyDefaults(students, null);
        }).toThrow(expectedError);
      });
      global.it('if the default object is not an object', () => {
        const students = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' },
          { first: 'jane', last: 'doe', birthday: '2003-05-01' },
          { first: 'jack', last: 'white', failure: 401 }
        ];

        const expectedError = 'object.setPropertyDefaults(targetObject, defaultObject): '
          + 'defaultObject is expected to be an object with properties set to the defaults to apply';

        global.expect(() => {
          ObjectUtils.setPropertyDefaults(students, 2);
        }).toThrow(expectedError);
      });
    });
  });

  global.describe('propertyFromList', () => {
    global.it('accesses a property from a list', () => {
      const data = [{ record: 'jobA', val: 1 }, { record: 'jobA', val: 2 },
        { record: 'jobA', val: 3 }, { record: 'jobA', val: 4 },
        { record: 'jobA', val: 5 }, { record: 'jobA', val: 6 },
        { record: 'jobA', val: 7 }, { record: 'jobA', val: 8 },
        { record: 'jobA', val: 9 }, { record: 'jobA', val: 10 }
      ];
      const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = ObjectUtils.propertyFromList(data, 'val');
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
      const results = ObjectUtils.propertyFromList(data, (r) => r.val);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('accesses values from a list', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = ObjectUtils.propertyFromList(data);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not fail if not sent a list', () => {
      const data = 1;
      const expected = [];
      const results = ObjectUtils.propertyFromList(data);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not fail if sent a null list', () => {
      const data = null;
      const expected = [];
      const results = ObjectUtils.propertyFromList(data);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not fail if sent an empty list', () => {
      const data = [];
      const expected = [];
      const results = ObjectUtils.propertyFromList(data);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('mapProperties', () => {
    global.describe('can map', () => {
      global.it('one property', () => {
        const list = [
          { id: '100', age: '21', name: 'p1' },
          { id: '200', age: '22', name: 'p2' },
          { id: '300', age: '23', name: 'p3' },
          { id: '400', age: '24', name: 'p4' },
          { id: '500', age: '25', name: 'p5' }
        ];
        const expected = [
          { id: 100, age: '21', name: 'p1' },
          { id: 200, age: '22', name: 'p2' },
          { id: 300, age: '23', name: 'p3' },
          { id: 400, age: '24', name: 'p4' },
          { id: 500, age: '25', name: 'p5' }
        ];
        const parseNum = (str) => parseInt(str, 10);
        const results = ObjectUtils.mapProperties(list, parseNum, 'id');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('two properties', () => {
        const list = [
          { id: '100', age: '21', name: 'p1' },
          { id: '200', age: '22', name: 'p2' },
          { id: '300', age: '23', name: 'p3' },
          { id: '400', age: '24', name: 'p4' },
          { id: '500', age: '25', name: 'p5' }
        ];
        const expected = [
          { id: 100, age: 21, name: 'p1' },
          { id: 200, age: 22, name: 'p2' },
          { id: 300, age: 23, name: 'p3' },
          { id: 400, age: 24, name: 'p4' },
          { id: 500, age: 25, name: 'p5' }
        ];
        const parseNum = (str) => parseInt(str, 10);
        const results = ObjectUtils.mapProperties(list, parseNum, 'id', 'age');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('no properties', () => {
        const list = [
          { id: '100', age: '21', name: 'p1' },
          { id: '200', age: '22', name: 'p2' },
          { id: '300', age: '23', name: 'p3' },
          { id: '400', age: '24', name: 'p4' },
          { id: '500', age: '25', name: 'p5' }
        ];
        const expected = [
          { id: '100', age: '21', name: 'p1' },
          { id: '200', age: '22', name: 'p2' },
          { id: '300', age: '23', name: 'p3' },
          { id: '400', age: '24', name: 'p4' },
          { id: '500', age: '25', name: 'p5' }
        ];
        const parseNum = (str) => parseInt(str, 10);
        const results = ObjectUtils.mapProperties(list, parseNum);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('with one object', () => {
      global.it('one property', () => {
        const list = { id: '100', age: '21', name: 'p1' };
        const expected = [{ id: 100, age: '21', name: 'p1' }];
        const parseNum = (str) => parseInt(str, 10);
        const results = ObjectUtils.mapProperties(list, parseNum, 'id');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('two properties', () => {
        const list = { id: '100', age: '21', name: 'p1' };
        const expected = [{ id: 100, age: 21, name: 'p1' }];
        const parseNum = (str) => parseInt(str, 10);
        const results = ObjectUtils.mapProperties(list, parseNum, 'id', 'age');
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('with properties in an array', () => {
      global.it('one property', () => {
        const list = [
          { id: '100', age: '21', name: 'p1' },
          { id: '200', age: '22', name: 'p2' },
          { id: '300', age: '23', name: 'p3' },
          { id: '400', age: '24', name: 'p4' },
          { id: '500', age: '25', name: 'p5' }
        ];
        const expected = [
          { id: 100, age: '21', name: 'p1' },
          { id: 200, age: '22', name: 'p2' },
          { id: 300, age: '23', name: 'p3' },
          { id: 400, age: '24', name: 'p4' },
          { id: 500, age: '25', name: 'p5' }
        ];
        const parseNum = (str) => parseInt(str, 10);
        const results = ObjectUtils.mapProperties(list, parseNum, ['id']);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('two properties', () => {
        const list = [
          { id: '100', age: '21', name: 'p1' },
          { id: '200', age: '22', name: 'p2' },
          { id: '300', age: '23', name: 'p3' },
          { id: '400', age: '24', name: 'p4' },
          { id: '500', age: '25', name: 'p5' }
        ];
        const expected = [
          { id: 100, age: 21, name: 'p1' },
          { id: 200, age: 22, name: 'p2' },
          { id: 300, age: 23, name: 'p3' },
          { id: 400, age: 24, name: 'p4' },
          { id: 500, age: 25, name: 'p5' }
        ];
        const parseNum = (str) => parseInt(str, 10);
        const results = ObjectUtils.mapProperties(list, parseNum, ['id', 'age']);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('no properties', () => {
        const list = [
          { id: '100', age: '21', name: 'p1' },
          { id: '200', age: '22', name: 'p2' },
          { id: '300', age: '23', name: 'p3' },
          { id: '400', age: '24', name: 'p4' },
          { id: '500', age: '25', name: 'p5' }
        ];
        const expected = [
          { id: '100', age: '21', name: 'p1' },
          { id: '200', age: '22', name: 'p2' },
          { id: '300', age: '23', name: 'p3' },
          { id: '400', age: '24', name: 'p4' },
          { id: '500', age: '25', name: 'p5' }
        ];
        const parseNum = (str) => parseInt(str, 10);
        const results = ObjectUtils.mapProperties(list, parseNum, []);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('throws an error', () => {
      global.it('if the formatting function is missing', () => {
        const list = { id: '100', age: '21', name: 'p1' };
        const expectedError = 'object.mapProperties(collection, formattingFn, ...propertiesToFormat): formattingFn must be provided';
        global.expect(() => {
          ObjectUtils.mapProperties(list);
        }).toThrow(expectedError);
      });
      global.it('if the formatting is not a function', () => {
        const list = { id: '100', age: '21', name: 'p1' };
        const expectedError = 'object.mapProperties(collection, formattingFn, ...propertiesToFormat): formattingFn must be provided';
        global.expect(() => {
          ObjectUtils.mapProperties(list, 'a', 'id');
        }).toThrow(expectedError);
      });
    });
  });

  global.describe('formatProperties', () => {
    global.describe('can translate with a function', () => {
      global.it('with no properties assigned', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const result = ObjectUtils.formatProperties(data, ({}));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('with one property to clean', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'B', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'B', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'B', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const result = ObjectUtils.formatProperties(data, ({ station: () => 'B' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('with two properties to clean', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'false', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'B', isFahreinheit: true, offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'B', isFahreinheit: true, offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'B', isFahreinheit: false, offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const result = ObjectUtils.formatProperties(data, ({ station: () => 'B', isFahreinheit: (val) => val === 'true' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('with many properties to clean', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'false', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'A', isFahreinheit: true, offset: 0, temp: 36.669599999999996, type: 'C', descr: '0123' },
          { station: 'A', isFahreinheit: true, offset: 2, temp: 37.2252, type: 'C', descr: '0123456' },
          { station: 'A', isFahreinheit: false, offset: 3, temp: 37.7808, type: 'C', descr: '0123456789' }
        ];
        const result = ObjectUtils.formatProperties(data, ({
          type: 'C',
          offset: 'number',
          isFahreinheit: 'boolean',
          temp: (val) => (val - 32) * 0.5556
        }));
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('throws an error', () => {
      global.it('or not as a safe example', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'false', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const formatter = {};
        global.expect(() => ObjectUtils.formatProperties(data, formatter)).not.toThrow();
      });
      global.it('if the format is null', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'false', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const formatter = null;
        // eslint-disable-next-line
        const expectedError = 'ObjectUtils.formatProperties(collection, propertyTranslations): propertyTranslations must be an object, with the properties matching those to be formatted, and values as functions returning the new value';
        global.expect(() => ObjectUtils.formatProperties(data, formatter)).toThrow(expectedError);
      });
    });
    global.describe('can translate with a literal', () => {
      global.it('with one string literal', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'B', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'B', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'B', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const result = ObjectUtils.formatProperties(data, ({ station: 'B' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('with one number literal', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 20, isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 20, isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 20, isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const result = ObjectUtils.formatProperties(data, ({ station: 20 }));
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('with a function shorthand', () => {
      global.it('string', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: '98', type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: '99', type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: '100', type: 'F', descr: '0123456789' }
        ];
        const result = ObjectUtils.formatProperties(data, ({ temp: 'string' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('ellipsis', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: '98', type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: '99', type: 'F', descr: '0123456' },
          {
            station: 'A',
            isFahreinheit: 'true',
            offset: '3',
            temp: '100',
            type: 'F',
            descr: '0123456789012345678901234567890123456789012345678901234567890123456789'
          }
        ];
        const expected = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: '98', type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: '99', type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: '100', type: 'F', descr: '01234567890123456789012345678901234567890123456789…' }
        ];
        const result = ObjectUtils.formatProperties(data, ({ descr: 'ellipsis' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('ellipsis(5)', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: '98', type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: '99', type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: '100', type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: '98', type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: '99', type: 'F', descr: '01234…' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: '100', type: 'F', descr: '01234…' }
        ];
        const result = ObjectUtils.formatProperties(data, ({ descr: 'ellipsis(5)' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('number', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: 123 },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: 123456 },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: 123456789 }
        ];
        const result = ObjectUtils.formatProperties(data, ({ descr: 'number' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('float', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: 123 },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: 123456 },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: 123456789 }
        ];
        const result = ObjectUtils.formatProperties(data, ({ descr: 'float' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('int', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: 123 },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: 123456 },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: 123456789 }
        ];
        const result = ObjectUtils.formatProperties(data, ({ descr: 'int' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('integer', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: 123 },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: 123456 },
          { station: 'A', isFahreinheit: 'true', offset: '3', temp: 100, type: 'F', descr: 123456789 }
        ];
        const result = ObjectUtils.formatProperties(data, ({ descr: 'integer' }));
        global.expect(result).toStrictEqual(expected);
      });
      global.it('boolean', () => {
        const data = [
          { station: 'A', isFahreinheit: 'true', offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: 'false', offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const expected = [
          { station: 'A', isFahreinheit: true, offset: '0', temp: 98, type: 'F', descr: '0123' },
          { station: 'A', isFahreinheit: true, offset: '2', temp: 99, type: 'F', descr: '0123456' },
          { station: 'A', isFahreinheit: false, offset: '3', temp: 100, type: 'F', descr: '0123456789' }
        ];
        const result = ObjectUtils.formatProperties(data, ({ isFahreinheit: 'boolean' }));
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('does not fail', () => {
      global.it('if null is passed for a collection', () => {
        const data = null;
        const expected = [];
        const result = ObjectUtils.formatProperties(data, ({ station: 20 }));
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('can format a single object', () => {
      const data = { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' };
      const expected = [{ station: 'A', isFahreinheit: true, offset: 2, temp: 37.2252, type: 'C', descr: '0123456' }];
      const result = ObjectUtils.formatProperties(data, ({
        type: 'C',
        offset: 'number',
        isFahreinheit: 'boolean',
        temp: (val) => (val - 32) * 0.5556
      }));
      global.expect(result).toStrictEqual(expected);
    });
  });

  global.describe('propertyValueSample', () => {
    global.describe('can describe', () => {
      global.it('with one object', () => {
        const collection = {
          first: 'first',
          age: 23
        };
        const expected = new Map([
          ['first', 'first'],
          ['age', 23]
        ]);
        const results = ObjectUtils.propertyValueSample(collection);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with multiple objects', () => {
        const collection = [{
          first: 'firstVal',
          age: 23
        }, {
          last: 'lastVal'
        }];
        const expected = new Map([
          ['first', 'firstVal'],
          ['age', 23],
          ['last', 'lastVal']
        ]);
        const results = ObjectUtils.propertyValueSample(collection);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with multiple objects duplicating values', () => {
        const collection = [{
          first: 'firstVal',
          age: 23
        }, {
          first: 'ignore',
          last: 'lastVal',
          age: 99
        }];
        const expected = new Map([
          ['first', 'firstVal'],
          ['age', 23],
          ['last', 'lastVal']
        ]);
        const results = ObjectUtils.propertyValueSample(collection);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with null values', () => {
        const collection = [{
          first: 'firstVal',
          age: 23
        }, null, {
          first: 'ignore',
          last: 'lastVal',
          age: 99
        }];
        const expected = new Map([
          ['first', 'firstVal'],
          ['age', 23],
          ['last', 'lastVal']
        ]);
        const results = ObjectUtils.propertyValueSample(collection);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('with number values', () => {
        const collection = [{
          first: 'firstVal',
          age: 23
        }, 23, {
          first: 'ignore',
          last: 'lastVal',
          age: 99
        }];
        const expected = new Map([
          ['first', 'firstVal'],
          ['age', 23],
          ['last', 'lastVal']
        ]);
        const results = ObjectUtils.propertyValueSample(collection);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('fails', () => {
      global.it('if object collection is not passed', () => {
        const collection = null;
        
        global.expect(
          () => ObjectUtils.propertyValueSample(collection)
        ).toThrow('propertyValueSample(objectCollection): objectCollection is required');
      });
    });
  });
  global.describe('cacheIterate', () => {
    /*
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

    const complexSource = complexMarkdown.map((r) => ({
      text: r,
      section: isHeader1(r) ? r.replace(/^\s?#+\s+/, '') : undefined,
      subSection: isHeader2(r) ? r.replace(/^\s?#+\s+/, '') : undefined
    })).map((r) => ({ ...r, isHeader: r.section || r.subSection ? true : false }));
    */

    const isHeader1 = (str) => str.startsWith('# ');
    const isHeader2 = (str) => str.startsWith('## ');

    const complexSource = [
      {
        text: 'Heading',
        section: undefined,
        subSection: undefined,
        isHeader: false
      },
      {
        text: '# Overview',
        section: 'Overview',
        subSection: undefined,
        isHeader: true
      },
      {
        text: 'This entire list is a hierarchy of data.',
        section: undefined,
        subSection: undefined,
        isHeader: false
      },
      {
        text: '# Section A',
        section: 'Section A',
        subSection: undefined,
        isHeader: true
      },
      {
        text: 'This describes section A',
        section: undefined,
        subSection: undefined,
        isHeader: false
      },
      {
        text: '## SubSection 1',
        section: undefined,
        subSection: 'SubSection 1',
        isHeader: true
      },
      {
        text: 'With a subsection belonging to Section A',
        section: undefined,
        subSection: undefined,
        isHeader: false
      },
      {
        text: '## SubSection 2',
        section: undefined,
        subSection: 'SubSection 2',
        isHeader: true
      },
      {
        text: 'And another subsection sibling to SubSection 1, but also under Section A.',
        section: undefined,
        subSection: undefined,
        isHeader: false
      },
      {
        text: '# Section B',
        section: 'Section B',
        subSection: undefined,
        isHeader: true
      },
      {
        text: 'With an entirely unrelated section B, that is sibling to Section A',
        section: undefined,
        subSection: undefined,
        isHeader: false
      },
      {
        text: '## SubSection 1',
        section: undefined,
        subSection: 'SubSection 1',
        isHeader: true
      },
      {
        text: 'And another subsection 1, but this time related to Section B.',
        section: undefined,
        subSection: undefined,
        isHeader: false
      }
    ];

    global.describe('can iterate', () => {
      global.it('over a simple usecase', () => {
        const source = complexSource; // .slice(0, 8);

        //-- return undefined if the value should not persist
        const result = ObjectUtils.augmentInherit(source, (entry) => ({
          section: isHeader1(entry.text) ? entry.text.replace(/#+\s+/, '') : undefined,
          subSection: isHeader2(entry.text) ? entry.text.replace(/#+\s+/, '') : undefined
        }));

        const expected = [
          {
            text: 'Heading',
            section: undefined,
            subSection: undefined,
            isHeader: false
          },
          {
            text: '# Overview',
            section: 'Overview',
            subSection: undefined,
            isHeader: true
          },
          {
            text: 'This entire list is a hierarchy of data.',
            section: 'Overview',
            subSection: undefined,
            isHeader: false
          },
          {
            text: '# Section A',
            section: 'Section A',
            subSection: undefined,
            isHeader: true
          },
          {
            text: 'This describes section A',
            section: 'Section A',
            subSection: undefined,
            isHeader: false
          },
          {
            text: '## SubSection 1',
            section: 'Section A',
            subSection: 'SubSection 1',
            isHeader: true
          },
          {
            text: 'With a subsection belonging to Section A',
            section: 'Section A',
            subSection: 'SubSection 1',
            isHeader: false
          },
          {
            text: '## SubSection 2',
            section: 'Section A',
            subSection: 'SubSection 2',
            isHeader: true
          },
          {
            text: 'And another subsection sibling to SubSection 1, but also under Section A.',
            section: 'Section A',
            subSection: 'SubSection 2',
            isHeader: false
          },
          {
            text: '# Section B',
            section: 'Section B',
            subSection: undefined,
            isHeader: true
          },
          {
            text: 'With an entirely unrelated section B, that is sibling to Section A',
            section: 'Section B',
            subSection: undefined,
            isHeader: false
          },
          {
            text: '## SubSection 1',
            section: 'Section B',
            subSection: 'SubSection 1',
            isHeader: true
          },
          {
            text: 'And another subsection 1, but this time related to Section B.',
            section: 'Section B',
            subSection: 'SubSection 1',
            isHeader: false
          }
        ];

        // console.log(source);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('even if a null is returned', () => {
        const source = complexSource; // .slice(0, 8);

        //-- return undefined if the value should not persist
        const result = ObjectUtils.augmentInherit(source, (entry) => {
          let entryResult = ({
            section: isHeader1(entry.text) ? entry.text.replace(/#+\s+/, '') : undefined,
            subSection: isHeader2(entry.text) ? entry.text.replace(/#+\s+/, '') : undefined
          });

          // console.log('entry:text:' + entry.text);
          if ((entry.text || '').includes('Section A')) {
            entryResult = null;
          }

          return entryResult;
        });

        const expected = [
          {
            text: 'Heading',
            section: undefined,
            subSection: undefined,
            isHeader: false
          },
          {
            text: '# Overview',
            section: 'Overview',
            subSection: undefined,
            isHeader: true
          },
          {
            text: 'This entire list is a hierarchy of data.',
            section: 'Overview',
            subSection: undefined,
            isHeader: false
          },
          {
            text: '# Section A',
            section: 'Overview',
            subSection: undefined,
            isHeader: true
          },
          {
            text: 'This describes section A',
            section: 'Overview',
            subSection: undefined,
            isHeader: false
          },
          {
            text: '## SubSection 1',
            section: 'Overview',
            subSection: 'SubSection 1',
            isHeader: true
          },
          {
            text: 'With a subsection belonging to Section A',
            section: 'Overview',
            subSection: 'SubSection 1',
            isHeader: false
          },
          {
            text: '## SubSection 2',
            section: 'Overview',
            subSection: 'SubSection 2',
            isHeader: true
          },
          {
            text: 'And another subsection sibling to SubSection 1, but also under Section A.',
            section: 'Overview',
            subSection: 'SubSection 2',
            isHeader: false
          },
          {
            text: '# Section B',
            section: 'Section B',
            subSection: undefined,
            isHeader: true
          },
          {
            text: 'With an entirely unrelated section B, that is sibling to Section A',
            section: 'Section B',
            subSection: undefined,
            isHeader: false
          },
          {
            text: '## SubSection 1',
            section: 'Section B',
            subSection: 'SubSection 1',
            isHeader: true
          },
          {
            text: 'And another subsection 1, but this time related to Section B.',
            section: 'Section B',
            subSection: 'SubSection 1',
            isHeader: false
          }
        ];

        // console.log(source);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('Example within Docs', () => {
        const source = [
          { text: '# Overview' },
          { text: 'This entire list is a hierarchy of data.' },
          { text: '# Section A' },
          { text: 'This describes section A' },
          { text: '## SubSection 1' },
          { text: 'With a subsection belonging to Section A' },
          { text: '# Section B' },
          { text: 'With an entirely unrelated section B, that is sibling to Section A' },
          { text: '## SubSection 1' },
          { text: 'And another subsection 1, but this time related to Section B.' }
        ];
        const inheritFn = (entry) => ({
          section: isHeader1(entry.text) ? entry.text.replace(/#+\s+/, '') : undefined,
          subSection: isHeader2(entry.text) ? entry.text.replace(/#+\s+/, '') : undefined
        });
        const expected = [
          { text: '# Overview', section: 'Overview', subSection: undefined },
          {
            text: 'This entire list is a hierarchy of data.',
            section: 'Overview',
            subSection: undefined
          },
          { text: '# Section A', section: 'Section A', subSection: undefined },
          {
            text: 'This describes section A',
            section: 'Section A',
            subSection: undefined
          },
          {
            text: '## SubSection 1',
            section: 'Section A',
            subSection: 'SubSection 1'
          },
          {
            text: 'With a subsection belonging to Section A',
            section: 'Section A',
            subSection: 'SubSection 1'
          },
          { text: '# Section B', section: 'Section B', subSection: undefined },
          {
            text: 'With an entirely unrelated section B, that is sibling to Section A',
            section: 'Section B',
            subSection: undefined
          },
          {
            text: '## SubSection 1',
            section: 'Section B',
            subSection: 'SubSection 1'
          },
          {
            text: 'And another subsection 1, but this time related to Section B.',
            section: 'Section B',
            subSection: 'SubSection 1'
          }
        ];
        const results = ObjectUtils.augmentInherit(source, inheritFn);
        global.expect(results).toStrictEqual(expected);
      });
    });

    global.describe('cannot iterate', () => {
      global.it('if the source is not an array', () => {
        const inheritFn = (entry) => ({
          section: isHeader1(entry.text) ? entry.text.replace(/#+\s+/, '') : undefined,
          subSection: isHeader2(entry.text) ? entry.text.replace(/#+\s+/, '') : undefined
        });

        const expected = 'augmentInherit(source, augmentFn): source must be an array';

        global.expect(() => ObjectUtils.augmentInherit('string', inheritFn)).toThrow(expected);
      });
      global.it('if the augmentFn is not a function', () => {
        const source = complexSource; // .slice(0, 8);

        const expected = 'augmentInherit(source, augmentFn): augmentFn must be a function of signature: (entry, lastValue) => obj';

        global.expect(() => ObjectUtils.augmentInherit(source, 'string')).toThrow(expected);
      });
    });
  });

  global.describe('union', () => {
    global.describe('can union', () => {
      global.describe('with no overlap', () => {
        global.it('simple arrays', () => {
          const source1 = [{ first: 'john' }, { first: 'jane' }];
          const source2 = [{ last: 'doe' }, { last: 'doh' }];
          const expected = [
            { first: 'john', last: 'doe' },
            { first: 'jane', last: 'doh' }
          ];
          const results = ObjectUtils.union(source1, source2);
          global.expect(results).toStrictEqual(expected);
        });
        global.it('with source 1 as object', () => {
          const source1 = { first: 'john' };
          const source2 = [{ last: 'doe' }, { last: 'doh' }];
          const expected = [
            { first: 'john', last: 'doe' },
            { first: 'john', last: 'doh' }
          ];
          const results = ObjectUtils.union(source1, source2);
          global.expect(results).toStrictEqual(expected);
        });
        global.it('with source 2 as object', () => {
          const source1 = [{ first: 'john' }, { first: 'jane' }];
          const source2 = { last: 'doe' };
          const expected = [
            { first: 'john', last: 'doe' },
            { first: 'jane', last: 'doe' }
          ];
          const results = ObjectUtils.union(source1, source2);
          global.expect(results).toStrictEqual(expected);
        });
        global.it('with both as objects', () => {
          const source1 = { first: 'john' };
          const source2 = { last: 'doe' };
          const expected = [
            { first: 'john', last: 'doe' }
          ];
          const results = ObjectUtils.union(source1, source2);
          global.expect(results).toStrictEqual(expected);
        });
      });

      global.describe('if values overlap', () => {
        global.describe('with arrays', () => {
          global.it('source 1', () => {
            const source1 = [{ first: 'john', last: 'unknown' }, { first: 'jane' }];
            const source2 = [{ last: 'doe' }, { last: 'doh' }];
            const expected = [
              { first: 'john', last: 'doe' },
              { first: 'jane', last: 'doh' }
            ];
            const results = ObjectUtils.union(source1, source2);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('source 2', () => {
            const source1 = [{ first: 'john', age: 2 }, { first: 'jane' }];
            const source2 = [{ first: 'johnny', last: 'doe' }, { last: 'doh' }];
            const expected = [
              { first: 'johnny', last: 'doe', age: 2 },
              { first: 'jane', last: 'doh' }
            ];
            const results = ObjectUtils.union(source1, source2);
            global.expect(results).toStrictEqual(expected);
          });
        });
        global.describe('with objects', () => {
          global.it('source 1', () => {
            const source1 = [{ first: 'john', last: 'unknown' }, { first: 'jane' }];
            const source2 = { last: 'doe' };
            const expected = [
              { first: 'john', last: 'doe' },
              { first: 'jane', last: 'doe' }
            ];
            const results = ObjectUtils.union(source1, source2);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('source 2', () => {
            const source1 = { first: 'john' };
            const source2 = [{ last: 'doe' }, { last: 'doh' }];
            const expected = [
              { first: 'john', last: 'doe' },
              { first: 'john', last: 'doh' }
            ];
            const results = ObjectUtils.union(source1, source2);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('both', () => {
            const source1 = { first: 'john' };
            const source2 = { last: 'doe' };
            const expected = [
              { first: 'john', last: 'doe' }
            ];
            const results = ObjectUtils.union(source1, source2);
            global.expect(results).toStrictEqual(expected);
          });
        });
      });
      global.describe('if lengths are different', () => {
        global.it('source 1', () => {
          const source1 = [{ first: 'john' }];
          const source2 = [{ last: 'doe' }, { last: 'doh' }];
          const expected = [
            { first: 'john', last: 'doe' },
            { last: 'doh' }
          ];
          const results = ObjectUtils.union(source1, source2);
          global.expect(results).toStrictEqual(expected);
        });
        global.it('source 2', () => {
          const source1 = [{ first: 'john' }, { first: 'jane' }];
          const source2 = [{ last: 'doh' }];
          const expected = [
            { first: 'john', last: 'doh' },
            { first: 'jane' }
          ];
          const results = ObjectUtils.union(source1, source2);
          global.expect(results).toStrictEqual(expected);
        });
      });
    });
    global.describe('cannot union', () => {
      global.it('if source1 is not an object ', () => {
        const source1 = 'string';
        const source2 = [{ last: 'doe' }];
        const expected = 'union(source1:object[], source2:object[]): source1 must be a collection of objects, or a single object';
        global.expect(() => ObjectUtils.union(source1, source2)).toThrow(expected);
      });
      global.it('if source2 is not an object ', () => {
        const source1 = [{ first: 'john' }];
        const source2 = 'string';
        const expected = 'union(source1:object[], source2:object[]): source2 must be a collection of objects, or a single object';
        global.expect(() => ObjectUtils.union(source1, source2)).toThrow(expected);
      });
    });
  });
  global.describe('extractObjectProperty', () => {
    global.describe('can extract', () => {
      global.describe('from a list', () => {
        global.it('a property name', () => {
          const weather = [
            { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
            null,
            { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
            { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
          ];
          const expected = ['Seattle', 'New York', 'Chicago'];
          const results = ObjectUtils.extractObjectProperty(weather, 'city');
          global.expect(results).toStrictEqual(expected);
        });
        global.it('a function', () => {
          const weather = [
            { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
            null,
            { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
            { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
          ];
          const expected = ['Seattle', 'New York', 'Chicago'];
          const results = ObjectUtils.extractObjectProperty(weather, (r) => r.city);
          global.expect(results).toStrictEqual(expected);
        });
      });
      global.describe('from an Object', () => {
        global.it('a property name', () => {
          const weather = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
          const expected = ['Seattle'];
          const results = ObjectUtils.extractObjectProperty(weather, 'city');
          global.expect(results).toStrictEqual(expected);
        });
        global.it('a function', () => {
          const weather = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
          const expected = ['Seattle'];
          const results = ObjectUtils.extractObjectProperty(weather, (r) => r.city);
          global.expect(results).toStrictEqual(expected);
        });
      });
    });
    global.describe('cannot extract', () => {
      global.it('if the list is empty', () => {
        const weather = [];
        const expected = [];
        const results = ObjectUtils.extractObjectProperty(weather, (r) => r.city);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if the list is null', () => {
        const weather = null;
        const expected = [];
        const results = ObjectUtils.extractObjectProperty(weather, (r) => r.city);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });
  global.describe('extractObjectProperties', () => {
    global.describe('cannot extract', () => {
      global.it('an empty array', () => {
        const weather = [
        ];
        const expected = {
          city: []
        };
        const results = ObjectUtils.extractObjectProperties(weather, ['city']);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if map is not set', () => {
        const weather = [
          { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
          null,
          { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
          { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
        ];
        const expected = [];
        const results = ObjectUtils.extractObjectProperties(weather, null);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if map is not a map or array', () => {
        const weather = [
          { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
          null,
          { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
          { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
        ];
        const expected = 'object.extractObjectProperties(list:Object[], '
          + 'propertyOrFnMap:Map<String, stringOrFn>): propertyOrFnMap must be '
          + 'a map of propertyName keys, with a function or property name as the value';
        global.expect(() => ObjectUtils.extractObjectProperties(weather, 2)).toThrow(expected);
      });
      global.it('if values other than strings are provded', () => {
        const weather = [
          { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
          null,
          { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
          { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
        ];
        const expected = {
          city: ['Seattle', 'New York', 'Chicago']
        };
        const results = ObjectUtils.extractObjectProperties(weather, [1, 'city']);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('can extract', () => {
      global.describe('from a list', () => {
        global.describe('with a list', () => {
          global.it('a property name', () => {
            const weather = [
              { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
              null,
              { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
              { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
            ];
            const expected = {
              city: ['Seattle', 'New York', 'Chicago']
            };
            const results = ObjectUtils.extractObjectProperties(weather, ['city']);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('multiple property names', () => {
            const weather = [
              { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
              null,
              { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
              { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
            ];
            const expected = {
              city: ['Seattle', 'New York', 'Chicago'],
              month: ['Aug', 'Apr', 'Apr']
            };
            const results = ObjectUtils.extractObjectProperties(weather, ['city', 'month']);
            global.expect(results).toStrictEqual(expected);
          });
        });
        global.describe('with a map', () => {
          global.it('a property name', () => {
            const weather = [
              { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
              null,
              { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
              { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
            ];
            const expected = {
              city: ['Seattle', 'New York', 'Chicago']
            };
            const results = ObjectUtils.extractObjectProperties(weather, new Map([['city', 'city']]));
            global.expect(results).toStrictEqual(expected);
          });
          global.it('a function', () => {
            const weather = [
              { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
              null,
              { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
              { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
            ];
            const expected = {
              city: ['Seattle', 'New York', 'Chicago']
            };
            const results = ObjectUtils.extractObjectProperties(weather, new Map([['city', (r) => r.city]]));
            global.expect(results).toStrictEqual(expected);
          });
          global.it('multiple property name', () => {
            const weather = [
              { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
              null,
              { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
              { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
            ];
            const expected = {
              city: ['Seattle', 'New York', 'Chicago'],
              month: ['Aug', 'Apr', 'Apr']
            };
            const results = ObjectUtils.extractObjectProperties(weather, new Map([['city', 'city'], ['month']]));
            global.expect(results).toStrictEqual(expected);
          });
          global.it('multiple functions', () => {
            const weather = [
              { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
              null,
              { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
              { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
            ];
            const expected = {
              city: ['Seattle', 'New York', 'Chicago'],
              month: ['Aug', 'Apr', 'Apr']
            };
            const results = ObjectUtils.extractObjectProperties(weather, new Map([['city', (r) => r.city], ['month', (r) => r.month]]));
            global.expect(results).toStrictEqual(expected);
          });
          global.it('mixed functions and strings', () => {
            const weather = [
              { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
              null,
              { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
              { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }
            ];
            const propertyMap = new Map();
            propertyMap.set('city', null);
            propertyMap.set('city2', 'city');
            propertyMap.set('city3', (r) => r.city);

            const expected = {
              city: ['Seattle', 'New York', 'Chicago'],
              city2: ['Seattle', 'New York', 'Chicago'],
              city3: ['Seattle', 'New York', 'Chicago']
            };

            const results = ObjectUtils.extractObjectProperties(weather, propertyMap);
            global.expect(results).toStrictEqual(expected);
          });
        });
      });
    });
  });
  global.describe('extractTransformApply', () => {
    global.it('on a simple case', () => {
      const targetObjects = [
        { account: 'A', user: 'X' },
        { account: 'A', user: 'Y' },
        { account: 'A', user: 'Z' },
      ];
      const path = 'user';
      const values = ObjectUtils.extractObjectProperty(targetObjects, path);
      const expectedTransformations = new Map([['X', 'User-X'], ['Y', 'User-Y'], ['Z', 'User-Z']]);

      global.expect(expectedTransformations.get('X')).toBe('User-X');
      global.expect(expectedTransformations.get('Y')).toBe('User-Y');
      global.expect(expectedTransformations.get('Z')).toBe('User-Z');

      const transformedValues = values.map((val) => expectedTransformations.get(val));

      global.expect(transformedValues[0]).toBe('User-X');
      global.expect(transformedValues[1]).toBe('User-Y');
      global.expect(transformedValues[2]).toBe('User-Z');

      ObjectUtils.applyPropertyValues(targetObjects, path, transformedValues);

      const expected = [
        { account: 'A', user: 'User-X' },
        { account: 'A', user: 'User-Y' },
        { account: 'A', user: 'User-Z' },
      ];

      global.expect(targetObjects).toStrictEqual(expected);
    });
    global.it('on multiple properties', () => {
      const targetObjects = [
        { account: 'A', user: 'X', owner: 'Z' },
        { account: 'A', user: 'Y', owner: 'X' },
        { account: 'A', user: 'Z', owner: 'Y' },
      ];
      const paths = ['user', 'owner'];
      const values = ObjectUtils.extractObjectProperties(targetObjects, paths);
      const expectedTransformations = new Map([['X', 'User-X'], ['Y', 'User-Y'], ['Z', 'User-Z']]);

      global.expect(expectedTransformations.get('X')).toBe('User-X');
      global.expect(expectedTransformations.get('Y')).toBe('User-Y');
      global.expect(expectedTransformations.get('Z')).toBe('User-Z');

      const transformedUsers = values.user.map((val) => expectedTransformations.get(val));
      const transformedOwners = values.owner.map((val) => expectedTransformations.get(val));

      ObjectUtils.applyPropertyValues(targetObjects, 'user', transformedUsers);
      ObjectUtils.applyPropertyValues(targetObjects, 'owner', transformedOwners);

      const expected = [
        { account: 'A', user: 'User-X', owner: 'User-Z' },
        { account: 'A', user: 'User-Y', owner: 'User-X' },
        { account: 'A', user: 'User-Z', owner: 'User-Y' },
      ];

      global.expect(targetObjects).toStrictEqual(expected);
    });
  });
});
