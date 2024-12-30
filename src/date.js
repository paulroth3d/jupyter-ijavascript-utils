/**
 * Utility methods for working with dates and date ranges
 * 

 * * Valiate
 *   * {@link module:date.isValid|date.isValid(date)} - whether the date provided is an invalid date
 * * Parse
 *   * {@link module:date.parse|date.parse(String)} - parse a date and throw an exception if it is not a valid date
 * * TimeZones
 *   * {@link module:date.getTimezoneOffset|date.getTimezoneOffset(String)} - gets the number of milliseconds offset for a given timezone
 *   * {@link module:date.correctForTimezone|date.correctForTimezone(Date, String)} - meant to correct a date already off from UTC to the correct time
 *   * {@link module:date.epochShift|date.epochShift(Date, String)} - offsets a date from UTC to a given time amount
 * - knowing some methods might behave incorrectly
 * * Add
 *   * {@link module:date.add|date.add(Date, {days, hours, minutes, seconds)} - shift a date by a given amount
 *   * {@link module:date.endOfDay|date.endOfDay(Date)} - finds the end of day UTC for a given date
 *   * {@link module:date.startOfDay|date.startOfDay(Date)} - finds the end of day UTC for a given date
 * 
 * --------
 * 
 * See other libraries for more complete functionality:
 * 
 * * [Luxon](https://moment.github.io/luxon/index.html) - successor to [Moment.js](https://momentjs.com/)
 * * [date-fns-tz](https://github.com/marnusw/date-fns-tz) extension for [date-fns](https://date-fns.org/)
 * 
 * also watch the [TC39 Temporal Proposal](https://github.com/tc39/proposal-temporal)
 * - also found under caniuse: https://caniuse.com/temporal
 * 
 * @module date
 * @exports date
 * @see {@link https://stackoverflow.com/questions/15141762/how-to-initialize-a-javascript-date-to-a-particular-time-zone}
 * @see {@link https://www.youtube.com/watch?v=2rnIHsqABfM&t=750s|epochShifting}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getTimeZones|MDN TimeZone Names}
 */
module.exports = {};
const DateUtils = module.exports;

/**
 * Collection of time durations in milliseconds
 */
module.exports.TIME = { MILLI: 1 };
module.exports.TIME.SECOND = DateUtils.TIME.MILLI * 1000;
module.exports.TIME.MINUTE = DateUtils.TIME.SECOND * 60;
module.exports.TIME.HOUR = DateUtils.TIME.MINUTE * 60;
module.exports.TIME.DAY = DateUtils.TIME.HOUR * 24;

module.exports.padTime = function padTime(num, size = 2) {
  return String(num).padStart(size, '0');
};

/**
 * Simple check on whether the a JavaScript Date object is - or is not - an 'Invalid Date' instance.
 * 
 * ```
 * d = new Date('2024-12-1');
 * utils.date.isValid(d); // true
 * 
 * d = new Date('2024-12-1T');
 * utils.date.isValid(d); // false
 * 
 * d = new Date('some string');
 * utils.date.isValid(d); // false
 * ```
 * 
 * @param {Date} testDate - JavaScript date to validate
 * @returns {boolean} - whether the Date object is an 'invalid date' instance
 */
module.exports.isValid = (testDate) => {
  if (!testDate) return false;
  if (!(testDate instanceof Date)) return false;
  return !Number.isNaN(testDate.getTime());
};

/**
 * Harshly parses a JavaScript Date.
 * 
 * If the testValue is null, undefined then the same value is returned.
 * 
 * if the testValue is a valid Date - then the parsed Date object is returned.
 * 
 * If the testValue is not a valid Date, then throws an Error.
 * 
 * ```
 * d = utils.date.parse('2024-12-01'); // returns Date object
 * d = utils.date.parse(0); // returns Date object
 * 
 * d = utils.date.parse(null); // returns null
 * 
 * @param {String} dateStr - value passed to Date.parse
 * @returns {Date}
 * @see {@link module:date.isValid|date.isValid} - in checking for invalid dates
 */
module.exports.parse = (dateStr) => {
  if (dateStr === undefined || dateStr === null) return dateStr;
  const result = new Date(Date.parse(dateStr));
  if (!DateUtils.isValid(result)) {
    throw new Error(`Could not parse date: ${dateStr}`);
  }
  return result;
};

module.exports.timeZoneOffsets = new Map();

