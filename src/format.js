/* eslint-disable max-len */

/**
 * Utility methods for printing and formatting values
 * 
 * * Printing Values to String
 *   * {@link module:format.printValue|format.printValue} - Prints any type of value to string
 *   * {@link module:format#.DATE_FORMAT|format.DATE_FORMAT} - Options for printValue Date Formats (see {@link module:array.printValue|array.printValue(value, options)})
 * * formatting Numbers
 *   * {@link module:format.zeroFill|format.zeroFill} - Pads a number to a specific length
 *   * {@link module:format.divideR|format.divideR}   - Divides a number to provide { integer, remainder } - ex: 5/3 as ( 1, remainder 2 )
 *   * {@link module:format.compactNumber|format.compactNumber} - Converts a number to a compact format, ex: 100K, 2M
 *   * {@link module:format.compactParse|format.compactParse} - Parses a compact number to a true number (very useful for sorting)
 * * Formatting Strings
 *   * {@link module:format.capitalize|format.capitalize} - Capitalizes only the first character in the string (ex: 'John paul');
 *   * {@link module:format.capitalizeAll|format.capitalizeAll} - Capitalizes all the words in a string (ex: 'John Paul')
 *   * {@link module:format.ellipsify|format.ellipsify} - Truncates a string if the length is 'too long'
 *   * {@link module:format.stripHtmlTags|format.stripHtmlTags} - removes html / xml tags from strings.
 *   * {@link module:format.limitLines|format.limitLines(string, toLine, fromLine, lineSeparator)} - selects only a subset of lines in a string
 *   * {@link module:format.consoleLines|format.consoleLines(...)} - same as limit lines, only console.logs the string out.
 *   * {@link module:format.wordWrap|format.wordWrap(str, options)} - breaks apart string by line length
 *   * {@link module:format.lineCount|format.lineCount(str, options)} - counts the number of lines in a string
 * * Replacing values in Strings
 *   * {@link module:format.replaceString|format.replaceString(string, stringTupletsOrMap)} - applies replace from a collection of [matcher, replacement] tuplets or map based on key-> values
 *   * {@link module:format.replaceStrings|format.replaceStrings(stringsArray, stringTupletsOrMap)} - applies replaceString on an array of values
 * * Formatting Time
 *   * {@link module:format.millisecondDuration|format.millisecondDuration}
 * * Mapping Values
 *   * {@link module:format.mapDomain|format.mapDomain} - projects a value from a domain of expected values to a range of output values, ex: 10% of 2 Pi
 *   * {@link module:format.mapArrayDomain|format.mapArrayDomain} - projects a value from between a range a value, and picks the corresponding value from an array
 * * Identifying Time Periods
 *   * {@link module:format.timePeriod|format.timePeriod} - Converts a time to a time period, very helpful for animations
 *   * {@link module:format.timePeriodPercent|format.timePeriodPercent} - Determines the percent complete of the current time period
 * * Converting values safely
 *   * {@link module:format.safeConvertString|format.safeConvertString} - converts a value to string, or uses a default for any error
 *   * {@link module:format.safeConvertFloat|format.safeConvertFloat} - converts a value to a Number (123.4), or uses a default for any error or NaN
 *   * {@link module:format.safeConvertInteger|format.safeConvertInteger} - converts a value to a Number (123), or uses a default for any error or NaN
 *   * {@link module:format.safeConvertBoolean|format.safeConvertBoolean} - converts a value to a boolean
 * * Parsing values
 *   * {@link module:format.parseBoolean|format.parseBoolean(val)} - converts a value to a boolean value
 *   * {@link module:format.parseNumber|format.parseNumber(val, locale)} - converts a value to a number
 * * Identifying values
 *   * {@link module:format.isEmptyValue|format.isEmptyValue} - determine if a value is not 'empty'
 * * Extracting values
 *   * {@link module:format.extractWords|format.extractWords} - to extract the words from a string
 * 
 * @module format
 * @exports format
 */
module.exports = {};
const FormatUtils = module.exports; // eslint-disable-line no-unused-vars

require('./_types/global');

/**
 * The number of milliseconds of various time durations
 * @private
 */
module.exports.DURATION = {
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 1000 * 60,
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24
};

/**
 * Date Formats
 * @type {DateFormat}
 * @see {@link module:format.printValue|printValue()} -
 * @see {@link TableGenerator} - 
 * @example
 * d = new Date();
 * format = { dateFormat: utils.format.DATE_FORMAT.LOCAL }; // .LOCAL = 'toLocaleString'
 * utils.format.printValue( new Date(), format)
 * //3/8/2022, 4:22:38 PM
 * 
 * format = { dateFormat: utils.format.DATE_FORMAT.LOCAL_DATE }; // .LOCAL_DATE = 'toLocaleDateString'
 * utils.format.printValue( new Date(), format)
 * //3/8/2022
 * 
 * format = { dateFormat: utils.format.DATE_FORMAT.LOCAL_TIME }; // .LOCAL_TIME = 'toLocaleTimeString'
 * utils.format.printValue( new Date(), format)
 * //4:22:38 PM
 * 
 * format = { dateFormat: utils.format.DATE_FORMAT.GMT }; // .GMT = 'toGMTString'
 * utils.format.printValue( new Date(), format)
 * //Tue, 08 Mar 2022 22:22:38 GMT
 * 
 * format = { dateFormat: utils.format.DATE_FORMAT.ISO }; // .ISO = 'toISOString'
 * utils.format.printValue( new Date(), format)
 * //2022-03-08T22:22:38.163Z
 * 
 * format = { dateFormat: utils.format.DATE_FORMAT.UTC }; // .UTC = 'toUTCString'
 * utils.format.printValue( new Date(), format)
 * //Tue, 08 Mar 2022 22:22:38 GMT
 * 
 * format = { dateFormat: utils.format.DATE_FORMAT.NONE };
 * utils.format.printValue( new Date(), format)
 * //Tue Mar 08 2022 16:22:38 GMT-0600 (Central Standard Time)
 */
module.exports.DATE_FORMAT = {
  LOCAL: 'toLocaleString',
  LOCAL_DATE: 'toLocaleDateString',
  LOCAL_TIME: 'toLocaleTimeString',
  GMT: 'toGMTString',
  ISO: 'toISOString',
  UTC: 'toUTCString',
  NONE: 'NONE'
};

/**
 * Ellipsis unicode character `…`
 * @type {String}
 * @private
 * @example
 * utils.format.ellipsis('supercalifragilisticexpialidocious', 5)
 * // super…
 */
module.exports.ELLIPSIS = '…';

