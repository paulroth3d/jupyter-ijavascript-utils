/* eslint-disable prefer-template */

const SourceMap = require('../SourceMap');
// const FileUtil = require('../file');

const generateSourceMap = () => {
  const seattleData = [
    ['Aug', [{ id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 }]],
    ['Apr', [{ id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 }]],
    ['Dec', [{ id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }]]
  ];
  const seattle = new SourceMap(seattleData);
  seattle.source = 'month';

  return seattle;
};

const generateMultiSourceMap = () => {
  const seattleData = [
    ['Aug', [{ id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 }]],
    ['Apr', [{ id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 }]],
    ['Dec', [{ id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }]]
  ];
  const seattle = new SourceMap(seattleData);
  seattle.source = 'month';

  const newYorkData = [
    ['Aug', [{ id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 }]],
    ['Apr', [{ id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 }]],
    ['Dec', [{ id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }]]
  ];
  const newYork = new SourceMap(newYorkData);
  newYork.source = 'month';

  const chicagoData = [
    ['Aug', [{ id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 }]],
    ['Apr', [{ id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 }]],
    ['Dec', [{ id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }]]
  ];
  const chicago = new SourceMap(chicagoData);
  chicago.source = 'month';

  const resultData = [['Seattle', seattle], ['New York', newYork], ['Chicago', chicago]];
  const result = new SourceMap(resultData);
  result.source = 'city';

  return result;
};

const generateLongSourceMap = () => {
  const data = [
    [
      'Seattle',
      [
        { id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 },
        { id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 },
        { id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }
      ]
    ],
    [
      'New York',
      [
        { id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 },
        { id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 },
        { id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }
      ]
    ],
    [
      'Chicago',
      [
        { id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 },
        { id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 },
        { id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }
      ]
    ]
  ];
  const results = new SourceMap(data);
  results.source = 'city';
  return results;
};

const peek = (a) => Array.isArray(a) && a.length > 0 ? a[0] : null;