/**
 * Determines the number of milliseconds difference between
 * a given timezone and UTC.
 * 
 * (Note: these values are cached, and optimized for repeated use on the same value)
 * 
 * See {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones|the list of TZ database time zones}
 * for the full list of options.
 * 
 * @param {String} timeZoneStr - a timezone string like "America/Toronto"
 * @returns {Number} - the number of milliseconds between UTC and that timezone
 */
module.exports.getTimezoneOffset = function getTimezoneOffset(timeZoneStr) {
  if (DateUtils.timeZoneOffsets.has(timeZoneStr)) {
    return DateUtils.timeZoneOffsets.get(timeZoneStr);
  }
  const d = new Date();

  const format = new Intl.DateTimeFormat('en-us', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    fractionalSecondDigits: 3,
    timeZone: timeZoneStr
  });
  const dm = format.formatToParts(d)
    .filter(({ type }) => type !== 'literal')
    .reduce((result, { type, value }) => {
      // eslint-disable-next-line no-param-reassign
      result[type] = value;
      return result;
    }, {});
  //   const impactedDate = new Date(d.toLocaleString('en-US', { timeZone: timeZoneStr }));
  const dateStr = `${dm.year}-${DateUtils.padTime(dm.month)}-${DateUtils.padTime(dm.day)}T${
    DateUtils.padTime(dm.hour)}:${DateUtils.padTime(dm.minute)}:${DateUtils.padTime(dm.second)}.${
    DateUtils.padTime(dm.fractionalSecond, 3)}`;
  const impactedDate = new Date(dateStr);

  const diff = d.getTime() - impactedDate.getTime();

  DateUtils.timeZoneOffsets.set(timeZoneStr, diff);

  return diff;
};

/**
 * JavaScript always stores dates in UTC, but the data you imported may have lost the timezone information.
 * 
 * Use this to correct the timezone to the correct time UTC.
 * 
 * For Example:
 * 
 * ```
 * // the date we originally pulled from the database
 * // but thetimezone of the database was america/Toronto but not in UTC
 * dateStr = '2024-12-06 18:00';
 * 
 * // we may have done this:
 * myDate = new Date(dateStr);
 * 
 * // but now calling toISOString() is incorrect
 * myDate.toISOString(); // '2024-12-06T18:00:00.0000' 
 * 
 * // it should be:
 * correctedDate = utils.date.correctForTimezone('america/Toronto');
 * correctedDate.toISOString(); // '2024-12-06T13:00:00.00.000' -- the correct time UTC
 * ```
 * 
 * See {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones|the list of TZ database time zones}
 * for the full list of timezone options.
 * 
 * @param {Date} date - the date to be corrected in a new instance
 * @param {String} timeZoneStr - tz database name for the timezone
 * @returns {Date} - copy of the date corrected 
 */
module.exports.correctForTimezone = function correctForTimezone(date, timeZoneStr) {
  const offsetMilli = DateUtils.getTimezoneOffset(timeZoneStr);
  return new Date(date.getTime() + offsetMilli);
};

/**
 * Epoch shift a date, so the utcDate is no longer correct,
 * but many other functions behave closer to expected.
 * 
 * See {@link https://stackoverflow.com/a/15171030|here why this might not be what you want}
 * 
 * @param {Date} date - date to shift
 * @param {String} timeZoneStr - the tz database name of the timezone
 * @returns {Date}
 */
module.exports.epochShift = function epochShift(date, timeZoneStr) {
  const offsetMilli = DateUtils.getTimezoneOffset(timeZoneStr);
  return new Date(date.getTime() - offsetMilli);
};

/**
 * Clones a date.
 * 
 * (Doesn't seem needed currently)
 * 
 * (NOTE: the timezone information is lost)
 * 
 * @param {Date} targetDate - the date to be cloned
 * @returns {Date}
 */
/*
module.exports.clone = function clone(targetDate) {
  return new Date(targetDate.getTime());
};
*/

/**
 * Adds an amount to a date: days, hours, minutes, seconds
 * 
 * ```
 * d = new Date('2024-12-26 6:00:00');
 * d30 = utils.date.add(d, { minutes: 30 }); // Date('2024-12-26 6:00:00')
 * ```
 * 
 * @param {Date} dateValue - date to add to
 * @param {Object} options - options of what to add
 * @param {Number} [options.days=0] - number of days to add
 * @param {Number} [options.minutes=0] - number of minutes to add
 * @param {Number} [options.hours=0] - number of minutes to add 
 * @param {Number} [options.seconds=0] - number of seconds to add 
 * @returns {Date} - 
 */