/**
 * Print a value in legible string format
 * 
 * Note: collapsing 
 * 
 * @param {any} value - the value to print
 * @param {Object} options - collection of options
 * @param {Boolean} options.collapseObjects - if true, typesof Object values are not expanded
 * @param {String} options.dateFormat - ('LOCAL'|'LOCAL_DATE','LOCAL_TIME','GMT','ISO','UTC','NONE')
 * @returns {string} - legible formatted value
 * @see #.DATE_FORMAT
 * @example
 * 
 * format = { dateFormat: utils.format.DATE_FORMAT.ISO };
 * utils.format.printValue( new Date(), format)
 * //2022-03-08T22:22:38.163Z
 * 
 * //-- but you will mostly be using this in aggregate, like with the TableGenerator
 * 
 * obj = { first: 'john', last: 'doe', classes: [23, 34], professor: { name: 'jane doe' }, dateTime: new Date(), aliases: new Set(['jdoe', 'j_doe'])}
 * new utils.TableGenerator([obj])
 *   .generateMarkdown();
 * 
 * //-- with many objects, this can get unweildy
 * first|last|classes|professor          |dateTime                |aliases                  
 * --   |--  |--     |--                 |--                      |--                       
 * john |doe |[23,34]|{"name":"jane doe"}|2022-03-08T22:50:03.632Z|"Set(\"jdoe\",\"j_doe\")"
 * 
 * new utils.TableGenerator([obj])
 *   .printOptions({ collapse: true, dateFormat: 'toLocaleDateString' })
 *   .generateMarkdown();
 * 
 * //-- a bit more easy to read
 * first|last|classes|professor      |dateTime|aliases     
 * --   |--  |--     |--             |--      |--          
 * john |doe |23,34  |[object Object]|3/8/2022|[object Set]
 * 
 */
module.exports.printValue = function printValue(value, options) {
  const {
    dateFormat = FormatUtils.DATE_FORMAT.ISO,
    collapseObjects = false,
    collapse = false
  } = options || {};

  if (value === null) {
    return 'null';
  } else if (value === undefined) {
    return 'undefined';
  }
  
  const valType = typeof value;
  
  if (valType === 'string') {
    return value;
  } else if (valType === 'number') {
    return value.toLocaleString();
  } else if (value instanceof Date) {
    if (dateFormat === FormatUtils.DATE_FORMAT.NONE) {
      return String(value);
    }
    return value[dateFormat || FormatUtils.DATE_FORMAT.ISO]();
  } else if (value instanceof Map) {
    if (collapseObjects || collapse) {
      return `[Map length=${value.size} ]`;
    }
    return JSON.stringify(value, FormatUtils.mapReplacer);
  } else if (typeof value[Symbol.iterator] === 'function') {
    //-- iterator
    return JSON.stringify(Array.from(value));
  } else if (valType === 'object' && (collapseObjects || collapse)) {
    return String(value);
  }
  return JSON.stringify(value);
};

/**
 * Print a number and zero fill it until it is len long.
 * 
 * @param {Number} num - Number to be converted
 * @param {Number} [len = 3] - the length of the string
 * @param {String} [fill = '0'] - the value to pad with 
 * @returns {String}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart|MDN - Pad Start} - for padding strings at the start
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd|MDN - Pad End} - for padding strings at the end
 * @example
 * utils.format.zeroFill(23)         // '023';
 * utils.format.zeroFill(23, 5)      // '00023';
 * utils.format.zeroFill(23, 5, ' ') // '   23'
 */
module.exports.zeroFill = function zeroFill(num, len = 3, fill = '0') {
  return String(num).padStart(len, fill);
};

/**
 * Generate a random Integer between a maximum and a minimum number
 * 
 * @param {Number} max - maximum value
 * @param {Number} min - minimum value
 * @returns {Number}
 * 
 * @example
 * utils.format.randomInt(10) // 4
 * utils.format.randomInt(20, 10) // 11
 */
module.exports.randomInt = function randomInt(max, min = 0) {
  return Math.trunc(Math.random() * (max - min) + min);
};

/**
 * Generate a random Float between a maximum and minimum number
 * @param {Number} max - maximum value
 * @param {Number} min - minimum value
 * @returns {Number}
 * 
 * @example
 * utils.format.randomFloat(10) // 7.21323
 * utils.format.randomFloat(10) // 4.2232392
 */
module.exports.randomFloat = function randomFloat(max, min = 0) {
  return (Math.random() *  (max - min) + min);
};

/**
 * Replaces maps with strings.
 * 
 * @see SourceMap.stringifyReducer for other instances.
 * @private
 */
module.exports.mapReplacer = function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  }
  return value;
};

/**
 * Divide a number and get the integer value and remainder
 * @param {Number} numerator - number to be divided
 * @param {Number} denominator - number to divide with
 * @returns {Object} - ({value, remainder}) 
 * @example
 * utils.format.divideR(5, 3)
 * // ({ value: 1, remainder: 2 })
 */
module.exports.divideR = function divideR(numerator, denominator) {
  return ({
    value: Math.trunc(numerator / denominator),
    remainder: numerator % denominator
  });
};

/**
 * @typedef {Object} Duration
 * @property {Number} days -
 * @property {Number} hours -
 * @property {Number} minutes -
 * @property {Number} seconds -
 * @property {Number} milliseconds -
 * @property {Number} epoch - the total duration in milliseconds
 */

/**
 * Determines the length of time that a number of milliseconds take in duration
 * @param {Number} milliseconds - Number of millisecond duration
 * @returns {Duration}
 * @example
 * d1 = new Date();
 * // 2022-03-08T22:55:14.775Z
 * d2 = new Date(d1.getTime())
 * // 2022-03-08T23:02:18.040Z
 * 
 * utils.format.millisecondDuration(d2.getTime() - d1.getTime())
 * // {
 * //   days: 0,
 * //   hours: 0,
 * //   minutes: 7,
 * //   seconds: 3,
 * //   milliseconds: 265,
 * //   epoch: 423265
 * // }
 */
module.exports.millisecondDuration = function millisecondDuration(milliseconds) {
  const result = {};
  let division = FormatUtils.divideR(milliseconds, FormatUtils.DURATION.DAY);
  result.days = division.value;
  division = FormatUtils.divideR(division.remainder, FormatUtils.DURATION.HOUR);
  result.hours = division.value;
  division = FormatUtils.divideR(division.remainder, FormatUtils.DURATION.MINUTE);
  result.minutes = division.value;
  division = FormatUtils.divideR(division.remainder, FormatUtils.DURATION.SECOND);
  result.seconds = division.value;
  result.milliseconds = division.remainder;
  result.epoch = milliseconds;

  return result;
};

