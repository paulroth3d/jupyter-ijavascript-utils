const addObjectProperty = (obj, property, value) => {
  // eslint-disable-next-line no-param-reassign
  obj[property] = value;
  return obj;
};

/**
 * Simple class that extends Map - to include a source and toString fixes.
 * 
 * Specifically generated from {@link module:group.by|group.by(collection, ...)}
 * 
 * * Reduce Group Magic
 *   * {@link SourceMap#reduce|SourceMap.reduce(fn)} - Reduce the groups held within to objects - for reports
 *   * {@link SourceMap#reduceSeparate|SourceMap.reduceSeparate(fn)} - Reduce the groups to objects - for charts
 *   * {@link SourceMap#map|SourceMap.map(fn)} - Map the leaf (array) collection to allow for sorting, filtering, reducing, etc.
 * * Source functionality
 *   * {@link SourceMap#getSource|SourceMap.getSource} - specify the source of how the group was made
 *   * {@link SourceMap#setSource|SourceMap.setSource} - get the source of how the group was made
 * * Fixing Map toString / JSON.Stringify common issues
 *   * {@link SourceMap.stringifyReducer|SourceMap.stringifyReducer} - JSON.stringify(map, reducer) - to allow maps to convert
 *   * {@link SourceMap#toJSON|SourceMap.toJSON} - Corrected toJSON functionality, so it works as expected
 *   * {@link SourceMap#toString|SourceMap.toString} - Corrected toString functionality, so it works as expected
 */
class SourceMap extends Map {
  /**
   * The property the map was sourced from
   * @type {String}
   */
  source;

  /**
   * Specify the source
   * @param {Strinng} source -
   */
  setSource(source) {
    this.source = source;
  }

  /**
   * Getter for the source
   * @returns {String}
   */
  getSource() {
    return this.source;
  }

  /**
   * Use this for a reducer for Maps if ever needed.
   * 
   * (NOTE: SourceMap already uses this where needed, you only would use this for normal maps)
   * 
   * `JSON.stringify(new Map())` doesn't work well, it just returns `Map()`
   * - regardless of what it contains
   * 
   * instead use something like this:
   * 
   * ```
   * //-- can be a map, or any object, even one including a map
   * const toBeStringified = { value: 'a', map: new Map() };
   * 
   * //-- simple destructure to make it easier to access
   * const stringifyReducer = utils.SourceMap.stringifyReducer;
   * 
   * //-- pass it in as the second argument
   * JSON.stringify(toBeStringified, stringifyReducer);
   * 
   * // returns
   * {"value":"a","map":{"dataType":"Map","value":[["A",1],["B",2]]}}
   * 
   * //-- or on a traditional map
   * const standardMap = new Map([['a', 1], ['b', 2]]);
   * 
   * JSON.stringify(standardMap, stringifyReducer);
   * 
   * // returns
   * {"dataType":"Map","value":[["a",1],["b",2]]}
   * ```
   * 
   * @param {String} key - the name of the property
   * @param {any} value -
   * @returns {Object}
   */
  static stringifyReducer(key, value) {
    if (value instanceof SourceMap) {
      return {
        dataType: 'SourceMap',
        source: value.source,
        data: Array.from(value.entries())
      };
    } else if (value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    }
    return value;
  }

  /**
   * toString() override to use the stringify reducer.
   * 
   * Now you can use `String(sourceMapInstance)` and it will work correctly.
   * 
   * ```
   * //-- for instance
   * String(sourceMapInstance)
   * ```
   * 
   * provides
   * 
   * ```
   * {"dataType":"SourceMap","source":"city","data":
   * [["Seattle",{"dataType":"SourceMap","source":"month","data":
   * [["Aug",[{"id":1,"city":"Seattle","month":"Aug","precip":0.87}]],
   * ["Apr",[{"id":0,"city":"Seattle","month":"Apr","precip":2.68}]],
   * ["Dec",[{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]]]}],
   * ["New York",{"dataType":"SourceMap","source":"month","data":
   * [["Apr",[{"id":3,"city":"New York","month":"Apr","precip":3.94}]],
   * ["Aug",[{"id":4,"city":"New York","month":"Aug","precip":4.13}]],
   * ["Dec",[{"id":5,"city":"New York","month":"Dec","precip":3.58}]]]}],
   * ["Chicago",{"dataType":"SourceMap","source":"month","data":
   * [["Apr",[{"id":6,"city":"Chicago","month":"Apr","precip":3.62}]],
   * ["Dec",[{"id":8,"city":"Chicago","month":"Dec","precip":2.56}]],
   * ["Aug",[{"id":7,"city":"Chicago","month":"Aug","precip":3.98}]]]}]]}
   * ```
   * 
   * @returns {String}
   */
  toString() {
    return JSON.stringify(this, SourceMap.stringifyReducer);
  }

