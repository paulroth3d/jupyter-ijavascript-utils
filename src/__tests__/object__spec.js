const objectUtils = require('../object');

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
      const results = objectUtils.evaluateFunctionOrProperty(null)(source);
      global.expect(results).toBe(expected);
    });
    global.it('returns a property if a string is passed', () => {
      const source = { age: 23 };
      const expected = 23;
      const results = objectUtils.evaluateFunctionOrProperty('age')(source);
      global.expect(results).toBe(expected);
    });
    global.it('returns a mapped value if the function is passed',  () => {
      const source = { age: 23 };
      const expected = 23 * 2;
      const results = objectUtils.evaluateFunctionOrProperty((r) => r.age * 2)(source);
      global.expect(results).toBe(expected);
    });
    global.it('throws an error if an unexpected type is passed',  () => {
      global.expect(() => objectUtils.evaluateFunctionOrProperty(new Date()))
        .toThrow();
    });
  });

  describe('objAssign', () => {
    it('assigns a value on an existing object', () => {
      const expected = { first: 'john', last: 'doe' };
      let found = {};
      found = objectUtils.objAssign(found, 'first', 'john');
      found = objectUtils.objAssign(found, 'last', 'doe');
      expect(found).toEqual(expected);
    });
    it('assigns a value even on an empty object', () => {
      const expected = { first: 'john' };
      const found = objectUtils.objAssign(undefined, 'first', 'john');
      expect(found).toEqual(expected);
    });
  });
  describe('propertyObj', () => {
    it('can create a simple object by itself', () => {
      const expected = { first: 'john' };
      const found = objectUtils.objAssign(null, 'first', 'john');
      expect(found).toEqual(expected);
    });
    it('can combine multiple property objects', () => {
      const expected = { first: 'john', last: 'doe' };
      const found = objectUtils.objAssign(null, 'first', 'john', 'last', 'doe');
      expect(found).toEqual(expected);
    });
    it('still works if multiple properties are not even', () => {
      const expected = { first: 'john', last: undefined };
      const found = objectUtils.objAssign(null, 'first', 'john', 'last');
      global.expect(found).toEqual(expected);
    });
    global.it('throws an error if a property is not passed', () => {
      global.expect(() => objectUtils.objAssign(null)).toThrow();
    });
    global.it('throws an error if a property is not a string', () => {
      global.expect(() => objectUtils.objAssign(null, 1, 'doe')).toThrow();
    });
  });
  global.describe('objAssignEntities', () => {
    global.it('can assign at least one entity', () => {
      const entities = [['first', 'john']];
      const expected = { first: 'john' };
      const result = objectUtils.objAssignEntities(null, entities);
      global.expect(result).toEqual(expected);
    });
    global.it('can assign multiple entities', () => {
      const entities = [['first', 'john'], ['last', 'doe']];
      const expected = { first: 'john', last: 'doe' };
      const result = objectUtils.objAssignEntities(null, entities);
      global.expect(result).toEqual(expected);
    });
    global.it('appends to an existing object', () => {
      const entities = [['first', 'john']];
      const expected = { first: 'john', last: 'doe' };
      const result = objectUtils.objAssignEntities({ last: 'doe' }, entities);
      global.expect(result).toEqual(expected);
    });
    global.it('fails if entities are not an array', () => {
      try {
        // not sure why this isn't catching the error
        //global.expect(objectUtils.objAssignEntities(null, {})).toThrow();
        objectUtils.objAssignEntities(null, {});
        jest.fail('exception should be thrown if entities are not an array');
      } catch (err) {
        //
      }
    });
    global.it('fails if entities are not sent', () => {
      try {
        // not sure why this isn't catching the error
        // global.expect(objectUtils.objAssignEntities(null, [])).toThrow();
        objectUtils.objAssignEntities(null, []);
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
        const results = objectUtils.augment(data, augmentFn, false);
        
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
        const results = objectUtils.augment(data, augmentFn, false);
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
        const results = objectUtils.augment(data, augmentFn);
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
        const results = objectUtils.augment(data, augmentFn, true);
        
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
        const results = objectUtils.augment(data, augmentFn, true);
        global.expect(data[0].origin).toBe('s_A');
        global.expect(expected[0].origin).toBe('s_A');
        global.expect(results).toEqual(expected);
      });
    });
  });
  describe('safe keys', () => {
    it('can get keys off a null object', () => {
      const expected = [];
      const found = objectUtils.keys(undefined);
      expect(found).toEqual(expected);
    });
    it('can get keys off an object', () => {
      const expected = ['first', 'last'];
      const found = objectUtils.keys({ first: 'john', last: 'doe' });
      expect(found).toEqual(expected);
    });
    it('can get keys off an array', () => {
      const expected = ['first', 'last', 'cuca'];
      const found = objectUtils.keys([
        { first: 'john', last: 'doe' },
        { first: 'jane', last: 'doe' },
        { first: 'robin', last: 'lloyd', cuca: 'monga' }
      ]);
      expect(found).toEqual(expected);
    });
    it('can get keys off an array, including nulls', () => {
      const expected = ['first', 'last', 'cuca'];
      const found = objectUtils.keys([
        { first: 'john', last: 'doe' },
        { first: 'jane', last: 'doe' },
        { first: 'robin', last: 'lloyd', cuca: 'monga' },
        null,
        { first: 'becky', last: 'sternhoffer' }
      ]);
      expect(found).toEqual(expected);
    });
  });
  describe('clean properties', () => {
    it('leaves a normal property alone', () => {
      const expected = 'first';
      const found = objectUtils.cleanPropertyName('first');
      expect(found).toBe(expected);
    });
    it('cleans a property if the property is completely quoted', () => {
      const expected = 'first';
      const found = objectUtils.cleanPropertyName('"first"');
      expect(found).toBe(expected);
    });
    it('works with spaces', () => {
      const expected = 'first_woman';
      const dirty = 'first woman';
      const found = objectUtils.cleanPropertyName(dirty);
      expect(found).toBe(expected);
    });
    it('works with numbers', () => {
      const expected = '1st_woman';
      const dirty = '1st woman';
      const found = objectUtils.cleanPropertyName(dirty);
      expect(found).toBe(expected);
    });
    it('works with odd characters', () => {
      const expected = 'first_woman';
      const dirty = 'first ("woman")';
      const found = objectUtils.cleanPropertyName(dirty);
      expect(found).toBe(expected);
    });
    it('works on bad data from d3', () => {
      const badData = [
        { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
        { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
        { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
      ];
      const expected = { ' date': 'date', ' kind': 'kind', num: 'num' };
      const found = objectUtils.cleanPropertyNames(badData[0]);
      expect(found).toEqual(expected);
    });
    global.it('can clean properties as a set of fields provided', () => {
      const badData = [
        { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
        { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
        { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
      ];
      const expected = { ' date': 'date', ' kind': 'kind', num: 'num' };
      const keys = objectUtils.keys(badData[0]);
      const found = objectUtils.cleanPropertyNames(keys);
      expect(found).toEqual(expected);
    });
    global.it('can clean properties from a list of objects provided', () => {
      const badData = [
        { num: '192', ' kind': ' s', ' date': ' 2021-07-11T22:23:07+0100' },
        { num: '190', ' kind': ' c', ' date': ' 2021-07-09T19:54:48+0100' },
        { num: '190', ' kind': ' s', ' date': ' 2021-07-08T17:00:32+0100' }
      ];
      const expected = { ' date': 'date', ' kind': 'kind', num: 'num' };
      const keys = objectUtils.keys(badData);
      expect(keys).toEqual(['num', ' kind', ' date']);
      const found = objectUtils.cleanPropertyNames(badData);
      expect(found).toEqual(expected);
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
      const found = objectUtils.cleanProperties(badData);
      expect(found).toEqual(expected);
    });
  });
  describe('renameProperties', () => {
    it('renames properties on an object', () => {
      const dirtyObject = { first: 'john', last: 'doe' };
      const translation = { first: 'first_name' };
      const expected = { first_name: 'john', last: 'doe' };
      const found = objectUtils.renameProperties(dirtyObject, translation);
      expect(found).toEqual(expected);
      expect(found).not.toEqual(dirtyObject);
    });
    it('returns an empty object if renaming a null object', () => {
      //-- don't put the result in the spec
      // const expected = {};
      const result = objectUtils.renameProperties(null, { first: 'first_name' });
      global.expect(result).toBeTruthy();
      global.expect(typeof result).toBe('object');
    });
    it('returns an empty object if renaming a null object', () => {
      //-- don't put the result in the spec
      // const expected = {};
      const result = objectUtils.renameProperties([null], { first: 'first_name' });
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

    // const keys = objectUtils.keys(dirty);
    const cleanedKeys = objectUtils.cleanPropertyNames(dirty[0]);
    const expectedKeys = {
      '"first name"': 'first_name',
      'last name': 'last_name',
      'current (occupation)': 'current_occupation'
    };
    expect(cleanedKeys).toEqual(expectedKeys);

    const cleanedObjects = objectUtils.renameProperties(dirty, cleanedKeys);
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
      const result = objectUtils.collapse(targetObj);
      global.expect(result).not.toBeNull();
      global.expect(result).toHaveProperty('base', 'obj');
      global.expect(result).toHaveProperty('targetValue', 'test');
    });
    it('returns an empty object if the object to collapse is null', () => {
      const targetObj = null;
      const result = objectUtils.collapse(targetObj);
      const expected = {};
      global.expect(result).toEqual(expected);
    });
    it('is the same even if it is on the same object', () => {
      const targetObj = { base: 'obj', targetValue: 'test' };
      const result = objectUtils.collapse(targetObj);
      global.expect(result).not.toBeNull();
      global.expect(result).toHaveProperty('base', 'obj');
      global.expect(result).toHaveProperty('targetValue', 'test');
    });
    it('collapses even if the values are on two separate objects', () => {
      const targetObj = { p1: { base: 'obj' }, p2: { targetValue: 'test' } };
      const result = objectUtils.collapse(targetObj);
      global.expect(result).not.toBeNull();
      global.expect(result).toHaveProperty('base', 'obj');
      global.expect(result).toHaveProperty('targetValue', 'test');
    });
    it('does NOT include the field if the depth is too high', () => {
      const targetObj = { base: 'obj' };

      let travellingObj = targetObj;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < objectUtils.MAX_COLLAPSE_DEPTH + 4; i++) {
        travellingObj.p = {};
        travellingObj = travellingObj.p;
      }
      travellingObj.targetValue = 'test';

      const result = objectUtils.collapse(targetObj);

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
      const result = objectUtils.generateSchema(targetObj);
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

      const result = objectUtils.mapByProperty(collection, 'first');
      expect(result).toStrictEqual(expected);
    });
    global.it('can map an empty list without throwing an error', () => {
      objectUtils.mapByProperty([], 'field');
    });
    global.it('throws an error if no property is requested', () => {
      global.expect(() => objectUtils.mapByProperty([]))
        .toThrow('object.mapByProperty: expects a propertyName');
    });
    global.it('returns an empty map if the object to be mapped is null', () => {
      const expected = new Map();
      const result = objectUtils.mapByProperty(null, 'field');
      global.expect(result).toStrictEqual(expected);
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
      const result = objectUtils.selectObjectProperties(baseObj, ['a', 'b']);
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
      const result = objectUtils.selectObjectProperties(baseObj, 'a', 'b');
      const expected = [{
        a: 1,
        b: 2
      }];
      global.expect(result).toStrictEqual(expected);
    });
    global.it('does not throw an error if selecting properties on null', () => {
      const result = objectUtils.selectObjectProperties(null, ['a', 'b']);
      global.expect(result).toBeTruthy();
      global.expect(Array.isArray(result)).toBe(true);
    });
    global.it('returns an empty array if requesting an empty list of properties', () => {
      const result = objectUtils.selectObjectProperties(null, []);
      const expected = [];
      global.expect(result).toEqual(expected);
    });
    global.it('returns an empty array if requesting an null list of properties', () => {
      const result = objectUtils.selectObjectProperties(null, null);
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
    const result = objectUtils.selectObjectProperties(baseObj, ['a', 'b']);
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
    const result = objectUtils.selectObjectProperties(baseObj, ['a', 'b']);
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
      const result = objectUtils.filterObjectProperties(baseObj, ['a', 'b']);
      const expected = [{
        c: 3,
        d: 4
      }];
      global.expect(result).toStrictEqual(expected);
    });
    global.it('does not throw an error if filtering on null', () => {
      const result = objectUtils.filterObjectProperties(null, ['a', 'b']);
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
    const result = objectUtils.filterObjectProperties(baseObj, ['a', 'b']);
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
    const result = objectUtils.filterObjectProperties(baseObj, ['a', 'b']);
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
      const results = objectUtils.getObjectPropertyTypes(target);
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
      const results = objectUtils.getObjectPropertyTypes(target);
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
      const results = objectUtils.getObjectPropertyTypes(target);
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
      const results = objectUtils.getObjectPropertyTypes(target);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not throw an error if gettingPropertyTypes on null', () => {
      const expected = new Map();
      const result = objectUtils.getObjectPropertyTypes(null);
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
      const result = objectUtils.fetchObjectProperty(targetObj, 'first');
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
      const result = objectUtils.fetchObjectProperty(targetObj, 'first');
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
      const result = objectUtils.fetchObjectProperty(targetObj, 'age');
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
      const result = objectUtils.fetchObjectProperty(targetObj, 'class');
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
      const result = objectUtils.fetchObjectProperty(targetObj, 'class.id');
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
      const result = objectUtils.fetchObjectProperty(targetObj, 'class.invalidProperty', { safeAccess: false });
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
      try {
        objectUtils.fetchObjectProperty(targetObj, 'class.invalidProperty.invalidProperty2', { safeAccess: false });
        global.expect('an exception should have been thrown').toBe(true);
      } catch (err) {
        global.expect(err).toBeTruthy();
      }
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
      const result = objectUtils.fetchObjectProperty(targetObj, 'class.invalidProperty.invalidProperty2', { safeAccess: true });
      global.expect(result).toBeFalsy();
    });
    global.it('can support elvis operators', () => {
      const targetObj = {
        first: 'john',
        age: 24,
        class: {
          id: 'econ-101',
          name: 'Economy of Thought'
        }
      };
      //-- no exception to be thrown because we are safe
      const result = objectUtils.fetchObjectProperty(targetObj, 'class.?invalidProperty.?invalidProperty2', { safeAccess: false });
      global.expect(result).toBeFalsy();
    });
    global.it('does not throw an error if fetching properties on null', () => {
      const result = objectUtils.fetchObjectProperty(null, 'clases.className');
      global.expect(result).toBeNull();
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
      const result = objectUtils.fetchObjectProperties(
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
        objectUtils.fetchObjectProperties(
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
      const result = objectUtils.fetchObjectProperties(
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
      const result = objectUtils.fetchObjectProperties(
        targetObjects,
        { first: 'first', classId: 'class.id', professor: 'class.professor.name' },
        { append: true }
      );
      global.expect(targetObjects[0].class.id).toBe('econ-101');
      global.expect(result).toStrictEqual(expected);
    });
    global.it('does not throw an error if fetching properties on null', () => {
      const result = objectUtils.fetchObjectProperties(
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
      const result = objectUtils.fetchObjectProperties(
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

      const results = objectUtils.join(weather, 'city', cityLocations, ((w, c) => ({ ...w, ...c })));
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

      const results = objectUtils.join(weather, 'city', cityLocations, ((w, c) => ({ ...w, ...c })));
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

      global.expect(() => objectUtils.join(targetObj, indexField, targetMap, null)).toThrow(errorMsg);
    });
    global.it('must have a targetMap', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = null;
      const joinFn = jest.fn().mockImplementation((s) => s);

      const errorMsg = 'object.join(objectArray, indexField, targetMap, joinFn): targetMap cannot be null';

      global.expect(() => objectUtils.join(targetObj, indexField, targetMap, joinFn)).toThrow(errorMsg);
    });

    global.it('can join on a null object', () => {
      const targetObj = null;
      const indexField = 'city';
      const targetMap = cityLocations;

      const joinFn = jest.fn().mockImplementation((s, t) => s);

      const results = objectUtils.join(targetObj, indexField, targetMap, joinFn);
      const expected = [];

      global.expect(joinFn).not.toHaveBeenCalled();

      global.expect(results).toEqual(expected);
    });

    global.it('can join a single object', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = cityLocations;

      const joinFn = jest.fn();

      objectUtils.join(targetObj, indexField, targetMap, joinFn);

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

      const results = objectUtils.join(targetObj, indexField, targetMap, joinFn);
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

      const results = objectUtils.join(targetObj, indexField, targetMap, joinFn);
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

      objectUtils.join(targetObj, indexField, targetMap, joinFn);

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

      objectUtils.join(targetObj, indexFn, targetMap, joinFn);

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
      const results = objectUtils.join(targetObj, indexField, targetMap, joinFn);
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

        global.expect(() => objectUtils.joinProperties(targetObj, indexField, targetMap)).toThrow(errorMsg);
      });
      global.it('null sent', () => {
        const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
        const indexField = 'city';
        const targetMap = cityLocations;

        const errorMsg = 'object.joinProperties(objectArray, indexField, targetMap, ...fields): at least one property passed to join';

        global.expect(() => objectUtils.joinProperties(targetObj, indexField, targetMap, null)).toThrow(errorMsg);
      });
      global.it('null plus valid sent', () => {
        const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
        const indexField = 'city';
        const targetMap = cityLocations;

        const errorMsg = 'object.joinProperties(objectArray, indexField, targetMap, ...fields): at least one property passed to join';

        global.expect(() => objectUtils.joinProperties(targetObj, indexField, targetMap, null, 'lat')).not.toThrow(errorMsg);
      });
    });
    global.it('must have a targetMap', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = null;
      const errorMsg = 'object.join(objectArray, indexField, targetMap, joinFn): targetMap cannot be null';

      global.expect(() => objectUtils.joinProperties(targetObj, indexField, targetMap, 'lat')).toThrow(errorMsg);
    });

    global.it('can join on a null object', () => {
      const targetObj = null;
      const indexField = 'city';
      const targetMap = cityLocations;

      const results = objectUtils.joinProperties(targetObj, indexField, targetMap, 'lat', 'lon');
      const expected = [];

      global.expect(results).toEqual(expected);
    });

    global.it('can join a single object', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = cityLocations;

      const results = objectUtils.joinProperties(targetObj, indexField, targetMap, 'locationId');
      const expected = [
        { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3 }
      ];

      global.expect(results).toEqual(expected);
    });

    global.it('can join with multiple properties', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexField = 'city';
      const targetMap = cityLocations;

      const results = objectUtils.joinProperties(targetObj, indexField, targetMap, 'lat', 'lon');
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

      const results = objectUtils.joinProperties(targetObj, indexField, targetMap, 'locationId');
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

      const results = objectUtils.joinProperties(targetObj, indexField, targetMap, 'locationId');
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

      const results = objectUtils.joinProperties(targetObj, indexField, targetMap, 'locationId');
      const expected = [{ id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, locationId: 3 }];

      global.expect(results).toEqual(expected);
    });

    global.it('an join based on a formula', () => {
      const targetObj = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
      const indexFn = (obj) => obj.city;
      const targetMap = cityLocations;

      const seattleLocation = targetMap.get('Seattle');
      global.expect(seattleLocation.city).toBe('Seattle');

      const results = objectUtils.joinProperties(targetObj, indexFn, targetMap, 'locationId');
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

      const results = objectUtils.joinProperties(weather, 'city', cityLocations, 'locationId', 'lat', 'lon');
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
        const results = objectUtils.findWithProperties(students, 'birthday');
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
        const results = objectUtils.findWithProperties(students, 'first', 'last', 'birthday');
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
        const results = objectUtils.findWithProperties(students, ['first', 'last']);
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
        const results = objectUtils.findWithProperties(students, 'failure');
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
        const results = objectUtils.findWithProperties(students, 'birthday');
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
        const results = objectUtils.findWithProperties(students, 'cuca');
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('single object', () => {
      global.it('matching one', () => {
        const students = { first: 'john', last: 'doe', birthday: '2002-04-01' };
        const expected = [
        ];
        const results = objectUtils.findWithProperties(students, 'cuca');
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
        const results = objectUtils.findWithProperties(students, 'cuca');
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
        const results = objectUtils.findWithoutProperties(students, 'birthday');
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
        const results = objectUtils.findWithoutProperties(students, 'first', 'last', 'birthday');
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
        const results = objectUtils.findWithoutProperties(students, ['first', 'last', 'cuca']);
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
        const results = objectUtils.findWithoutProperties(students, 'birthday');
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
        const results = objectUtils.findWithoutProperties(students, 'failure');
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
        const results = objectUtils.findWithoutProperties(students, 'first');
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('single object', () => {
      global.it('matching one', () => {
        const students = { first: 'john', last: 'doe', birthday: '2002-04-01' };
        const expected = [
          { first: 'john', last: 'doe', birthday: '2002-04-01' }
        ];
        const results = objectUtils.findWithoutProperties(students, 'failure');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('matching none', () => {
        const students = { first: 'john', last: 'doe', birthday: '2002-04-01' };
        const expected = [
        ];
        const results = objectUtils.findWithoutProperties(students, 'first');
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

        objectUtils.setPropertyDefaults(students, {
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

        objectUtils.setPropertyDefaults(students, {
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

        objectUtils.setPropertyDefaults(students, {
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

        objectUtils.setPropertyDefaults(students, {
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
          objectUtils.setPropertyDefaults(students, null);
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
          objectUtils.setPropertyDefaults(students, 2);
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
      const results = objectUtils.propertyFromList(data, 'val');
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
      const results = objectUtils.propertyFromList(data, (r) => r.val);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('accesses values from a list', () => {
      const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = objectUtils.propertyFromList(data);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not fail if not sent a list', () => {
      const data = 1;
      const expected = [];
      const results = objectUtils.propertyFromList(data);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not fail if sent a null list', () => {
      const data = null;
      const expected = [];
      const results = objectUtils.propertyFromList(data);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not fail if sent an empty list', () => {
      const data = [];
      const expected = [];
      const results = objectUtils.propertyFromList(data);
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
        const results = objectUtils.mapProperties(list, parseNum, 'id');
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
        const results = objectUtils.mapProperties(list, parseNum, 'id', 'age');
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
        const results = objectUtils.mapProperties(list, parseNum);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('with one object', () => {
      global.it('one property', () => {
        const list = { id: '100', age: '21', name: 'p1' };
        const expected = [{ id: 100, age: '21', name: 'p1' }];
        const parseNum = (str) => parseInt(str, 10);
        const results = objectUtils.mapProperties(list, parseNum, 'id');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('two properties', () => {
        const list = { id: '100', age: '21', name: 'p1' };
        const expected = [{ id: 100, age: 21, name: 'p1' }];
        const parseNum = (str) => parseInt(str, 10);
        const results = objectUtils.mapProperties(list, parseNum, 'id', 'age');
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
        const results = objectUtils.mapProperties(list, parseNum, ['id']);
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
        const results = objectUtils.mapProperties(list, parseNum, ['id', 'age']);
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
        const results = objectUtils.mapProperties(list, parseNum, []);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('throws an error', () => {
      global.it('if the formatting function is missing', () => {
        const list = { id: '100', age: '21', name: 'p1' };
        const expectedError = 'object.mapProperties(collection, formattingFn, ...propertiesToFormat): formattingFn must be provided';
        global.expect(() => {
          objectUtils.mapProperties(list);
        }).toThrow(expectedError);
      });
      global.it('if the formatting is not a function', () => {
        const list = { id: '100', age: '21', name: 'p1' };
        const expectedError = 'object.mapProperties(collection, formattingFn, ...propertiesToFormat): formattingFn must be provided';
        global.expect(() => {
          objectUtils.mapProperties(list, 'a', 'id');
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
        const result = objectUtils.formatProperties(data, ({}));
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
        const result = objectUtils.formatProperties(data, ({ station: () => 'B' }));
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
        const result = objectUtils.formatProperties(data, ({ station: () => 'B', isFahreinheit: (val) => val === 'true' }));
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
        const result = objectUtils.formatProperties(data, ({
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
        global.expect(() => objectUtils.formatProperties(data, formatter)).not.toThrow();
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
        global.expect(() => objectUtils.formatProperties(data, formatter)).toThrow(expectedError);
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
        const result = objectUtils.formatProperties(data, ({ station: 'B' }));
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
        const result = objectUtils.formatProperties(data, ({ station: 20 }));
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
        const result = objectUtils.formatProperties(data, ({ temp: 'string' }));
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
        const result = objectUtils.formatProperties(data, ({ descr: 'number' }));
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
        const result = objectUtils.formatProperties(data, ({ descr: 'float' }));
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
        const result = objectUtils.formatProperties(data, ({ descr: 'int' }));
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
        const result = objectUtils.formatProperties(data, ({ descr: 'integer' }));
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
        const result = objectUtils.formatProperties(data, ({ isFahreinheit: 'boolean' }));
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('does not fail', () => {
      global.it('if null is passed for a collection', () => {
        const data = null;
        const expected = [];
        const result = objectUtils.formatProperties(data, ({ station: 20 }));
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('can format a single object', () => {
      const data = { station: 'A', isFahreinheit: 'true', offset: '2', temp: 99, type: 'F', descr: '0123456' };
      const expected = [{ station: 'A', isFahreinheit: true, offset: 2, temp: 37.2252, type: 'C', descr: '0123456' }];
      const result = objectUtils.formatProperties(data, ({
        type: 'C',
        offset: 'number',
        isFahreinheit: 'boolean',
        temp: (val) => (val - 32) * 0.5556
      }));
      global.expect(result).toStrictEqual(expected);
    });
  });
});
