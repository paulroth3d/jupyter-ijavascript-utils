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
 *   * {@link module:array.arrangeMulti|array.arrangeMulti(n, m, ...)} - generate a multi-dimensional array
 *   * {@link module:array.clone|array.clone(array)} - deep clones arrays
 * * Sorting
 *   * {@link module:array.createSort|array.createSort(sortIndex, sortIndex, ...)} - generates a sorting function
 *   * {@link module:array.SORT_ASCENDING|array.SORT_ASCENDING} - common ascending sorting function for array.sort()
 *   * {@link module:array.SORT_DESCENDING|array.SORT_DESCENDING} - common descending sorting function for array.sort()
 *   * {@link module:array.indexify|array.indexify} - identify sections within a 1d array to create a hierarchy.
 * * Rearrange Array
 *   * {@link module:array.reshape|array.reshape} - reshapes an array to a size of rows and columns
 *   * {@link module:array.transpose|array.transpose} - transposes (flips - the array along the diagonal)
 * * Picking Values
 *   * {@link module:array.peekFirst|array.peekFirst} - peeks at the first value in the list
 *   * {@link module:array.peekLast|array.peekLast} - peeks at the last value in the list
 *   * {@link module:array.pickRows|array.pickRows} - picks a row from a 2d array
 *   * {@link module:array.pickColumns|array.pickColumns} - picks a column from a 2d array
 *   * {@link module:array.pick|array.pick} - picks either/or rows and columns
 * * Extracting Array Values
 *   * {@link module:array.extract|array.extract} - synonym to array.pick to pick either a row or column from an array
 *   * {@link module:array.multiLineSubstr|array.multiLineSubstr} - Extract
 *        {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr|Substr}
 *        from a multi-line string or array of strings
 *   * {@link module:array.multiLineSubstring|array.multiLineSubstring} - Extract 
 *        {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring|Substring}
 *        from a multi-line string or array of strings
 *   * {@link module:array.multiStepReduce|array.multiStepReduce} - Performs reduce, and returns the value of reduce at each step
 * * Applying a value
 *   * {@link module:array.applyArrayValue|array.applyArrayValue} - applies a value deeply into an array safely
 *   * {@link module:array.applyArrayValues|array.applyArrayValues} - applies a value / multiple values deeply into an array safely
 * * Understanding Values
 *   * {@link module:array.isMultiDimensional|array.isMultiDimensional} - determines if an array is multi-dimensional
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

/**
 * Peek in an array and return the first value in the array.
 * 
 * Or return the default value (`defaultVal`) - if the array is empty
 * 
 * @param {Array} targetArray - array to be peeked within
 * @param {any} defaultVal - the value to return if the array is empty
 * @returns {any}
 */
module.exports.peekFirst = function peekFirst(targetArray, defaultVal = null) {
  return (Array.isArray(targetArray) && targetArray.length > 0)
    ? targetArray[0]
    : defaultVal;
};

/**
 * Peek in an array and return the last value in the array.
 * 
 * Or return the default value (`defaultVal`) - if the array is empty
 * 
 * @param {Array} targetArray - array to be peeked within
 * @param {any} defaultVal - the value to return if the array is empty
 * @returns {any}
 */
module.exports.peekLast = function peekLast(targetArray, defaultVal = null) {
  return (Array.isArray(targetArray) && targetArray.length > 0)
    ? targetArray[targetArray.length - 1]
    : defaultVal;
};

/**
 * Picks a row (or multiple rows) from a 2d array.
 * 
 * Please also see [Danfo.js](https://danfo.jsdata.org/) for working with DataFrames.
 * 
 * @param {Array} array2d - 2d array to pick from [row][column]
 * @param {...Number} rowIndices - Indexes of the row to return, [0...length-1]
 * @returns - Array with only those rows
 * @see {@link module:array.pick|array.pick} - pick either rows or columns
 * @example
 * data = [
 *  ['john', 23, 'purple'],
 *  ['jane', 32, 'red'],
 *  ['ringo', 27, 'green']
 * ];
 * 
 * utils.array.pickRows(data, 0);
 * //-- [['john', 23, 'purple']];
 * 
 * utils.array.pickRows(data, 0, 1);
 * //-- [['john', 23, 'purple'], ['jane', 32, 'red']];
 */
module.exports.pickRows = function pickRows(array2d, ...rowIndices) {
  //-- allow passing an array as the first item
  const cleanRowIndices = rowIndices.length > 0 && Array.isArray(rowIndices[0])
    ? rowIndices[0]
    : rowIndices;
  return cleanRowIndices.map((index) => array2d[index]);
};