/**
 * Ellipsifies a string (but only if it is longer than maxLen)
 * 
 * @param {String} str - string to be ellipsified
 * @param {Integer} [maxLen = 50] - the maximum length of str before getting ellipsified
 * @returns {String}
 * @example
 * format.ellipsify('longName') // 'longName' (as maxLen is 50)
 * format.ellipsify('longName', 8) // 'longName' (as maxLen is 8)
 * format.ellipsify('longName', 4) // 'long…' (as str is longer than maxLen)
 */
module.exports.ellipsify = function ellipsify(str, maxLen) {
  const cleanStr = !str
    ? ''
    : typeof str === 'string'
      ? str
      : JSON.stringify(str);
  
  const cleanLen = maxLen > 0 ? maxLen : 50;

  if (cleanStr.length > cleanLen) {
    return `${cleanStr.substring(0, cleanLen)}…`;
  }
  return cleanStr;
};

/**
 * projects a value from a domain of expected values to a range of output values, ex: 10% of 2 Pi.
 * 
 * This is SUPER helpful in normalizing values, or converting values from one "range" of values to another.
 * 
 * @param {Number} val - value to be mapped
 * @param {Array} domain - [min, max] - domain of possible input values
 * @param {Array} domain.domainMin - minimum input value (anything at or below maps to rangeMin)
 * @param {Array} domain.domainMax - maximum input value (anything at or above maps to rangeMax)
 * @param {Array} range - [min, max] - range of values to map to
 * @param {Array} range.rangeMin - minimum output value
 * @param {Array} range.rangeMax - maximum output value
 * @returns Number
 * @see {@link module:format.clampDomain|clampDomain(value, [min, max])}
 * @example
 * 
 * format.mapDomain(-2, [0, 10], [0, 1])
 * // 0   - since it is below the minimum value
 * format.mapDomain(0, [0, 10], [0, 1])
 * // 0   - since it is the minimum value
 * format.mapDomain(5, [0, 10], [0, 1])
 * // 0.5 - since it is 5/10
 * format.mapDomain(12, [0, 10], [0, 1])
 * // 1   - since it is above the maximum value
 * 
 * format.mapDomain(0.5, [0, 1], [0, 10])
 * format.mapDomain(0.5, [0, 1], [0, Math.PI + Math.PI])
 * // 5 - since it is half of 0-1, and half of 1-10
 * // 3.1415 or Math.PI - since it is half of 2 PI
 */
module.exports.mapDomain = function mapDomain(val, [domainMin, domainMax], [rangeMin = 0, rangeMax = 1]) {
  if (val < domainMin) {
    return rangeMin;
  } else if (val > domainMax) {
    return rangeMax;
  }
  // domainMin / val / domainMax = rangeMin / result / rangeMax
  // (val - domainMin) / (domainMax - domainMin) = (result - rangeMin) / (rangeMax - rangeMin)
  // (val - domainMin) * (rangeMax - rangeMin) / (domainMax - domainMin) = result - rangeMin;
  // (val - domainMin) * (rangeMax - rangeMin) / (domainMax - domainMin) + rangeMin = result
  return (((val - domainMin) * (rangeMax - rangeMin)) / (domainMax - domainMin)) + rangeMin;
};

/**
 * projects a value from a domain of expected values to an array - very useful for random distributions.
 * 
 * like mapping normal / gaussian distributions to an array of values with 
 * [d3-random](https://observablehq.com/@d3/d3-random)
 * as format.mapArrayDomain projects a value from between a range a value,
 * and picks the corresponding value from an array.
 * 
 * For example:
 * 
 * ```
 * require('esm-hook');
 * d3 = require('d3');
 * utils = require('jupyter-ijavascript-utils');
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
 * numPicks = 3; // increase to a larger number (ex: 1000) to better see distributions
 * 
 * //-- create an array of 3 items, each with the results from randomGenerator
 * results = utils.array.size(numPicks, () => randomGenerator());
 * // [ 0.6235937672428706, 0.4991359903898883, 0.4279365561645624 ]
 * 
 * //-- map those values to the randomDataset
 * resultPicks = results.map(val => ({ pick: utils.format.mapArrayDomain(val, randomDataset) }));
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
 *         vl.x().fieldN('pick'),
 *         vl.y().fieldQ('count').scale({type: 'log'})
 *       );
 * });
 * ```
 * ![Screenshot of the chart above](img/randomMap_normalDistribution.png)
 * 
 * @param {Number} val - value to be mapped
 * @param {Array} targetArray - array of values to pick from
 * @param {Array} domain - [min, max] - domain of possible input values
 * @param {Array} [domain.domainMin = 0] - minimum input value (anything at or below maps to rangeMin)
 * @param {Array} [domain.domainMax = 1] - maximum input value (anything at or above maps to rangeMax)
 * @returns Number
 * @see {@link module:format.clampDomain|clampDomain(value, [min, max])}
 * @example
 * 
 * //-- array of 10 values
 * randomArray = ['a', 'b', 'c', 'd', 'e'];
 * 
 * format.mapArrayDomain(-1, randomArray, [0, 5]);
 * // 'a'  - since it is below the minimum value
 * format.mapArrayDomain(6, randomArray, [0, 5]);
 * // 'e'   - since it is the minimum value
 * 
 * format.mapArrayDomain(0.9, randomArray, [0, 5]);
 * // 'a'
 * format.mapArrayDomain(1, randomArray, [0, 5]);
 * // 'b'
 * format.mapArrayDomain(2.5, randomArray, [0, 5]);
 * // 'c' 
 * 
 * //-- or leaving the domain of possible values value can be out:
 * format.mapArrayDomain(0.5, randomArray); // assumed [0, 1]
 * // 'c'
 */
module.exports.mapArrayDomain = function mapArrayDomain(val, targetArray, domain = null) {
  if (!targetArray || !Array.isArray(targetArray)) {
    throw Error('mapArrayDomain: targetArray is not an array');
  } else if (targetArray.length < 1) {
    throw Error('mapArrayDomain: targetArray is not a populated array');
  }

  const cleanArray = domain || [];
  const [domainMin = 0, domainMax = 1] = cleanArray;

  if (val <= domainMin) {
    return targetArray[0];
  } else if (val >= domainMax) {
    return targetArray[targetArray.length - 1];
  }

  const targetIndex = Math.floor(FormatUtils.mapDomain(
    val,
    [domainMin, domainMax],
    [0, targetArray.length]
  ));
  // console.log(targetIndex);
  return targetArray[targetIndex];
};

