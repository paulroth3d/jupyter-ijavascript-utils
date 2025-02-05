const DateUtils = require('../date');

global.describe('Date', () => {
  global.describe('isValid', () => {
    global.describe('can detect a valid date', () => {
      global.it('if sent a YYYY-MM-DD', () => {
        const test = new Date('2024-12-26');
        const expected = true;
        const result = DateUtils.isValid(test);
        global.expect(result).toBe(expected);
      });
      global.it('if sent 0 wrapped date', () => {
        const test = new Date(0);
        const expected = true;
        const result = DateUtils.isValid(test);
        global.expect(result).toBe(expected);
      });
    });
    global.describe('can detect an invalid date', () => {
      global.it('if sent null instead of a date', () => {
        const test = null;
        const expected = false;
        const result = DateUtils.isValid(test);
        global.expect(result).toBe(expected);
      });
      global.it('if sent undefined instead of a date', () => {
        const test = undefined;
        const expected = false;
        const result = DateUtils.isValid(test);
        global.expect(result).toBe(expected);
      });
      global.it('if sent a POJO instead of a date', () => {
        const test = {};
        const expected = false;
        const result = DateUtils.isValid(test);
        global.expect(result).toBe(expected);
      });
      global.it('if sent undefined wrapped date', () => {
        const test = new Date(undefined);
        const expected = false;
        const result = DateUtils.isValid(test);
        global.expect(result).toBe(expected);
      });
      global.it('if sent a bad string', () => {
        const test = new Date('cuca');
        const expected = false;
        const result = DateUtils.isValid(test);
        global.expect(result).toBe(expected);
      });
    });
  });

  global.describe('parse', () => {
    global.describe('can parse', () => {
      global.it('if sent a YYYY-MM-DD', () => {
        const test = '2024-12-26';
        const expected = new Date('2024-12-26');
        const result = DateUtils.parse(test);
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('cannot parse', () => {
      global.it('if sent undefined', () => {
        const test = undefined;
        const expected = undefined;
        const result = DateUtils.parse(test);
        global.expect(result).toBe(expected);
      });
      global.it('if sent null', () => {
        const test = null;
        const expected = null;
        const result = DateUtils.parse(test);
        global.expect(result).toBe(expected);
      });
      global.it('if sent a bad string', () => {
        const test = 'cuca';
        const expected = 'Could not parse date: cuca';
        global.expect(() => {
          DateUtils.parse(test);
        }).toThrow(expected);
      });
    });
  });

  global.describe('getTimezoneOffset', () => {
    global.describe('can get timezone', () => {
      global.it('for america/chicago', () => {
        const testValue = 'america/chicago';
        const expected = 21600000;
        const results = DateUtils.getTimezoneOffset(testValue);
        global.expect(results).toBe(expected);
      });
      global.it('for america/los_angeles', () => {
        const testValue = 'america/los_angeles';
        const expected = 28800000;
        const results = DateUtils.getTimezoneOffset(testValue);
        global.expect(results).toBe(expected);
      });
    });
    global.describe('cannot get timezone', () => {
      global.it('for invalid datetimes', () => {
        const testValue = 'cuca';
        // const expected = 'something';

        global.expect(() => {
          DateUtils.getTimezoneOffset(testValue);
        }).toThrow();
      });
    });
  });

  global.describe('correct for timezone', () => {
    global.describe('can correct for timezone', () => {
      global.it('america/chicago', () => {
        //-- when pulling the time from the database - it corrected it to local time for me
        //-- so what I have pulled down is actually in Central time
        //-- but I want instead to have the correct UTC time
        const originalDate = new Date(Date.UTC(2024, 11, 26, 17, 0, 0));
        const timezone = 'america/chicago';
        const expected = new Date(Date.UTC(2024, 11, 26, 11, 0, 0));
        const results = DateUtils.correctForTimezone(originalDate, timezone);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('us/pacific', () => {
        //-- when pulling the time from the database - it corrected it to local time for me
        //-- so what I have pulled down is actually in Central time
        //-- but I want instead to have the correct UTC time
        const originalDate = new Date(Date.UTC(2024, 11, 26, 19, 0, 0));
        const timezone = 'us/pacific';
        const expected = new Date(Date.UTC(2024, 11, 26, 11, 0, 0));
        const results = DateUtils.correctForTimezone(originalDate, timezone);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });

  global.describe('correctForOtherTimezone', () => {
    global.describe('can correct for an other timezone', () => {
      global.it('us/central + us/eastern', () => {
        // const timeStr = '2025-02-01T15:15:00';
        const d = new Date(Date.UTC(2025, 1, 1, 15, 15, 0));
        const sourceTimezone = 'us/eastern';
        const localTimezone = 'us/central';
        const expected = new Date(Date.UTC(2025, 1, 1, 14, 15, 0));
        const result = DateUtils.correctForOtherTimezone(
          d,
          sourceTimezone,
          localTimezone
        );
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('can correct from a parse', () => {
      const dateStr = '2024-12-27 13:30:00';
      const d = new Date(Date.parse(dateStr));
      const sourceTimezone = 'us/eastern';
      const localTimezone = 'us/central';
      //-- EST is -5 hours from GMT,
      //-- CST is -6 hours from GMT
      //-- -1 hour difference 
      const expected = new Date(Date.UTC(2024, 11, 27, 12, 30, 0));
      const result = DateUtils.correctForOtherTimezone(
        d,
        sourceTimezone,
        localTimezone
      );
      global.expect(result).toStrictEqual(expected);
    });
  });

  global.describe('epochShift', () => {
    global.describe('can correct for timezone', () => {
      global.it('america/chicago', () => {
        //-- when pulling the time from the database - it corrected it to local time for me
        //-- so what I have pulled down is actually in Central time
        //-- but I want instead to have the correct UTC time
        const originalDate = new Date(Date.UTC(2024, 11, 26, 11, 0, 0));
        const timezone = 'america/chicago';
        const expected = new Date(Date.UTC(2024, 11, 26, 17, 0, 0));
        const results = DateUtils.epochShift(originalDate, timezone);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('us/pacific', () => {
        //-- when pulling the time from the database - it corrected it to local time for me
        //-- so what I have pulled down is actually in Central time
        //-- but I want instead to have the correct UTC time
        const originalDate = new Date(Date.UTC(2024, 11, 26, 11, 0, 0));
        const timezone = 'us/pacific';
        const expected = new Date(Date.UTC(2024, 11, 26, 19, 0, 0));
        const results = DateUtils.epochShift(originalDate, timezone);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });

  global.describe('add', () => {
    global.describe('can add', () => {
      global.it('an empty object', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const options = {};
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('null gives the same time', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        // const options = {};
        const results = DateUtils.add(originalTime);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('1 day', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 11, 27, 12, 0, 0));
        const options = { days: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('3 day', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 11, 28, 12, 0, 0));
        const options = { days: 2 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('1 hour', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
        const options = { hours: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('1 minute', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 11, 26, 12, 1, 0));
        const options = { minutes: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('1 second', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 11, 26, 12, 0, 1));
        const options = { seconds: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('1 year', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2025, 11, 26, 12, 0, 0));
        const options = { years: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('1 month', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2025, 0, 26, 12, 0, 0));
        const options = { months: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('cannot add', () => {
      global.it('a null', () => {
        const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
        const options = null;
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });
  
  global.describe('endOfDay', () => {
    global.it('can find the end of day', () => {
      const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const expected     = new Date(Date.UTC(2024, 11, 26, 23, 59, 59, 999));
      const results = DateUtils.endOfDay(originalTime);
      global.expect(results).toStrictEqual(expected);
    });
  });
  
  global.describe('startOfDay', () => {
    global.it('can find the start of day', () => {
      const originalTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const expected     = new Date(Date.UTC(2024, 11, 26, 0, 0, 0));
      const results = DateUtils.startOfDay(originalTime);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('durationString', () => {
    global.it('simple example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0 days, 1 hours, 0 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('day', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 27, 12, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '1 days, 0 hours, 0 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('hours', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0 days, 2 hours, 0 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('minutes', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 30, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0 days, 0 hours, 30 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('negative example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 27, 13, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '-1 days, 1 hours, 0 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('durationISO', () => {
    global.it('simple example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0:01:00:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('day', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 27, 12, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '1:00:00:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('hours', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0:02:00:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('minutes', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 30, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0:00:30:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('negative example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 27, 13, 30, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '-1:01:30:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('toLocalISO', () => {
    global.describe('without weekdays', () => {
      global.it('can convert a date to america/Chicago', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T07:30:00.000-06:00';
        const results = DateUtils.toLocalISO(dateA, 'america/Chicago');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to america/los_angeles', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T05:30:00.000-08:00';
        const results = DateUtils.toLocalISO(dateA, 'america/Los_Angeles');
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to europe/paris', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T14:30:00.000+01:00';
        const results = DateUtils.toLocalISO(dateA, 'europe/paris');
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('explicitly without weekdays', () => {
      global.it('can convert a date to america/Chicago', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T07:30:00.000-06:00';
        const results = DateUtils.toLocalISO(dateA, 'america/Chicago', false);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to america/los_angeles', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T05:30:00.000-08:00';
        const results = DateUtils.toLocalISO(dateA, 'america/Los_Angeles', false);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to europe/paris', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T14:30:00.000+01:00';
        const results = DateUtils.toLocalISO(dateA, 'europe/paris', false);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('explicitly with weekdays', () => {
      global.it('can convert a date to america/Chicago', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T07:30:00.000-06:00 - Fri';
        const results = DateUtils.toLocalISO(dateA, 'america/Chicago', true);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to america/los_angeles', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T05:30:00.000-08:00 - Fri';
        const results = DateUtils.toLocalISO(dateA, 'america/Los_Angeles', true);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to europe/paris', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T14:30:00.000+01:00 - Fri';
        const results = DateUtils.toLocalISO(dateA, 'europe/paris', true);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });

  global.describe('localISOFormatter', () => {
    global.describe('without weekdays', () => {
      global.it('can convert a date to america/Chicago', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T07:30:00.000-06:00';
        const formatter = DateUtils.localISOFormatter('america/Chicago');
        const results = formatter(dateA);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to america/los_angeles', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T05:30:00.000-08:00';
        const formatter = DateUtils.localISOFormatter('america/Los_Angeles');
        const results = formatter(dateA);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to europe/paris', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T14:30:00.000+01:00';
        const formatter = DateUtils.localISOFormatter('europe/paris');
        const results = formatter(dateA);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('explicitly without weekdays', () => {
      global.it('can convert a date to america/Chicago', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T07:30:00.000-06:00';
        const formatter = DateUtils.localISOFormatter('america/Chicago', false);
        const results = formatter(dateA);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to america/los_angeles', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T05:30:00.000-08:00';
        const formatter = DateUtils.localISOFormatter('america/Los_Angeles', false);
        const results = formatter(dateA);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to europe/paris', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T14:30:00.000+01:00';
        const formatter = DateUtils.localISOFormatter('europe/paris', false);
        const results = formatter(dateA);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('explicitly with weekdays', () => {
      global.it('can convert a date to america/Chicago', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T07:30:00.000-06:00 - Fri';
        const formatter = DateUtils.localISOFormatter('america/Chicago', true);
        const results = formatter(dateA);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to america/los_angeles', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T05:30:00.000-08:00 - Fri';
        const formatter = DateUtils.localISOFormatter('america/Los_Angeles', true);
        const results = formatter(dateA);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can convert a date to europe/paris', () => {
        const dateA = Date.parse('2024-12-27 13:30:00');
        const expected = '2024-12-27T14:30:00.000+01:00 - Fri';
        const formatter = DateUtils.localISOFormatter('europe/paris', true);
        const results = formatter(dateA);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });

  global.describe('getWeekday', () => {
    global.it('can get the date', () => {
      const date = new Date('2025-01-15T06:00:00.000Z');
      const expected = 'Wed';
      const result = DateUtils.getWeekday(date, 'us/eastern');
      global.expect(result).toBe(expected);
    });
    global.it('can get the date crossing date border', () => {
      const date = new Date('2025-01-15T06:00:00.000Z');
      const expected = 'Tue';
      const result = DateUtils.getWeekday(date, 'us/pacific');
      global.expect(result).toBe(expected);
    });
  });

  global.describe('toEpochShiftedISO', () => {
    global.describe('iso date parsing works as expected', () => {
      const d = new Date(Date.UTC(2025, 1, 1, 15, 22));
      const expected = '2025-02-01T15:22:00.000Z';
      const results = d.toISOString();
      global.expect(results).toBe(expected);
    });
    global.describe('us/central', () => {
      const d = new Date(Date.UTC(2025, 1, 1, 15, 22));
      const timezone = 'us/central';
      const expected = '2025-02-01T15:22:00.000-06:00';
      const results = DateUtils.toEpochShiftedISO(d, timezone);
      global.expect(results).toBe(expected);
    });
    global.describe('us/eastern', () => {
      const d = new Date(Date.UTC(2025, 1, 1, 15, 22));
      const timezone = 'us/eastern';
      const expected = '2025-02-01T15:22:00.000-05:00';
      const results = DateUtils.toEpochShiftedISO(d, timezone);
      global.expect(results).toBe(expected);
    });
  });

  global.describe('shiftStart', () => {
    const createDateRange = () => new DateUtils.DateRange(
      new Date(Date.UTC(2025, 0, 1, 12, 0, 0)),
      new Date(Date.UTC(2025, 0, 2, 12, 0, 0))
    );

    global.describe('can shift', () => {
      global.it('simple example', () => {
        const myRange = createDateRange();
        const result = myRange.shiftStart({ days: 1 });
        const expected = new Date(Date.UTC(2025, 0, 2, 12, 0, 0));
        const resultStart = result.startDate;
        global.expect(resultStart).toStrictEqual(expected);
      });
      global.it('is not the same object', () => {
        const myRange = createDateRange();
        const result = myRange.shiftStart({ days: 1 });
        const myRangeStart = myRange.startDate;
        const resultStart = result.startDate;
        global.expect(resultStart).not.toStrictEqual(myRangeStart);
      });
    });
    global.describe('can shift in place', () => {
      global.it('simple example', () => {
        const myRange = createDateRange();
        const result = myRange.shiftStart({ days: 1 }, true);
        const expected = new Date(Date.UTC(2025, 0, 2, 12, 0, 0));
        const resultStart = result.startDate;
        global.expect(resultStart).toStrictEqual(expected);
      });
      global.it('is the same object', () => {
        const myRange = createDateRange();
        const result = myRange.shiftStart({ days: 1 }, true);
        const myRangeStart = myRange.startDate;
        const resultStart = result.startDate;
        global.expect(resultStart).toStrictEqual(myRangeStart);
      });
    });
  });

  global.describe('shiftEnd', () => {
    const createDateRange = () => new DateUtils.DateRange(
      new Date(Date.UTC(2025, 0, 1, 12, 0, 0)),
      new Date(Date.UTC(2025, 0, 2, 12, 0, 0))
    );

    global.describe('can shift', () => {
      global.it('simple example', () => {
        const myRange = createDateRange();
        const result = myRange.shiftEnd({ days: 1 });
        const expected = new Date(Date.UTC(2025, 0, 3, 12, 0, 0));
        const resultEnd = result.endDate;
        global.expect(resultEnd).toStrictEqual(expected);
      });
      global.it('is not the same object', () => {
        const myRange = createDateRange();
        const result = myRange.shiftEnd({ days: 1 });
        const myRangeEnd = myRange.endDate;
        const resultEnd = result.endDate;
        global.expect(resultEnd).not.toStrictEqual(myRangeEnd);
      });
    });
    global.describe('can shift in place', () => {
      global.it('simple example', () => {
        const myRange = createDateRange();
        const result = myRange.shiftEnd({ days: 1 }, true);
        const expected = new Date(Date.UTC(2025, 0, 3, 12, 0, 0));
        const resultEnd = result.endDate;
        global.expect(resultEnd).toStrictEqual(expected);
      });
      global.it('is the same object', () => {
        const myRange = createDateRange();
        const result = myRange.shiftEnd({ days: 1 }, true);
        const myRangeEnd = myRange.endDate;
        const resultEnd = result.endDate;
        global.expect(resultEnd).toStrictEqual(myRangeEnd);
      });
    });
  });

  global.describe('fromList', () => {
    global.it('can make a list', () => {
      const dates = [new Date('2025-01-01'),
        new Date('2025-02-01'),
        new Date('2025-03-01'),
        new Date('2025-04-01')];
      const results = DateUtils.DateRange.fromList(dates);
      const expected = [
        new DateUtils.DateRange(dates[0], dates[1]),
        new DateUtils.DateRange(dates[1], dates[2]),
        new DateUtils.DateRange(dates[2], dates[3])
      ];
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can initialize data', () => {
      const dates = [new Date('2025-01-01'),
        new Date('2025-02-01'),
        new Date('2025-03-01'),
        new Date('2025-04-01')];
      
      const dataGenerator = () => [];
      const results = DateUtils.DateRange.fromList(dates, dataGenerator);

      for (let i = 0; i < results.length; i += 1) {
        global.expect(results[i].data).not.toBeNull();
        global.expect(Array.isArray(results[i].data)).toBe(true);
      }
    });
    global.it('count matches', () => {
      const dates = [new Date('2025-01-01'),
        new Date('2025-02-01'),
        new Date('2025-03-01'),
        new Date('2025-04-01')];
      
      const dataGenerator = () => [];
      const results = DateUtils.DateRange.fromList(dates, dataGenerator);

      dates.forEach((date) => results
        .find((rl) => rl.contains(date))
        .data.push(date));
      
      global.expect(results[0].data.length).toBe(2);
      global.expect(results[1].data.length).toBe(1);
      global.expect(results[2].data.length).toBe(1);
    });
    global.it('count matches doc example', () => {
      const dates = [new Date('2025-01-01'),
        new Date('2025-02-01'),
        new Date('2025-03-01'),
        new Date('2025-04-01')];
      
      const dataGenerator = () => [];
      const results = DateUtils.DateRange.fromList(dates, dataGenerator);

      dates.forEach((date) => results
        .find((rl) => rl.contains(date))
        .data.push(date));
      
      const expected = `2025-01-01T00:00:00.000Z to 2025-02-01T00:00:00.000Z: has 2
2025-02-01T00:00:00.000Z to 2025-03-01T00:00:00.000Z: has 1
2025-03-01T00:00:00.000Z to 2025-04-01T00:00:00.000Z: has 1`;

      const resultsStr = results
        .map((rl) => `${rl.toString()}: has ${rl.data.length}`)
        .join('\n');

      global.expect(resultsStr).toStrictEqual(expected);
    });
    global.it('cannot create a list from an empty list', () => {
      const dates = [];
      const results = DateUtils.DateRange.fromList(dates);
      const expected = [];
      global.expect(results).toStrictEqual(expected);
    });
    global.it('cannot create a list from a list with one date', () => {
      const dates = [
        new Date('2025-02-01')
      ];
      const results = DateUtils.DateRange.fromList(dates);
      const expected = [];
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('generateDateSequence', () => {
    global.it('example for one hour', () => {
      const start = new Date('2025-01-01 01:00:00');
      const end = new Date('2025-01-01 02:00:00');
      const results = DateUtils.generateDateSequence(
        start,
        end,
        { minutes: 30 }
      );
      const expected = [
        start,
        new Date('2025-01-01 01:30:00'),
        end
      ];
      global.expect(results).toStrictEqual(expected);
    });
    global.it('if not a valid start date', () => {
      const start = 'string';
      const end = new Date('2025-01-01 02:00:00');
      const expected = 'Invalid start date:string';
      global.expect(() => {
        DateUtils.generateDateSequence(
          start,
          end,
          { minutes: 30 }
        );
      }).toThrow(expected);
    });
    global.it('if not a valid end date', () => {
      const start = new Date('2025-01-01 02:00:00');
      const end = 'string';
      const expected = 'Invalid end date:string';
      global.expect(() => {
        DateUtils.generateDateSequence(
          start,
          end,
          { minutes: 30 }
        );
      }).toThrow(expected);
    });
  });

  global.describe('arrange', () => {
    global.it('example for one hour', () => {
      const start = new Date('2025-01-01 01:00:00');
      const count = 1;
      const options = { hours: 1 };
      const results = DateUtils.arrange(start, count, options);
      const expected = [
        new Date('2025-01-01 01:00:00'),
        new Date('2025-01-01 02:00:00')
      ];
      global.expect(results).toStrictEqual(expected);
    });
    global.it('example for four weeks', () => {
      const start = new Date('2025-01-01 01:00:00');
      const count = 4;
      const options = { days: 7 };
      const results = DateUtils.arrange(start, count, options);
      const expected = [
        new Date('2025-01-01 01:00:00'),
        new Date('2025-01-08 01:00:00'),
        new Date('2025-01-15 01:00:00'),
        new Date('2025-01-22 01:00:00'),
        new Date('2025-01-29 01:00:00')
      ];
      global.expect(results).toStrictEqual(expected);
    });
    global.it('example for four weeks + 1 hour', () => {
      const start = new Date('2025-01-01 01:00:00');
      const count = 4;
      const options = { days: 7, hours: 1 };
      const results = DateUtils.arrange(start, count, options);
      const expected = [
        new Date('2025-01-01 01:00:00'),
        new Date('2025-01-08 02:00:00'),
        new Date('2025-01-15 03:00:00'),
        new Date('2025-01-22 04:00:00'),
        new Date('2025-01-29 05:00:00')
      ];
      global.expect(results).toStrictEqual(expected);
    });
    global.it('if not a valid start date', () => {
      const start = 'string';
      const count = 1;
      const options = { hours: 1 };
      const expected = 'Invalid start date:string';
      global.expect(() => {
        DateUtils.arrange(start, count, options);
      }).toThrow(expected);
    });
  });

  global.describe('overwrite', () => {
    global.describe('can', () => {
      global.it('overwrite a date with a date', () => {
        const dateToUpdate = new Date(Date.UTC(2024, 0, 1, 12, 0, 0));
        const newDate = new Date(Date.UTC(2025, 0, 1, 12, 0, 0));
        const expected = new Date(Date.UTC(2025, 0, 1, 12, 0, 0));
        const result = DateUtils.overwrite(dateToUpdate, newDate);

        global.expect(result).toStrictEqual(expected);
      });
      global.it('overwrite a date with a string', () => {
        const dateToUpdate = new Date(Date.UTC(2024, 0, 1, 12, 0, 0));
        const newDate = '2025-01-01 13:30:00';
        const expected = new Date(Date.UTC(2025, 0, 1, 13, 30, 0));
        const result = DateUtils.overwrite(dateToUpdate, newDate);

        global.expect(result).toStrictEqual(expected);
      });
      global.it('overwrite a date with an epoch', () => {
        const dateToUpdate = new Date(Date.UTC(2024, 0, 1, 12, 0, 0));
        const newDate = new Date(Date.UTC(2025, 0, 1, 13, 30, 0)).getTime();
        const expected = new Date(Date.UTC(2025, 0, 1, 13, 30, 0));
        const result = DateUtils.overwrite(dateToUpdate, newDate);

        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('cannot', () => {
      global.it('update if dateToUpdate is not a date', () => {
        const dateToUpdate = null;
        const newDate = new Date(Date.UTC(2025, 0, 1, 12, 0, 0));
        const expected = 'date.overwrite: dateToUpdate is not a date:null';
        global.expect(() => {
          DateUtils.overwrite(dateToUpdate, newDate);
        }).toThrow(expected);
      });
      global.it('update if dateToUpdate is something weird', () => {
        const dateToUpdate = {};
        const newDate = new Date(Date.UTC(2025, 0, 1, 12, 0, 0));
        const expected = 'date.overwrite: dateToUpdate is not a date:[object Object]';
        global.expect(() => {
          DateUtils.overwrite(dateToUpdate, newDate);
        }).toThrow(expected);
      });
      global.it('update if newDate is not a date', () => {
        const dateToUpdate = new Date(Date.UTC(2024, 0, 1, 6, 0, 0));
        const newDate = null;
        const expected = 'date.overwrite: cannot set to an invalid date:null';
        global.expect(() => {
          DateUtils.overwrite(dateToUpdate, newDate);
        }).toThrow(expected);
      });
      global.it('update if dateToUpdate is something weird', () => {
        const dateToUpdate = new Date(Date.UTC(2025, 0, 1, 12, 0, 0));
        const newDate = {};
        const expected = 'cannot overwrite date:2025-01-01T12:00:00.000Z, unknown newDateEpoch: [object Object]';
        global.expect(() => {
          DateUtils.overwrite(dateToUpdate, newDate);
        }).toThrow(expected);
      });
    });
  });

  global.describe('clone', () => {
    global.it('can clone a value with the same time', () => {
      const originalDate = new Date(Date.UTC(2025, 0, 1, 12, 0, 0));
      const result = DateUtils.clone(originalDate);
      global.expect(result).toStrictEqual(originalDate);
    });
    global.it('does not modify the original date', () => {
      const originalDate = new Date(Date.UTC(2025, 0, 1, 12, 0, 0));
      const result = DateUtils.clone(originalDate);
      const expected = new Date(Date.UTC(2025, 0, 1, 12, 0, 0));
      originalDate.setFullYear(1900);
      global.expect(result).toStrictEqual(expected);
    });
  });
});