  /**
   * `toJSON()` override.
   * 
   * Now you can use `JSON.stringify(sourceMapInstance)` and it will work correctly
   * 
   * or within Jupyter / iJavaScript:
   * 
   * ```
   * $$.json(sourceMapInstance)
   * ```
   * 
   * and you can explore the values in collapsing folders
   * 
   * ![Screenshot using $$.json](img/SourceMap_jsonExplore.png)
   * 
   * @returns {Object}
   */
  toJSON() {
    return {
      dataType: 'SourceMap',
      source: this.source,
      data: Array.from(this.entries())
    };
  }

  /**
   * Reduces a SourceMap by groups, to a collection of objects that can be printed.
   * 
   * Note that the ReduceFn is called at the grouped collection of records level,
   * not the entire collection.
   * 
   * This can be very helpful when working with tables.
   * 
   * ```
   * new utils.TableGenerator(
   *   utils.group.by(weather, 'city')
   *     .reduce((group) => ({
   *       min: utils.agg.min(group, 'precip'),
   *       max: utils.agg.max(group, 'precip'),
   *       avg: utils.agg.avgMean(group, 'precip')
   *     }))
   * )
   *   .render()
   * ```
   * 
   * ![Screenshot of reduce with table](img/aggregateReduceTable.png)
   * 
   * @param {Function} reduceFn - (collection, props) => {Object} - Function that reduces the collection to an object
   * @param {Array} reduceFn.collection - the collection of records in the group
   * @param {Object} reduceFn.collectionProps - the properties and values the collection was grouped by
   * @returns {Array} - Array of objects merged with the parent group attributes and reduceFn result
   * @see {@link SourceMap#reduceSeparate|reduceSeparate()} - for separate objects - useful for vega charts
   * @example
   * collection = [
   *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
   *   { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
   *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
   *   { id: 4, city: 'New York', month: 'Aug', precip: 4.13 }
   * ];
   * utils.group.by(collection, 'city')
   *    .reduce((records) => {
   *      min: utils.aggregate.min('precip'),
   *      max: utils.aggregate.min('precip'),
   *      avg: utils.aggregate.avgMean('precip')
   *    });
   * //-- results
   * [{ city: 'Seattle', min: 0.87, max: 2.68, avg: 1.78 },
   *  { city: 'New York', min: 3.94, max: 4.13, avg: 4.06 }];
   */
  reduce(reduceFn) {
    return SourceMap.reduceGroup(this, reduceFn, {});
  }