/**
 * Picks a column (or multiple columns) from a 2d array
 * 
 * Please also see [Danfo.js](https://danfo.jsdata.org/) for working with DataFrames.
 * 
 * @param {Array} array2d - 2d array to pick from [row][column]
 * @param  {...any} columns - Indexes of the columns to pick the values from: [0...row.length-1]
 * @returns - Array with all rows, and only those columns
 * @see {@link module:array.pick|array.pick} - pick either rows or columns
 * @example
 * data = [
 *  ['john', 23, 'purple'],
 *  ['jane', 32, 'red'],
 *  ['ringo', 27, 'green']
 * ];
 * 
 * utils.array.pickColumns(data, 0);
 * //-- [['john'], ['jane'], ['ringo']];
 * 
 * utils.array.pickColumns(data, 0, 2);
 * //-- [['john', 'purple'], ['jane', 'red'], ['ringo', 'green']];
 */
module.exports.pickColumns = function pickColumns(array2d, ...columns) {
  //-- allow passing an array as the first item
  const cleanColumns = columns.length > 0 && Array.isArray(columns[0])
    ? columns[0]
    : columns;
  return array2d.map((row) => cleanColumns.map((columnIndex) => row[columnIndex]));
};

/**
 * Convenience function for picking specific rows and columns from a 2d array.
 * 
 * Please also see [Danfo.js](https://danfo.jsdata.org/) for working with DataFrames.
 * 
 * @param {Array} array2d - 2d array to pick from [row][column]
 * @param {Object} options - options on which to pick
 * @param {Number[]} [options.rows = null] - indices of the rows to pick
 * @param {Number[]} [options.columns = null] - indices of the columns to pick.
 * @returns {Array} - 2d array of only the rows and columns chosen.
 * @see {@link module:array.pickRows|array.pickRows} - picking rows
 * @see {@link module:array.pickColumns|array.pickColumns} - picking columns
 * @see {@link module:array.applyArrayValues|array.applyArrayValues} - applies a value / multiple values deeply into an array safely
 * @returns - 2dArray of the columns and rows requested
 * @example
 * data = [
 *  ['john', 23, 'purple'],
 *  ['jane', 32, 'red'],
 *  ['ringo', 27, 'green']
 * ];
 * 
 * utils.array.pick(data, {rows: [0, 1]});
 * //-- [['john', 23, 'purple'], ['jane', 32, 'red']];
 * 
 * utils.array.pick(data, {columns: [0, 2]});
 * //-- [['john', 'purple'], ['jane', 'red'], ['ringo', 'green']];
 * 
 * utils.array.pick(data, {rows:[0, 1], columns:[0, 2]});
 * //-- [['john', 'purple'], ['jane', 'red']];
 */
module.exports.pick = function pick(array2d, options) {
  const cleanOptions = options || {};

  const {
    rows = null,
    columns = null
  } = cleanOptions;

  let results = array2d;

  if (rows) {
    results = ArrayUtils.pickRows(results, rows);
  }

  if (columns) {
    results = ArrayUtils.pickColumns(results, columns);
  }

  return results;
};

/**
 * Convenience function for picking specific rows and columns from a 2d array.
 * 
 * Alias of {@link module:array.pick|array.pick}
 * 
 * Please also see [Danfo.js](https://danfo.jsdata.org/) for working with DataFrames.
 * 
 * @param {Array} array2d - 2d array to pick from [row][column]
 * @param {Object} options - options on which to pick
 * @param {Number[]} [options.rows = null] - indices of the rows to pick
 * @param {Number[]} [options.columns = null] - indices of the columns to pick.
 * @returns {Array} - 2d array of only the rows and columns chosen.
 * @see {@link module:array.pickRows} - picking rows
 * @see {@link module:array.pickColumns} - picking columns
 * @returns - 2dArray of the columns and rows requested
 * @example
 * data = [
 *  ['john', 23, 'purple'],
 *  ['jane', 32, 'red'],
 *  ['ringo', 27, 'green']
 * ];
 * 
 * utils.array.pick(data, {rows: [0, 1]});
 * //-- [['john', 23, 'purple'], ['jane', 32, 'red']];
 * 
 * utils.array.pick(data, {columns: [0, 2]});
 * //-- [['john', 'purple'], ['jane', 'red'], ['ringo', 'green']];
 * 
 * utils.array.pick(data, {rows:[0, 1], columns:[0, 2]});
 * //-- [['john', 'purple'], ['jane', 'red']];
 */
module.exports.extract = module.exports.pick;

