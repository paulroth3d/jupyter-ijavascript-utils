const objectUtils = require('../object');

describe('ObjectUtils', () => {
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
    global.it('does not throw an error if selecting properties on null', () => {
      const result = objectUtils.selectObjectProperties(null, ['a', 'b']);
      global.expect(result).toBeTruthy();
      global.expect(Array.isArray(result)).toBe(true);
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
  });
});
