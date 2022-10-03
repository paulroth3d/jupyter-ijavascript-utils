/* eslint-disable max-classes-per-file, class-methods-use-this */

const FormatUtils = require('./format');
const ObjectUtils = require('./object');

/**
 * Module to describe objects or sets of data
 * 
 * @module describe
 * @exports describe
 */
module.exports = {};
const DescribeUtil = module.exports;

/**
 * @typedef {Object} DescribeOptions
 * @property {Boolean} uniqueStrings - whether unique strings / frequency should be captured
 */

/**
 * Base Description for a series of values
 * @class
 */
class SeriesDescription {
  /**
   * Constructor
   * @param {String} what - description of what is being described
   * @param {DescribeOptions} options - options for how things are described
   */
  constructor(what, type, options) {
    this.reset();
    this.what = what;
    this.type = type;
    // this.options = options || {};
  }

  /**
   * Options used for describing
   * @type {DescribeOptions}
   */
  // options;

  /**
   * What is being described
   * @type {String}
   */
  what;

  /**
   * The type of thing being described
   * @type {String}
   */
  type;

  /**
   * The number of entries reviewed
   * @type {Number}
   */
  count;

  /**
   * The minimum value found;
   * @type {any}
   */
  min;

  /**
   * The maximum value found
   * @type {any{}}
   */
  max;

  /**
   * Resets the Description to the initial state
   */
  reset() {
    this.count = 0;
    this.max = null;
    this.min = null;
  }

  /**
   * Validates a value is the type expected
   * or throws an error if the type is not
   * or throws false if the value is 'empty'
   * @param {any} value - value to be checked
   * @param {String} expectedTypeOf - the type of the value
   * @returns {Boolean} - true if found and the right type, false if empty
   * @throws {Error} if the value is the wrong type
   */
  check(value, expectedType) {
    if (FormatUtils.isEmptyValue(value)) {
      return false;
    }

    const valueType = typeof value;
    if (valueType !== expectedType) {
      throw Error(`describe: Value passed(${value}) expected to be:${expectedType}, but was: ${valueType}`);
    }

    this.count += 1;

    return true;
  }

  /**
   * Checks for minimum and maximum values
   * @param {any} value
   */
  checkMinMax(value) {
    if (this.min === null || value < this.min) {
      this.min = value;
    }
    if (this.max === null || value > this.max) {
      this.max = value;
    }
  }

  /**
   * Finalizes the review
   */
  finalize() { // eslint-disable-line
  }
}

/**
 * Describes a series of Boolean Values
 * @augments SeriesDescription
 * @class
 */
class BooleanDescription extends SeriesDescription {
  /**
   * Mean sum as expressed
   * @type {number}
   */
  mean;

  /**
   * 
   * @param {String} what - what is being described
   * @param {DescribeOptions} options - options used for describing
   */
  constructor(what, options) {
    super(what, 'boolean', options);
    this.reset();
  }

  reset() {
    super.reset();
    this.mean = 0.0;
  }

  /**
   * Whether the value can be described with this
   * @param {any} value - value to check
   * @returns {Boolean} - true if the value matches
   */
  static matchesType(value) {
    return FormatUtils.parseBoolean(value)
      || value === false
      || value === 'FALSE'
      || value === 'False'
      || value === 'false';
  }

  check(value) {
    if (FormatUtils.isEmptyValue(value)) return;

    this.count += 1;
    const cleanValue = FormatUtils.parseBoolean(value)
      ? 1 : 0;
    
    const oldMean = this.mean;
    this.mean += (cleanValue - oldMean) / this.count;

    if (this.max === null && cleanValue === 1) this.max = 1;
    if (this.min === null && cleanValue === 0) this.min = 0;
  }

  finalize() {
    super.finalize();
  }
}

/**
 * Describes a series of Numbers
 */
class NumberDescription extends SeriesDescription {
  /**
   * Mean sum as expressed
   * @type {number}
   */
  mean;

  /**
   * M2 - sum of squared deviation
   */
  m2;

  /**
   * Standard deviation of the numbers 
   */
  stdDeviation;

  /**
   * Constructor
   * @param {String} what - What is being described
   * @param {DescribeOptions} options -
   */
  constructor(what, options) {
    super(what, 'number', options);
    this.reset();
  }

  reset() {
    super.reset();
    this.mean = 0.0;
    this.m2 = 0.0;
    this.stdDeviation = 0.0;
  }

  /**
   * Whether the value can be described with this
   * @param {any} value - value to check
   * @returns {Boolean} - true if the value matches
   */
  static matchesType(value) {
    return (typeof value) === 'number';
  }

