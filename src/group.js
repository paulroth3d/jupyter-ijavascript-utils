const SourceMap = require('./SourceMap');

const ObjectUtils = require('./object');

/**
 * Utilities for collating and grouping records
 * 
 * * Creating Groups of records
 *   * {@link module:group.by|group.by(collection, field, field, ...)} - group arrays by common values - for further reduction, etc.
 *   * {@link module:group.separateByFields|group.separateByFields(collection, field, field)} - duplicate collections by fields (useful for charting)
 * * Indexing records by a unique key
 *   * {@link module:group.index|group.index(collection, field)} - create a map of records by a unique field (helpful for joining records)
 * * Reducing Collections of records
 *   * {@link module:group.rollup|group.rollup(collection, field)} - group and "reduce" to aggregate a collection of records
 * 
 * Please also see:
 * 
 * * {@link SourceMap} - as it is the result from {@link module:group.by|group.by()}
 * * {@link module:aggregate|aggregate} - a collection of utilities to aggregate / reduce records.
 * 
 * See {@link https://stackoverflow.com/questions/31412537/numpy-like-package-for-node|this stackoverflow}
 * for someone asking why couldn't {@link https://numpy.org/doc/stable/user/quickstart.html|Numpy} be written in JavaScript;
 * 
 * * D3, specifically: [group / rollup / index](https://observablehq.com/@d3/d3-group)
 * and [flatGroup / flatRollup](https://observablehq.com/@d3/d3-flatgroup)
 * 
 * * {@link https://danfo.jsdata.org/|DanfoJS} - a js library heavily inspired by
 * {@link https://pandas.pydata.org/pandas-docs/stable/index.html|Pandas}
 * so someone familiar with Pandas can get up to speed very quickly
 * 
 * * {@link https://gmousse.gitbooks.io/dataframe-js/|dataframe-js} -
 * provides an immutable data structure for DataFrames
 * which allows to work on rows and columns with a sql
 * and functional programming inspired api.
 * 
 * * {@link https://github.com/stdlib-js/stdlib|StdLib} - 
 * is a great library that compiles down to C/C++ level to provide speeds comparable to Numpy.
 * 
 * * {@link https://www.npmjs.com/package/numjs | NumJS}
 * is also a great number processing library.
 * It may not be as fast as StdLib, but it can sometimes be easier to use.
 * 
 * @module group
 * @exports group
 */
module.exports = {};
const GroupUtils = module.exports;

/**
 * Group a collection into multiple levels of maps.
 * 
 * @param {Array} collection - Array of objects or two dimensional array
 * @param {String|Number} key - the key to group the collection by
 * @param {...String} key - the additional keys to group the collection by
 * @returns {SourceMap} - collection of results with the source as the key used for that level
 * 
 * For example:
 * 
 * ```
 * initializeWeather = () => [
 *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
 *   { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
 *   { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31 },
 *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
 *   { id: 4, city: 'New York', month: 'Aug', precip: 4.13 },
 *   { id: 5, city: 'New York', month: 'Dec', precip: 3.58 },
 *   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 },
 *   { id: 8, city: 'Chicago',  month: 'Dec', precip: 2.56 },
 *   { id: 7, city: 'Chicago',  month: 'Aug', precip: 3.98 }
 * ];
 * weather = initializeWeather();
 * 
 * utils.group.by(weather, 'city')
 * ```
 * 
 * // provides
 * 
 * ```
 * SourceMap(3) [Map] {
 *   'Seattle' => [
 *     { id: 1, city: 'Seattle', month: 'Aug', precip: 0.87 },
 *     { id: 0, city: 'Seattle', month: 'Apr', precip: 2.68 },
 *     { id: 2, city: 'Seattle', month: 'Dec', precip: 5.31 }
 *   ],
 *   'New York' => [
 *     { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
 *     { id: 4, city: 'New York', month: 'Aug', precip: 4.13 },
 *     { id: 5, city: 'New York', month: 'Dec', precip: 3.58 }
 *   ],
 *   'Chicago' => [
 *     { id: 6, city: 'Chicago', month: 'Apr', precip: 3.62 },
 *     { id: 8, city: 'Chicago', month: 'Dec', precip: 2.56 },
 *     { id: 7, city: 'Chicago', month: 'Aug', precip: 3.98 }
 *   ],
 *   source: 'city'
 * }
 * ```
 * 
 * or using multiple groups:
 * `utils.group.by(weather, 'month', 'city')`
 * 
 * provides:
 * 
 * ```
 * SourceMap(3) [Map] {
 *   'Aug' => SourceMap(3) [Map] {
 *     'Seattle' => [ [Object] ],
 *     'New York' => [ [Object] ],
 *     'Chicago' => [ [Object] ],
 *     source: 'city'
 *   },
 *   'Apr' => SourceMap(3) [Map] {
 *     'Seattle' => [ [Object] ],
 *     'New York' => [ [Object] ],
 *     'Chicago' => [ [Object] ],
 *     source: 'city'
 *   },
 *   'Dec' => SourceMap(3) [Map] {
 *     'Seattle' => [ [Object] ],
 *     'New York' => [ [Object] ],
 *     'Chicago' => [ [Object] ],
 *     source: 'city'
 *   },
 *   source: 'month'
 * }
```
 */