  /**
   * Reduces a SourceMap by groups, to a collection of objects that can be printed.
   * 
   * **This can be very helpful when working with tables.**
   * 
   * ```
   * new utils.TableGenerator(
   *   utils.group.by(weather, 'city')
   *     .reduce((group) => ({
   *       min: utils.agg.min(group, 'precip'),
   *       max: utils.agg.max(group, 'precip'),
   *       avg: utils.agg.avgMean(group, 'precip')
   *     }))
   * )
   *   .render()
   * ```
   * 
   * ![Screenshot of reduce with table](img/aggregateReduceTable.png)
   * 
   * @param {Function} reduceFn - (collection, props) => {Object} - Function that reduces the collection to an object
   * @param {Array} reduceFn.collection - the collection of records in the group
   * @param {Object} reduceFn.collectionProps - the properties and values the collection was grouped by
   * @returns {Array} - Array of objects merged with the parent group attributes and reduceFn result
   * @see {@link SourceMap#reduce|reduce()} - to call this method from an instance
   * @private
   * @example
   * collection = [
   *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
   *   { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
   *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
   *   { id: 4, city: 'New York', month: 'Aug', precip: 4.13 }
   * ];
   * utils.group.by(collection, 'city')
   *    .reduce((records) => ({
   *      min: utils.aggregate.min('precip'),
   *      max: utils.aggregate.min('precip'),
   *      avg: utils.aggregate.avgMean('precip')
   *    }));
   * //-- results
   * [{ city: 'Seattle', min: 0.87, max: 2.68, avg: 1.78 },
   *  { city: 'New York', min: 3.94, max: 4.13, avg: 4.06 }];
   */
  static reduceGroup(sourceMap, reduceFn, currentObj = {}) {
    if (sourceMap instanceof SourceMap) {
      // console.log('found sourceMap');
      const results = Array.from(sourceMap.entries())
        .flatMap(([key, values]) => SourceMap.reduceGroup(
          values,
          reduceFn,
          addObjectProperty(currentObj, sourceMap.source, key)
        ));
      // console.log('sourceMapResults: ' + JSON.stringify(results));
      return results;
    } else if (!Array.isArray(sourceMap)) {
      throw (Error('reduceGroups only works on arrays or sourceMaps'));
    }
    
    //-- collection should either be SourceMap or Array
    const results = [({ ...currentObj, ...reduceFn(sourceMap, currentObj) })];
    // console.log('array results: ' + JSON.stringify(results));
    return results;
  }

  /**
   * Reduces, but puts each aggregate value on a separate record.
   * 
   * **This is particularly useful for charting vega, as series must be on separate objects.**
   * 
   * Each object then made per group leaf collection, preserving the groups used to make it.
   * 
   * The object generated by the function is then merged.
   * 
   * ```
   * utils.vega.svg((vl) => vl.markLine()
   *     .data(
   *         utils.group.by(weather, 'city')
   *             .reduceSeparate((group) => ({
   *                 min: utils.agg.min(group, 'precip'),
   *                 max: utils.agg.max(group, 'precip'),
   *                 avg: utils.agg.avgMean(group, 'precip')
   *             }))
   *     )
   *     .width(200)
   *     .encode(
   *         vl.x().fieldN('city'),
   *         vl.y().fieldQ('_aggregateValue'),
   *         vl.color().fieldN('_aggregateKey')
   * ));
   * ```
   * 
   * ![Screenshot of reduce with chart](img/aggregateReduceSeparateChart.png)
   * 
   * @param {Function} reduceFn - (collection, props) => {Object} - Function that reduces the collection to an object
   * @param {Array} reduceFn.collection - the collection of records in the group
   * @param {Object} reduceFn.collectionProps - the properties and values the collection was grouped by
   * @returns {Array}
   * @see {@link SourceMap#reduce|reduce()} - for a compact object with multiple aggregate values, useful for tables
   * @example
   * utils.group.by(weather, 'city')
   *   .reduceSeparate((group) => ({
   *     min: utils.agg.min(group, 'precip'),
   *     max: utils.agg.max(group, 'precip'),
   *     avg: utils.agg.avgMean(group, 'precip')
   *   }));
   * 
   * //-- results
   * [
   *   { city: 'Seattle', _aggregateKey: 'min', _aggregateValue: 0.87 },
   *   { city: 'Seattle', _aggregateKey: 'max', _aggregateValue: 5.31 },
   *   { city: 'Seattle', _aggregateKey: 'avg', _aggregateValue: 2.953 },
   *   { city: 'New York', _aggregateKey: 'min', _aggregateValue: 3.58 },
   *   { city: 'New York', _aggregateKey: 'max', _aggregateValue: 4.13 },
   *   { city: 'New York', _aggregateKey: 'avg', _aggregateValue: 3.883 },
   *   { city: 'Chicago', _aggregateKey: 'min', _aggregateValue: 2.56 },
   *   { city: 'Chicago', _aggregateKey: 'max', _aggregateValue: 3.98 },
   *   { city: 'Chicago', _aggregateKey: 'avg', _aggregateValue: 3.387 }
   * ]
   */
  reduceSeparate(reduceFn) {
    return SourceMap.reduceGroupSeparate(this, reduceFn, {});
  }

