/* eslint-disable prefer-template, implicit-arrow-linebreak, function-paren-newline */

require('./_types/global');

/**
 * Utility Methods for working with Arrays / Lists
 * 
 * similar to {@link module:group}, this is not meant to be exhaustive,
 * only the ones commonly used.
 * 
 * * Generate Array
 *   * {@link module:array.size|array.size(size, default)} - generate array of a specific size and CONSISTENT default value
 *   * {@link module:array.arrange|array.arrange(size, start, step)} - generate array of a size, and INCREASING default value
 * * Sorting
 *   * {@link module:array.createSort|array.createSort(sortIndex, sortIndex, ...)} - generates a sorting function
 *   * {@link module:array.SORT_ASCENDING|array.SORT_ASCENDING} - common ascending sorting function for array.sort()
 *   * {@link module:array.SORT_DESCENDING|array.SORT_DESCENDING} - common descending sorting function for array.sort()
 * * Rearrange Array
 *   * {@link module:array.reshape|array.reshape}
 *   * {@link module:array.transpose|array.transpose}
 * 
 * @module array
 * @exports array
 */
module.exports = {};
const ArrayUtils = module.exports;

/**
 * Simple ascending sort function
 * @type {Function}
 * @example
 * 
 * [3,5,1,2,4].sort(utils.sort.SIMPLE_ASCENDING))
 * //
 * [1,2,3,4,5]
 */
module.exports.SORT_ASCENDING = (a, b) => a === b ? 0 : a > b ? 1 : -1;

/**
 * Simple descending sort function
 * @example
 * [3,5,1,2,4].sort(utils.sort.SIMPLE_ASCENDING))
 * //
 * [5,4,3,2,1]
 * @type {Function}
 */
module.exports.SORT_DESCENDING = (a, b) => a === b ? 0 : a > b ? -1 : 1;

/**
 * Creates a sort function based on fields of an object.
 * 
 * ```
 * sampleData = [{score: 200, name: 'jane'}, {score: 200, name: 'john'}]
 * // sort by score descending, and then by name ascending
 * sampleData.sort(utils.array.createSort('-score','name'))
 * ```
 * 
 * @example
 * 
 * sampleData = [{i:4}, {v:2}, {v:1}, {v:3}];
 * sortedData = sampleData.sort(
 *    utils.createSort('-v')
 * );
 * // [{v:4}, {v:3}, {v:2}, {v:1}]
 * 
 * @param {String} fieldName - name of property to sort by with - for descending
 * @returns {Function}
 **/
module.exports.createSort = (...fields) => {
  // const fields = Array.from(arguments);
  if (fields.length < 1) {
    //-- if nothing is passed, just give an ascending
    return ArrayUtils.SORT_ASCENDING;
  } else if (fields.length === 1) {
    if (!fields[0]) {
      //-- createSort('') - like for a simple array
      return ArrayUtils.SORT_ASCENDING;
    } else if (fields[0] === '-') {
      //-- createSort('-') - like for a simple array
      return ArrayUtils.SORT_DESCENDING;
    }
  }

  const sortFunctions = fields.map((field) => {
    if (field && field.length > 0) {
      if (field[0] === '-') {
        const newField = field.slice(1);
        return ((a, b) => ArrayUtils.SORT_DESCENDING(a[newField], b[newField]));
      }
      return ((a, b) => ArrayUtils.SORT_ASCENDING(a[field], b[field]));
    }
    return ((a, b) => 0);
  });
  
  return ((a, b) => {
    for (const sortFunction of sortFunctions) {
      const sortResult = sortFunction(a, b);
      if (sortResult) return sortResult;
      // continue
    }
  });
};

module.exports.peekFirst = function peekFirst(targetArray, defaultVal = null) {
  return (Array.isArray(targetArray) && targetArray.length > 0)
    ? targetArray[0]
    : defaultVal;
};

module.exports.peekLast = function peekLast(targetArray, defaultVal = null) {
  return (Array.isArray(targetArray) && targetArray.length > 0)
    ? targetArray[targetArray.length - 1]
    : defaultVal;
};

