/**
 * Utilities / Functional methods for manipulating JavaScript sets.
 * 
 * * Add Values 
 *   * {@link module:set.add|add(set?, value, ...)} - add specific values to a set
 *   * {@link module:set.union|union(set, list|set|iterable)} - combine two arrays
 * * common values
 *   * {@link module:set.intersection|intersection(set, list|set|iterable)} - items in both of the lists
 * * Remove values
 *   * {@link module:set.remove|remove(set, value, ...)} - remove specific values from set and return set
 *   * {@link module:set.difference|difference(set, list|set|iteratable)} - remove set values from another  
 * * unique
 *   * new Set([ ...utils.difference(setA, setB), ...utils.difference(setB, setA)])
 * 
 * Note that the EcmaScript is catching up and union, difference, etc. will be supported soon.
 * 
 * However, this library removes a value and returns the set - which can be very helpful for functional programming.
 * 
 * @module set
 * @exports set
 */
module.exports = {};

// eslint-disable-next-line no-unused-vars
const SetUtils = module.exports;

/**
 * Mutably adds a value to a set, and then returns the set. (Allowing Chaining)
 * 
 * (If you wish to immutably, use ES6: `{...setA, value1, value2, ...setB, etc...}`)
 * 
 * @param {set} setTarget - set to add values to
 * @param {any} val - value to add to the set
 * @returns {set} setTarget
 * @example
 * setA = new Set([1, 2, 3]);
 * utils.array.add(setA, 4, 5, 6); // Set([1, 2, 3, 4, 5, 6])
 */
module.exports.add = function add(setTarget, ...rest) {
  const target = SetUtils.union(setTarget, rest);
  return target;
};

/**
 * Mutably Adds all the values from a target into a set. (Allowing Chaining)
 * 
 * (If you wish to union immutably, use ES6: `{...setA, ...setB}`)
 * 
 * **Note**: this works with Arrays and other things iteratable
 *
 * @param {set} setTarget - set to add values to
 * @param {iteratable} iteratable - iteratable that can be unioned into the set.
 * @returns {set} setTarget
 * @example
 * 
 * setA = new Set([1, 2, 3]);
 * setB = new Set([4, 5, 6];
 * array.union(setA, setB) // Set([1, 2, 3, 4, 5, 6])
 * 
 * setA = new Set([1, 2, 3]);
 * listB = [4, 5, 6];
 * array.union(setA, listB) // Set([1, 2, 3, 4, 5, 6])
 * 
 */
module.exports.union = function union(setTarget, iteratable) {
  const target = setTarget instanceof Set ? setTarget : new Set(setTarget);
  if (iteratable) {
    // eslint-disable-next-line
    for (let v of iteratable) {
      target.add(v);
    }
  }
  return target;
};

/**
 * Immutably identify all items that are common in two sets of iterable items
 * 
 * **Note**: this works with Arrays and other things iteratable
 * 
 * @param {Set} sourceA - the set to check for common items
 * @param {Set} sourceB - another set to check for common items
 * @returns {Set} - set of items that are in both sourceA and sourceB
 * @example
 * setA = new Set([1, 2, 3, 4]);
 * setB = new Set([3, 4, 5, 6]);
 * utils.set.intersection(setA, setB); // Set([3, 4])
 * 
 * // Note that you can use other iteratable things too
 * utils.set.intersection([1, 2, 3, 4], [3, 4, 5, 6]); // Set([3, 4])
 */
module.exports.intersection = function intersection(sourceA, sourceB) {
  const targetA = sourceA instanceof Set ? sourceA : new Set(sourceA);
  const results = new Set([...sourceB].filter((val) => targetA.has(val)));
  return results;
};

/**
 * Mutably removes a value to a set, and then returns the set. (Allowing for chaining)
 * 
 * @param {set} setTarget - set to remove values from
 * @param {any} val - value to remove from the set
 * @returns {set} setTarget
 * @example
 * setA = new Set([1, 2, 3, 4, 5])
 * utils.set.remove(setA, 4, 5); // Set([1, 2, 3])
 */
module.exports.remove = function remove(setTarget, ...rest) {
  const target = SetUtils.difference(setTarget, rest);
  return target;
};

/**
 * Mutably removes all the values from one set in another
 * 
 * @param {set} setTarget - set to remove values from
 * @param {iteratable} iteratable - iteratable that can be removed from the set.
 * @returns {set} setTarget
 * @example
 * setA = new Set([1, 2, 3, 4, 5, 6])
 * setB = new Set([4, 5, 6])
 * utils.set.difference(setA, setB) // Set([1, 2, 3])
 */
module.exports.difference = function difference(setTarget, iteratable) {
  const target = setTarget instanceof Set ? setTarget : new Set(setTarget);
  if (iteratable) {
    // eslint-disable-next-line
    for (let v of iteratable) {
      target.delete(v);
    }
  }
  return target;
};

/**
 * Immutably verifies the superset contains all items in iteratable,
 * and returns the set of items not found in the superset.
 * 
 * @param {set} superSet - set to check it contains all iteratable items
 * @param {iteratable} iteratableWithAllValues - iteratable with all items
 * @returns {Set} - set with items not in setToCheck (or an empty set if all contained)
 * @example
 * 
 * const possibeSuperSet = new Set([1,2,3,4,5,6]);
 * const subset = new Set([4,5,6,7]);
 * set.findItemsNotContained(possibleSuperSet, subset); // Set([7]);
 */
module.exports.findItemsNotContained = function findItemsNotContained(superSet, iteratable) {
  const target = superSet instanceof Set ? superSet : new Set(superSet);
  const result = new Set();
  if (iteratable) {
    for (const v of iteratable) {
      if (!target.has(v)) {
        result.add(v);
      }
    }
  }
  return result;
};
