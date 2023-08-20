//-- we are not using objects, and avoid constant Garbage Collection - if we allow modification of the numbers.
/* eslint-disable no-param-reassign */

const SimplexModule = require('./random_simplex');

/**
 * Generating and picking random values.
 * 
 * * Managing Seed Values
 *     * {@link module:random.seed|seed(number)} - specifies the seed that all following random calls will use
 * * Generating Random Numbers
 *     * {@link module:random.randomInteger|randomInteger(min, max)} - inclusive integer between min and max values
 *     * {@link module:random.random|randomInteger(min, max)} - inclusive float between min and max values
 * * Working with Arrays
 *     * {@link module:random.pickRandom|pickRandom(array)} - picks a value at random from the list
 *     * {@link module:random.randomArray|randomArray(size, fn)} - creates an array of size length, with each value generated from fn
 * * Simplex Noise
 *     * {@link module:random.simplexGenerator|simplexGenerator(seed)} - Number generator between -1 and 1 given an x/y/z coordinate
 * 
 * If leveraging 
 * 
 * While generating a simple number between two values is common, it is very important - and useful in generating fake data.
 * 
 * ```
 * const firstNames = ['jane', 'john', 'paul', 'ringo'];
 * const lastNames = ['do', 'doe', 'dough', 'doh'];
 * fakeName = `${utils.random.pickRandom(firstNames)} ${utils.random.pickRandom(lastNames)}`;
 * // 'john dough'
 * ```
 * 
 * Additionally, there are so many different ways of generating visualizations
 * based on simplex noise.
 * 
 * From straight (red - negative / green - positive)
 * 
 * ![Screenshot of animation](img/simplexNoiseAnim.gif)
 * 
 * To indicators with length, and rotation (negative ccw / positive cw)
 * 
 * ![Screenshot of animation](img/noiseFinal.gif)
 * 
 * The possibilities are endless.
 * 
 * <hr />
 * 
 * <b>This library is meant to provide simple use cases.</b>
 * Please use Standard libraries
 * - like [d3-random](https://observablehq.com/@d3/d3-random) for additional alternatives
 * 
 * see {@link module:format.mapArrayDomain|format.mapArrayDomain} - as it projects a value
 * from between a range a value, and picks the corresponding value from an array.
 * 
 * For example:
 * 
 * ```
 * require('esm-hook');
 * d3 = require('d3');
 * 
 * //-- create a number generator using Normal / Gaussian distribution
 * randomGenerator = d3.randomNormal(
 *  0.5, // mu - or centerline
 *  0.1 // sigma - or spread of values
 * );
 * 
 * randomValue = randomGenerator();
 * // randomValue - 0.4
 * 
 * randomDataset = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
 * 
 * //-- create an array of 3 items, each with the results from randomGenerator
 * results = utils.array.size(3, () => randomGenerator());
 * // [ 0.6235937672428706, 0.4991359903898883, 0.4279365561645624 ]
 * 
 * //-- map those values to the randomDataset
 * results.map(val => ({ pick: utils.format.mapArrayDomain(val, randomDataset) }));
 * // [ { pick: 'g' }, { pick: 'e' }, { pick: 'e' } ]
 * 
 * //-- group them by the pick field
 * //-- then add a new property called count - using the # of records with the same value
 * groupedResults = utils.group.by(resultPicks, 'pick')
 *     .reduce((list) => ({ count: list.length }));
 * // [ { pick: 'g', count: 1 }, { pick: 'e', count: 2 } ]
 * 
 * //-- make a bar chart (only with 10k results)
 * utils.vega.embed((vl) => {
 *     return vl
 *       .markBar()
 *       .title('Distribution')
 *       .data(groupedResults)
 *       .encode(
 *         vl.x().fieldN('value'),
 *         vl.y().fieldQ('count').scale({type: 'log'})
 *       );
 * });
 * ```
 * ![Screenshot of the chart above](img/randomMap_normalDistribution.png)
 * 
 * @module random
 */
const RandomUtil = module.exports;

module.exports.seedValue = Date.now() % 10000;

/**
 * Specifies a new seed to be used in upcoming random calls.
 * @param {Number} newSeedValue - new seed to use in following random calls
 * @example
 * utils.random.seed(12345);
 * utils.random.randomInteger(); // 55
 */
