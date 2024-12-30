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
    global.it('can correct for time', () => {
      //-- when pulling the time from the database - it corrected it to local time for me
      //-- so what I have pulled down is actually in Central time
      //-- but I want instead to have the correct UTC time
      const originalDate = new Date(Date.UTC(2024, 12, 26, 11, 0, 0));
      const timeZone = 'america/chicago';
      const expected = new Date(Date.UTC(2024, 12, 26, 17, 0, 0));
      const results = DateUtils.correctForTimezone(originalDate, timeZone);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('epochShift', () => {
    global.it('can shift time', () => {
      //-- I got the correct time from the database as UTC
      //-- but I want to shift the time - knowing full well that functions may behave differently

      //-- when pulling the time from the database - it corrected it to local time for me
      //-- so what I have pulled down is actually in Central time
      //-- but I want instead to have the correct UTC time
      const originalDate = new Date(Date.UTC(2024, 12, 26, 17, 0, 0));
      const timeZone = 'america/chicago';
      const expected = new Date(Date.UTC(2024, 12, 26, 11, 0, 0));
      const results = DateUtils.epochShift(originalDate, timeZone);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('add', () => {
    global.describe('can add', () => {
      global.describe('an empty object', () => {
        const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const options = {};
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.describe('null gives the same time', () => {
        const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        // const options = {};
        const results = DateUtils.add(originalTime);
        global.expect(results).toStrictEqual(expected);
      });
      global.describe('1 day', () => {
        const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 12, 27, 12, 0, 0));
        const options = { days: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.describe('3 day', () => {
        const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 12, 28, 12, 0, 0));
        const options = { days: 2 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.describe('1 hour', () => {
        const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
        const options = { hours: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.describe('1 minute', () => {
        const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 12, 26, 12, 1, 0));
        const options = { minutes: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
      global.describe('1 second', () => {
        const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 12, 26, 12, 0, 1));
        const options = { seconds: 1 };
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('cannot add', () => {
      global.it('a null', () => {
        const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const expected     = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
        const options = null;
        const results = DateUtils.add(originalTime, options);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });
  
  global.describe('endOfDay', () => {
    global.it('can find the end of day', () => {
      const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const expected     = new Date(Date.UTC(2024, 12, 26, 23, 59, 59, 999));
      const results = DateUtils.endOfDay(originalTime);
      global.expect(results).toStrictEqual(expected);
    });
  });
  
  global.describe('startOfDay', () => {
    global.it('can find the start of day', () => {
      const originalTime = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const expected     = new Date(Date.UTC(2024, 12, 26, 0, 0, 0));
      const results = DateUtils.startOfDay(originalTime);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('durationString', () => {
    global.it('simple example', () => {
      const durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0 days, 1 hours, 0 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('day', () => {
      const durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 12, 27, 12, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '1 days, 0 hours, 0 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('hours', () => {
      const durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 12, 26, 14, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0 days, 2 hours, 0 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('minutes', () => {
      const durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 12, 26, 12, 30, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0 days, 0 hours, 30 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('negative example', () => {
      const durationA = new Date(Date.UTC(2024, 12, 27, 13, 0, 0));
      const durationB = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '-1 days, 1 hours, 0 minutes, 0.0 seconds';
      const results = DateUtils.durationLong(range);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('durationISO', () => {
    global.it('simple example', () => {
      const durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 12, 26, 13, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0:01:00:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('day', () => {
      const durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 12, 27, 12, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '1:00:00:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('hours', () => {
      const durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 12, 26, 14, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0:02:00:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('minutes', () => {
      const durationA = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 12, 26, 12, 30, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '0:00:30:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
    global.it('negative example', () => {
      const durationA = new Date(Date.UTC(2024, 12, 27, 13, 30, 0));
      const durationB = new Date(Date.UTC(2024, 12, 26, 12, 0, 0));
      const range = durationB.getTime() - durationA.getTime();
      const expected = '-1:01:30:00.000';
      const results = DateUtils.durationISO(range);
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('toLocalISO', () => {
    global.it('can convert a date to america/Chicago', () => {
      const dateA = Date.parse('2024-12-27 13:30:00');
      const expected = '2024-12-27T07:30:00.000-06:00';
      const results = DateUtils.toLocalISO(dateA, 'america/Chicago');
      global.expect(results).toStrictEqual(expected);
    });
    global.it('can convert a date to europe/paris', () => {
      const dateA = Date.parse('2024-12-27 13:30:00');
      const expected = '2024-12-27T14:30:00.000+01:00';
      const results = DateUtils.toLocalISO(dateA, 'europe/paris');
      global.expect(results).toStrictEqual(expected);
    });
  });
});
