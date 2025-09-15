const FormatUtils = require('./format');

/**
 * Library for working with JavaScript hashmaps.
 * 
 * * Modifying
 *   * {@link module:hashMap.add|hashMap.add(map, key, value):Map} - Add a value to a map and return the Map
 *   * {@link module:hashMap.update|hashMap.update(map, key, function)} - use a function to get/set a value on a map
 *   * {@link module:hashMap.union|hashMap.union(targetMap, additionalMap, canOverwrite)} - merges two maps and ignores or overwrites with conflicts
 * * Cloning
 *   * {@link module:hashMap.clone|hashMap.clone(map):Map} - Clones a given Map
 * * Conversion
 *   * {@link module:hashMap.stringify|hashMap.stringify(map, indent)} - converts a Map to a string representation
 *   * {@link module:hashMap.toObject|hashMap.toObject(map)} - converts a hashMap to an Object
 *   * {@link module:hashMap.fromObject|hashMap.fromObject(object)} - converts an object's properties to hashMap keys
 *   * {@link module:hashMap.reverse|hashMap.reverse(map)} - swaps the key and value in the resulting map.
 * 
 * Note: JavaScript Maps can sometimes be faster than using Objects,
 * and sometimes slower.
 * 
 * (Current understanding is that Maps do better with more updates made)
 * 
 * There are many searches such as `javascript map vs object performance`
 * with many interesting links to come across.
 * 
 * @module hashMap
 * @exports hashMap
 */
module.exports = {};
const HashMapUtil = module.exports;

/**
 * Set a Map in a functional manner (adding a value and returning the map)
 * @param {Map} map - the map to be updated
 * @param {any} key -
 * @param {any} value -
 * @returns {Map} - the updated map value
 * @example
 * const objectToMap = { key1: 1, key2: 2, key3: 3 };
 * const keys = [...Object.keys(objectToMap)];
 * // ['key1', 'key2', 'key3'];
 * 
 * keys.reduce(
 *  (result, key) => utils.hashMap.add(result, key, objectToMap[key]),
 *  new Map()
 * );
 * // Map([[ 'key1',1 ], ['key2', 2], ['key3', 3]]);
 */
module.exports.add = function add(map, key, value) {
  map.set(key, value);
  return map;
};

/**
 * Use this for times where you want to update a value
 * 
 * ```
 * key = 'somethingToIncrement';
 * defaultValue = null;
 * 
 * const initialMap = new Map([
 *   [key, defaultValue]
 * ]);
 * // Map([[ 'somethingToIncrement', null ]]);
 * 
 * const functor = (value) => { //, key, map) => {
 *   if (!value) return 1;
 *   return value + 1;
 * };
 * 
 * utils.hashMap.getSet(initialMap, key, functor);
 * utils.hashMap.getSet(initialMap, key, functor);
 * utils.hashMap.getSet(initialMap, key, functor);
 * utils.hashMap.getSet(initialMap, key, functor);
 * utils.hashMap.getSet(initialMap, key, functor);
 * 
 * initialMap.get(key); // 5
 * ```
 * 
 * @param {Map} map - map to get and set values from
 * @param {any} key - they key to GET and SET the value (unless setKey is provided)
 * @param {Function} functor - the function called with the arguments below - returning the value to set
 * @param {any} functor.value - the first argument is the current value
 * @param {any} functor.key - the second argument is the key passed
 * @param {any} functor.map - the third argument is the map being acted upon
 * @returns {Map}
 */
module.exports.getSet = function getSet(map, key, functor) {
  const currentValue = map.has(key) ? map.get(key) : undefined;
  map.set(key, functor(currentValue, key, map));
  return map;
};
module.exports.update = module.exports.getSet;

/**
 * Clones a Map
 * @param {Map} target - Map to clone
 * @returns {Map} - clone of the target map
 * @example
 * const sourceMap = new Map();
 * sourceMap.set('first', 1);
 * const mapClone = utils.hashMap.clone(sourceMap);
 * mapClone.has('first'); // true
 */
module.exports.clone = function clone(target) {
  if (!(target instanceof Map)) {
    throw Error('hashMap.clone(targetMap): targetMap must be a Map');
  }
  return new Map(target.entries());
};

/**
 * Creates a new map that includes all entries of targetMap, and all entries of additionalMap.
 * 
 * If allowOverwrite is true, then values found in additionalMap will take priority in case of conflicts.
 * 
 * ```
 * const targetMap = new Map([['first', 'John'], ['amount', 100]]);
 * const additionalMap = new Map([['last', 'Doe'], ['amount', 200]]);
 * 
 * utils.hashMap.union(targetMap, additionalMap, true);
 * // Map([['first', 'John'], ['last', 'Doe'], ['amount', 200]]);
 * ```
 * 
 * If allowOverwrite is false, then values found in targetMap will take priority in case of conflicts.
 * 
 * ```
 * const targetMap = new Map([['first', 'John'], ['amount', 100]]);
 * const additionalMap = new Map([['last', 'Doe'], ['amount', 200]]);
 * 
 * utils.hashMap.union(targetMap, additionalMap);
 * utils.hashMap.union(targetMap, additionalMap, false);
 * // Map([['first', 'John'], ['last', 'Doe'], ['amount', 100]]);
 * ```
 * 
 * @param {Map} targetMap 
 * @param {Map} additionalMap - 
 * @param {Boolean} [allowOverwrite=false] - whether targetMap is prioritized (false) or additional prioritized (true)
 * @returns {Map}
 */