module.exports.seed = function seed(newSeedValue) {
  RandomUtil.seedValue = newSeedValue;
};

/**
 * Used only for testing
 * @private
 */
module.exports.getSeed = function getSeed() {
  return RandomUtil.seedValue;
};

/**
 * Generate a random integer (with uniform distribution)
 * @param {Number} [min = 0] - Minimum integer (inclusive) that could be generated
 * @param {Number} [max = 100] - Maximum integer (inclusive) number that could be generated
 * @returns {Number} - number between (and including) min and max
 * @example
 * utils.random.randomInteger(0, 100) // 40
 * utils.random.randomInteger(0, 100) // 96
 * @see [d3-random](https://observablehq.com/@d3/d3-random) for additional alternatives
 */
module.exports.randomInteger = function randomInteger(min = 0, max = 100) {
  //-- can only occur if the user exports to htmlScript
  /* istanbul ignore next */
  const seed = ((typeof RandomUtil) !== 'undefined') ? RandomUtil.seedValue : undefined;

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random(seed) * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};

/**
 * Generates a random floating point number (with uniform distribution)
 * @param {Number} [min = 0] - Minimum float (inclusive) that could be generated
 * @param {Number} [max = 100] - Maximum float (inclusive) number that the value will be less than
 * @returns {Number} - number between (and including) min and max
 * utils.random.randomInteger(0, 1) // 0.224223
 * @see [d3-random](https://observablehq.com/@d3/d3-random) for additional alternatives
 */
module.exports.random = function random(min = 0, max = 1) {
  //-- can only occur if the user exports to htmlScript
  /* istanbul ignore next */
  const seed = ((typeof RandomUtil) !== 'undefined') ? RandomUtil.seedValue : undefined;

  if (min === 0 && max === 1) {
    return Math.random(seed);
  }
  return Math.random(seed) * (max - min) + min;
};

/**
 * Picks a random value from an array of values (with uniform distribution)
 * @param {Array} targetArray - Array of values to pick from
 * @returns {any} - one of the values picked at random from the target array
 * @example
 * utils.random.pickRandom(['apple', 'orange', 'pear']); // 'pear'
 * @see [d3-random](https://observablehq.com/@d3/d3-random) for additional alternatives
 */
module.exports.pickRandom = function pickRandom(targetArray) {
  if (!targetArray || !Array.isArray(targetArray)) {
    throw Error('utils.random.pickRandom(targetArray): targetArray must be an array');
  }

  //-- can only occur if the user exports to htmlScript
  /* istanbul ignore next */
  const seed = ((typeof RandomUtil) !== 'undefined') ? RandomUtil.seedValue : undefined;

  //-- short circuit if array is null
  if (targetArray.length < 1) {
    return null;
  } else if (targetArray.length === 1) {
    return targetArray[0];
  }

  //-- do not use RandomUtils to allow it to be exportable to javaScript
  const min = 0;
  const max = targetArray.length;

  return targetArray[Math.floor(Math.random(seed) * (max - min) + min)];
};

/**
 * Generates an array of random values
 * @param {Number} arraySize - length of the array to return
 * @param {Function} [generatingFunction = null] - function to use to generate or number 0-1
 * @returns {Array} - array of size arraysize
 * @example
 * utils.random.randomArray(4); // [0.23, 0.56, 0.87, 0.77];
 * utils.random.randomArray(4, () => utils.random.randomInteger(1, 100)); // [22, 11, 99, 32]
 */
module.exports.randomArray = function randomArray(arraySize, generatingFunction) {
  if (arraySize < 0) {
    throw Error('random.randomArray(size, fn): array size cannot be less than 1');
  }

  //-- can only occur if the user exports to htmlScript
  /* istanbul ignore next */
  const seed = ((typeof RandomUtil) !== 'undefined') ? RandomUtil.seedValue : undefined;

  const cleanFn = generatingFunction || (() => Math.random(seed));
  return Array(arraySize).fill(undefined)
    .map((val, index) => cleanFn());
};

// {[import('./random_simplex')]}

/**
 * Returns a new Simplex Generator
 * @function simplexGenerator
 * @static
 * @param {Number} [seed] - seed to use for the generator (or null for random)
 * @returns {SimplexGenerator} - Simplex Generator that can generate in multiple dimensions
 */
module.exports.simplexGenerator = SimplexModule;
