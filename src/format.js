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
 * * Formatting Time
 *   * {@link module:format.millisecondDuration|format.millisecondDuration}
 * * Mapping Values
 *   * {@link module:format.mapDomain|format.mapDomain} - projects a value from a domain of expected values to a range of output values, ex: 10% of 2 Pi
 * * Identifying Time Periods
 *   * {@link module:format.timePeriod|format.timePeriod} - Converts a time to a time period, very helpful for animations
 *   * {@link module:format.timePeriodPercent|format.timePeriodPercent} - Determines the percent complete of the current time period
 * * Converting values safely
 *   * {@link module:format.safeConvertString|format.safeConvertString} - converts a value to string, or uses a default for any error
 *   * {@link module:format.safeConvertFloat|format.safeConvertFloat} - converts a value to a Number (123.4), or uses a default for any error or NaN
 *   * {@link module:format.safeConvertInteger|format.safeConvertInteger} - converts a value to a Number (123), or uses a default for any error or NaN
 *   * {@link module:format.safeConvertBoolean|format.safeConvertBoolean} - converts a value to a boolean
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
module.exports.ellipsify = function ellipsify(str, maxLen = 50) {
  if (str && str.length > maxLen) {
    return `${str.substring(0, maxLen)}…`;
  }
  return str;
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
    if (typeof translationVal === 'function') {
      //-- do nothing
    } else if (translationVal === 'string') {
      result[key] = FormatUtils.safeConvertString;
    } else if (translationVal === 'number' || translationVal === 'float') {
      result[key] = FormatUtils.safeConvertFloat;
    } else if (translationVal === 'int' || translationVal === 'integer') {
      result[key] = FormatUtils.safeConvertInteger;
    } else if (translationVal === 'boolean') {
      result[key] = FormatUtils.safeConvertBoolean;
    } else {
      result[key] = () => translationVal;
    }
  });

  return result;
};