  /**
   * Reduces, but puts each aggregate value on a separate record.
   * 
   * This is particularly useful for charting vega, as series must be on separate objects.
   * 
   * ```
   * utils.vega.svg((vl) => vl.markLine()
   *     .data(
   *         utils.group.by(weather, 'city')
   *             .reduceSeparate((group) => ({
   *                 min: utils.agg.min(group, 'precip'),
   *                 max: utils.agg.max(group, 'precip'),
   *                 avg: utils.agg.avgMean(group, 'precip')
   *             }))
   *     )
   *     .width(200)
   *     .encode(
   *         vl.x().fieldN('city'),
   *         vl.y().fieldQ('_aggregateValue'),
   *         vl.color().fieldN('_aggregateKey')
   * ));
   * ```
   * 
   * ![Screenshot of reduce with chart](img/aggregateReduceSeparateChart.png)
   * 
   * @param {SourceMap} sourceMap -
   * @param {Function} reduceFn - (collection, props) => {Object} - Function that reduces the collection to an object
   * @param {Array} reduceFn.collection - the collection of records in the group
   * @param {Object} reduceFn.collectionProps - the properties and values the collection was grouped by
   * @param {Object} currentObj - values to inject into the results
   * @returns {Array}
   * @see {@link SourceMap#reduce|reduceSeparate()} - to call this method from an instance
   * @private
   * @example
   * utils.group.by(weather, 'city')
   *   .reduceSeparate((group) => ({
   *     min: utils.agg.min(group, 'precip'),
   *     max: utils.agg.max(group, 'precip'),
   *     avg: utils.agg.avgMean(group, 'precip')
   *   }));
   * 
   * //-- results
   * [
   *   { city: 'Seattle', _aggregateKey: 'min', _aggregateValue: 0.87 },
   *   { city: 'Seattle', _aggregateKey: 'max', _aggregateValue: 5.31 },
   *   { city: 'Seattle', _aggregateKey: 'avg', _aggregateValue: 2.953 },
   *   { city: 'New York', _aggregateKey: 'min', _aggregateValue: 3.58 },
   *   { city: 'New York', _aggregateKey: 'max', _aggregateValue: 4.13 },
   *   { city: 'New York', _aggregateKey: 'avg', _aggregateValue: 3.883 },
   *   { city: 'Chicago', _aggregateKey: 'min', _aggregateValue: 2.56 },
   *   { city: 'Chicago', _aggregateKey: 'max', _aggregateValue: 3.98 },
   *   { city: 'Chicago', _aggregateKey: 'avg', _aggregateValue: 3.387 }
   * ]
   */
  static reduceGroupSeparate = (sourceMap, reduceFn, currentObj = {}) => {
    if (sourceMap instanceof SourceMap) {
      //console.log('found sourceMap');
      const results = Array.from(sourceMap.entries())
        .flatMap(([key, values]) => SourceMap.reduceGroupSeparate(
          values,
          reduceFn,
          addObjectProperty(currentObj, sourceMap.source, key)
        ));
      // console.log('sourceMapResults: ' + JSON.stringify(results));
      return results;
    } else if (!Array.isArray(sourceMap)) {
      throw (Error('reduceGroups only works on arrays or sourceMaps'));
    }
    
    const results = Object.entries(reduceFn(sourceMap, currentObj))
      .map(([_aggregateKey, _aggregateValue]) => ({ ...currentObj, _aggregateKey, _aggregateValue }));
    // console.log('array results: ' + JSON.stringify(results));
    return results;
  }

  /**
   * Convenience function for reduceGroup.
   * 
   * Instead of providing a function to reduce, provide an object
   * 
   * @param {SourceMap} sourceMap - source to be reduced by group
   * @param {Object} obj - each property as {(collection) => result}
   * @returns {Array} - Array of objects merged with the parent group attributes and reduceFn result
   * @see SourceMap.reduceGroup
   * @deprecated - not as much of a convenience, and causes confusion
   * @private
   * @example
   * collection = [
   *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
   *   { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
   *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
   *   { id: 4, city: 'New York', month: 'Aug', precip: 4.13 }
   * ];
   * 
   * //-- provides
   * [
   *   { city: 'Seattle', month: 'Aug', precipitation: 0.87, numReports: 1 },
   *   { city: 'Seattle', month: 'Apr', precipitation: 2.68, numReports: 1 },
   *   { city: 'New York', month: 'Apr', precipitation: 3.94, numReports: 1 },
   *   { city: 'New York', month: 'Aug', precipitation: 4.13, numReports: 1 }
   * ]
   */
  objectReduce(reductionObject) {
    return SourceMap.objectReduce(this, reductionObject);
  }

