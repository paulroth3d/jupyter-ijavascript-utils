const FormatUtils = require('./format');

/**
 * Library for working with JavaScript hashmaps.
 * 
 * * Modifying
 *   * {@link module:hashMap.add|hashMap.add(map, key, value):Map} - Add a value to a map and return the Map
 *   * {@link module:hashMap.union|hashMap.union(targetMap, additionalMap, canOverwrite)} - merges two maps and ignores or overwrites with conflicts
 * * Cloning
 *   * {@link module:hashMap.clone|hashMap.clone(map):Map} - Clones a given Map
 * * Conversion
 *   * {@link module:hashMap.stringify|hashMap.stringify(map, indent)} - converts a Map to a string representation
 *   * {@link module:hashMap.toObject|hashMap.toObject(map)} - converts a hashMap to an Object
 *   * {@link module:hashMap.fromObject|hashMap.fromObject(object)} - converts an object's properties to hashMap keys
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
 * const result = keys.reduce(
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
 * const targetMap = new Map([['first', 'John'], ['amount': 100]]);
 * const additionalMap = new Map([['last': 'Doe'], ['amount': 200]]);
 * 
 * utils.hashMap.union(targetMap, additionalMap, true);
 * // Map([['first', 'John'], ['last', 'Doe'], ['amount', 200]]);
 * ```
 * 
 * If allowOverwrite is false, then values found in targetMap will take priority in case of conflicts.
 * 
 * ```
 * const targetMap = new Map([['first', 'John'], ['amount': 100]]);
 * const additionalMap = new Map([['last': 'Doe'], ['amount': 200]]);
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
 * HashMapUtil.stringify(target);
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
 * const targetMap = utils.hashMap.toObject(targetObject)
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
 * const targetMap = utils.hashMap.fromObject(targetObject)
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