module.exports.union = function union(targetMap, additionalMap, allowOverwrite) {
  if (!(targetMap instanceof Map)) {
    return HashMapUtil.clone(additionalMap);
  }

  const result = new Map(targetMap.entries());

  if (!(additionalMap instanceof Map)) {
    return result;
  }

  for (const key of additionalMap.keys()) {
    if (!result.has(key) || allowOverwrite) {
      result.set(key, additionalMap.get(key));
    }
  }
  return result;
};

/**
 * Serializes a hashMap (plain javascript Map) to a string
 * 
 * ```
 * const target = new Map([['first', 1], ['second', 2]]);
 * utils.hashMap.stringify(target);
 * // '{"dataType":"Map","value":[["first",1],["second",2]]}'
 * ```
 * 
 * Note, that passing indent will make the results much more legible.
 * 
 * ```
 * {
 *   "dataType": "Map",
 *   "value": [
 *     [
 *       "first",
 *       1
 *     ],
 *     [
 *       "second",
 *       2
 *     ]
 *   ]
 * }
 * ```
 * @param {Map} target - the Map to be serialized
 * @param {Number} indentation - the indentation passed to JSON.serialize
 * @returns {String} - JSON.stringify string for the map
 */
module.exports.stringify = function stringify(map, indentation) {
  return JSON.stringify(map, FormatUtils.mapReplacer, indentation);
};

/**
 * Converts a map to an object
 * 
 * For example, say we have a Map:
 * 
 * ```
 * const targetMap = new Map([['first', 1], ['second', 2], ['third', 3]]);
 * ```
 * 
 * We can convert it to an Object as follows:
 * 
 * ```
 * utils.hashMap.toObject(targetMap)
 * // { first: 1, second: 2, third: 3 };
 * ```
 * 
 * @param {Map} target - map to be converted
 * @returns {Object} - object with the properties as the target map's keys.
 * @see {@link hashMap.fromObject} - to reverse the process
 */
module.exports.toObject = function toObject(target) {
  const results = {};

  if (!target) { // eslint-disable-line no-empty
  } else if (!(target instanceof Map)) {
    throw Error('hashMap.toObject(map): must be passed a Map');
  } else {
    [...target.keys()]
      .forEach((key) => {
        results[key] = target.get(key);
      });
  }

  return results;
};

/**
 * Creates a Map from the properties of an Object
 * 
 * For example, say we have an object:
 * 
 * ```
 * const targetObject = { first: 1, second: 2, third: 3 };
 * ```
 * 
 * We can convert it to a Map as follows:
 * 
 * ```
 * utils.hashMap.fromObject(targetObject)
 * // new Map([['first', 1], ['second', 2], ['third', 3]]);
 * ```
 * 
 * @param {Object} target - target object with properties that should be considered keys
 * @returns {Map<String,any>} - converted properties as keys in a new map
 * @see {@link hashMap.toObject} - to reverse the process
 */
module.exports.fromObject = function fromObject(target) {
  if (!(typeof target === 'object')) {
    throw Error('hashMap.fromObject(object): must be passed an object');
  }

  if (target.dataType === 'Map' && Array.isArray(target.value)) {
    return new Map(target.value);
  }

  return [...Object.keys(target)]
    .reduce((result, key) => HashMapUtil.add(result, key, target[key]), new Map());
};

/**
 * Simple and safe Map accessing function.
 * 
 * ```
 * styleMap = new Map([['1', 'background-color: #FF0000'], ['2', 'background-color: #00FF00']]);
 * styleFn = utils.hashMap.mappingFn(styleMap, 'background-color: #aaaaaa');
 * 
 * styleFn('1'); // 'background-color: #FF0000';
 * styleFn('2'); // 'background-color: #00FF00';
 * styleFn('somethingElse'); // 'background-color: #aaaaaa' - because it was not found
 * 
 * @param {Map} map - map to use when checking the subsequent function
 * @param {any} [defaultValue=''] - default value to return if key is not found
 * @returns {Function} - (key) => map.get(key) || defaultValue
 */
module.exports.mappingFn = function mappingFn(map, defaultValue = '') {
  return function mappingFnImpl(key) {
    if (map.has(key)) {
      return map.get(key);
    }
    return defaultValue;
  };
};

/**
 * Flip the key and value of the map
 * 
 * ```
 * encodingMap = new Map([[' ', '%20'],['\\n', '%0A'],['\\t', '%09']]);
 * encodingMap.get(' '); // '%20'
 * 
 * decodingMap = utils.hashMap.reverse(encodingMap);
 * decodingMap.get('%20'); // ' '
 * ```
 * 
 * 
 * @param {Map<any,any>} map - map to reverse
 * @returns {Map<any,any>} - new map with the keys and values reversed
 */
module.exports.reverse = function flipKeyValues(map) {
  return new Map(
    [...map.entries()].map(([key, value]) => [value, key])
  );
};
