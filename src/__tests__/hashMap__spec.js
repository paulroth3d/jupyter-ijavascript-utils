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

  global.describe('stringify', () => {
    global.it('can stringify an empty map', () => {
      const target = new Map();
      const expected = '{"dataType":"Map","value":[]}';
      const results = HashMapUtil.stringify(target);
      global.expect(results).toBe(expected);
    });
    global.it('can stringify a single entry', () => {
      const target = new Map([['first', 1]]);
      const expected = '{"dataType":"Map","value":[["first",1]]}';
      const results = HashMapUtil.stringify(target);
      global.expect(results).toBe(expected);
    });
    global.it('can stringify multiple entries', () => {
      const target = new Map([['first', 1], ['second', 2]]);
      const expected = '{"dataType":"Map","value":[["first",1],["second",2]]}';
      const results = HashMapUtil.stringify(target);
      global.expect(results).toBe(expected);
    });
    global.it('can use the indentation', () => {
      const target = new Map([['first', 1], ['second', 2]]);
      const expected = `{
  "dataType": "Map",
  "value": [
    [
      "first",
      1
    ],
    [
      "second",
      2
    ]
  ]
}`;
      const results = HashMapUtil.stringify(target, 2);
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
      global.it('an empty map', () => {
        const target = new Map();
        const expected = {};
        const result = HashMapUtil.toObject(target);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('null', () => {
        const target = null;
        const expected = {};
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

  global.describe('fromObject', () => {
    global.describe('can deserialize', () => {
      global.it('an object', () => {
        const target = { first: 1, second: 2, third: 3 };
        const results = HashMapUtil.fromObject(target);
        const expected = new Map([['first', 1], ['second', 2], ['third', 3]]);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('a direct serialized object', () => {
        const sourceObj = {
          dataType: 'Map',
          value: [
            ['first', 1],
            ['second', 2]
          ]
        };
        const expected = new Map([['first', 1], ['second', 2]]);
        const results = HashMapUtil.fromObject(sourceObj);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('a serialized map string', () => {
        const str = '{"dataType":"Map","value":[["first",1],["second",2],["third",3]]}';
        const strObj = JSON.parse(str);
        const expected = new Map([['first', 1], ['second', 2], ['third', 3]]);
        const results = HashMapUtil.fromObject(strObj);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('a serialized map', () => {
        const sourceMap = new Map([['first', 1], ['second', 2], ['third', 3]]);
        const str = HashMapUtil.stringify(sourceMap);

        const expectedStr = '{"dataType":"Map","value":[["first",1],["second",2],["third",3]]}';
        global.expect(str).toBe(expectedStr);

        const strObj = JSON.parse(str);
        const expected = new Map([['first', 1], ['second', 2], ['third', 3]]);
        const results = HashMapUtil.fromObject(strObj);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('cannot deserialize', () => {
      global.it('a number', () => {
        const target = 4;
        global.expect(() => {
          HashMapUtil.fromObject(target);
        }).toThrow('hashMap.fromObject(object): must be passed an object');
      });
    });
  });

  global.describe('union', () => {
    global.describe('can work', () => {
      global.it('and takes both from source and target', () => {
        const source = new Map([['first', 1]]);
        const additional = new Map([['second', 2]]);
        const expected = new Map([['first', 1], ['second', 2]]);
        const results = HashMapUtil.union(source, additional, false);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('and unions if both the source and target are maps', () => {
        const source = new Map([['first', 1], ['second', 2]]);
        const additional = new Map([['second', 1], ['third', 2]]);
        const expected = new Map([['first', 1], ['second', 2], ['third', 2]]);
        const results = HashMapUtil.union(source, additional, false);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('make a clone of the results', () => {
        const source = new Map([['first', 1]]);
        const additional = new Map([['second', 2]]);
        const expected = new Map([['first', 1], ['second', 2]]);
        const results = HashMapUtil.union(source, additional, false);
        global.expect(results).toStrictEqual(expected);

        results.set('first', 0);
        results.set('second', 1);

        global.expect(results.get('first')).toBe(0);
        global.expect(source.get('first')).toBe(1);

        global.expect(results.get('second')).toBe(1);
        global.expect(additional.get('second')).toBe(2);
      });
      global.it('if the source is null', () => {
        const source = null;
        const additional = new Map([['second', 1], ['third', 2]]);
        const expected = new Map([['second', 1], ['third', 2]]);
        const results = HashMapUtil.union(source, additional, false);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('if the additional map is null', () => {
        const source = new Map([['first', 1], ['second', 2]]);
        const additional = null;
        const expected = new Map([['first', 1], ['second', 2]]);
        const results = HashMapUtil.union(source, additional, false);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('handles conflicts', () => {
      global.it('by ignoring if allow overwrites is default', () => {
        const source = new Map([['first', 1]]);
        const additional = new Map([['first', 0]]);
        const expected = new Map([['first', 1]]);
        const results = HashMapUtil.union(source, additional);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('by ignoring if allow overwrites is false', () => {
        const source = new Map([['first', 1]]);
        const additional = new Map([['first', 0]]);
        const expected = new Map([['first', 1]]);
        const results = HashMapUtil.union(source, additional, false);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('by updating if allow overwrites is true', () => {
        const source = new Map([['first', 1]]);
        const additional = new Map([['first', 0]]);
        const expected = new Map([['first', 0]]);
        const results = HashMapUtil.union(source, additional, true);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('cannot work', () => {
    });
  });

  global.describe('clone', () => {
    global.describe('can clone', () => {
      global.it('a simple map', () => {
        const target = new Map([['first', 1], ['second', 2], ['third', 3]]);
        const expected = target;
        const results = HashMapUtil.clone(target);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('an empty array', () => {
        const target = new Map([['first', 1], ['second', 2], ['third', 3]]);
        const expected = target;
        const results = HashMapUtil.clone(target);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('changing a clone does not change the source', () => {
      global.it('a simple map', () => {
        const target = new Map([['first', 1], ['second', 2], ['third', 3]]);
        const expected = new Map([['first', 0], ['second', 2], ['third', 3]]);
        const results = HashMapUtil.clone(target);
        global.expect(results.has('first'));
        
        results.set('first', 0);
        global.expect(target.get('first')).toBe(1);
        global.expect(results.get('first')).toBe(0);

        global.expect(results).toStrictEqual(expected);
      });
      global.it('an empty array', () => {
        const target = new Map();
        const expected = new Map([['first', 0]]);
        const results = HashMapUtil.clone(target);
        
        results.set('first', 0);
        global.expect(!target.has('first'));
        global.expect(results.get('first')).toBe(0);

        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('cannot clone', () => {
      global.it('a number', () => {
        const target = 4;
        global.expect(() => {
          HashMapUtil.clone(target);
        }).toThrow('hashMap.clone(targetMap): targetMap must be a Map');
      });
      global.it('null', () => {
        const target = null;
        global.expect(() => {
          HashMapUtil.clone(target);
        }).toThrow('hashMap.clone(targetMap): targetMap must be a Map');
      });
    });
  });

  global.describe('mappingFn', () => {
    const bgRed = 'background-color: #FF0000';
    const bgGreen = 'background-color: #00FF00';
    const bgGrey = 'background-color: #AAAAAA';
    const styleMap = new Map([['1', bgRed], ['2', bgGreen]]);

    global.it('styles if the value is found', () => {
      const mappingFn = HashMapUtil.mappingFn(styleMap, bgGrey);
      const expected = bgRed;
      const value = '1';
      const results = mappingFn(value);
      global.expect(results).toBe(expected);
    });
    global.it('styles if the value is found 2', () => {
      const mappingFn = HashMapUtil.mappingFn(styleMap, bgGrey);
      const expected = bgGreen;
      const value = '2';
      const results = mappingFn(value);
      global.expect(results).toBe(expected);
    });
    global.it('styles with default if not found', () => {
      const mappingFn = HashMapUtil.mappingFn(styleMap, bgGrey);
      const expected = bgGrey;
      const value = 'somethingElse';
      const results = mappingFn(value);
      global.expect(results).toBe(expected);
    });
    global.it('styles with default if not found', () => {
      const mappingFn = HashMapUtil.mappingFn(styleMap);
      const expected = '';
      const value = 'somethingElse';
      const results = mappingFn(value);
      global.expect(results).toBe(expected);
    });
  });

  global.describe('reverse', () => {
    global.it('can map', () => {
      const encodingMap = new Map([[' ', '%20'], ['\\n', '%0A'], ['\\t', '%09']]);
      const result = encodingMap.get(' '); // '%20'
      const expected = '%20';
      global.expect(result).toBe(expected);
    });
    global.it('can reverse a map', () => {
      const encodingMap = new Map([[' ', '%20'], ['\\n', '%0A'], ['\\t', '%09']]);
      const decodingMap = HashMapUtil.reverse(encodingMap);
      const result = decodingMap.get('%20');
      const expected = ' ';
      global.expect(result).toBe(expected);
    });
    global.it('doesnt modify the existing map', () => {
      const encodingMap = new Map([[' ', '%20'], ['\\n', '%0A'], ['\\t', '%09']]);
      const decodingMap = HashMapUtil.reverse(encodingMap);
      global.expect(decodingMap).not.toBe(encodingMap);
    });
  });
});