global.describe('SourceMap', () => {
  global.describe('constructor', () => {
    global.it('can be constructed just like a map', () => {
      global.expect(() => new SourceMap([['A', 1], ['B', 2]])).not.toThrow();
    });
    global.it('can be constructed without any arguments', () => {
      global.expect(() => new SourceMap()).not.toThrow();
    });
    global.it('can run generateSourceMap', () => {
      global.expect(generateSourceMap).not.toThrow();
    });
    global.it('generateSourceMap is a valid sourceMap', () => {
      const result = generateSourceMap();
      global.expect(result.size).toBe(3);
      global.expect(result.getSource()).toBe('month');
    });
    global.it('can run generateMultiSourceMap', () => {
      global.expect(generateMultiSourceMap).not.toThrow();
    });
  });
  
  global.describe('source', () => {
    global.it('can specify the source and get the source', () => {
      const expected = 'expected';
      const instance = new SourceMap();
      instance.setSource(expected);

      const result = instance.getSource();

      global.expect(result).toBe(expected);
    });
  });

  global.describe('to String', () => {
    global.it('can stringify a source map through stringifyReducer', () => {
      const instance = generateSourceMap();
      const results = JSON.stringify(instance, SourceMap.stringifyReducer);
      const expected = ''
        + '{"dataType":"SourceMap","source":"month","data":'
        + '[["Aug",[{"id":1,"city":"Seattle","month":"Aug","precip":0.87}]],'
        + '["Apr",[{"id":0,"city":"Seattle","month":"Apr","precip":2.68}]],'
        + '["Dec",[{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]]]}';
      // FileUtil.writeFileStd('./tmp/SourceMap', results);
      global.expect(results).toBe(expected);
    });
    global.it('can stringify a complex sourceMap', () => {
      const instance = generateMultiSourceMap();
      const results = JSON.stringify(instance, SourceMap.stringifyReducer);
      const expected = ''
        + '{"dataType":"SourceMap","source":"city","data":'
        + '[["Seattle",{"dataType":"SourceMap","source":"month","data":'
        + '[["Aug",[{"id":1,"city":"Seattle","month":"Aug","precip":0.87}]],'
        + '["Apr",[{"id":0,"city":"Seattle","month":"Apr","precip":2.68}]],'
        + '["Dec",[{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]]]}],'
        + '["New York",{"dataType":"SourceMap","source":"month","data":'
        + '[["Aug",[{"id":1,"city":"Seattle","month":"Aug","precip":0.87}]],'
        + '["Apr",[{"id":0,"city":"Seattle","month":"Apr","precip":2.68}]],'
        + '["Dec",[{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]]]}],'
        + '["Chicago",{"dataType":"SourceMap","source":"month","data":'
        + '[["Aug",[{"id":1,"city":"Seattle","month":"Aug","precip":0.87}]],'
        + '["Apr",[{"id":0,"city":"Seattle","month":"Apr","precip":2.68}]],'
        + '["Dec",[{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]]]}]]}';
      // FileUtil.writeFileStd('./tmp/SourceMap', results);
      global.expect(results).toBe(expected);
    });
    global.it('can stringify with a map', () => {
      const instance = new SourceMap();
      instance.setSource('test');
      instance.set('A', new Map());
      const results = JSON.stringify(instance, SourceMap.stringifyReducer);
      const expected = ''
        + '{"dataType":"SourceMap","source":"test","data":'
        + '[["A",{"dataType":"Map","value":[]}]]}';
      // FileUtil.writeFileStd('./tmp/SourceMap', results);
      global.expect(results).toBe(expected);
    });
    global.it('can stringify with a sourceMap', () => {
      const instance = new SourceMap();
      instance.setSource('test');
      instance.set('A', new SourceMap());
      const results = JSON.stringify(instance, SourceMap.stringifyReducer);
      const expected = ''
        + '{"dataType":"SourceMap","source":"test","data":'
        + '[["A",{"dataType":"SourceMap","data":[]}]]}';
      // FileUtil.writeFileStd('./tmp/SourceMap', results);
      global.expect(results).toBe(expected);
    });

    global.it('can convert simple instance to string', () => {
      const instance = new SourceMap();
      instance.setSource('test');
      const results = String(instance);
      const expected = ''
        + '{"dataType":"SourceMap","source":"test","data":[]}';
      // FileUtil.writeFileStd('./tmp/SourceMap', results);
      global.expect(results).toBe(expected);
    });
    global.it('can convert 1d sourcemap to string', () => {
      const instance = generateSourceMap();
      instance.setSource('month');
      const results = String(instance);
      const expected = ''
        + '{"dataType":"SourceMap","source":"month","data":'
        + '[["Aug",[{"id":1,"city":"Seattle","month":"Aug","precip":0.87}]],'
        + '["Apr",[{"id":0,"city":"Seattle","month":"Apr","precip":2.68}]],'
        + '["Dec",[{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]]]}';
      // FileUtil.writeFileStd('./tmp/SourceMap', results);
      global.expect(results).toBe(expected);
    });
    global.it('can convert 2d sourcemap to string', () => {
      const instance = generateMultiSourceMap();
      instance.setSource('city');
      const results = String(instance);
      const expected = ''
        + '{"dataType":"SourceMap","source":"city","data":'
        + '[["Seattle",{"dataType":"SourceMap","source":"month","data":'
        + '[["Aug",[{"id":1,"city":"Seattle","month":"Aug","precip":0.87}]],'
        + '["Apr",[{"id":0,"city":"Seattle","month":"Apr","precip":2.68}]],'
        + '["Dec",[{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]]]}],'
        + '["New York",{"dataType":"SourceMap","source":"month","data":'
        + '[["Aug",[{"id":1,"city":"Seattle","month":"Aug","precip":0.87}]],'
        + '["Apr",[{"id":0,"city":"Seattle","month":"Apr","precip":2.68}]],'
        + '["Dec",[{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]]]}],'
        + '["Chicago",{"dataType":"SourceMap","source":"month","data":'
        + '[["Aug",[{"id":1,"city":"Seattle","month":"Aug","precip":0.87}]],'
        + '["Apr",[{"id":0,"city":"Seattle","month":"Apr","precip":2.68}]],'
        + '["Dec",[{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]]]}]]}';
      // FileUtil.writeFileStd('./tmp/SourceMap', results);
      global.expect(results).toBe(expected);
    });

    global.it('can stringify with a sourceMap', () => {
      const instance = new SourceMap();
      instance.setSource('test');
      instance.set('A', 'Cuca');
      const results = SourceMap.stringifyReducer(null, instance);
      const expected = { data: [['A', 'Cuca']], dataType: 'SourceMap', source: 'test' };
      // FileUtil.writeFileStd('./tmp/SourceMap', results);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('reduce', () => {
    global.it('can reduce simple', () => {
      const instance = generateSourceMap();
      
      const results = instance.reduce((records) => ({
        count: records.length,
        count2: records.length
      }));

      const expected = [
        { month: 'Aug', count: 1, count2: 1 },
        { month: 'Apr', count: 1, count2: 1 },
        { month: 'Dec', count: 1, count2: 1 }
      ];

      // FileUtil.writeFileStd('./tmp/SourceMap', JSON.stringify(results));
      global.expect(results).toEqual(expected);
    });
    global.it('can reduce complex', () => {
      const instance = generateMultiSourceMap();
      
      const results = instance.reduce((records) => ({
        count: records.length,
        count2: records.length
      }));

      const expected = [
        { city: 'Seattle',  month: 'Aug', count: 1, count2: 1 },
        { city: 'Seattle',  month: 'Apr', count: 1, count2: 1 },
        { city: 'Seattle',  month: 'Dec', count: 1, count2: 1 },
        { city: 'New York', month: 'Aug', count: 1, count2: 1 },
        { city: 'New York', month: 'Apr', count: 1, count2: 1 },
        { city: 'New York', month: 'Dec', count: 1, count2: 1 },
        { city: 'Chicago',  month: 'Aug', count: 1, count2: 1 },
        { city: 'Chicago',  month: 'Apr', count: 1, count2: 1 },
        { city: 'Chicago',  month: 'Dec', count: 1, count2: 1 }
      ];

      //FileUtil.writeFileStd('./tmp/SourceMap', JSON.stringify(results));
      global.expect(results).toEqual(expected);
    });
    global.it('cannot reduce a non sourcemap', () => {
      const reduceFn = (records) => ({
        count: records.length,
        count2: records.length
      });

      try {
        SourceMap.reduceGroup({}, reduceFn);
        global.jest.fail('Excpetion should have been thrown: SourceMap.reduceGroup({}, reduceFn) is not a collection');
      } catch (err) {
        //
      }
    });
  });

  global.describe('reduceSeparate', () => {
    global.it('can reduce separate on an empty sourceMap', () => {
      const instance = new SourceMap();
      const reduceFn = (records) => ({
        count: records.length,
        count2: records.length
      });
      global.expect(() => instance.reduceSeparate(reduceFn)).not.toThrow();
    });
    global.it('can reduce a simple map', () => {
      const instance = generateSourceMap();
      const reduceFn = (records) => ({
        count: records.length,
        count2: records.length
      });
      const results = instance.reduceSeparate(reduceFn);
      const expected = [
        { month: 'Aug', _aggregateKey: 'count',  _aggregateValue: 1 },
        { month: 'Aug', _aggregateKey: 'count2', _aggregateValue: 1 },
        { month: 'Apr', _aggregateKey: 'count',  _aggregateValue: 1 },
        { month: 'Apr', _aggregateKey: 'count2', _aggregateValue: 1 },
        { month: 'Dec', _aggregateKey: 'count',  _aggregateValue: 1 },
        { month: 'Dec', _aggregateKey: 'count2', _aggregateValue: 1 }
      ];

      // FileUtil.writeFileStd('./tmp/SourceMap', JSON.stringify(results));
      global.expect(results).toEqual(expected);
    });
    global.it('can reduce a complex map', () => {
      const instance = generateMultiSourceMap();
      const reduceFn = (records) => ({
        count: records.length,
        count2: records.length
      });
      const results = instance.reduceSeparate(reduceFn);
      const expected = [
        { city: 'Seattle',  month: 'Aug', _aggregateKey: 'count',  _aggregateValue: 1 },
        { city: 'Seattle',  month: 'Aug', _aggregateKey: 'count2', _aggregateValue: 1 },
        { city: 'Seattle',  month: 'Apr', _aggregateKey: 'count',  _aggregateValue: 1 },
        { city: 'Seattle',  month: 'Apr', _aggregateKey: 'count2', _aggregateValue: 1 },
        { city: 'Seattle',  month: 'Dec', _aggregateKey: 'count',  _aggregateValue: 1 },
        { city: 'Seattle',  month: 'Dec', _aggregateKey: 'count2', _aggregateValue: 1 },
        { city: 'New York', month: 'Aug', _aggregateKey: 'count',  _aggregateValue: 1 },
        { city: 'New York', month: 'Aug', _aggregateKey: 'count2', _aggregateValue: 1 },
        { city: 'New York', month: 'Apr', _aggregateKey: 'count',  _aggregateValue: 1 },
        { city: 'New York', month: 'Apr', _aggregateKey: 'count2', _aggregateValue: 1 },
        { city: 'New York', month: 'Dec', _aggregateKey: 'count',  _aggregateValue: 1 },
        { city: 'New York', month: 'Dec', _aggregateKey: 'count2', _aggregateValue: 1 },
        { city: 'Chicago',  month: 'Aug', _aggregateKey: 'count',  _aggregateValue: 1 },
        { city: 'Chicago',  month: 'Aug', _aggregateKey: 'count2', _aggregateValue: 1 },
        { city: 'Chicago',  month: 'Apr', _aggregateKey: 'count',  _aggregateValue: 1 },
        { city: 'Chicago',  month: 'Apr', _aggregateKey: 'count2', _aggregateValue: 1 },
        { city: 'Chicago',  month: 'Dec', _aggregateKey: 'count',  _aggregateValue: 1 },
        { city: 'Chicago',  month: 'Dec', _aggregateKey: 'count2', _aggregateValue: 1 }
      ];

      // FileUtil.writeFileStd('./tmp/SourceMap', JSON.stringify(results));
      global.expect(results).toEqual(expected);
    });
    global.it('cannot reduce a non sourcemap', () => {
      const reduceFn = (records) => ({
        count: records.length,
        count2: records.length
      });

      try {
        SourceMap.reduceGroupSeparate({}, reduceFn);
        global.jest.fail('Excpetion should have been thrown: SourceMap.reduceGroup({}, reduceFn) is not a collection');
      } catch (err) {
        //
      }
    });
  });

  global.describe('reduceObject', () => {
    global.it('can reduce simple', () => {
      const instance = generateSourceMap();
      
      const results = instance.objectReduce({
        count: (records) => records.length,
        count2: (records) => records.length
      });

      const expected = [
        { month: 'Aug', count: 1, count2: 1 },
        { month: 'Apr', count: 1, count2: 1 },
        { month: 'Dec', count: 1, count2: 1 }
      ];

      // FileUtil.writeFileStd('./tmp/SourceMap', JSON.stringify(results));
      global.expect(results).toEqual(expected);
    });
    global.it('can reduce complex', () => {
      const instance = generateMultiSourceMap();
      
      const results = instance.objectReduce({
        count: (records) => records.length,
        count2: (records) => records.length
      });

      const expected = [
        { city: 'Seattle',  month: 'Aug', count: 1, count2: 1 },
        { city: 'Seattle',  month: 'Apr', count: 1, count2: 1 },
        { city: 'Seattle',  month: 'Dec', count: 1, count2: 1 },
        { city: 'New York', month: 'Aug', count: 1, count2: 1 },
        { city: 'New York', month: 'Apr', count: 1, count2: 1 },
        { city: 'New York', month: 'Dec', count: 1, count2: 1 },
        { city: 'Chicago',  month: 'Aug', count: 1, count2: 1 },
        { city: 'Chicago',  month: 'Apr', count: 1, count2: 1 },
        { city: 'Chicago',  month: 'Dec', count: 1, count2: 1 }
      ];

      //FileUtil.writeFileStd('./tmp/SourceMap', JSON.stringify(results));
      global.expect(results).toEqual(expected);
    });
    global.it('cannot reduce a non sourcemap', () => {
      const reduceFn = (records) => ({
        count: records.length,
        count2: records.length
      });

      try {
        SourceMap.objectReduce({}, reduceFn);
        global.jest.fail('Excpetion should have been thrown: SourceMap.reduceGroup({}, reduceFn) is not a collection');
      } catch (err) {
        //
      }
    });
    global.it('object reduce should have functions and throws an error if not', () => {
      const reduceFn = (records) => ({
        count: records.length,
        count2: records.length
      });

      try {
        SourceMap.objectReduce([], { name: 'john' }, reduceFn);
        global.jest.fail('Excpetion should have been thrown: SourceMap.reduceGroup({}, reduceFn) is not a collection');
      } catch (err) {
        //
      }
    });
  });

  global.describe('map', () => {
    global.it('can 1d map by reducing', () => {
      const source = generateSourceMap();
      const expected = new SourceMap();
      expected.source = 'month';
      expected.set('Aug', 0.87);
      expected.set('Apr', 2.68);
      expected.set('Dec', 5.31);

      const results = source.map((r) => peek(r).precip);
      global.expect(JSON.stringify(results)).toStrictEqual(JSON.stringify(expected));
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can 1d map by filter and reducing', () => {
      const source = generateLongSourceMap();
      const data = [
        ['Seattle', 1],
        ['New York', 1],
        ['Chicago', 1]
      ];
      const expected = new SourceMap(data);
      expected.source = 'city';

      const results = source
        .map((c) => c.filter((r) => r.month === 'Apr'))
        .map((c) => c.length);

      global.expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can 2d map by reducing', () => {
      const source = generateMultiSourceMap();
      const Chicago = new SourceMap([
        ['Aug', 1], ['Apr', 1], ['Dec', 1]
      ]);
      Chicago.source = 'month';

      const Seattle = new SourceMap([
        ['Aug', 1], ['Apr', 1], ['Dec', 1]
      ]);
      Seattle.source = 'month';

      const NewYork = new SourceMap([
        ['Aug', 1], ['Apr', 1], ['Dec', 1]
      ]);
      NewYork.source = 'month';

      const expected = new SourceMap([
        ['Seattle', Seattle],
        ['New York', NewYork],
        ['Chicago', Chicago]
      ]);
      expected.source = 'city';

      const results = source.map((r) => r.length);
      global.expect(JSON.stringify(results)).toEqual(JSON.stringify(expected));
      global.expect(results).toStrictEqual(expected);
    });
  });
});
