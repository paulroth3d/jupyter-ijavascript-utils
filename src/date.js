/**
 * Utility methods for working with dates and date ranges
 * 

 * * Valiate
 *   * {@link module:date.isValid|date.isValid(date)} - whether the date provided is an invalid date
 * * Parse
 *   * {@link module:date.parse|date.parse(String)} - parse a date and throw an exception if it is not a valid date
 * * TimeZones
 *   * {@link module:date.toLocalISO|date.toLocalISO} - prints in 8601 format with timezone offset based on a tz entry - like america/chicago
 *   * {@link module:date.getTimezoneOffset|date.getTimezoneOffset(String)} - gets the number of milliseconds offset for a given timezone
 *   * {@link module:date.correctForTimezone|date.correctForTimezone(Date, String)} - meant to correct a date already off from UTC to the correct time
 *   * {@link module:date.epochShift|date.epochShift(Date, String)} - offsets a date from UTC to a given time amount
 * - knowing some methods might behave incorrectly
 * * Add
 *   * {@link module:date.add|date.add(Date, {days, hours, minutes, seconds)} - shift a date by a given amount
 *   * {@link module:date.endOfDay|date.endOfDay(Date)} - finds the end of day UTC for a given date
 *   * {@link module:date.startOfDay|date.startOfDay(Date)} - finds the end of day UTC for a given date
 * * Overwrite
 *   * {@link module:date.overwrite|date.overwrite(targetDate, newValue)} - overwrite the value inside a Date
 *   * {@link module:date.clone|date.clone(targetDate)} - clone the value of a Date, so it is not modified
 * * Print
 *   * {@link module:date.durationLong|date.durationLong(epoch)} - displays duration in legible form:
 *      `D days, H hours, M minutes, S.MMM seconds`
 *   * {@link module:date.durationISO|date.durationISO(epoch)} - displays duration in condensed forme:
 * * Generate Date Sequence
 *   * {@link module:date.arrange|date.arrange(startDate, count, incOptions)} - create a sequence of dates by continually adding to them
 *   * {@link module:date.generateDateSequence|date.generateDateSequence(startDate, endDate, incOptions)} - create a sequence of dates
 *      by continually adding between dates
 *   * {@link module:date~DateRange.fromList|DateRange.fromList()} - pass a sequence of dates to create a list of DateRanges
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
 * --------
 * 
 * List of timezone supported is based on the version of javascript used.
 * 
 * Please see:
 * * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat|Intl.DateTimeFormat from MDN}
 * * {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones|wikipedia list of tz database names}
 * 
 * @module date
 * @exports date
 * @see {@link https://stackoverflow.com/questions/15141762/how-to-initialize-a-javascript-date-to-a-particular-time-zone}
 * @see {@link https://www.youtube.com/watch?v=2rnIHsqABfM&t=750s|epochShifting}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getTimeZones|MDN TimeZone Names}
 */
module.exports = {};
const DateUtils = module.exports;

module.exports.divideRemainder = (val, denominator) => ({ value: Math.floor(val / denominator), remainder: val % denominator });

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

/**
 * Prints the duration in ISO format: `D:HH:MM:SS.MMM`
 * 
 * ```
 * start = new Date(Date.ISO(2024, 12, 26, 12, 0, 0));
 * end = new Date(Date.ISO(2024, 12, 26, 13, 0, 0));
 * 
 * duration = end.getTime() - start.getTime();
 * 
 * utils.date.durationLong(duration); // '0 days, 1 hours, 0 minutes, 0.00 seconds'
 * 
 * @param {Number} epochDifference - difference in milliseconds between two dates
 * @returns {String} `D days, H hours, M minutes,S.MMMM seconds`
 * @see {@link module:date.DateRange.duration|DateRange.duration}
 */