module.exports.by = function by(collection, prop, ...rest) {
  const resultMap = new SourceMap();
  if (!collection || !Array.isArray(collection) || collection.length < 1) {
    throw (Error('Group.By:Collection is not an array'));
  }
  
  resultMap.source = prop;

  collection.forEach((item, index) => {
    let val = item[prop];

    if (val instanceof Date) {
      val = val.toISOString();
    }
    
    if (!resultMap.has(val)) {
      resultMap.set(val, [item]);
    } else {
      resultMap.get(val).push(item);
    }
  });
  
  if (rest.length > 0) {
    //-- do the next level
    [...resultMap.keys()].forEach((key) => {
      const newCollection = resultMap.get(key);
      resultMap.set(key, GroupUtils.by.apply(this, [newCollection, ...rest]));
    });
  }
  
  return resultMap;
};

/**
 * Group and "Reduce" a collection of records.
 * 
 * (Similar to {@link https://observablehq.com/@d3/d3-group|d3 - rollup})
 * 
 * @param {Array} collection - Collection to be rolled up
 * @param {Function} reducer - {(Array) => any} Function to reduce the group of records down
 * @param {String} prop - The property on the objects to group by
 * @param  {...any} fields - Additional fields to group by
 * @returns {SourceMap} - a reduced sourceMap, where only the leaves of the groups are reduced
 * @see {@link SourceMap#map} - Used to reduce or filter records
 * @see {@link module:group.by|group.by(collection, fields, ...)} - to group records
 * 
 * @example
 * weather = [
 *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, dateTime: new Date(2020, 7, 1)  , year: 2020},
 *   { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31, dateTime: new Date(2020, 11, 1) , year: 2020},
 *   { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68, dateTime: new Date(2021, 3, 1)  , year: 2021},
 *   { id: 4, city: 'New York', month: 'Aug', precip: 4.13, dateTime: new Date(2020, 7, 1)  , year: 2020},
 *   { id: 5, city: 'New York', month: 'Dec', precip: 3.58, dateTime: new Date(2020, 11, 1) , year: 2020},
 *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94, dateTime: new Date(2021, 3, 1)  , year: 2021},
 *   { id: 7, city: 'Chicago',  month: 'Aug', precip: 3.98, dateTime: new Date(2020, 7, 1)  , year: 2020},
 *   { id: 8, city: 'Chicago',  month: 'Dec', precip: 2.56, dateTime: new Date(2020, 11, 1) , year: 2020},
 *   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, dateTime: new Date(2021, 3, 1)  , year: 2021}
 * ];
 * 
 * utils.group.rollup(weather, (collection) => collection.length, 'city')
 * 
 * // SourceMap(3) [Map] {
 * //   'Seattle' => 3,
 * //   'New York' => 3,
 * //   'Chicago' => 3,
 * //   source: 'city'
 * // }
 * 
 * utils.group.rollup(weather, r => r.length, 'city', 'year')
 * 
 * //  SourceMap(3) [Map] {
 * //   'Seattle' => SourceMap(2) [Map] { 2020 => 2, 2021 => 1, source: 'year' },
 * //   'New York' => SourceMap(2) [Map] { 2021 => 1, 2020 => 2, source: 'year' },
 * //   'Chicago' => SourceMap(2) [Map] { 2021 => 1, 2020 => 2, source: 'year' },
 * //   source: 'city'
 * // }
 */
module.exports.rollup = function rollup(collection, reducer, prop, ...fields) {
  return GroupUtils.by.apply(this, [collection, prop, ...fields])
    .map(reducer);
};

