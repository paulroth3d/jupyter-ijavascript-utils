/* eslint-disable max-classes-per-file, class-methods-use-this */

const FormatUtils = require('./format');

/**
 * Module to describe objects or sets of data
 */
module.exports = {};
const DescribeUtil = module.exports;

/**
 * Base Description for a series of values
 */
class SeriesDescription {
  constructor() {
    this.reset();
  }

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
      throw Error(`Value passed(${value}) expected to be:${expectedType}, but was: ${valueType}`);
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

  constructor() {
    super();
    this.reset();
  }

  reset() {
    super.reset();
    this.mean = 0.0;
    this.m2 = 0.0;
    this.stdDeviation = 0.0;
  }

  check(value) {
    if (!super.check(value, 'number')) return;
    super.checkMinMax(value);

    /*
    @see Welford's algorithm
    @see https://stackoverflow.com/a/1348615
    @see https://lingpipe-blog.com/2009/03/19/computing-sample-mean-variance-online-one-pass/
    @see https://lingpipe-blog.com/2009/07/07/welford-s-algorithm-delete-online-mean-variance-deviation/
    */
    const oldMean = this.mean;
    this.mean += (value - oldMean) / this.count;
    // const nextMean = this.mean + (value - this.mean) / this.count;
    this.m2 += (value - oldMean) * (value - this.mean);
    // console.log(`value:${value}, this.mean:${this.mean}, oldMean:${oldMean}, stdDeviation:${this.stdDeviation}`);
    // this.mean = nextMean;
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

  constructor() {
    super();
    this.reset();
  }

  reset() {
    super.reset();
    this.uniqueMap = new Map();
    this.unique = null;
    this.top = null;
    this.topFrequency = null;
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

    let currentTop;
    let currentTopFrequency = null;
    for (const [key, count] of this.uniqueMap.entries()) {
      if (currentTopFrequency == null || count > currentTopFrequency) {
        currentTop = key;
        currentTopFrequency = count;
      }
    }
    this.top = currentTop;
    this.topFrequency = currentTopFrequency;
  }
}

DescribeUtil.NumberDescription = NumberDescription;
DescribeUtil.StringDescription = StringDescription;

DescribeUtil.describeStrings = function describeStrings(collection) {
  if (!Array.isArray(collection) || collection.length < 1 || typeof collection[0] !== 'string') {
    throw Error('describeStrings(collection): collection must be an array of strings');
  }

  const result = new StringDescription();
  collection.forEach((value) => result.check(value));
  result.finalize();

  return result;
};

DescribeUtil.describeNumbers = function describeNumbers(collection) {
  if (!Array.isArray(collection) || collection.length < 1 || typeof collection[0] !== 'number') {
    throw Error('describeNumbers(collection): collection must be an array of numbers');
  }

  const result = new NumberDescription();
  collection.forEach((value) => result.check(value));
  result.finalize();

  return result;
};

DescribeUtil.welford = function welford(series) {
  let M = 0;
  let S = 0;
  const N = series.length;
  for (let k = 1; k <= series.length; k += 1) {
    const x = series[k - 1];
    const oldM = M;
    M = M + (x - M) / k; // eslint-disable-line
    S = S + (x - M) * (x - oldM); // eslint-disable-line
    // console.log(`x:${x}, k:${k}, M:${M}, S:${S}, oldM:${oldM}`);
  }
  return N > 1 ? S / (N) : 0.0;
};

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
