
const HashMapUtil = require('../hashMap');

global.describe('hashmap', () => {
  global.describe('add', () => {
    global.it('can add directly', () => {
      const expected = new Map([['key1', 1]]);
      const results = HashMapUtil.add(new Map(), 'key1', 1);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('works with reduce', () => {
      const expected = new Map([['key1', 1], ['key2', 2], ['key3', 3]]);
      const targetObject = { key1: 1, key2: 2, key3: 3 };

      const keys = ['key1', 'key2', 'key3'];
      const result = keys.reduce(
        (reduceResult, key) => HashMapUtil.add(reduceResult, key, targetObject[key]),
        new Map()
      );
      global.expect(result).toStrictEqual(expected);
    });
  });

  global.describe('serialize', () => {
    global.it('can serialize an empty map', () => {
      const target = new Map();
      const expected = '{"dataType":"Map","value":[]}';
      const results = HashMapUtil.serialize(target);
      global.expect(results).toBe(expected);
    });
    global.it('can serialize a single entry', () => {
      const target = new Map([['first', 1]]);
      const expected = '{"dataType":"Map","value":[["first",1]]}';
      const results = HashMapUtil.serialize(target);
      global.expect(results).toBe(expected);
    });
    global.it('can serialize multiple entries', () => {
      const target = new Map([['first', 1], ['second', 2]]);
      const expected = '{"dataType":"Map","value":[["first",1],["second",2]]}';
      const results = HashMapUtil.serialize(target);
      global.expect(results).toBe(expected);
    });
  });

  global.describe('toObject', () => {
    global.describe('can serialize', () => {
      global.it('with a simple map', () => {
        const target = new Map([['first', 1], ['second', 2]]);
        const expected = { first: 1, second: 2 };
        const result = HashMapUtil.toObject(target);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('with a map of numbers', () => {
        const target = new Map([[1, 1], [2, 2]]);
        const expected = {};
        expected[1] = 1;
        expected[2] = 2;
        const result = HashMapUtil.toObject(target);
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('cannot serialize', () => {
      global.it('if the target map is not a map at all', () => {
        const target = { first: 1 };
        global.expect(() => HashMapUtil.toObject(target))
          .toThrow('hashMap.toObject(map): must be passed a Map');
      });
    });
  });
});