module.exports.add = function add(dateValue, options = null) {
  if (!options) return dateValue;

  const { days = 0, minutes = 0, hours = 0, seconds = 0 } = options;
  return new Date(dateValue.getTime()
    + DateUtils.TIME.DAY * days
    + DateUtils.TIME.HOUR * hours
    + DateUtils.TIME.MINUTE * minutes
    + DateUtils.TIME.SECOND * seconds);
};

/**
 * Creates a new date that is at the end of the day (in UTC)
 * 
 * ```
 * d = new Date('2024-12-26 6:00:00');
 * dEnd = utils.date.endOfDay(d); // Date('2024-12-26 23:59:59.9999')
 * ```
 * 
 * @param {Date} dateValue - Date where only the year,month,day is used
 * @returns {Date} - new date set to the end of the day for dateValue's date
 */
module.exports.endOfDay = function endOfDay(dateValue) {
  const startDate = Math.floor(dateValue.getTime() / DateUtils.TIME.DAY) * DateUtils.TIME.DAY;
  return new Date(startDate + DateUtils.TIME.DAY - 1);
};

/**
 * Creates a new date that is at the start of the day (in UTC)
 * 
 * ```
 * d = new Date('2024-12-26 6:00:00');
 * dEnd = utils.date.startOfDay(d); // Date('2024-12-26 0:00:00.0000')
 * ```
 * 
 * @param {Date} dateValue - Date where only the year,month,day is used
 * @returns {Date} - new date set to the end of the day for dateValue's date
 */
module.exports.startOfDay = function endOfDay(dateValue) {
  const startDate = Math.floor(dateValue.getTime() / DateUtils.TIME.DAY) * DateUtils.TIME.DAY;
  return new Date(startDate);
};

/**
 * Represents a Range between two times
 */
class DateRange {
  /**
   * The starting date
   * @type {Date}
   */
  startDate;

  /**
   * The ending date
   * @type {Date}
   */
  endDate;

  /**
   * @param {Date} startDate - the starting datetime of the range
   * @param {Date} endDate - the ending datetime of the range
   */
  constructor(startDate, endDate) {
    this.reinitialize(startDate, endDate);
  }

  /**
   * Reinitializes the object
   * 
   * (Sometimes useful for shifting times after the fact)
   * 
   * @param {Date} startDate - the starting date
   * @param {Date} endDate - the ending date
   */
  reinitialize(startDate, endDate) {
    if (startDate > endDate) {
      this.startDate = endDate;
      this.endDate = startDate;
    } else {
      this.startDate = startDate;
      this.endDate = endDate;
    }
  }

  /**
   * Creates a DateRange based on the start and end of the day UTC.
   * 
   * This is very useful for determining overlapping dates.
   * 
   * @param {Date} targetDate - date to use to find the start and end UTC for
   * @returns {DateRange}
   */
  static startAndEndOfDay(targetDate) {
    const startDate = DateUtils.startOfDay(targetDate);
    const endDate = DateUtils.endOfDay(targetDate);
    return new DateRange(startDate, endDate);
  }

  /**
   * Whether this dateRange overlaps with a target dateRange.
   * @param {DateRange} targetDateRange - dateRange to compare
   * @returns {Boolean}
   * @example
   * overlapA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
   * overlapB = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
   * overlapC = new Date(Date.UTC(2024, 12, 26, 14, 0, 0));
   * overlapD = new Date(Date.UTC(2024, 12, 26, 15, 0, 0));
   * 
   * rangeBefore = new utils.DateRange(overlapA, overlapB);
   * rangeAfter = new utils.DateRange(overlapC, overlapD);
   * 
   * rangeBefore.overlaps(rangeAfter); // false
   * rangeAfter.overlaps(rangeBefore); // false
   * 
   * rangeBefore = new utils.DateRange(overlapA, overlapC);
   * rangeAfter = new utils.DateRange(overlapB, overlapD);
   * 
   * rangeBefore.overlaps(rangeAfter); // true
   * rangeAfter.overlaps(rangeBefore); // true
   */
  overlaps(targetDateRange) {
    return (this.endDate > targetDateRange.startDate
        && this.startDate < targetDateRange.endDate);
  }