/**
 * Given that a period of time is millisecondPeriod number of milliseconds long,
 * determines which period of time we are currently in (timeEpoch / millisecondPeriod)
 * 
 * This is especially handy for animations or cyclical time measuring.
 * 
 * **NOTE: consider sending the timeEpoch relative to a separate start time**,
 * it is rarely ever needed to know how many 10 second intervals occurred since 1970...
 * 
 * Likely, we care more that the animation should have cycled 40 times since the page loaded though.
 * 
 * @param {Integer} millisecondPeriod - Number of Milliseconds in a Period of time
 * @param {Integer} [timeMilli = now] - optional time to check - in epoch milliseconds
 * @param {Integer} [startMilli = null] - optional starting epoch
 * @returns {Number} - (timeEpoch - startEpoch) / millisecondPeriod - number of periods 
 * 
 * @example
 * const startTime = new Date().getTime();
 * 
 * format.timePeriod(1000)
 * // 164955061.3 - using the current time and epoch starting point
 * 
 * format.timePeriod(1000, new Date().getTime(), startTime);
 * // 0.0 - using the starting point instead
 * 
 * // - wait 3 seconds
 * 
 * format.timePeriod(10000, new Date().getTime(), startTime); // 0.3
 * format.timePeriod(10000, null, startTime); // 0.3
 * 
 * // - wait another 14 seconds
 * 
 * format.timePeriod(10000, new Date().getTime(), startTime); // 1.7
 * 
 * //-- wait 8 seconds
 * 
 * format.timePeriod(10000, new Date().getTime(), startTime) // 2.5
 */
module.exports.timePeriod = function mapTime(millisecondPeriod, timeMilli = null, startMilli = null) {
  let updatedMilli = !timeMilli
    ? new Date().getTime()
    : timeMilli;
  
  if (startMilli) {
    updatedMilli -= startMilli;
  }

  return updatedMilli / millisecondPeriod;
};

/**
 * Given that a period of time is millisecondPeriod number of milliseconds long,
 * determines how far along in the CURRENT PERIOD.
 * 
 * This is especially handy for animations or cyclical time measuring.
 * 
 * @param {Integer} millisecondPeriod - Number of Milliseconds in a Period of time
 * @param {Integer} [timeEpoch = now] - time to check - in epoch milliseconds
 * @returns {Number} - percentage through the current millisecond period (0 <= x < 1)
 * 
 * @example
 * format.timePeriodPercent(10000, new Date().getTime()) // 0.3
 * 
 * //-- wait 14 seconds
 * 
 * format.timePeriodPercent(10000, new Date().getTime()) // 0.7
 * 
 * //-- wait 8 seconds
 * 
 * format.timePeriodPercent(10000, new Date().getTime()) // 0.5
 */
module.exports.timePeriodPercent = function mapEpochInPeriod(millisecondPeriod, timeEpoch = new Date().getTime()) {
  return (timeEpoch % millisecondPeriod) / millisecondPeriod;
};

/**
 * Clamps (restircts) a value to a specific domain.
 * 
 * Meaning if value is less than minimum, then the minimum is returned.
 * If the value is greater than the maximum, then the maximum is returned.
 * 
 * NOTE: null or undefined are not treated specially when comparing to maximum or minimum values.
 * 
 * @param {Number} value - the value that will be modified if less than min or max
 * @param {Array} domain - Domain of min and max values
 * @param {Number} domain.min - the minimum value allowable
 * @param {Number} domain.max - the maximum value allowable
 * @returns {Number} - minimum if value is less than minimum, maximum if more, value otherwise.
 * 
 * @see {@link module:format.mapDomain|mapDomain(value, [min, max], [newMin, newMax])}
 * @example
 * format.clampDomain( -1, [0, 1]); // 0
 * format.clampDomain( 2, [0, 1]); // 1
 * format.clampDomain( 0.5, [0, 1]); // 0.5
 **/
module.exports.clampDomain = function clampDomain(value, [minimum, maximum]) {
  if (value < minimum) {
    return minimum;
  } else if (value > maximum) {
    return maximum;
  }
  return value;
};

/**
 * Capitalizes the first character of the string.
 * 
 * @param {String} str - String to capitalize the first letter only
 * @returns {String} - ex: 'John paul'
 * @see {@link module:format.capitalizeAll|capitalizeAll} - to capitalize all words in a string
 * @example
 * utils.format.capitalize('john'); // 'John'
 * utils.format.capitalize('john doe'); // 'John doe'
 */
module.exports.capitalize = function capitalize(str) {
  if (!str || str.length === 0) {
    return '';
  }

  //-- charAt does not work for unicode
  const [first, ...rest] = str;
  return first.toLocaleUpperCase() + rest.join('');
};

/**
 * Capitalizes all words in a string.
 * 
 * @param {String} str - String to capitalize
 * @returns {String} - ex: 'John-Paul'
 * @see {@link module:format.capitalizeAll|capitalizeAll} - to capitalize all words in a string
 * @example
 * utils.format.capitalize('john'); // 'John'
 * utils.format.capitalize('john doe'); // 'John Doe'
 * utils.format.capitalize('john-paul'); // 'John-Paul'
 */
module.exports.capitalizeAll = function capitalizeAll(str) {
  return (str || '').split(/\b/)
    .map(FormatUtils.capitalize)
    .join('');
};