/**
 * Creates an array of a specific size and default value
 * 
 * Especially useful for forLoops, map or reduce
 * 
 * @example
 * 
 * utils.array.size(3, null)
 *  .map((v, index) => `item ${index}`)
 * 
 * @param {Number} length - the length of the new array
 * @param {any} defaultValue - the new value to put in each cell
 * @see {@link module:array.arrange} for values based on the index
 * @returns {Array} - an array of length size with default values
 */
module.exports.size = function size(length, defaultValue) {
  if (typeof defaultValue === 'function') {
    return new Array(length).fill(null).map((_, index) => defaultValue(index));
  }
  return  new Array(length).fill(defaultValue);
};

/**
 * Creates an array of values to replace for loops
 * 
 * @example
 * 
 * utils.array.arange(10, 1)
 *  .map((val) => `item ${val}`);
 * //
 * [
 *   'item 1', 'item 2',
 *   'item 3', 'item 4',
 *   'item 5', 'item 6',
 *   'item 7', 'item 8',
 *   'item 9', 'item 10'
 * ]
 * @param {Number} length - the number of items toreturn
 * @param {Number} [start=0] - the starting number
 * @param {Number} [step=1] - the number to increment for each step
  * @see {@link module:array.size} for consistent values in the array
 * @return {Number[]} - collection of numbers
 */
module.exports.arrange = function arange(len, start = 0, step = 1) {
  return Array.from(new Array(len)).map((v, i) => i * step + start);
};

/**
 * @see {@link module:array.arange} synonym
 * @private
 */
module.exports.arange = module.exports.arrange;

/**
 * Transposes a two dimensional array, so an NxM becomes MxN
 * @param {any[]} matrix - MxN array
 * @returns {any[]} - NxM array
 * 
 * @example
 * 
 * baseArray = [ 0, 1, 2, 3, 4 ];
 * utils.array.transpose(utils.array.arrange(5))
 * //
 * [ [ 0 ],
 *   [ 1 ],
 *   [ 2 ],
 *   [ 3 ],
 *   [ 4 ] ]
 */
module.exports.transpose = function transpose(matrix) {
  //-- fast fail
  if (!matrix || !Array.isArray(matrix)) {
    return [];
  }

  //-- check for 1d arrays
  if (!Array.isArray(matrix[0])) {
    return matrix.map((v) => [v]);
  }

  //-- for speed, we use for loops.
  const rows = matrix.length;
  const cols = matrix[0].length;
  let colI;
  let rowI;

  const result = Array.from(new Array(cols))
    .map((r) => Array.from(new Array(rows)));

  for (colI = 0; colI < cols; colI += 1) {
    for (rowI = 0; rowI < rows; rowI += 1) {
      result[colI][rowI] = matrix[rowI][colI];
    }
  }

  return result;
};

/**
 * Resizes an NxM dimensional array by number of columns
 * @param {any[]} sourceArray - an array to resize
 * @param {Number} numColumns - number of columns
 * @returns {any[][]} - 2 dimensinal array
 * @example
 * 
 * baseArray = utils.array.arrange(12);
 * [
 *    0,  1, 2, 3, 4, 5,  6, 7, 8, 9, 10, 11
 * ]
 * 
 * //-- resize the 1d array based on 3 columns
 * newArray = utils.array.reshape(baseArray, 3)
 * [ [ 0, 1, 2 ],
 *   [ 3, 4, 5 ],
 *   [ 6, 7, 8 ],
 *   [ 9, 10, 11 ] ];
 * 
 * //-- now resize the 4x3 array to 3x4
 * utils.array.reshape(newArray, 4);
 * [ [ 0, 1, 2, 3 ],
 *   [ 4, 5, 6, 7 ],
 *   [ 8, 9, 10, 11 ] ]
 */
module.exports.reshape = function reshape(sourceArray, numColumns) {
  const results = [];
  let resultGroup = [];
  let column;
  const array1d = sourceArray
    .flat();
  array1d
    .forEach((value, index) => {
      column = index % numColumns;
      if (index > 0 && column === 0) {
        results.push(resultGroup);
        resultGroup = [];
      }
      resultGroup.push(value);
    });
  //-- push the last result group
  results.push(resultGroup);

  return results;
};

//-- collection utilities