/**
 * Applies deeply onto an array safely - in-place using dot-notation paths
 * even if the child paths don't exist.
 * 
 * While tthis can be as simple as safely applying a value even if targetObj may be null
 * 
 * ```
 * targetObj = [1, 2, null, 4, 5];
 * 
 * utils.object.applyPropertyValue(targetObj, '[2]', 3);
 * // [1, 2, 3, 4, 5]
 * // equivalent to targetObj[2] = 3;
 * ```
 * 
 * This is much more safely working with deeply nested objects
 * 
 * ```
 * targetObj = [{
 *  name: 'john smith',
 *  class: {
 *    name: 'ECON_101',
 *    professor: {
 *      last_name: 'Winklemeyer'
 *    }
 *   }
 * }];
 * 
 * utils.object.applyPropertyValue(targetObj, '[0].class.professor.first_name', 'René');
 * // [{
 * //  name: 'john smith',
 * //  class: {
 * //    name: 'ECON_101',
 * //    professor: {
 * //      last_name: 'Winklemeyer',
 * //      first_name: 'René' // <- Added
 * //    }
 * //   }
 * // }];
 * ```
 * 
 * or creating intermediary objects along the path - if they did not exist first.
 * 
 * ```
 * targetObj = [{
 *  name: 'john smith'
 * }];
 * utils.object.applyPropertyValue(targetObj, '[0].class.professor.first_name', 'René');
 * [{
 *  name: 'john smith',
 *  class: {
 *    professor: {
 *      first_name: 'René'
 *    }
 *   }
 * }];
 * ```
 * 
 * @param {Array} collection - array to apply the value to
 * @param {string} path - dot notation path to set the value, ex: 'geo', or 'states[0].prop'
 * @param {any} value - value to set
 * @returns {Array} - the base array
 * @see {@link module:array.pick|array.pick} - to pick a row or column into an array
 * @see {@link module:array.applyArrayValues|array.applyArrayValues} - applies an array safely and deeply onto another array of values
 */
module.exports.applyArrayValue = function applyArrayValue(collection, path, value) {
  // const signature = 'applyArrayValue(collection, path, value)';

  if (!collection) return collection;
  if (!path) return collection;

  const cleanPath = String(path)
    .replace(/\[/g, '.')
    .replace(/\]/g, '.')
    .replace(/[.]+/g, '.')
    .replace(/^[.]+/, '')
    .replace(/[.]$/, '');

  const splitPath = cleanPath.split('.');
  const terminalIndex = splitPath.length - 1;

  return splitPath
    .reduce((currentVal, prop, currentIndex) => {
      //-- can no longer occur
      // if (!prop) throw Error(`${signature}:Unable to set value with path:${path}`);

      const isLeaf = currentIndex === terminalIndex;
      if (isLeaf) {
        // eslint-disable-next-line no-param-reassign
        currentVal[prop] = value;
        // if (value === undefined) {
        //   delete currentVal[prop];
        // } else {
        //   currentVal[prop] = value;
        // }
        return collection;
      }
      //-- not a leaf
      if (!currentVal[prop]) {
        // eslint-disable-next-line no-param-reassign
        currentVal[prop] = {};
      }
      return currentVal[prop];
    }, collection);
};

/**
 * Converse from the extractPropertyValue, this takes a value / set of values
 * and applies the values for each index in the collection.
 * 
 * for example:
 * 
 * ```
 * weather = [{ id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
 *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
 *   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 }];
 * 
 * cities = utils.object.extractObjectProperty('city');
 * // ['Seattle', 'New York', 'Chicago'];
 * 
 * //-- async process to geocode
 * geocodedCities = geocodeCity(cities);
 * // [{ city: 'Seattle', state: 'WA', country: 'USA' },
 * // { city: 'New York', state: 'NY', country: 'USA' },
 * // { city: 'Chicago', state: 'IL', country: 'USA' }]
 * 
 * utils.applyArrayValues(weather, 'geo', geocodedCities);
 * // [{ id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87, geo: { city: 'Seattle', state: 'WA', country: 'USA' } },
 * //  { id: 3, city: 'New York', month: 'Apr', precip: 3.94, geo: { city: 'New York', state: 'NY', country: 'USA' } },
 * //  { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62, geo: { city: 'Chicago', state: 'IL', country: 'USA' } }];
 * 
 * Note that traditional [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
 * works best for if you are working with objects completely in memory.
 * 
 * But this helps quite a bit if the action of mapping / transforming values
 * needs to be separate from the extraction / application of values back.
 * 
 * @param {Array} collection - array to apply the value to on each index
 * @param {string} path - dot notation path to set the value within each index, ex: 'geo', or 'states[0].prop'
 * @param {any} value - the value that should be set at that path.
 * @returns {Object}
 * @see {@link module:array.applyArrayValue|array.applyArrayValue} - to apply a single value to a single object
 * @see {@link module:array.pick|array.pick} - to pick a row or column into an array
 */
