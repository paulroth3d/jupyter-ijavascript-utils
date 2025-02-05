/**
 * Utility methods for working with dates and date ranges
 * 

 * * Valiate
 *   * {@link module:date.isValid|date.isValid(date)} - whether the date provided is an invalid date
 * * Parse
 *   * {@link module:date.parse|date.parse(String)} - parse a date and throw an exception if it is not a valid date
 * * Timezones
 *   * {@link module:date.toLocalISO|date.toLocalISO} - prints in 8601 format with timezone offset based on a tz entry - like america/chicago
 *   * {@link module:date.localISOFormatter|date.localISOFormatter} - prints in 8601 format - slightly improved performance for large scale use
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
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getTimezones|MDN Timezone Names}
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
 * Function that is passed a date for formatting
 * 
 * @callback dateFormatter
 * @param {Date} dateToFormat - the date to format
 */

/**
 * @typedef {Object} TimezoneEntry
 * @property {String} tz - the name of the timezone
 * @property {Function} formatter - formats a date to that local timezone
 * @property {Number} epoch - the difference in milliseconds from that tz to UTC
 * @property {String} offset - ISO format for how many hours and minutes offset to UTC '+|-' HH:MMM 
 * @property {dateFormatter} toLocalISO - formatter function that formats a date to local ISO
 * @property {dateFormatter} toLocalISOWeekday - formatter function that formats a date to local ISO + weekday
 * @property {dateFormatter} getWeekday - formatter function that determines the day of week for a date
 */

/**
 * Collection of TimezoneEntries by the tz string
 * @private
 * @type {Map<String,TimezoneEntry>}
 */
module.exports.timezoneOffsetMap = new Map();

/**
 * Fetches or creates a TimezoneEntry
 * @private
 * @param {String} timezoneStr - tz database entry for the timezone
 * @returns {TimezoneEntry}
 */