/* eslint-disable comma-spacing */
module.exports.metricSI = [
  ['Y', { key: 'Y', name: 'yotta', value: 10 ** 24 , fullName: 'Septillion'    }],
  ['Z', { key: 'Z', name: 'zetta', value: 10 ** 21 , fullName: 'Sextillion'    }],
  ['E', { key: 'E', name: 'exa',   value: 10 ** 18 , fullName: 'Quintillion'   }],
  ['P', { key: 'P', name: 'peta',  value: 10 ** 15 , fullName: 'Quadrillion'   }],
  ['T', { key: 'T', name: 'tera',  value: 10 ** 12 , fullName: 'Trillion'      }],
  ['G', { key: 'G', name: 'giga',  value: 10 ** 9  , fullName: 'Billion'       }],
  ['M', { key: 'M', name: 'mega',  value: 10 ** 6  , fullName: 'Million'       }],
  ['K', { key: 'K', name: 'kilo',  value: 10 ** 3  , fullName: 'Thousand'      }],
  // ['H', { key: 'H', name: 'hecto', value: 10 ** 2  , fullName: 'Hundred'       }],
  // ['D', { key: 'D', name: 'deka',  value: 10 ** 1  , fullName: 'Ten'           }],
  // ['d', { key: 'd', name: 'deci',  value: 10 ** -1 , fullName: 'Tenth'         }],
  ['', { key: '', name: '', value: 1, fullName: ''     }],
  ['c', { key: 'c', name: 'centi', value: 10 ** -2 , fullName: 'Hundredth'     }],
  ['m', { key: 'm', name: 'milli', value: 10 ** -3 , fullName: 'Thousandth'    }],
  ['μ', { key: 'μ', name: 'micro', value: 10 ** -6 , fullName: 'Millionth'     }],
  ['n', { key: 'n', name: 'nano',  value: 10 ** -9 , fullName: 'Billionth'     }],
  ['p', { key: 'p', name: 'pico',  value: 10 ** -12, fullName: 'Trillionth'    }],
  ['f', { key: 'f', name: 'femto', value: 10 ** -15, fullName: 'Quadrillionth' }],
  ['a', { key: 'a', name: 'atto',  value: 10 ** -18, fullName: 'Quintillionth' }],
  ['z', { key: 'z', name: 'zepto', value: 10 ** -21, fullName: 'Sextillionth'  }],
  ['y', { key: 'y', name: 'yocto', value: 10 ** -24, fullName: 'Septillionth'  }]
];

module.exports.metricSIMap = new Map(FormatUtils.metricSI);
/* eslint-enable comma-spacing */

/**
 * This parses compact numbers, like 100K, 2M, etc.
 * 
 * key|name |fullName     |value2  
 * -- |--   |--           |--      
 * Y  |yotta|Septillion   |10^24   
 * Z  |zetta|Sextillion   |10^21   
 * E  |exa  |Quintillion  |10^18   
 * P  |peta |Quadrillion  |10^15   
 * T  |tera |Trillion     |10^12   
 * G  |giga |Billion      |10^9    
 * M  |mega |Million      |10^6    
 * K  |kilo |Thousand     |10^3    
 * m  |milli|Thousandth   |0.001   
 * μ  |micro|Millionth    |0.000001
 * n  |nano |Billionth    |10^-9   
 * p  |pico |Trillionth   |10^-12  
 * f  |femto|Quadrillionth|10^-15  
 * a  |atto |Quintillionth|10^-18  
 * z  |zepto|Sextillionth |10^-21  
 * y  |yocto|Septillionth |10^-24
 * 
 * @param {String} compactStr - Compact Number String, like 100K, 2M, etc.
 * @returns {Number}
 * @example
 * utils.compactParse('1.2K'); // 1200
 * utils.compactParse('12');   // 12
 * utils.compactParse('299.8M')// 299800000
 */
module.exports.compactParse = function compactParse(compactStr) {
  const match = (compactStr || '').match(/([\d.]+)([a-zA-Zμ])?/);
  if (!match) {
    throw Error(`Unable to parse short number:${compactStr}`);
  }
  
  const parsedNumber = parseFloat(match[1]);
  const char = match[2];
  let value = parsedNumber;
  
  if (FormatUtils.metricSIMap.has(char)) {
    value *= FormatUtils.metricSIMap.get(char).value;
  }
  
  return value;
};

/**
 * Converts a number to a compact version.
 * 
 * key|name |fullName     |value2  
 * -- |--   |--           |--      
 * Y  |yotta|Septillion   |10^24   
 * Z  |zetta|Sextillion   |10^21   
 * E  |exa  |Quintillion  |10^18   
 * P  |peta |Quadrillion  |10^15   
 * T  |tera |Trillion     |10^12   
 * G  |giga |Billion      |10^9    
 * M  |mega |Million      |10^6    
 * K  |kilo |Thousand     |10^3    
 * m  |milli|Thousandth   |0.001   
 * μ  |micro|Millionth    |0.000001
 * n  |nano |Billionth    |10^-9   
 * p  |pico |Trillionth   |10^-12  
 * f  |femto|Quadrillionth|10^-15  
 * a  |atto |Quintillionth|10^-18  
 * z  |zepto|Sextillionth |10^-21  
 * y  |yocto|Septillionth |10^-24
 * 
 * Note, a standard method Javascript is now available
 * with {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat|Intl.NumberFormat()}
 * 
 * This method handles very simple cases, but you can use the `compact` layout
 * for much more control.
 * 
 * @param {Number} num - Number to create into a compact number
 * @param {Number} digits - Significant digits
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed|Number.toFixed(num, digits)}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat|Intl.NumberFormat()} - as the compact format does something similar
 * @returns {String}
 * @example 
 * utils.format.compactNumber(123.456, 1);   // 123.5
 * utils.format.compactNumber(759878, 0);    // 760K
 * utils.format.compactNumber(0.0000002, 1); // 200n
 * 
 * //-- or using Intl.NumberFormat
 * new Intl.NumberFormat('en-GB', {
 *   notation: "compact",
 *   compactDisplay: "short"
 * }).format(987654321);
 * // → 988M
 */
module.exports.compactNumber = function compactNumber(num, digits = 0) {
  if (num === 0) {
    return '0';
  } else if (Number.isNaN(num) || !num) {
    return '';
  }

  let si = FormatUtils.metricSI.find((siEntry) => siEntry[1].value <= num);
  if (!si) si = FormatUtils.metricSI[FormatUtils.metricSI.length - 1];

  const siValue = si[1].value;
  const siKey = si[0];

  return (num / siValue).toFixed(digits) + siKey;
};

/**
 * Converts a value to a String, <br />
 * Or returns `otherwise` if any exceptions are found.
 * 
 * @param {any} val - value to convert
 * @param {any} otherwise - value to use if any exceptions are caught
 * @returns {String} - `String(val)`
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive|toPrimitive}
 * @returns {String}
 * @example
 * utils.format.safeConvertString(23); // '23'
 * 
 * const customObj = {
 *  toString: () => `String Value`
 * };
 * utils.format.safeConvertString(customObj); // 'String Value'
 */
module.exports.safeConvertString = function safeConvertString(val, otherwise = null) {
  try {
    return String(val);
  } catch (err) {
    return otherwise;
  }
};

/**
 * Converts a value to a Floating Number, <br />
 * Or returns `otherwise` if any exceptions are found or value is NaN
 * 
 * @param {any} val - value to convert
 * @param {any} otherwise - value to use if any exceptions are caught
 * @returns {Number}
 * @example
 * utils.format.safeConvertFloat('23.1'); // 23.1
 * utils.format.safeConvertFloat('not a number', -1); // -1
 */