module.exports.applyArrayValues = function applyArrayValues(collection, path, valueList) {
  // const signature = 'applyValue(objectList, path, valueList)';
  if (!collection || !path) {
    //-- do nothing
    return collection;
  }

  const cleanCollection = Array.isArray(collection) ? collection : [collection];
  const cleanValueList = Array.isArray(valueList) ? valueList : Array(cleanCollection.length).fill(valueList);

  // if (cleanCollection.length !== cleanValueList) throw Error(
  //   `${signature}: objectList.length[${cleanCollection.length}] does not match valueList.length[${cleanValueList.length}]`
  // );
  const minLength = Math.min(cleanCollection.length, cleanValueList.length);

  for (let i = 0; i < minLength; i += 1) {
    const obj = cleanCollection[i];
    const val = cleanValueList[i];
    ArrayUtils.applyArrayValue(obj, path, val);
  }

  return collection;
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
 * Determine whether an array is multi-dimensional (an array of arrays)
 * 
 * For example:
 * 
 * ```
 * utils.array.isMultiDimensional(0); // false
 * utils.array.isMultiDimensional([0,1,2,3]); // false
 * utils.array.isMultiDimensional([[0,1], [2,3]]); // true
 * utils.array.isMultiDimensional([0, [1,2]]); // true
 * ```
 * 
 * @param {Array} targetArray - array to check if multi-dimensional
 * @returns {Boolean} - if the targetArray has any values that are multi-dimensional
 */
module.exports.isMultiDimensional = function isMultiDimensional(targetArray) {
  if (!targetArray || !Array.isArray(targetArray)) {
    return false;
  }
  return targetArray.find((v) => Array.isArray(v)) !== undefined;
};

/**
 * Determines the depth of a two dimensional array
 * @param {Array} targetArray - two dimensional array
 * @returns {Number}
 * @private
 */
module.exports.arrayLength2d = function arrayLength2d(targetArray) {
  return (targetArray || [])
    .reduce((max, line) => {
      const len = (line || []).length;
      return (len > max) ? len : max;
    }, 0);
};

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
  const cols = ArrayUtils.arrayLength2d(matrix); // matrix[0].length; 
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

/**
 * Deep clones multi-dimensional arrays.
 * 
 * If you want to just deep clone a 1d array, use [...target] instead
 * 
 * NOTE: this only deep clones Arrays, and not the values within the arrays.
 * 
 * ```
 * const sourceArray = [[0, 1], [2, 3]];
 * const targetArray = utils.array.clone(sourceArray);
 * 
 * targetArray[0][0] = 99;
 * 
 * console.log(targetArray); // [[99, 1], [2, 3]];
 * console.log(sourceArray); // [[0, 1], [2, 3]];
 * ```
 * 
 * @param {any | Array} target - Array to be cloned
 * @returns New deep-cloned array
 */
module.exports.clone = function clone(target) {
  if (!Array.isArray(target)) return target;

  return target.map((item) => Array.isArray(item) ? ArrayUtils.clone(item) : item);
};

/**
 * Creates an array for multiple dimensions of varying sizes.
 * 
 * (In order from higher order dimensions to lower)
 * 
 * ```
 * utils.array.arangeMulti(0); // []
 * utils.array.arangeMulti(2); // [0, 1]
 * utils.array.arangeMulti(4); // [0, 1, 2, 3]
 * utils.array.arangeMulti(2, 2); // [[0, 1], [0, 1]]
 * utils.array.arangeMulti(2, 2, 2); // [[[0, 1], [0, 1]], [[0, 1], [0, 1]]]
 * utils.array.arangeMulti(2, 2, 4); // [[[0, 1, 2, 3], [0, 1, 2, 3]], [[0, 1, 2, 3], [0, 1, 2, 3]]]
 * ```
 * 
 * Note that this can help with laying items out within a grid
 * 
 * ```
 * gridPositions = utils.array.arangeMulti(4, 4)
 *   .reduce((result, row, rowIndex) => [ ...result,
 *      ...row.reduce((rowReduce, value, columnIndex) => [...rowReduce, [rowIndex, columnIndex]], [])
 *   ], []);
 * // [
 * //   [ 0, 0 ], [ 0, 1 ], [ 0, 2 ], [ 0, 3 ],
 * //   [ 1, 0 ], [ 1, 1 ], [ 1, 2 ], [ 1, 3 ],
 * //   [ 2, 0 ], [ 2, 1 ], [ 2, 2 ], [ 2, 3 ],
 * //   [ 3, 0 ], [ 3, 1 ], [ 3, 2 ], [ 3, 3 ]
 * // ]
 * 
 * myList.forEach((value, index) => {
 *   const [x, y] = gridPositions[index];
 *   console.log(`placing ${value} in row:${x}, column:${y}`);
 * });
 * ```
 * 
 * @param  {...any} dimensions - sizes of each dimension to create
 * @returns Multi-dimensional array 
 */
module.exports.arrangeMulti = function arangeMulti(...dimensions) {
  if (dimensions.length < 1) {
    return [];
  } else if (dimensions.length === 1) {
    return ArrayUtils.arange(dimensions[0]);
  }
  const currentDimension = dimensions[0];
  const remainderDimensions = dimensions.slice(1);
  const childDimensionalValue = ArrayUtils.arangeMulti.apply(this, remainderDimensions);
  return ArrayUtils.size(currentDimension, () => ArrayUtils.clone(childDimensionalValue));
};
module.exports.arangeMulti = module.exports.arrangeMulti;

/** 
 * Create a unique number index for each element in an array,
 * alternatively using additional functions to indicate hierarchies of data.
 * 
 * For example, markdown can be considered a hierarchy of data:
 * 
 * ```
 * markdownList = `# Overview
 * This entire list is a hierarchy of data.
 * 
 * # Section A
 * This describes section A
 * 
 * ## SubSection 1
 * With a subsection belonging to Section A
 * 
 * ## SubSection 2
 * And another subsection sibling to SubSection 1, but also under Section A.
 * 
 * # Section B
 * With an entirely unrelated section B, that is sibling to Section A
 * 
 * ## SubSection 1
 * And another subsection 1, but this time related to Section B.`;
 * ```
 * 
 * And we want to convert this 1d array into a hierarchy.
 * 
 * ```
 * data = markdownList.split('\n')
 *    .filter(line => line ? true : false); // check for empty lines
 * 
 * utils.format.consoleLines( data, 4);
 * // ['# Overview',
 * // 'This entire list is a hierarchy of data.',
 * // '# Section A',
 * // 'This describes section A',;
 * 
 * //-- functions that return True if we are in a new "group"
 * isHeader1 = (str) => str.startsWith('# ');
 * 
 * isHeader1('# Overview'); // true
 * isHeader1('This entire list is a hierarchy of data'); // false
 * isHeader1('# Section A'); // true
 * isHeader1('This describes section A'); // false
 * 
 * indexedData = utils.array.indexify(data, isHeader1);
 * [
 *   { entry: 'Heading', section: [ 0 ], subIndex: 1 },
 *   { entry: '# Overview', section: [ 1 ], subIndex: 0 },
 *   {
 *     entry: 'This entire list is a hierarchy of data.',
 *     section: [ 1 ],
 *     subIndex: 1
 *   },
 *   { entry: '# Section A', section: [ 2 ], subIndex: 0 },
 *   { entry: 'This describes section A', section: [ 2 ], subIndex: 1 },
 *   { entry: '## SubSection 1', section: [ 2 ], subIndex: 2 },
 *   {
 *     entry: 'With a subsection belonging to Section A',
 *     section: [ 2 ],
 *     subIndex: 3
 *   },
 *   { entry: '## SubSection 2', section: [ 2 ], subIndex: 4 },
 *   {
 *     entry: 'And another subsection sibling to SubSection 1, but also under Section A.',
 *     section: [ 2 ],
 *     subIndex: 5
 *   },
 *   { entry: '# Section B', section: [ 3 ], subIndex: 0 },
 *   {
 *     entry: 'With an entirely unrelated section B, that is sibling to Section A',
 *     section: [ 3 ],
 *     subIndex: 1
 *   },
 *   { entry: '## SubSection 1', section: [ 3 ], subIndex: 2 },
 *   {
 *     entry: 'And another subsection 1, but this time related to Section B.',
 *     section: [ 3 ],
 *     subIndex: 3
 *   }
 * ];
 * ```
 * 
 * Note that this only indexes elements by the first header.
 * 
 * To index this with two levels of hierarchy, we can pass another function.
 * 
 * ```
 * isHeader2 = (str) => str.startsWith('## ');
 * 
 * isHeader2('# Overview'); // false
 * isHeader2('This entire list is a hierarchy of data'); // false
 * isHeader2('# Section A'); // true
 * isHeader2('This describes section A'); // false
 * 
 * indexedData = utils.array.indexify(data, isHeader1, isHeader2);
 * // [
 * //   { entry: 'Heading', section: [ 0, 0 ], subIndex: 1 },
 * //   { entry: '# Overview', section: [ 1, 0 ], subIndex: 0 },
 * //   {
 * //     entry: 'This entire list is a hierarchy of data.',
 * //     section: [ 1, 0 ],
 * //     subIndex: 1
 * //   },
 * //   { entry: '# Section A', section: [ 2, 0 ], subIndex: 0 },
 * //   { entry: 'This describes section A', section: [ 2, 0 ], subIndex: 1 },
 * //   { entry: '## SubSection 1', section: [ 2, 1 ], subIndex: 0 },
 * //   {
 * //     entry: 'With a subsection belonging to Section A',
 * //     section: [ 2, 1 ],
 * //     subIndex: 1
 * //   },
 * //   { entry: '## SubSection 2', section: [ 2, 2 ], subIndex: 0 },
 * //   {
 * //     entry: 'And another subsection sibling to SubSection 1, but also under Section A.',
 * //     section: [ 2, 2 ],
 * //     subIndex: 1
 * //   },
 * //   { entry: '# Section B', section: [ 3, 0 ], subIndex: 0 },
 * //   {
 * //     entry: 'With an entirely unrelated section B, that is sibling to Section A',
 * //     section: [ 3, 0 ],
 * //     subIndex: 1
 * //   },
 * //   { entry: '## SubSection 1', section: [ 3, 1 ], subIndex: 0 },
 * //   {
 * //     entry: 'And another subsection 1, but this time related to Section B.',
 * //     section: [ 3, 1 ],
 * //     subIndex: 1
 * //   }
 * // ];
 * ```
 * 
 * @param {Array} source - list of values to index
 * @param {...Function} sectionIndicatorFunctions - each function indicates a new section
 * @returns {Object[]} - collection of objects, each with a new section (indicating the layers) 
 *            and subIndex: unique value in the section (always 0 for header)
 */
module.exports.indexify = function indexify(source, ...sectionIndicatorFunctions) {
  const functionSignature = 'indexify(source, ...sectionIndicatorFunctions)';

  const counters = new Array(sectionIndicatorFunctions.length).fill(0);
  let subIndex = 0;
  // counters[counters.length - 1] = -1;

  //-- validate inputs
  if (!Array.isArray(source)) {
    throw new Error(`${functionSignature}: source must be an array`);
  }
  sectionIndicatorFunctions.forEach((fn) => {
    if (typeof fn !== 'function') {
      throw new Error(`${functionSignature}: all section indicators passed must be functions`);
    }
  });

  const results = source.map((entry) => {
    let isNewSectionTripped = false;

    sectionIndicatorFunctions.forEach((fn, index) => {
      if (isNewSectionTripped) {
        counters[index] = 0;
      } else {
        isNewSectionTripped = fn(entry) ? true : false;

        if (isNewSectionTripped) {
          counters[index] += 1;
        }
      }
    });

    if (isNewSectionTripped) {
      subIndex = 0;
    } else {
      subIndex += 1;
    }

    return ({ entry, section: [...counters], subIndex });
  });

  return results;
};

/**
 * Parse a fixed length table of strings (often in markdown format)
 * 
 * For example, say you got a string formatted like this:
 * 
 * ```
 * hardSpacedString = `
 * id first_name last_name  city        email                        gender ip_address      airport_code car_model_year
 * -- ---------- ---------- ----------- ---------------------------- ------ --------------- ------------ --------------
 * 1  Thekla     Brokenshaw Chicago     tbrokenshaw0@kickstarter.com Female 81.118.170.238  CXI          2003          
 * 2  Lexi       Dugall     New York    ldugall1@fc2.com             Female 255.140.25.31   LBH          2005          
 * 3  Shawna     Burghill   London      sburghill2@scribd.com        Female 149.240.166.189 GBA          2004          
 * 4  Ginger     Tween      Lainqu      gtween3@wordpress.com        Female 132.67.225.203  EMS          1993          
 * 5  Elbertina  Setford    Los Angeles esetford4@ted.com            Female 247.123.242.49  MEK          1989          `;
 * ```
 * 
 * This can be a bit hard to parse, because the space delimiter is a valid character in the `city` column, ex: `New York`.
 * 
 * Instead, we can use the starting index and number of characters, to extract the data out
 * 
 * ```
 * const carModelYears = ArrayUtils.multiLineSubstr(hardSpacedString, 102);
 * // ['car_model_year', '--------------', '2003          ', '2005          ', '2004          ', '1993          ', '1989'];
 * const ipAddresses = ArrayUtils.multiLineSubstr(hardSpacedString, 73, 14);
 * // ['ip_address    ', '--------------', '81.118.170.238', '255.140.25.31 ', '149.240.166.18', '132.67.225.203', '247.123.242.49'];
 * ```
 * @see {@link module:array.multiLineSubstring|multiLineSubstring} - to use start and end character positions
 * @see {@link module:array.multiStepReduce|multiStepReduce} - for example on how to extract data from hard spaced arrays
 * 
 * {@link module:array.size|array.size(size, default)} - generate array of a specific size and CONSISTENT default value
 * 
 * @param {String|String[]} str - multi-line string or array of strings
 * @param {Number} start - the starting index to substr
 * @param {Number} [len=0] - optional length of string to substr
 * @returns {String[]} - substr values from each line
 */
module.exports.multiLineSubstr = function multiLineSubstr(target, start, length) {
  const lines = (() => {
    if (Array.isArray(target)) {
      return target;
    } else if (typeof target === 'string') {
      return target.split(/\n/); //.trim()
    }
    throw Error('multiLineSubstr(target, start, length): target is assumed a multi-line string or array of strings');
  })();
  
  return lines.map((line) => line.substr(start, length));
};

/**
 * Parse a fixed length table of strings (often in markdown format)
 * 
 * For example, say you got a string formatted like this:
 * 
 * ```
 * hardSpacedString = `
 * id first_name last_name  city        email                        gender ip_address      airport_code car_model_year
 * -- ---------- ---------- ----------- ---------------------------- ------ --------------- ------------ --------------
 * 1  Thekla     Brokenshaw Chicago     tbrokenshaw0@kickstarter.com Female 81.118.170.238  CXI          2003          
 * 2  Lexi       Dugall     New York    ldugall1@fc2.com             Female 255.140.25.31   LBH          2005          
 * 3  Shawna     Burghill   London      sburghill2@scribd.com        Female 149.240.166.189 GBA          2004          
 * 4  Ginger     Tween      Lainqu      gtween3@wordpress.com        Female 132.67.225.203  EMS          1993          
 * 5  Elbertina  Setford    Los Angeles esetford4@ted.com            Female 247.123.242.49  MEK          1989          `;
 * ```
 * 
 * This can be a bit hard to parse, because the space delimiter is a valid character in the `city` column, ex: `New York`.
 * 
 * Instead, we can use the starting index and number of characters, to extract the data out.
 * 
 * Note, this function uses the starting and ending character positions, to extract,
 * where {@link module:array.multiLineSubstr|multiLineSubstr} - uses the start and character length instead.
 * 
 * ```
 * const carModelYears = ArrayUtils.multiLineSubstring(hardSpacedString, 102);
 * // ['car_model_year', '--------------', '2003          ', '2005          ', '2004          ', '1993          ', '1989'];
 * const ipAddresses = ArrayUtils.multiLineSubstring(hardSpacedString, 73, 87);
 * // ['ip_address    ', '--------------', '81.118.170.238', '255.140.25.31 ', '149.240.166.18', '132.67.225.203', '247.123.242.49'];
 * ```
 * @see {@link module:array.multiLineSubstr|multiLineSubstr} - to use character start and length
 * @see {@link module:array.multiStepReduce|multiStepReduce} - for example on how to extract data from hard spaced arrays
 * 
 * @param {String|String[]} str - multi-line string or array of strings
 * @param {Number} startPosition - the starting index to extract out - using the standard `substring` method
 * @param {Number} [endPosition] - the ending endex to extract out
 * @returns {String[]} - substr values from each line
 */
module.exports.multiLineSubstring = function multiLineSubstring(target, startPosition, endPosition) {
  const lines = (() => {
    if (Array.isArray(target)) {
      return target;
    } else if (typeof target === 'string') {
      return target.trim().split(/\n/);
    }
    throw Error('multiLineSubstring(target, startPosition, endPosition): target is assumed a multi-line string or array of strings');
  })();
  
  return lines.map((line) => line.substring(startPosition, endPosition));
};

/**
 * Returns the reduce at each step along the way.
 * 
 * For example, if you have a set of column widths
 * and would like to know how wide the table is after each column.
 * 
 * For example:
 * 
 * ```
 * hardSpacedString = `
 * id first_name last_name  city        email                        gender ip_address      airport_code car_model_year
 * -- ---------- ---------- ----------- ---------------------------- ------ --------------- ------------ --------------
 * 1  Thekla     Brokenshaw Chicago     tbrokenshaw0@kickstarter.com Female 81.118.170.238  CXI          2003          
 * 2  Lexi       Dugall     New York    ldugall1@fc2.com             Female 255.140.25.31   LBH          2005          
 * 3  Shawna     Burghill   London      sburghill2@scribd.com        Female 149.240.166.189 GBA          2004          
 * 4  Ginger     Tween      Lainqu      gtween3@wordpress.com        Female 132.67.225.203  EMS          1993          
 * 5  Elbertina  Setford    Los Angeles esetford4@ted.com            Female 247.123.242.49  MEK          1989          `;
 * 
 * columnWidths = [3, 11, 11, 12, 29, 7, 16, 13, 15];
 * sumFn = (a, b) => a + b;
 * 
 * //-- get the starting position for each column,
 * //-- ex: column 3 is sum of columnWidths[0..3] or 0 + 3 + 11 + 11 or 25
 * columnStops = utils.format.multiStepReduce( columnWidths, (a,b) => a + b, 0);
 * // [0, 3, 14, 25, 37, 66, 73, 89, 102, 117];
 * ```
 * 
 * We can then pair with the column widths - to get exactly the starting position and width of each column.
 * 
 * ```
 * substrPairs = columnWidths.map((value, index) => [columnStops[index], value]);
 * // [[0, 3], [3, 11], [14, 11], [25, 12], [37, 29], [66, 7], [73, 16], [89, 13], [102, 15]];
 * ```
 * 
 * Now that we know how the starting positions for each of the columns, we can try picking one column out:
 * 
 * ```
 * //-- we can get a single column like this:
 * cityStartingCharacter = substrPairs[3][0]; // 25
 * cityColumnLength = substrPairs[3][0]; // 12
 * 
 * cityData = ArrayUtils.multiLineSubstr(hardSpacedString, cityStartingCharacter, cityColumnLength);
 * // ['city        ', '----------- ', 'Chicago     ', 'New York    ', 'London      ', 'Lainqu      ', 'Los Angeles ']
 * ```
 * 
 * Or we can get all columns with something like this:
 * 
 * ```
 * results = substrPairs.map(
 *  ([startingPos, length]) => ArrayUtils.multiLineSubstr(hardSpacedString, startingPos, length)
 * );
 * 
 * [['id ', '-- ', '1  ', '2  ', '3  ', '4  ', '5  '],
 * ['first_name ', '---------- ', 'Thekla     ', 'Lexi       ', 'Shawna     ', 'Gin...', ...],
 * ['last_name  ', '---------- ', 'Brokenshaw ', 'Dugall     ', 'Burghill   ', 'Twe...', ...],
 * ['city        ', '----------- ', 'Chicago     ', 'New York    ', 'London      ', ...],
 * ['email                        ', '---------------------------- ', 'tbrokenshaw0...', ...],
 * ['gender ', '------ ', 'Female ', 'Female ', 'Female ', 'Female ', 'Female '],
 * ['ip_address      ', '--------------- ', '81.118.170.238  ', '255.140.25.31   ', ...],
 * ['airport_code ', '------------ ', 'CXI          ', 'LBH          ', 'GBA       ...', ...],
 * ['car_model_year', '--------------', '2003          ', '2005          ', '2004  ...', ...]]
 * ```
 * 
 * We can then transpose the array to give us the format we might expect (non DataFrame centric)
 * 
 * ```
 * resultsData = utils.array.transpose(results);
 * 
 * utils.table(resultsData).render();
 * ```
 * 
 * 0  |1          |2          |3           |4                            |5      |6               |7            |8             
-- |--         |--         |--          |--                           |--     |--              |--           |--            
id |first_name |last_name  |city        |email                        |gender |ip_address      |airport_code |car_model_year
-- |---------- |---------- |----------- |---------------------------- |------ |--------------- |------------ |--------------
1  |Thekla     |Brokenshaw |Chicago     |tbrokenshaw0@kickstarter.com |Female |81.118.170.238  |CXI          |2003          
2  |Lexi       |Dugall     |New York    |ldugall1@fc2.com             |Female |255.140.25.31   |LBH          |2005          
3  |Shawna     |Burghill   |London      |sburghill2@scribd.com        |Female |149.240.166.189 |GBA          |2004          
4  |Ginger     |Tween      |Lainqu      |gtween3@wordpress.com        |Female |132.67.225.203  |EMS          |1993          
5  |Elbertina  |Setford    |Los Angeles |esetford4@ted.com            |Female |247.123.242.49  |MEK          |1989          
 * 
 * This can also be helpful with coming up with complex
 *  {@link module:array.arrange|array.arrange(size, start, step)}
 * collections.
 */
module.exports.multiStepReduce = function multiStepReduce(list, fn, initialValue = undefined) {
  const results = [initialValue];
  let currentResult = initialValue;
  list.forEach((val, index) => {
    currentResult = fn(currentResult, val, index, list);
    results.push(currentResult);
  });
  return results;
};