module.exports.getTimezoneEntry = function getTimezoneEntry(timezoneStr) {
  const cleanTz = String(timezoneStr).toLowerCase();
  if (DateUtils.timezoneOffsetMap.has(cleanTz)) {
    return DateUtils.timezoneOffsetMap.get(cleanTz);
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

  const dayOfWeekFormat = new Intl.DateTimeFormat('en-us', {
    weekday: 'short',
    timeZone: cleanTz
  });
  const getWeekday = (date) => dayOfWeekFormat.format(date);

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
    //   const impactedDate = new Date(d.toLocaleString('en-US', { timezone: timezoneStr }));
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

  const toLocalISO = (date) => `${formatter(date)}${offset}`;
  const toLocalISOWeekday = (date) => `${formatter(date)}${offset} - ${getWeekday(date)}`;

  const result = ({ tz: cleanTz, formatter, toLocalISO, toLocalISOWeekday, getWeekday, epoch: diff, offset });

  DateUtils.timezoneOffsetMap.set(cleanTz, result);

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
 * @param {String} timezoneStr - a timezone string like "America/Toronto"
 * @returns {TimezoneEntry} - the number of milliseconds between UTC and that timezone
 */
module.exports.getTimezoneOffset = function getTimezoneOffset(timezoneStr) {
  return DateUtils.getTimezoneEntry(timezoneStr).epoch;
};

/**
 * CorrectForTimezone is the opposite of {@link module:date.epochShift|date.epochShift}.
 * (This subtracts the timezone offset to a date, where the other adds the offset)
 * 
 * Use this when a date string is read by javascript, BUT the timezone is not sent or passed.
 * 
 * For example, something VERY IMPORTANT happened at '2/1/2025, 2:15:41 PM EST', ISO '2025-02-01T20:15:41.000Z', epoch: 1738440941000.
 * 
 * But the dates from the database don't include the timezone.
 * (Note that `Z` is conceptually equivalent of +0000)
 * 
 * If I create a date in javaScript WITHOUT the timezone, it assumes my local timezone.
 * 
 * ```
 * dTest = new Date('2025-02-01T20:15:41.000'); // -- DID NOT INCLUDE Timezone, so it assumes local timezone
 * ({ epoch: dTest2.getTime(), iso: dTest.toISOString(), local: dTest.toLocaleString() });
 * 
 * //-- time is INCORRECT, what should be the ISO time, is the local time.
 * //  local: '2/1/2025, 8:15:41 PM', iso: '2025-02-02T02:15:41.000Z', epoch: 1738440941000
 * ```
 * 
 * It assumed that the local time was 8pm instead of that as the ISO / GMT time.
 * 
 * To correct this, I just call epoch shift
 * 
 * ```
 * dTest = new Date('2025-02-01T20:15:41.000'); // -- DID NOT INCLUDE Timezone, so it assumes local timezone
 * dTest2 = utils.date.epochShift(dTest, 'us/central');  //-- correct for my local timezone
 * ({ epoch: dTest2.getTime(), iso: dTest.toISOString(), local: dTest.toLocaleString() });
 * 
 * //-- time is CORRECT
 * // local: '2/1/2025, 2:15:41 PM', iso: '2025-02-01T20:15:41.000Z', epoch: 1738440941000
 * ```
 * 
 * See {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones|the list of TZ database time zones}
 * for the full list of timezone options.
 * 
 * @param {Date} date - the date to be corrected in a new instance
 * @param {String} localTimezoneStr - tz database name for YOUR current machine's timezone
 * @returns {Date} - new instance of a corrected date back to UTC
 * @see {@link module:date.correctForOtherTimezone|date.correctForOtherTimezone} - if the date given is "local" but for another timezone
 * @see {@link module:date.toLocalISO|date.toLocalISO} - if you want to print a date to another timezone
 */
module.exports.correctForTimezone = function correctForTimezone(date, localTimezoneStr) {
  const { epoch } = DateUtils.getTimezoneEntry(localTimezoneStr);
  return new Date(date.getTime() - epoch);
};

/**
 * This helps you correct a "local date" from another timezone.
 * 
 * For example, if you got '2:15 PM' from a machine that is in eastern.
 * 
 * Combination of {@link module:date.correctForTimezone|date.correctForTimezone}
 * and {@link module:date.epochShift|date.epochShift}
 * 
 * For example, say you got a timezone string like this: `2024-12-27 13:30:00`
 * 
 * You know the timezone of the source is in `us/eastern`, but you are in `us/central`.
 * 
 * If you just use `Date.parse(dateString), it assumes `1:30 Central` - not `1:30 Eastern`
 * 
 * We can correct it like this:
 * 
 * ```
 * dateStr = '2024-12-27 13:30:00';
 * d = new Date(Date.parse(dateStr));
 * 
 * //-- the source was from 'us/eastern' timezone (-0500)
 * sourceTimezone = 'us/eastern';
 * 
 * //-- we are currently in 'us/central' timezone (-0600)
 * //-- this matters because of the Date.parse() done before
 * localTimezone = 'us/central'; // (change if yours is different)
 * 
 * utils.date.correctForOtherTimezone( d, sourceTimezone, localTimezone);
 * 
 * //-- correctly converted it to the correct local time
 * // 2024-12-28T18:30:00.000Z
 * ```
 * 
 * @param {Date} date - the date to be corrected in a new instance
 * @param {string} sourceTimezone - the timezone of the source information
 * @param {string} localTimezone - the timezone of this local machine
 * @returns {Date} - new date that is corrected to UTC
 * @see {@link module:date.toLocalISO|date.toLocalISO} - if you want to print a date to another timezone
 */
module.exports.correctForOtherTimezone = function correctForTimezones(date, sourceTimezone, localTimezone) {
  return DateUtils.correctForTimezone(
    DateUtils.epochShift(date, sourceTimezone),
    localTimezone
  );
};

/**
 * EpochShift is the opposite of {@link module:date.correctForTimezone|date.correctForTimezone}.
 * (This adds the timezone offset, where the other subtracts the offset)
 * 
 * Use this if you somehow have a date that needs to be shifted by the timezone offset.
 * 
 * For example, if you have a time that is already in GMT, and want the date shifted by a timezone.
 * 
 * This is used internally for {@link module:date.correctForOtherTimezone|date.correctForOtherTimezone}
 * if local dates are provided - but for a different timezone you yourself are not in.
 * 
 * ---
 * 
 * Epoch shift changes the internals of a JavaScript date, so the utcDate is no longer correct,
 * but many other functions behave closer to expected.
 * 
 * Once you epoch shift the date, then time stored in the date is incorrect (because it always points to GMT)
 * 
 * For example, using `.toIsoString()` or anything with Intl.DateTimeFormat etc - will all give you incorrect results.
 * 
 * See {@link https://stackoverflow.com/a/15171030|here why this might not be what you want}
 * 
 * * {@link module:date.correctForTimezone|date.correctForTimezone} or
 * * {@link module:date.correctForTimezones|date.correctForTimezones}.
 * 
 * @param {Date} date - date to shift
 * @param {String} timezoneStr - the tz database name of the timezone
 * @returns {Date}
 * @see {@link module:date.toEpochShiftedISO|date.toEpochShiftedISO} - this will print the
 *    "local time" of an epoch shifted date.
 * @see {@link module:date.toLocalISO|date.toLocalISO} - consider as an alternative.
 *    This prints the correct time, without updating the date object.
 * @see {@link module:date.correctForTimezone|date.correctForTimezone} - once shifted,
 *    this allows you to shift a date back to GMT time.
 */
module.exports.epochShift = function epochShift(date, timezoneStr) {
  const { epoch } = DateUtils.getTimezoneEntry(timezoneStr);
  return new Date(date.getTime() + epoch);
};

/**
 * Prints a date in 8601 format to a timezone (with +H:MM offset) using
 * [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).
 * 
 * The date accepted here is assumed to already have the internal clock set to GMT.
 * 
 * If you do epochShift, then use {@link module:date.toEpochShiftedISO|date.toEpochShiftedISO}
 * and pass the timezone the timezone the date is epoch shifted to.
 * 
 * ```
 * d = Date.parse('2024-12-27 13:30:00');
 * 
 * utils.date.toLocalISO(d, 'america/Chicago'); // '2024-12-27T07:30:00.000-06:00'
 * utils.date.toLocalISO(d, 'europe/paris'); //    '2024-12-27T14:30:00.000+01:00'
 * ```
 * 
 * Sometimes it is helpful to have the weekday to make sense of things
 * 
 * ```
 * utils.date.toLocalISO(d, 'america/Chicago', true); // '2024-12-27T07:30:00.000-06:00 FRI' 
 * utils.date.toLocalISO(d, 'europe/paris', true); //    '2024-12-27T14:30:00.000+01:00 FRI'
 * ```
 * 
 * @param {Date} date - date to print
 * @param {String} timezoneStr - the tz database name of the timezone
 * @param {Boolean} [includeWeekday=false] - whether to include the weekday
 * @see {@link module:date.localISOFormatter|date.localISOFormatter} - if you're converting to string frequently
 * @returns {String} - ISO format with timezone offset
 */
module.exports.toLocalISO = function toLocalISO(date, timezoneStr, includeWeekday = false) {
  if (includeWeekday) {
    return DateUtils.getTimezoneEntry(timezoneStr).toLocalISOWeekday(date);
  }
  return DateUtils.getTimezoneEntry(timezoneStr).toLocalISO(date);
};

/**
 * If repeatedly asking for a local time, use this method instead.
 * 
 * ```
 * myDate = new Date('2025-01-15T06:00:00.000Z');
 * centralFormatter = utils.date.localISOFormatter('us/central');
 * centralFormatter(myDate); // '2025-01-15T00:00:00.000Z'
 * ```
 * 
 * as opposed to
 * 
 * ```
 * myDate = new Date('2025-01-15T06:00:00.000Z');
 * utils.date.toLocalISO(myDate, 'us/central'); // '2025-01-15T00:00:00.000Z'
 * ```
 * 
 * @param {String} timezoneStr 
 * @returns {dateFormatter} - (date) => {String} 'yyyy-mm-ddThh:mm:ss.MMM[+-]TZOFFSET'
 * @see {@link module:date.toLocalISO|date.toLocalISO}
 */
module.exports.localISOFormatter = function localISOFormatter(timezoneStr, includeWeekday = false) {
  if (includeWeekday) {
    return DateUtils.getTimezoneEntry(timezoneStr).toLocalISOWeekday;
  }
  return DateUtils.getTimezoneEntry(timezoneStr).toLocalISO;
};

/**
 * Determines the weekday of a date
 * @param {Date} date - date to print
 * @param {String} timezoneStr - the tz database name of the timezone
 * @returns {String} - Currently returns `en-us` formatted day of week of a date
 * @see {@link module:date.toLocalISO|date.toLocalISO}
 * @example
 * date = new Date('2025-01-15T06:00:00.000Z');
 * utils.date.getWeekday(date, 'us/pacific'); // Tue
 * utils.date.getWeekday(date, 'us/eastern'); // Wed
 */
module.exports.getWeekday = function weekdayFormatter(date, timezoneStr) {
  return DateUtils.getTimezoneEntry(timezoneStr).getWeekday(date);
};

module.exports.toIsoStringNoTimezone = function toIsoStringNoTimezone(date) {
  return `${
    date.getFullYear()
  }-${
    String(date.getMonth() + 1).padStart(2, '0')
  }-${
    String(date.getDate()).padStart(2, '0')
  }T${
    String(date.getHours()).padStart(2, '0')
  }:${
    String(date.getMinutes()).padStart(2, '0')
  }:${
    String(date.getSeconds()).padStart(2, '0')
  }.${
    String(date.getMilliseconds()).padStart(3, '0')
  }`;
};

/**
 * Print a date that has been epoch shifted.
 * 
 * Dates in JavaScript are always stored in GMT, although you can format it to different times with
 * [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat).
 * 
 * Once you epoch shift the date, then time stored in the date is incorrect (because it always points to GMT)
 * 
 * For example, using `.toIsoString()` or anything with Intl.DateTimeFormat etc - will all give you incorrect results.
 * 
 * If you want an ISO format for an epoch shifted date, you'll need something like this.
 * 
 * @param {Date} date - Date to Print
 * @param {String} timezoneStr - the tz database name of the timezone the date is shifted to
 * @returns {String} date in the format of `YYYY-MM-DDTHH:mm:SS.MMMM[+-]TZ`
 * @see {@link module:date.correctForTimezone|date.correctForTimezone} - to shift the date back to GMT
 * @see {@link module:date.toLocalISO|date.toLocalISO} - if the date is not epoch shifted as this uses Intl.DateTimeFormat
 */
module.exports.toEpochShiftedISO = function toEpochShiftedISO(date, timezoneStr) {
  const { offset } = DateUtils.getTimezoneEntry(timezoneStr);
  return `${DateUtils.toIsoStringNoTimezone(date)}${offset}`;
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
 * @returns {Date} - Date with the interval added in
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
 * @see {@link module:date.add|utils.date.add}
 * @see {@link module:date.generateDateSequence|date.generateDateSequence} - finish at an endingDate instead of # of iterations
 * @see {@link module:date~DateRange.fromList|DateRange.fromList} - to create Date Ranges from these dates.
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
 * @see {@link module:date.add|utils.date.add}
 * @see {@link module:date.arrange|date.arrange} - run a set of iterations instead of stopping at endDate
 * @see {@link module:date~DateRange.fromList|DateRange.fromList} - to create Date Ranges from these dates.
 */
module.exports.generateDateSequence = function generateDateSequence(startDate, endDate, options) {
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
 * Represents a Range between two timestamps.
 * 
 * * Creating Date Range
 *   * {@link module:date~DateRange.fromList|fromList} - given a list of dates, make range bins for those dates.
 *   * {@link module:date~DateRange#reinitialize|reinitialize} - initialize the dateRange in-place with new start/end dates
 *   * {@link module:date~DateRange#shiftStart|shiftStart} - shifts the start of the range by hours,minutes,years, etc.
 *   * {@link module:date~DateRange#shiftEnd|shiftEnd} - shifts the start of the range by hours,minutes,years, etc.
 * 
 * * Understanding the Date Range
 *   * {@link module:date~DateRange#contains|contains} - if a date is within this range.
 *   * {@link module:date~DateRange#startDate|startDate} - the starting date of the range
 *   * {@link module:date~DateRange#endDate|endingDate} - the ending date of the range
 *   * {@link module:date~DateRange.startAndEndOfDay|startAndEndOfDay} - Creates a DateRange covering the start and end of a day
 *   * {@link module:date~DateRange#overlaps|overlaps} - whether this DateRange overlaps another DateRange
 *   * {@link module:date~DateRange#isValid|isValid} - Whether the start and end times of this range are both valid dates
 * * Durations
 *   * {@link module:date~DateRange#duration|duration} - Epoch duration (milliseconds) between the start and end timestamps
 *   * {@link module:date~DateRange#durationString|durationString} - creates a long duration description
 *   * {@link module:date~DateRange#durationISO|durationISO} - returns the duration as a string formatted '0:01:00:00.0000'
 * * String Representation
 *   * {@link module:date~DateRange#toString|toString} - String conversion of the DateRange
 *   * {@link module:date~DateRange#toLocaleString|toLocaleString} - Creates a locale string describing the DateRange
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
   * Data attached to the DateTime
   * @type {any}
   */
  data;

  /**
   * @param {Date|String} startDate - the starting date
   * @param {Date|String} endDate - the ending date
   * @param {any} [data] - any data to store
   */
  constructor(startDate, endDate, data = null) {
    this.reinitialize(startDate, endDate, data);
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
  * Often though, we want to remember something about the DateRange,
  * like which dates that it collected.
  * 
  * ```
  * arrayGenerator = function() { return [] };
  * rangeList = utils.DateRange.fromList(dates, arrayGenerator);
  * // [{start: 2025-01-01T00:00:00, end: 2025-02-01TT00:00:00},
  * //  {start: 2025-02-01TT00:00:00, end: 2025-03-01TT00:00:00},
  * //  {start: 2025-03-01TT00:00:00, end: 2025-04-01TT00:00:00}]
  * 
  * dates.forEach((date) => rangeList
  *   .find(rl => rl.contains(date))
  *   .data.push(date)
  * );
  * 
  * rangeList
  *   .map(rl => `${rl.toString()}: has ${rl.data.length}`)
  *   .join('\n');
  * 
  * // 2025-01-01T00:00:00.000Z to 2025-02-01T00:00:00.000Z: has 2
  * // 2025-02-01T00:00:00.000Z to 2025-03-01T00:00:00.000Z: has 1
  * // 2025-03-01T00:00:00.000Z to 2025-04-01T00:00:00.000Z: has 1
  * 
  * ```
  * 
  * (Note: you can also use {@link module:date.arrange|date.arrange} or
  * {@link module:date.generateDateSequence|date.generateDateSequence}
  * to come up with the list of those dates)
  * 
  * (If gaps are desired - ex: April to May and next one June to July,
  * the simplest is to remove the dates from the resulting list.)
  * 
  * @param {Date[]} dateList - list of dates
  * @param {Function} [dataCreationFn] - optional generator for data to be stored in each DataRange in the sequence
  * @returns {DateRange[]} - list of dateList.length-1 dateRanges,
  *   where the end of the firstRange is the start of the next.
  * @see {@link module:date.arrange|date.arrange} - to create dates by adding a value multiple times
  * @see {@link module:date.generateDateSequence|date.generateDateSequence} - to create dates between a start and an end date
  */
  static fromList(dateSequence, dataCreationFn) {
    if (dateSequence.length < 2) return [];

    const results = new Array(dateSequence.length - 2);

    if (dataCreationFn) {
      for (let i = 0; i < dateSequence.length - 1; i += 1) {
        results[i] = new DateRange(dateSequence[i], dateSequence[i + 1], dataCreationFn());
      }
    } else {
      for (let i = 0; i < dateSequence.length - 1; i += 1) {
        results[i] = new DateRange(dateSequence[i], dateSequence[i + 1]);
      }
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
   * @param {any} [data] - any data to store
   */
  reinitialize(startDate, endDate, data = null) {
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

    this.data = data;
  }

  /**
   * Creates a DateRange based on the start and end of the day UTC.
   * 
   * This is very useful for determining overlapping dates.
   * 
   * (Alternatively, you can define a list of dates, and use
   * {@link module:date~DateRange.fromList|DateRange.fromList}
   * to create the bins from those dates)
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
   * @returns {DateRange} - this DateRange if (inPlace=true), a new instance if (inPlace=false)
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
   * @returns {DateRange} - this DateRange if (inPlace=true), a new instance if (inPlace=false)
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