module.exports.safeConvertFloat = function safeConvertFloat(val, otherwise = NaN) {
  if (typeof val === 'string') {
    //-- replace the variable in memory to minimize garbage collection.
    // eslint-disable-next-line no-param-reassign
    val = val.replace(/[^0-9.]/g, '');
  }

  try {
    const result = Number.parseFloat(val);
    if (Number.isNaN(result)) {
      return otherwise;
    }
    return result;
  } catch (err) {
    //-- cannot reliably get the exception to be thrown so cannot test this line
    /* istanbul ignore next */
    return otherwise;
  }
};

/**
 * Converts a value to a Floating Number, <br />
 * Or returns `otherwise` if any exceptions are found or value is Not a Number.
 * 
 * @param {any} val - value to convert
 * @param {any} otherwise - value to use if any exceptions are caught
 * @param {Number} [radix = 10] - radix to use in converting the string
 * @returns {Number}
 * @example
 * utils.format.safeConvertFloat('23'); // 23
 * utils.format.safeConvertFloat('not a number', -1); // -1
 */
module.exports.safeConvertInteger = function safeConvertInteger(val, otherwise = NaN, radix = 10) {
  if (typeof val === 'string') {
    //-- replace the variable in memory to minimize garbage collection.
    // eslint-disable-next-line no-param-reassign
    val = val.replace(/[^0-9.]/g, '');
  }

  try {
    const result = Number.parseInt(val, radix);
    if (Number.isNaN(result)) {
      return otherwise;
    }
    return result;
  } catch (err) {
    //-- cannot reliably get the exception to be thrown so cannot test this line
    /* istanbul ignore next */
    return otherwise;
  }
};

/**
 * Converts a value to boolean.
 * 
 * Note this uses the standard JavaScript `truthy` conversion,
 * but with special exceptions for strings: only 'true', 'yes', '1' are considered true.
 * 
 * @param {any} val - value to be converted
 * @returns {Boolean}
 * @example
 * utils.format.safeConvertBoolean(1); // true
 * utils.format.safeConvertBoolean({ pojo: true }); // true
 * utils.format.safeConvertBoolean('TruE'); // true - case insensitive
 * utils.format.safeConvertBoolean('YeS'); // true - case insensitive
 * utils.format.safeConvertBoolean('1'); // true
 * 
 * utils.format.safeConvertBoolean(0); // false
 * utils.format.safeConvertBoolean(null); // false
 * utils.format.safeConvertBoolean('false'); // false
 * utils.format.safeConvertBoolean('No'); // false
 * utils.format.safeConvertBoolean('0'); // false
 */
module.exports.safeConvertBoolean = function safeConvertBoolean(val) {
  if (typeof val === 'string') {
    const valUpper = val.toUpperCase();
    return valUpper === 'TRUE' || valUpper === 'YES' || valUpper === '1';
  }
  return val ? true : false;
};

module.exports.parseCommand = function parseCommand(commandStr) {
  if (!commandStr || commandStr.indexOf('(') < 0) {
    return [commandStr];
  }

  const match = commandStr.match(/^([a-zA-Z].+)[(](.*)[)]$/i);
  let result = [];

  if (match) {
    const commandArgs = (match[2] || '').split(',').map((s) => s.trim()).filter((v) => v !== '');
    result = [
      match[1].trim(),
      commandArgs
    ];
  } else {
    result = [commandStr];
  }
  return result;
};

module.exports.prepareFormatterObject = function prepareFormatterObject(formatterObject) {
  //-- @TODO: find way to reliably say that the propertyTranslation is an object
  // propertyTranslations.constructor.name !== 'Object'
  if (!formatterObject) {
    throw Error(['ObjectUtils.formatProperties(collection, propertyTranslations): propertyTranslations must be an object, ',
      'with the properties matching those to be formatted, and values as functions returning the new value'].join(''));
  }

  const translationKeys = Array.from(Object.keys(formatterObject));

  const result = ({ ...formatterObject });

  translationKeys.forEach((key) => {
    const translationVal = formatterObject[key];
    const translationValType = typeof translationVal;
    if (translationValType === 'function') {
      //-- do nothing
    } else if (translationValType === 'string') {
      const [command, args = []] = FormatUtils.parseCommand(translationVal);
      if (command === 'string') {
        result[key] = FormatUtils.safeConvertString;
      } else if (command === 'ellipsify' || command === 'elipsify' || command === 'ellipsis' || command === 'elipsis') {
        result[key] = (str) => FormatUtils.ellipsify(str, args[0]);
      } else if (command === 'number' || command === 'float') {
        result[key] = FormatUtils.safeConvertFloat;
      } else if (command === 'int' || command === 'integer') {
        result[key] = FormatUtils.safeConvertInteger;
      } else if (command === 'bool' || command === 'boolean') {
        result[key] = FormatUtils.safeConvertBoolean;
      } else {
        result[key] = () => translationVal;
      }
    } else {
      result[key] = () => translationVal;
    }
  });

  return result;
};

/**
 * Tests for empty values:
 * 
 * * (zeros are allowed)
 * * not null
 * * not undefined
 * * not an empty string
 * * not an empty array `[]`
 * 
 * @param {any} val - a value to be tested 
 * @returns {Boolean} - TRUE if the value is not 'empty'
 */
module.exports.isEmptyValue = (val) =>
  //-- allow for 0s
  val === null || val === undefined || val === ''
  || (Array.isArray(val) && val.length === 0);

/**
 * Determines if a value is a boolean true value.
 * 
 * Matches for:
 * 
 * * boolean TRUE
 * * number 1
 * * string 'TRUE'
 * * string 'True'
 * * string 'true'
 * 
 * @param {any} val - the value to be tested
 * @returns {Boolean} - TRUE if the value matches
 */
module.exports.parseBoolean = function parseBoolean(val) {
  return val === true
    || val === 1
    || val === 'TRUE'
    || val === 'True'
    || val === 'true';
};

module.exports.isBoolean = function isBoolean(val) {
  return val === true || val === false
    || val === 1 || val === 0
    || val === 'TRUE' || val === 'FALSE'
    || val === 'True' || val === 'False'
    || val === 'true' || val === 'false';
};

FormatUtils.parseLocaleCache = new Map();

/**
 * Parses a given number, based on a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat|Intl.NumberFormat}
 * 
 * If the locale is not passed (ex: 'fr-FR'), then 'en-US' is assumed
 * 
 * @param {any} val - value to parse
 * @returns {Number} - parsed number
 * @example
 * 
 * utils.format.parseNumber(10); // 10
 * utils.format.parseNumber('10'); // 10
 * utils.format.parseNumber('1,000'); // 1000
 * utils.format.parseNumber('1,000.5'); // 1000.5
 * utils.format.parseNumber('1,000', 'en-US'); // 1000
 * utils.format.parseNumber('1,000.5', 'en-US'); // 1000.5
 * utils.format.parseNumber('1 000', 'fr-FR'); // 1000
 * utils.format.parseNumber('1 000,5', 'fr-FR'); // 1000.5
 */