module.exports.durationISO = function durationISO(epochDifference) {
  const signStr = epochDifference < 0 ? '-' : '';
  let result = DateUtils.divideRemainder(Math.abs(epochDifference), DateUtils.TIME.DAY);
  const days = String(result.value);
  result = DateUtils.divideRemainder(result.remainder, DateUtils.TIME.HOUR);
  const hours = String(result.value).padStart(2, '0');
  result = DateUtils.divideRemainder(result.remainder, DateUtils.TIME.MINUTE);
  const minutes = String(result.value).padStart(2, '0');
  result = DateUtils.divideRemainder(result.remainder, DateUtils.TIME.SECOND);
  const seconds = String(result.value).padStart(2, '0');
  const milli = String(result.remainder).padStart(3, '0');
  return `${signStr}${days}:${hours}:${minutes}:${seconds}.${milli}`;
};

/**
 * Prints the duration in long format: `D days, H hours, M minutes, S.MMM seconds`
 * 
 * ```
 * start = new Date(Date.ISO(2024, 12, 26, 12, 0, 0));
 * end = new Date(Date.ISO(2024, 12, 27, 13, 0, 0));
 * 
 * duration = end.getTime() - start.getTime();
 * 
 * utils.date.durationLong(duration); // '1 days, 1 hours, 0 minutes, 0.00 seconds'
 * 
 * @param {Number} epochDifference - difference in milliseconds between two dates
 * @returns {String} `D days, H hours, M minutes,S.MMMM seconds`
 * @see {@link module:date.DateRange.duration|DateRange.duration}
 */
module.exports.durationLong = function durationLong(epochDifference) {
  const signStr = epochDifference < 0 ? '-' : '';
  let result = DateUtils.divideRemainder(Math.abs(epochDifference), DateUtils.TIME.DAY);
  const days = result.value;
  result = DateUtils.divideRemainder(result.remainder, DateUtils.TIME.HOUR);
  const hours = result.value;
  result = DateUtils.divideRemainder(result.remainder, DateUtils.TIME.MINUTE);
  const minutes = result.value;
  result = DateUtils.divideRemainder(result.remainder, DateUtils.TIME.SECOND);
  const seconds = result.value;
  const milli = result.remainder;
  return `${signStr}${days} days, ${hours} hours, ${minutes} minutes, ${seconds}.${milli} seconds`;
};

/**
 * @typedef {Object} TimeZoneEntry
 * @property {String} tz - the name of the timezone
 * @property {Function} formatter - formats a date to that local timezone
 * @property {Number} epoch - the difference in milliseconds from that tz to UTC
 * @property {String} offset - ISO format for how many hours and minutes offset to UTC '+|-' HH:MMM 
 */

/**
 * Collection of TimeZoneEntries by the tz string
 * @private
 * @type {Map<String,TimeZoneEntry>}
 */
module.exports.timeZoneOffsetMap = new Map();

/**
 * Fetches or creates a TimeZoneEntry
 * @private
 * @param {String} timeZoneStr - tz database entry for the timezone
 * @returns {TimeZoneEntry}
 */
module.exports.getTimezoneEntry = function getTimezoneEntry(timeZoneStr) {
  const cleanTz = String(timeZoneStr).toLowerCase();
  if (DateUtils.timeZoneOffsetMap.has(cleanTz)) {
    return DateUtils.timeZoneOffsetMap.get(cleanTz);
  }
  const d = new Date(Date.UTC(2025, 0, 1, 0, 0, 0));

  const dtFormat = new Intl.DateTimeFormat('en-us', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    fractionalSecondDigits: 3,
    timeZone: cleanTz
  });

  const getOffset = (dateValue) => {
    const dm = dtFormat.formatToParts(dateValue)
      .filter(({ type }) => type !== 'literal')
      .reduce((result, { type, value }) => {
        // eslint-disable-next-line no-param-reassign
        result[type] = value;
        return result;
      }, {});
    return new Date(Date.UTC(dm.year, dm.month - 1, dm.day, dm.hour, dm.minute, dm.second, dm.fractionalSecond));
  };

  const formatter = (dateValue) => {
    const dm = dtFormat.formatToParts(dateValue)
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
    
    return dateStr;
  };
  
  const impactedDate = getOffset(d);

  const diff = d.getTime() - impactedDate.getTime();

  const diffSign = diff > 0 ? '-' : '+';
  let remainder = DateUtils.divideRemainder(Math.abs(diff), DateUtils.TIME.HOUR);
  const diffHours = remainder.value;
  remainder = DateUtils.divideRemainder(remainder.remainder, DateUtils.TIME.MINUTE);
  const diffMinutes = remainder.value;
  const offset = `${diffSign}${DateUtils.padTime(diffHours)}:${DateUtils.padTime(diffMinutes)}`;

  const result = ({ tz: cleanTz, formatter, epoch: diff, offset });

  DateUtils.timeZoneOffsetMap.set(cleanTz, result);

  return result;
};

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
 * @returns {TimeZoneEntry} - the number of milliseconds between UTC and that timezone
 */