  /**
   * Convenience function for reduceGroup.
   * 
   * Instead of providing a function to reduce, provide an object
   * 
   * @param {SourceMap} sourceMap - source to be reduced by group
   * @param {Object} obj - each property as {(collection) => result}
   * @returns {Array} - Array of objects merged with the parent group attributes and reduceFn result
   * @see SourceMap.reduceGroup
   * @deprecated - not as much of a convenience, and causes confusion
   * @private
   * @example
   * collection = [
   *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
   *   { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
   *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
   *   { id: 4, city: 'New York', month: 'Aug', precip: 4.13 }
   * ];
   * 
   * //-- provides
   * [
   *   { city: 'Seattle', month: 'Aug', precipitation: 0.87, numReports: 1 },
   *   { city: 'Seattle', month: 'Apr', precipitation: 2.68, numReports: 1 },
   *   { city: 'New York', month: 'Apr', precipitation: 3.94, numReports: 1 },
   *   { city: 'New York', month: 'Aug', precipitation: 4.13, numReports: 1 }
   * ]
   */
  static objectReduce(sourceMap, obj) {
    if (typeof obj !== 'object') {
      throw (Error('reducerObject: Expecting an object as the argument'));
    }
    const entities = Object.entries(obj)
      .filter(([key, val]) => {
        if (typeof val === 'function') {
          return true;
        }
        throw (Error('generateObjectFn: all properties should be {(collection) => result}'));
      });
    
    const reduceFn = (collection) => Object.fromEntries(
      entities.map(([key, fn]) => [key, fn(collection)])
    );

    return SourceMap.reduceGroup(sourceMap, reduceFn);
  }

  /**
   * Maps a collection within the sourceMap by a function.
   * 
   * Note that this only maps the leaf collection of values, not the intermediary levels.
   * 
   * This can be useful from everything from:
   * * sorting the leaf collections,
   * * filtering the results to only those that meet certain criteria,
   * * to an alternative form of reducing the values,
   * * or even combinations of the three or more:
   * 
   * @param {Function} mapFn - {(array) => any} Function to apply to the leaf collections (arrays)
   * @param {Array} mapFn.collection - the collection of records in the group
   * @param {Object} mapFn.collectionProps - the properties and values the collection was grouped by
   * @returns {SourceMap} - New SourceMap with the leaf collections updated to the results from mapFn
   * 
   * @example
   * const data = [
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
   * utils.group.by(weather, 'city')
   *   .map(collection => collection.length);
   * 
   * // SourceMap(3) [Map] {
   * //   'Seattle' => 3,
   * //   'New York' => 3,
   * //   'Chicago' => 3,
   * //   source: 'city'
   * // }
   * 
   * utils.group.by(weather, 'city')
   *     .map(collection => collection.filter(r => r.year === 2020))
   *     .map(collection => collection.length);
   * 
   * // SourceMap(3) [Map] {
   * //   'Seattle' => 2,
   * //   'New York' => 2,
   * //   'Chicago' => 2,
   * //   source: 'city'
   * // }
   */
  map(mapFn) {
    return SourceMap.mapCollection(this, mapFn);
  }

  /**
   * Implementatin for map.
   * @private
   */
  static mapCollection(sourceMap, mapFn, currentObj = {}) {
    const result = new SourceMap();
    result.source = sourceMap.source;
    for (const [key, value] of sourceMap.entries()) {
      if (value instanceof Map) {
        result.set(key, SourceMap.mapCollection(
          value,
          mapFn,
          addObjectProperty(currentObj, result.source, key)
        ));
      } else {
        result.set(key, mapFn(value, currentObj));
      }
    }
    return result;
  }
}

module.exports = SourceMap;