module.exports.parseNumber = function parseNumber(val, locale = 'en-US') {
  const valType = typeof val;
  if (valType === 'number') {
    return val;
  } else if (valType === 'string') {
    let separator;
    if (FormatUtils.parseLocaleCache.has(locale)) {
      separator = FormatUtils.parseLocaleCache.get(locale);
    } else {
      const example = Intl.NumberFormat(locale).format('1.1');
      separator = example.charAt(1);
      FormatUtils.parseLocaleCache.set(locale, separator);
    }

    const cleanPattern = new RegExp(`[^-+0-9${separator}]`, 'g');
    const cleaned = val.replace(cleanPattern, '');
    const normalized = cleaned.replace(separator, '.');

    return parseFloat(normalized);
  } else if (!val) {
    return val;
  }
  return parseFloat(val);
};

/**
 * Narrows to only fromLine - toLine (inclusive) within a string.
 * 
 * @see {@link module:format.consoleLines|format.consoleLines()} - to console the values out
 * @param {String|Object} str - string to be limited, or object to be json.stringify-ied
 * @param {Number} toLine 
 * @param {Number} [fromLine=0] - starting line number (starts at 0)
 * @param {String} [lineSeparator='\n'] - separator for lines
 * @returns {String}
 * @example
 * str = '1\n2\n\3';
 * utils.format.limitLines(str, 2); // '1\n2'
 * 
 * str = '1\n2\n3';
 * utils.format.limitLines(str, 3, 2); // '2\n3'
 * 
 * str = '1\n2\n3';
 * utils.format.limitLines(str, undefined, 2); // '2\n3'
 */
module.exports.limitLines = function limitLines(str, toLine, fromLine, lineSeparator) {
  const cleanStr = typeof str === 'string'
    ? str
    : JSON.stringify(str || '', FormatUtils.mapReplacer, 2);
  const cleanLine = lineSeparator || '\n';

  if (!toLine) {
    return cleanStr.split(cleanLine)
      .slice(fromLine || 0)
      .join(cleanLine);
  }

  return cleanStr.split(cleanLine)
    .slice(fromLine || 0, toLine)
    .join(cleanLine);
};

/**
 * Same as {@link module:format.limitLines|limitLines()} - only prints to the console.
 * 
 * @see {@link module:format.limitLines|format.limitLines}
 * @param {String|Object} str - string to be limited, or object to be json.stringify-ied
 * @param {Number} toLine 
 * @param {Number} [fromLine=0] - starting line number (starts at 0)
 * @param {String} [lineSeparator='\n'] - separator for lines
 * @returns {String}
 * @example
 * str = '1\n2\n\3';
 * utils.format.limitLines(str, 2); // '1\n2'
 * 
 * str = '1\n2\n3';
 * utils.format.limitLines(str, 3, 2); // '2\n3'
 * 
 * str = '1\n2\n3';
 * utils.format.limitLines(str, undefined, 2); // '2\n3'
 */
module.exports.consoleLines = function consoleLines(str, toLine, fromLine, lineSeparator) {
  console.log(FormatUtils.limitLines(str, toLine, fromLine, lineSeparator));
};

/**
 * Strips any html or xml tags from a string.
 * 
 * Note, if you want to remove html entities (ex: `&nbsp;` or `&#8209;`), please consider [other libraries](https://www.npmjs.com/search?q=html%20entities)
 * 
 * @param {String} str - string to strip html / xml entities from
 * @returns {String}
 * @example 
 * 
 * utils.format.stripHtmlTags('Hello <br />Nice to see <b>you</b>'); // 'Hello Nice to see you'
 * utils.format.stripHtmlTags('example string'); // 'example string' -- untouched
 */
module.exports.stripHtmlTags = function stripHtmlTags(str) {
  if (!str) return str;

  return str.replace(/<[^>]+>/g, '');
};

/**
 * Breaks apart a string into an array of strings by a new line character.
 * 
 * @param {String} str - string to be broken apart into lines
 * @param {Object} options - options to apply
 * @param {Number} [options.width=50] - width of lines to cut
 * @param {boolean} [options.cut=false] - whether to cut words in the middle
 * @param {boolean} [options.trim=true] - whether to trim the whitespace at ends of lines - after splitting.
 * @returns {String[]} - array of strings
 * @example
 * 
 * const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
 * + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation';
 * 
 * //-- does not cut the line by default, and width of 50
 * utils.format.wordWrap(str);
 * // [
 * //   'Lorem ipsum dolor sit amet, consectetur adipiscing',
 * //   'elit, sed do eiusmod tempor incididunt ut labore',
 * //   'et dolore magna aliqua. Ut enim ad minim veniam,',
 * //   'quis nostrud exercitation'
 * // ];
 * 
 * //-- you can also set the width, and whether to cut in the middle of the line
 * utils.format.wordWrap(str, { cut: true, width: 70 });
 * const expected = [
 *   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo',
 *   'd tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim',
 *   'veniam, quis nostrud exercitation'
 * ];
 */
module.exports.wordWrap = function wordWrap(str, options) {
  const cleanOptions = options || {};
  const {
    width = 50,
    cut = false,
    trim = true
  } = cleanOptions;

  if (!str || !(typeof str === 'string')) return str;

  let rexStr = `.{1,${width}}`;
  if (cut !== true) {
    rexStr += '([\\s\u200B]+|$)|[^\\s\u200B]+?([\\s\u200B]+|$)';
  }
  const rex = new RegExp(rexStr, 'g');

  /* istanbul ignore next */
  let lines = str.match(rex) || [];

  if (trim) {
    lines = lines.map((line) => line.trim());
  }
  return lines;
};

/**
 * Determines the number of lines in a string
 * 
 * @param {String} str - String to be checked for number of lines
 * @param {String} [newlineCharacter='\n'] - the newline character to use
 * @returns {Number} - Number of lines found
 * @see {@link module:format.wordWrap|wordWap(str, options})} for other options.
 * @example
 * 
 * utils.format.lineCount('single line'); // 1
 * utils.format.lineCount(`line 1
 *   line 2
 *   line 3`); // 3
 * utils.format.lineCount('line 1\rLine2\rLine3', '\r'); // 3
 */