  /**
   * Determines if a datetime is within the range
   * 
   * @param {Date} dateToCheck - the value to test if it is within the date range
   * @returns {Boolean} - if the value is within the range (true) or not (false)
   * 
   * @example
   * withinA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
   * withinB = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
   * withinC = new Date(Date.UTC(2024, 12, 26, 14, 0, 0));
   * withinD = new Date(Date.UTC(2024, 12, 26, 15, 0, 0));
   * 
   * range = new utils.DateRange(withinB, withinD);
   * range.contains(withinA); // false - it was before the range
   * 
   * range.contains(withinB); // true
   * range.contains(withinC); // true
   * range.contains(withinD); // true
   * 
   */
  contains(dateToCheck) {
    const testTime = dateToCheck.getTime();
    return testTime >= this.startDate.getTime() && testTime <= this.endDate.getTime();
  }

  /**
   * Determines the millisecond duration between the end and start time.
   * 
   * ```
   * durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
   * range = new utils.DateRange(durationA, durationB);
   * 
   * range.durationString(); // 1 hour in milliseconds; 1000 * 60 * 60;
   * ```
   * 
   * @returns {Number}
   */
  duration() {
    return this.endDate.getTime() - this.startDate.getTime();
  }

  /**
   * Determines the duration in a clear and understandable string;
   * 
   * ```
   * durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
   * range = new utils.DateRange(durationA, durationB);
   * 
   * range.durationString(); // '0 days, 1 hours, 0 minutes, 0.0 seconds';
   * ```
   * 
   * @returns {String}
   */
  durationString() {
    const dur = this.duration();
    const divideRemainder = (val, denominator) => ({ value: Math.floor(val / denominator), remainder: val % denominator });
    let result = divideRemainder(dur, DateUtils.TIME.DAY);
    const days = result.value;
    result = divideRemainder(result.remainder, DateUtils.TIME.HOUR);
    const hours = result.value;
    result = divideRemainder(result.remainder, DateUtils.TIME.MINUTE);
    const minutes = result.value;
    result = divideRemainder(result.remainder, DateUtils.TIME.SECOND);
    const seconds = result.value;
    const milli = result.remainder;
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds}.${milli} seconds`;
  }

  /**
   * Determines the duration in days:hours:minutes:seconds.milliseconds
   * 
   * ```
   * durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
   * range = new utils.DateRange(durationA, durationB);
   * 
   * range.durationString(); // '0:01:00:00.0000';
   * ```
   * 
   * @returns {String}
   */
  durationISO() {
    const dur = this.duration();
    const divideRemainder = (val, denominator) => ({ value: Math.floor(val / denominator), remainder: val % denominator });
    let result = divideRemainder(dur, DateUtils.TIME.DAY);
    const days = String(result.value);
    result = divideRemainder(result.remainder, DateUtils.TIME.HOUR);
    const hours = String(result.value).padStart(2, '0');
    result = divideRemainder(result.remainder, DateUtils.TIME.MINUTE);
    const minutes = String(result.value).padStart(2, '0');
    result = divideRemainder(result.remainder, DateUtils.TIME.SECOND);
    const seconds = String(result.value).padStart(2, '0');
    const milli = String(result.remainder).padStart(4, '0');
    return `${days}:${hours}:${minutes}:${seconds}.${milli}`;
  }

  /**
   * Determines if both the startDate and endDate are valid dates.
   * 
   * @returns {Boolean}
   */
  isValid() {
    return DateUtils.isValid(this.startDate) && DateUtils.isValid(this.endDate);
  }

  /**
   * Converts the daterange to a string value
   * 
   * ```
   * durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
   * range = new utils.DateRange(durationA, durationB);
   * 
   * range.toString(); // '2025-01-26T12:00:00.000Z to 2025-01-26T13:00:00.000Z';
   * ```
   * 
   * @returns {String}
   */
  toString() {
    return `${this.startDate.toISOString()} to ${this.endDate.toISOString()}`;
  }

  /**
   * Converts the daterange to a local string value
   * 
   * ```
   * durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
   * range = new utils.DateRange(durationA, durationB);
   * 
   * range.toLocaleString(); // '1/26/2025, 12:00:00 PM to 1/26/2025, 1:00:00 PM'
   * ```
   * 
   * @returns {String}
   */
  toLocaleString() {
    return `${this.startDate.toLocaleString()} to ${this.endDate.toLocaleString()}`;
  }
}

module.exports.DateRange = DateRange;