/**
 * Vega needs the series on separate objects.
 * 
 * Each object then made per group leaf collection, preserving the groups used to make it.
 * 
 * The object generated by the function is then merged.
 * 
 * See [vega-lite fold transform](https://vega.github.io/vega-lite/docs/fold.html)
 * 
 * @example
 * aggregateWeather = utils.group.by(weather, 'city')
 *   .reduce((group) => ({
 *     min: utils.agg.min(group, 'precip'),
 *     max: utils.agg.max(group, 'precip'),
 *     avg: utils.agg.avgMean(group, 'precip')
 *   }));
 * 
 * //-- gives
 * 
 * [
 *   { city: 'Seattle', min: 0.87, max: 5.31, avg: 2.953 },
 *   { city: 'New York', min: 3.58, max: 4.13, avg: 3.883 },
 *   { city: 'Chicago', min: 2.56, max: 3.98, avg: 3.387 }
 * ]
 * 
 * utils.group.separateByFields(aggregateWeather, 'min', 'max', 'avg');
 * 
 * //-- gives
 * [
 *   { city: 'Seattle', min: 0.87, max: 5.31, avg: 2.953,  key: 'min', value: 0.87 },
 *   { city: 'New York', min: 3.58, max: 4.13, avg: 3.883, key: 'min', value: 3.58 },
 *   { city: 'Chicago', min: 2.56, max: 3.98, avg: 3.387,  key: 'min', value: 2.56 },
 *   { city: 'Seattle', min: 0.87, max: 5.31, avg: 2.953,  key: 'max', value: 5.31 },
 *   { city: 'New York', min: 3.58, max: 4.13, avg: 3.883, key: 'max', value: 4.13 },
 *   { city: 'Chicago', min: 2.56, max: 3.98, avg: 3.387,  key: 'max', value: 3.98},
 *   ...
 * ]
 * 
 * @TODO - Vega needs series on separate records
 * @param {Array} collection - array of objects
 * @param  {...any} fields - string field name to separate by
 * @returns {Array}
 */
module.exports.separateByFields = function separateByFields(collection, ...fields) {
  if (!collection || !Array.isArray(collection)) {
    throw (Error('SeparateByFields: collection should be an array'));
  }
  if (!fields || !Array.isArray(fields) || fields.length < 1) {
    throw (Error('separateByFields: fields are expected'));
  }
  return fields.flatMap((field) => collection.map((obj) => ({ ...obj, key: field, value: obj[field] })));
};

/**
 * Index a collection of records to a map based on a specific value.
 * 
 * Unlike group.by, only one indexing function is accepted.
 * 
 * This is very helpful for joining records of two separate groups.
 * 
 * @param {Array} collection - Collection of objects to index by a specific field or value
 * @param {Function | String} indexFn - the propert name or function evaluating to a value for the index
 * @returns {Map}
 * 
 * @example
 * athletes = [
 *   {name: "Neymar", sport: "Soccer", nation: "Brazil", earnings: 90},
 *   {name: "LeBron James", sport: "Basketball", nation: "United States",  earnings: 85.5},
 *   {name: "Roger Federer", sport: "Tennis", nation: "Switzerland", earnings: 77.2},
 * ];
 * 
 * facts = [
 *   {about: "Neymar", fact: "Neymar is Neymar da Silva Santos Júnior"},
 *   {about: "Roger Federer", fact: "Federer has won 20 Grand Slam men's singles titles"},
 *   {about: "Megan Rapinoe", fact: "Rapinoe was named The Best FIFA Women's Player in 2019"}
 * ];
 * 
 * athletesByName = utils.group.index(athletes, 'name');
 * facts.map(({about: name, ...rest}) => ({...rest, name, ...athletesByName.get(name)}));
 * 
 * // [
 * //   {
 * //     fact: 'Neymar is Neymar da Silva Santos Júnior',
 * //     name: 'Neymar', sport: 'Soccer', nation: 'Brazil', earnings: 90
 * //   },
 * //   {
 * //     fact: "Federer has won 20 Grand Slam men's singles titles",
 * //     name: 'Roger Federer', sport: 'Tennis', nation: 'Switzerland', earnings: 77.2
 * //   },
 * //   //-- not found
 * //   {
 * //     fact: "Rapinoe was named The Best FIFA Women's Player in 2019",
 * //     name: 'Megan Rapinoe'
 * //   }
 * // ]
 */
module.exports.index = function index(collection, indexFn) {
  const resultMap = new Map();
  if (!collection || !Array.isArray(collection) || collection.length < 1) {
    throw (Error('group.index: Collection is not an array'));
  }
  
  const cleanedIndexFn = ObjectUtils.evaluateFunctionOrProperty(indexFn);

  collection.forEach((item, offset) => {
    let val = cleanedIndexFn(item, offset);

    if (val instanceof Date) {
      val = val.toISOString();
    }

    if (resultMap.has(val)) {
      throw Error(`group.index: found duplicate item with index:${val} \n ${JSON.stringify(resultMap.get(val))}`);
    }

    resultMap.set(val, item);
  });
  
  return resultMap;
};