module.exports.getTimezoneOffset = function getTimezoneOffset(timeZoneStr) {
  return DateUtils.getTimezoneEntry(timeZoneStr).epoch;
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
  const { epoch } = DateUtils.getTimezoneEntry(timeZoneStr);
  return new Date(date.getTime() + epoch);
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
 * @see {@link module:date.toLocalISO|date.toLocalISO} - consider as an alternative.
 *    This prints the correct time, without updating the date object.
 */
module.exports.epochShift = function epochShift(date, timeZoneStr) {
  const { epoch } = DateUtils.getTimezoneEntry(timeZoneStr);
  return new Date(date.getTime() - epoch);
};

/**
 * Prints a date in 8601 format to a timezone (with +H:MM offset)
 * 
 * Consider this as an alternative to epochShifting.
 * 
 * ```
 * d = Date.parse('2024-12-27 13:30:00');
 * 
 * utils.date.toLocalISO(d, 'america/Chicago'); // '2024-12-27T07:30:00.000-06:00'
 * utils.date.toLocalISO(d, 'europe/paris'); //    '2024-12-27T14:30:00.000+01:00'
 * ```
 * 
 * @param {Date} date - date to print
 * @param {String} timeZoneStr - the tz database name of the timezone
 * @returns {String} - ISO format with timezone offset
 */
module.exports.toLocalISO = function toLocalISO(date, timeZoneStr) {
  const { formatter, offset } = DateUtils.getTimezoneEntry(timeZoneStr);
  return `${formatter(date)}${offset}`;
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
module.exports.clone = function clone(targetDate) {
  return new Date(targetDate.getTime());
};

/**
 * Overwrite the internal time for a date object.
 * 
 * ```
 * const targetDate = new Date('2025-01-01');
 * utils.date.overwrite(targetDate, new Date('2025-02-01'));
 * 
 * targetDate.toISOString(); // 2025-02-01T00:00:00.000Z
 * ```
 * 
 * @param {Date} dateToUpdate - date object to modify the time in-place
 * @param {Number|Date} newDateEpoch - the new time in epoch or Date
 * @returns - dateToUpdate but with the internal date aligned to newDateEpoch
 */
module.exports.overwrite = function overwrite(dateToUpdate, newDateEpoch) {
  if (!(dateToUpdate instanceof Date)) {
    throw Error(`date.overwrite: dateToUpdate is not a date:${dateToUpdate}`);
  }

  let cleanEpoch;
  if (!newDateEpoch) {
    throw Error(`date.overwrite: cannot set to an invalid date:${newDateEpoch}`);
  } else if ((typeof newDateEpoch) === 'number') {
    cleanEpoch = newDateEpoch;
  } else if (newDateEpoch instanceof Date) {
    cleanEpoch = newDateEpoch.getTime();
  } else if ((typeof newDateEpoch) === 'string') {
    cleanEpoch = Date.parse(newDateEpoch);
  } else {
    throw Error(`cannot overwrite date:${dateToUpdate.toISOString()}, unknown newDateEpoch: ${newDateEpoch}`);
  }

  dateToUpdate.setTime(cleanEpoch);

  return dateToUpdate;
};

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
 * @param {Number} [options.years=0] - increments the calendar year (as opposed to adding 365.25 days)
 * @param {Number} [options.months=0] - increments the calendar month (as opposed to adding in 30 days)
 * @param {Number} [options.days=0] - number of days to add
 * @param {Number} [options.minutes=0] - number of minutes to add
 * @param {Number} [options.hours=0] - number of minutes to add 
 * @param {Number} [options.seconds=0] - number of seconds to add 
 * @returns {Date} -
 */
module.exports.add = function add(dateValue, options = null) {
  if (!options) return dateValue;

  const { days = 0, minutes = 0, hours = 0, seconds = 0 } = options;
  const result = new Date(dateValue.getTime()
    + DateUtils.TIME.DAY * days
    + DateUtils.TIME.HOUR * hours
    + DateUtils.TIME.MINUTE * minutes
    + DateUtils.TIME.SECOND * seconds);
  
  if (Object.hasOwn(options, 'years')) {
    result.setFullYear(result.getFullYear() + options.years);
  }
  if (Object.hasOwn(options, 'months')) {
    result.setMonth(result.getMonth() + options.months);
  }

  return result;
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
 * Creates an array of dates, starting with the startDate,
 * and adding in the options count number of times.
 * 
 * ```
 * const startDate = new Date('2025-02-02');
 * utils.date.arrange(startDate, 6, { days: 1 });
 * //   ['2025-02-02 00:00:00')
 * //   ['2025-02-03 00:00:00')
 * //   ['2025-02-04 00:00:00')
 * //   ['2025-02-05 00:00:00')
 * //   ['2025-02-06 00:00:00')
 * //   ['2025-02-07 00:00:00')
 * //   ['2025-02-08 00:00:00')
 * //   ['2025-02-09 00:00:00')
 * // ]
 * ```
 * 
 * @param {Date} startDate - startingDate to compare to
 * @param {Number} count - Number of times to add the options
 * @param {Object} options - options similar to {@link module:DateUtils.add|DateUtils.add}
 * @param {Number} [options.days = 0]: how many days to add each check
 * @param {Number} [options.hours = 0]: how many days to add each check
 * @param {Number} [options.minutes = 0]: how many days to add each check
 * @param {Number} [options.seconds = 0]: how many days to add each check
 * @param {Number} [options.years=0] - increments the calendar year (as opposed to adding 365.25 days)
 * @param {Number} [options.months=0] - increments the calendar month (as opposed to adding in 30 days)
 * @returns {Date[]} - collection of dates (count long)
 * @see {@link module:Date.add|utils.date.add}
 * @see {@link module:date.generateDateSequence} - finish at an endingDate instead of # of iterations
 */
module.exports.arrange = function arrange(startDate, count, options) {
  if (!DateUtils.isValid(startDate)) {
    throw Error(`Invalid start date:${startDate}`);
  }

  const results = new Array(count + 1).fill();
  results[0] = startDate;
  let currentDate = startDate;
  for (let i = 0; i < count; i += 1) {
    currentDate = DateUtils.add(currentDate, options);
    results[i + 1] = currentDate;
  }
  return results;
};

/**
 * Creates an array of dates, beginning at startDate,
 * and adding time until EndDate is reached.
 * 
 * ```
 * const startDate = new Date('2025-02-02');
 * const endDate = new Date('2025-02-09 23:59:59.000');
 * // alternative
 * // endDate = utils.date.endOfDay(utils.date.add(startDate, { days; 7 }));
 * 
 * utils.date.arrange(startDate, endDate, { days: 1 });
 * //   ['2025-02-02 00:00:00.000'],
 * //   ['2025-02-03 00:00:00.000'],
 * //   ['2025-02-04 00:00:00.000'],
 * //   ['2025-02-05 00:00:00.000'],
 * //   ['2025-02-06 00:00:00.000'],
 * //   ['2025-02-07 00:00:00.000'],
 * //   ['2025-02-08 00:00:00.000'],
 * //   ['2025-02-09 00:00:00.000'],
 * //   ['2025-02-09 23:59:59.9999']
 * // ]
 * ```
 * @param {Date} startDate - starting date
 * @param {Date} endDate - ending date
 * @param {Object} options - options similar to {@link module:DateUtils.add|DateUtils.add}
 * @param {Number} [options.days = 0]: how many days to add each check
 * @param {Number} [options.hours = 0]: how many days to add each check
 * @param {Number} [options.minutes = 0]: how many days to add each check
 * @param {Number} [options.seconds = 0]: how many days to add each check
 * @param {Number} [options.years=0] - increments the calendar year (as opposed to adding 365.25 days)
 * @param {Number} [options.months=0] - increments the calendar month (as opposed to adding in 30 days)
 * @returns {Date[]} - sequence of dates from startDate to endDate
 * @see {@link module:Date.add|utils.date.add}
 * @see {@link module:date.arrange} - run a set of iterations instead of stopping at endDate
 */
module.exports.generateDateSequence = function generateDateSequencde(startDate, endDate, options) {
  const results = [];

  if (!DateUtils.isValid(startDate)) {
    throw Error(`Invalid start date:${startDate}`);
  }
  if (!DateUtils.isValid(endDate)) {
    throw Error(`Invalid end date:${endDate}`);
  }

  const endTime = endDate.getTime();

  for (let currentDate = startDate;
    DateUtils.isValid(currentDate) && currentDate.getTime() < endTime;
    currentDate = DateUtils.add(currentDate, options)
  ) {
    results.push(currentDate);
  }

  results.push(endDate);

  return results;
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
   * @param {Date|String} startDate - the starting date
   * @param {Date|String} endDate - the ending date
   */
  constructor(startDate, endDate) {
    this.reinitialize(startDate, endDate);
  }

  /**
  * Create a list of DateRanges, from a list of dates.
  * 
  * ```
  * dates = [new Date('2025-01-01'),
  *   new Date('2025-02-01'),
  *   new Date('2025-03-01'),
  *   new Date('2025-04-01')];
  * 
  * utils.DateRange.fromList(dates);
  * // [{start: 2025-01-01T00:00:00, end: 2025-02-01TT00:00:00, },
  * //  {start: 2025-02-01TT00:00:00, end: 2025-03-01TT00:00:00},
  * //  {start: 2025-03-01TT00:00:00, end: 2025-04-01TT00:00:00}]
  * ```
  * 
  * (If gaps are desired - ex: April to May and next one June to July,
  * the simplest is to remove the dates from the resulting list.)
  * 
  * @param {Date[]} dateList - list of dates
  * @returns {DateRange[]} - list of dateList.length-1 dateRanges,
  *   where the end of the firstRange is the start of the next.
  */
  static fromList(dateSequence) {
    if (dateSequence.length < 2) return [];

    const results = new Array(dateSequence.length - 2);
    for (let i = 0; i < dateSequence.length - 1; i += 1) {
      results[i] = new DateRange(dateSequence[i], dateSequence[i + 1]);
    }
    return results;
  }

  /**
   * Reinitializes the object
   * 
   * (Sometimes useful for shifting times after the fact)
   * 
   * @param {Date|String} startDate - the starting date
   * @param {Date|String} endDate - the ending date
   */
  reinitialize(startDate, endDate) {
    const cleanStart = startDate instanceof Date
      ? startDate
      : new Date(Date.parse(startDate));
    const cleanEnd = endDate instanceof Date
      ? endDate
      : new Date(Date.parse(endDate));

    if (cleanStart > cleanEnd) {
      this.startDate = cleanEnd;
      this.endDate = cleanStart;
    } else {
      this.startDate = cleanStart;
      this.endDate = cleanEnd;
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
   * overlapA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
   * overlapB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
   * overlapC = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
   * overlapD = new Date(Date.UTC(2024, 11, 26, 15, 0, 0));
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
   * withinA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
   * withinB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
   * withinC = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
   * withinD = new Date(Date.UTC(2024, 11, 26, 15, 0, 0));
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
   * Shifts the start time of the DateRange.
   * 
   * ```
   * myRange = new utils.DateRange('2025-01-01', '2025-02-01');
   * myRange.shiftStart({ days: 1 });
   * // { startDate: 2025-01-02, endDate: 2025-02-01 }
   * 
   * myRange.toString(); // { startDate: 2025-01-01, endDate: 2025-02-01 }
   * ```
   * 
   * (Note that this defaults to immutable DateRanges,
   * but passing `inPlace=true` will update this instance)
   * 
   * ```
   * myRange = new utils.DateRange('2025-01-01', '2025-02-01');
   * myRange.shiftStart({ days: 1 });
   * 
   * myRange.toString(); // { startDate: 2025-01-02, endDate: 2025-02-01 }
   * ```
   * 
   * @param {Object} options - options to shift the dateRange by, similar to {@link module:DateUtils.add|DateUtils.add}
   * @param {Number} [options.days = 0]: how many days to add each check
   * @param {Number} [options.hours = 0]: how many days to add each check
   * @param {Number} [options.minutes = 0]: how many days to add each check
   * @param {Number} [options.seconds = 0]: how many days to add each check
   * @param {Number} [options.years=0] - increments the calendar year (as opposed to adding 365.25 days)
   * @param {Number} [options.months=0] - increments the calendar month (as opposed to adding in 30 days)
   * @param {*} inPlace 
   * @returns 
   */
  shiftStart(options, inPlace = false) {
    if (inPlace) {
      DateUtils.overwrite(this.startDate, DateUtils.add(this.startDate, options));
      return this;
    }

    const newStart = DateUtils.add(this.startDate, options);
    const newEnd = this.endDate;
    return new DateRange(newStart, newEnd);
  }

  /**
   * Shifts the ending time of the DateRange.
   * 
   * ```
   * myRange = new utils.DateRange('2025-01-01', '2025-02-01');
   * myRange.shiftEnd({ days: 1 });
   * // { startDate: 2025-01-01, endDate: 2025-02-02 }
   * 
   * myRange.toString(); // { startDate: 2025-01-01, endDate: 2025-02-01 }
   * ```
   * 
   * (Note that this defaults to immutable DateRanges,
   * but passing `inPlace=true` will update this instance)
   * 
   * ```
   * myRange = new utils.DateRange('2025-01-01', '2025-02-01');
   * myRange.shiftEnd({ days: 1 });
   * 
   * myRange.toString(); // { startDate: 2025-01-01, endDate: 2025-02-02 }
   * ```
   * 
   * @param {Object} options - options to shift the dateRange by, similar to {@link module:DateUtils.add|DateUtils.add}
   * @param {Number} [options.days = 0]: how many days to add each check
   * @param {Number} [options.hours = 0]: how many days to add each check
   * @param {Number} [options.minutes = 0]: how many days to add each check
   * @param {Number} [options.seconds = 0]: how many days to add each check
   * @param {Number} [options.years=0] - increments the calendar year (as opposed to adding 365.25 days)
   * @param {Number} [options.months=0] - increments the calendar month (as opposed to adding in 30 days)
   * @param {*} inPlace 
   * @returns 
   */
  shiftEnd(options, inPlace = false) {
    if (inPlace) {
      DateUtils.overwrite(this.endDate, DateUtils.add(this.endDate, options));
      return this;
    }

    const newStart = this.startDate;
    const newEnd = DateUtils.add(this.endDate, options);
    return new DateRange(newStart, newEnd);
  }

  /**
   * Determines the millisecond duration between the end and start time.
   * 
   * ```
   * durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
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
   * durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
   * range = new utils.DateRange(durationA, durationB);
   * 
   * range.durationString(); // '0 days, 1 hours, 0 minutes, 0.0 seconds';
   * ```
   * 
   * @returns {String}
   */
  durationString() {
    const dur = this.duration();
    return DateUtils.durationLong(dur);
  }

  /**
   * Determines the duration in days:hours:minutes:seconds.milliseconds
   * 
   * ```
   * durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
   * range = new utils.DateRange(durationA, durationB);
   * 
   * range.durationString(); // '0:01:00:00.0000';
   * ```
   * 
   * @returns {String}
   */
  durationISO() {
    const dur = this.duration();
    return DateUtils.durationISO(dur);
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
   * durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
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
   * durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
   * durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
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