  check(value) {
    if (!super.check(value, 'number')) return;
    super.checkMinMax(value);

    /*
    @see Welford's algorithm
    @see https://stackoverflow.com/a/1348615
    @see https://lingpipe-blog.com/2009/03/19/computing-sample-mean-variance-online-one-pass/
    @see https://lingpipe-blog.com/2009/07/07/welford-s-algorithm-delete-online-mean-variance-deviation/
    @see https://www.calculator.net/standard-deviation-calculator.html
    */
    const oldMean = this.mean;
    this.mean += (value - oldMean) / this.count;
    this.m2 += (value - oldMean) * (value - this.mean);
    // console.log(`value:${value}, this.mean:${this.mean}, oldMean:${oldMean}, stdDeviation:${this.stdDeviation}`);
  }

  finalize() {
    super.finalize();

    let newDeviation;
    if (this.count > 1) {
      newDeviation = Math.sqrt(this.m2 / this.count);
    } else {
      newDeviation = 0.0;
    }
    // console.log(`updated m2:${this.m2}, stdDeviation:${this.stdDeviation}, count:${this.count}, newDeviation:${newDeviation}`);
    this.stdDeviation = newDeviation;
  }
}

/**
 * Describes a series of string values
 */
class StringDescription extends SeriesDescription {
  /**
   * Map of unique values
   * @type {Map<String,Number>}
   */
  uniqueMap;

  /**
   * Number of unique values;
   * @type {Number}
   */
  unique;

  /**
   * The most common string
   * @type {String}
   */
  top;

  /**
   * The frequency of the most common string
   * @type {Number]}
   */
  topFrequency;

  /**
   * Constructor
   * @param {String} what - What is being described
   * @param {DescribeOptions} options -
   */
  constructor(what, options) {
    super(what, 'string', options);
    this.uniqueMap = null;
    this.reset();
  }

  reset() {
    super.reset();
    this.uniqueMap = new Map();
    this.unique = null;
    this.top = null;
    this.topFrequency = null;
  }

  /**
   * Whether the value can be described with this
   * @param {any} value - value to check
   * @returns {Boolean} - true if the value matches
   */
  static matchesType(value) {
    return (typeof value) === 'string';
  }

  check(value) {
    if (!super.check(value, 'string')) return;

    if (this.uniqueMap.has(value)) {
      this.uniqueMap.set(value, this.uniqueMap.get(value) + 1);
      return;
    }

    this.uniqueMap.set(value, 1);
    
    const len = value.length;
    if (this.min === null || len < this.min.length) this.min = value;
    if (this.max === null || len > this.max.length) this.max = value;
    // console.log(`len:${len}, min:${this.min}, max:${this.max}`);
  }

  finalize() {
    super.finalize();

    let currentTop = null;
    let currentTopFrequency = null;
    for (const [key, count] of this.uniqueMap.entries()) {
      if (currentTopFrequency == null || count > currentTopFrequency) {
        currentTop = key;
        currentTopFrequency = count;
      }
    }
    this.top = currentTop;
    this.topFrequency = currentTopFrequency;
    this.unique = this.uniqueMap.size;

    this.uniqueMap = null;
  }
}

/**
 * Describes a series of Dates
 */
class DateDescription extends SeriesDescription {
  /**
   * Mean sum as expressed
   * @type {number}
   */
  mean;

  /**
   * Constructor
   * @param {String} what - What is being described
   * @param {DescribeOptions} options -
   */
  constructor(what, options) {
    super(what, 'Date', options);
    this.reset();
  }

  reset() {
    super.reset();
    this.mean = null;
  }

  /**
   * Whether the value can be described with this
   * @param {any} value - value to check
   * @returns {Boolean} - true if the value matches
   */
  static matchesType(value) {
    return (value instanceof Date); // || (typeof value) === 'number';
  }

  check(value) {
    if (FormatUtils.isEmptyValue(value)) return;

    let cleanValue;
    if (value instanceof Date) {
      cleanValue = value.getTime();
    } else if (typeof value === 'number') {
      cleanValue = value;
    } else {
      throw Error(`describe: Value passed(${value}) - expected to be type:Date`);
    }

    this.count += 1;
    
    const oldMean = this.mean;
    this.mean += (cleanValue - oldMean) / this.count;

    super.checkMinMax(cleanValue);
  }

  finalize() {
    super.finalize();

    if (!FormatUtils.isEmptyValue(this.min)) this.min = new Date(this.min);
    if (!FormatUtils.isEmptyValue(this.max)) this.max = new Date(this.max);
    if (!FormatUtils.isEmptyValue(this.mean)) this.mean = new Date(this.mean);
  }
}

/**
 * 
 * @param {Object[]} collection - Collection of objects to be described
 * @param {Object} options - options to be 
 * @returns 
 */
