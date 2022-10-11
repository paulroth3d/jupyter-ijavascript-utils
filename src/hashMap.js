const FormatUtils = require('./format');

/**
 * Library for working with JavaScript hashmaps.
 * @module hashmap
 * @exports hashmap
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
 *  (result, key) => utils.hashmap.add(result, key, objectToMap[key]),
 *  new Map()
 * );
 * // Map([[ 'key1',1 ], ['key2', 2], ['key3', 3]]);
 */
module.exports.add = function add(map, key, value) {
  map.set(key, value);
  return map;
};

module.exports.union = function union(targetMap, additionalMap, ignoreDuplicates) {
  if (!(targetMap instanceof Map)) {
    throw Error('hashMap.union(targetMap, additionalMap): targetMap must be a Map');
  }
  if (!(additionalMap instanceof Map)) {
    throw Error('hashMap.union(targetMap, additionalMap): additionalMap must be a Map');
  }

  const result = new Map(targetMap.entries());

  for (let key of additionalMap.keys()) {
    if (!result.has(key) && !ignoreDuplicates) {
      result.set(key, additionalMap.get(key));
    }
  }
  return result;
}

/**
 * Serializes a hashMap (plain javascript Map)
 * @param {Map} target - the Map to be serialized
 * @param {Number} indentation - the indentation passed to JSON.serialize
 * @returns {String} - JSON.stringify string for the map
 */
module.exports.serialize = function serialize(map, indentation) {
  return JSON.stringify(map, FormatUtils.mapReplacer, indentation);
};

/**
 * Converts a map to an object
 * @param {Map} target
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
 * Converts an Object into a new Map
 * @param {Object} target - target object with properties that should be considered keys
 * @returns {Map<String,any>} - converted properties as keys in a new map
 */
module.exports.fromObject = function fromObject(target) {
  if (!(typeof target === 'object')) {
    throw Error('hashMap.fromObject(object): must be passed an object');
  }

  if (target.dataType === 'Map' && Array.isArray(target.value)) {
    return new Map(target.value);
  }

  return [...Object.prototype.keys(target)]
    .reduce((result, key) => HashMapUtil.add(result, key, target[key]), new Map());
};

module.exports.deserialize = function deserialize(target) {
  return HashMapUtil.fromObject(target);
}