module.exports.lineCount = function lineCount(str, newlineCharacter = '\n') {
  const cleanNewLine = newlineCharacter || '\n';
  if (!str || !(typeof str === 'string')) return 0;
  const rex = new RegExp(`${cleanNewLine}`, 'g');
  const match = str.match(rex);
  return match ? match.length + 1 : 1;
};

/**
 * Performs a set of replacement against a string or list of strings.
 * 
 * The string replacements can either be [[search,replace],[search,replace]]
 * or a map of Map([[search, replace], [search, replace]])
 * 
 * This is meant to provide a way to apply consistent string cleanups across projects.
 * 
 * example:
 * 
 * ```
 * targetStrings = [
 *   'jack and jill went up the hill',
 *   'to fetch the pail of water',
 *   'jack fell down and broke his crown',
 *   'and jill came tumbling after'
 * ];
 * 
 * //-- include an array of strings to all remove out
 * utils.format.replaceStrings(targetStrings, ['down ', ' of water']);
 * // [ 'jack and jill went up the hill',
 * //   'to fetch the pail',
 * //   'jack fell and broke his crown',
 * //   'and jill came tumbling after' ]
 *
 * //-- or use tuplets of [find, replace] with regular expressions
 * //-- and strings not in tuplets are simply removed.
 * replaceValues = [['jack', 'john'], [/\s+jill/i, ' ringo'], ' down'];
 * utils.format.replaceStrings(targetStrings, replaceValues);
 * expected = [
 *   'john and ringo went up the hill',
 *   'to fetch the pail of water',
 *   'john fell and broke his crown',
 *   'and ringo came tumbling after'
 * ];
 * 
 * //-- a map will do the same, but will not support regular expressions for keys
 * replaceValues = new Map();
 * replaceValues.set('jack', 'john');
 * replaceValues.set('jill', 'ringo');
 * utils.format.replaceStrings(targetStrings, replaceValues);
 * expected = [
 *   'john and ringo went up the hill',
 *   'to fetch the pail of water',
 *   'john fell down and broke his crown',
 *   'and ringo came tumbling after'
 * ];
 * ```
 * 
 * @param {string|string[]} targetStr - the string to search for with the tuplets
 * @param {Array|Map<string|RegExp,string>} stringTupletsOrMap - [[search, replace]] or Map<String|RegExp,String>
 * @returns {string[]} - the resulting list of strings
 */
module.exports.replaceStrings = function replaceStrings(targetStr, stringTupletsOrMap) {
  const cleanStrings = !targetStr ? [] : Array.isArray(targetStr) ? targetStr : [targetStr];
  // const signature = 'replaceStrings(targetStrings, stringTupletsOrMap)';
  const replacementEntries = [];

  if (Array.isArray(stringTupletsOrMap)) {
    stringTupletsOrMap.forEach((possibleReplacement) => {
      if (typeof possibleReplacement === 'string') {
        replacementEntries.push([possibleReplacement, '']);
      } else if (Array.isArray(possibleReplacement)) {
        const [replaceSearch, replaceWith] = possibleReplacement;
        replacementEntries.push([replaceSearch, replaceWith || '']);
      }
    });
  } else if (stringTupletsOrMap instanceof Map) {
    [...stringTupletsOrMap.entries()]
      .forEach(([replaceSearch, replaceWith]) => {
        replacementEntries.push([replaceSearch, replaceWith || '']);
      });
  }

  return cleanStrings.map((stringToClean) => !stringToClean
    ? stringToClean
    : replacementEntries.reduce((result, [replaceSearch, replaceWith]) => !result
      ? result
      : result.replace(replaceSearch, replaceWith), stringToClean));
};

/**
 * Conveience function for calling {@link module:format.replaceStrings|format.replaceStrings} -
 * giving and receiving a single value (instead of an array of values).
 * @param {String} targetStr - A Single string to replace values on.
 * @param {Array|Map<string|RegExp,string>} stringTupletsOrMap - [[search, replace]] or Map<String|RegExp,String>
 * @returns {string} - the targetStr with the values replaced
 * @see {@link module:format.replaceStrings}
 */
module.exports.replaceString = function replaceString(targetStr, stringTupletsOrMap) {
  if (Array.isArray(targetStr)) {
    throw Error('replaceString(targetStr, stringTupletsOrMap): targetStr was sent an array - please use replaceStrings instead');
  }
  return FormatUtils.replaceStrings([targetStr], stringTupletsOrMap)[0];
};

/**
 * Identify an array of words each from a string.
 * 
 * Note that this uses the new [Unicode Properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape)
 * using `\p{L}` to identify characters based on unicode properties.
 * 
 * For example:
 * 
 * ```
 * strs = 'I am Modern "major-general".';
 * FormatUtils.extractWords(strs);
 * // ['I', 'am', 'Modern', 'major', 'general'];
 * ```
 * 
 * you can also include additional characters that will no longer be considered word boundaries.
 * 
 * ```
 * strs = 'I am Modern "major-general".';
 * FormatUtils.extractWords(strs);
 * // ['I', 'am', 'Modern', 'major-general'];
 * ```
 * 
 * arrays of strings are also supported
 * 
 * ```
 * strs = ['letras mayúsculas de tamaño igual a las minúsculas',
 *  'الاختراع، ومايكل هارت'];
 * FormatUtils.extractWords(strs);
 * // [ 'letras', 'mayúsculas', 'de', 'tamaño', 'igual', 'a', 'las', 'minúsculas', 'الاختراع', 'ومايكل', 'هارت'];
 * ```
 * 
 * @param {String|String[]} strToExtractFrom - collection of strings to extract words from
 * @param {String} additionalNonBreakingCharacters - each char in this string will not be treated as a word boundry
 * @returns {string[]} - collection of words
 */
module.exports.extractWords = function extractWords(strToExtractFrom, additionalNonBreakingCharacters) {
  if (!strToExtractFrom) return strToExtractFrom;
  
  const cleanNonBreaking = additionalNonBreakingCharacters
    ? additionalNonBreakingCharacters
    : '';
  
  const regex = cleanNonBreaking
    ? new RegExp(`[${additionalNonBreakingCharacters}\\p{L}]+`, 'gu')
    : /\p{L}+/ug;  // -- old attempt/[A-Za-zÀ-ÖØ-öø-ÿ]+/g;
  
  const cleanStrings = Array.isArray(strToExtractFrom)
    ? strToExtractFrom
    : [strToExtractFrom];
  
  return cleanStrings.reduce((result, str) => [...result, ...((str || '').match(regex) || [])], []);
};