module.exports.describeObjects = function describeObjects(collection, options) {
  const cleanCollection = Array.isArray(collection) ? collection : [collection];

  const cleanOptions = options ? options : {};

  cleanOptions.include = cleanOptions.include ? new Set(cleanOptions.include) : null;
  cleanOptions.exclude = new Set(cleanOptions.exclude || []);

  const results = new Map();
  if (cleanOptions.results) {
    ObjectUtils.keys(cleanOptions.results)
      .forEach((key) => {
        const keyValue = cleanOptions.results[key];
        if (keyValue === 'string') {
          results.set(key, new StringDescription(key));
        } else if (keyValue === 'number') {
          results.set(key, new NumberDescription(key));
        } else if (keyValue === 'date') {
          results.set(key, new DateDescription(key));
        } else if (keyValue === 'boolean' || keyValue === 'bool') {
          results.set(key, new StringDescription(key));
        }
      });
  }
  let val;
  // let describer;

  cleanCollection.forEach((obj) => {
    ObjectUtils.keys(obj)
      .forEach((key) => {
        val = obj[key];
        
        if (cleanOptions.include && !cleanOptions.include.has(key)) {
          //-- ignore
        } else if (cleanOptions.exclude.has(key)) {
          //-- ignore
        } else if (FormatUtils.isEmptyValue(val)) {
          //-- do nothing
        } else {
          if (Object.prototype.hasOwnProperty.call(results, key)) {
            //-- describer already found
          } else if (StringDescription.matchesType(val)) {
            results[key] = new StringDescription(key);
          } else if (DateDescription.matchesType(val)) {
            results[key] = new DateDescription(key);
          } else if (NumberDescription.matchesType(val)) {
            results[key] = new NumberDescription(key);
          } else if (BooleanDescription.matchesType(val)) {
            results[key] = new BooleanDescription(key);
          } else {
            //-- ignore?
            results[key] = new SeriesDescription(key, typeof val);
          }
          results[key].check(val);
        }
      });
  });

  const resultArray = [];
  ObjectUtils.keys(results)
    .forEach((key) => {
      results[key].finalize();
      resultArray.push(results[key]);
    });
  
  return resultArray;
};

/**
 * Describes a series of numbers
 * @param {String[]} collection - collection of string values to describe
 * @param {Object} options - options for describing strings
 * @returns {StringDescription} - Description of the list of strings
 */
module.exports.describeStrings = function describeStrings(collection, options) {
  const cleanCollection = Array.isArray(collection) ? collection : [collection];
  
  const result = new StringDescription(null, options);
  cleanCollection.forEach((value) => result.check(value));
  result.finalize();

  return result;
};

/**
 * Describes a series of numbers
 * @param {Number[]} collection - Array of numbers
 * @param {Object} options - options for describing numbers
 * @returns {NumberDescription}
 */
module.exports.describeNumbers = function describeNumbers(collection, options) {
  const cleanCollection = Array.isArray(collection) ? collection : [collection];
  
  const result = new NumberDescription(null, options);
  cleanCollection.forEach((value) => result.check(value));
  result.finalize();

  return result;
};

/**
 * Describes a series of boolean values.
 * 
 * Note, that the following are considered TRUE:
 * 
 * * Boolean true
 * * Number 1
 * * String TRUE
 * * String True
 * * String true
 * 
 * @param {Boolean[] | String[] | Number[]} collection - Array of Boolean Values
 * @param {Object} options - options for describing boolean values
 * @returns {BooleanDescription}
 * @see {@link module:format.parseBooleanValue}
 */
module.exports.describeBoolean = function describeBoolean(collection, options) {
  const cleanCollection = Array.isArray(collection) ? collection : [collection];

  const result = new BooleanDescription(null, options);
  cleanCollection.forEach((value) => result.check(value));
  result.finalize();

  return result;
};

/**
 * Describes a series of Date / Epoch Numbers
 * 
 * @param {Date[] | Number[]} collection - Array of Dates / Epoch Numbers
 * @param {Object} options - options for describing dates
 * @returns {DateDescription}
 */
module.exports.describeDates = function describeDates(collection, options) {
  const cleanCollection = Array.isArray(collection) ? collection : [collection];

  const result = new DateDescription(null, options);
  cleanCollection.forEach((value) => result.check(value));
  result.finalize();

  return result;
};

//-- Testing Internal items

/**
 * Sanity check for standard deviation
 * @param {Number[]} series - collection of numbers
 * @returns {Number} - standard deviation of the numbers
 * @private
 */
DescribeUtil.stdDeviation = function stdDeviation(series) {
  let avg = 0;

  if (series.length < 2) return 0.0;

  const sum = series.reduce((result, val) => result + val, 0);
  avg = sum / series.length;

  const s1 = series.reduce((result, val) => result + ((val - avg) ** 2), 0);
  // console.log(`s1:${s1}`);
  const s2 = Math.sqrt(s1 / series.length);

  return s2;
};

/**
 * Number Description - used for testing
 * @private
 */
DescribeUtil.NumberDescription = NumberDescription;

/**
 * String Description - used for testing
 * @private
 */
DescribeUtil.StringDescription = StringDescription;
