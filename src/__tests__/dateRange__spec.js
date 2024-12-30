const { DateRange } = require('../date');

global.describe('DateRange', () => {
  global.describe('initializes', () => {
    global.it('the start and end times', () => {
      const startTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const endTime = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const results = new DateRange(startTime, endTime);

      global.expect(results.startDate).toStrictEqual(startTime);
      global.expect(results.endDate).toStrictEqual(endTime);
    });
    global.it('always has the starting time first', () => {
      const startTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const endTime = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const results = new DateRange(endTime, startTime);

      global.expect(results.startDate).toStrictEqual(startTime);
      global.expect(results.endDate).toStrictEqual(endTime);
    });
    global.it('still works if the same time is sent for both', () => {
      const startTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const results = new DateRange(startTime, startTime);

      global.expect(results.startDate).toStrictEqual(startTime);
      global.expect(results.endDate).toStrictEqual(startTime);
    });
  });

  global.describe('reinitialize', () => {
    global.it('the start and end times', () => {
      const startTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const endTime = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const results = new DateRange(startTime, endTime);

      const newStart = new Date(Date.UTC(2024, 11, 28, 12, 0, 0));
      const newEnd   = new Date(Date.UTC(2024, 11, 28, 12, 0, 0));

      results.reinitialize(newStart, newEnd);

      global.expect(results.startDate).toStrictEqual(newStart);
      global.expect(results.endDate).toStrictEqual(newEnd);
    });
    global.it('always has the starting time first', () => {
      const startTime = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const endTime = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const results = new DateRange(endTime, startTime);

      const newStart = new Date(Date.UTC(2024, 11, 28, 12, 0, 0));
      const newEnd   = new Date(Date.UTC(2024, 11, 28, 12, 0, 0));

      results.reinitialize(newEnd, newStart);

      global.expect(results.startDate).toStrictEqual(newStart);
      global.expect(results.endDate).toStrictEqual(newEnd);
    });
  });

  global.describe('can create a date range from a day', () => {
    global.it('first attempt', () => {
      const targetDate = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const startTime = new Date(Date.UTC(2024, 11, 26, 0, 0, 0));
      const endTime = new Date(Date.UTC(2024, 11, 26, 23, 59, 59, 999));

      const results = DateRange.startAndEndOfDay(targetDate);

      global.expect(results.startDate).toStrictEqual(startTime);
      global.expect(results.endDate).toStrictEqual(endTime);
    });
  });

  global.describe('overlaps', () => {
    const overlapA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
    const overlapB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
    const overlapC = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
    const overlapD = new Date(Date.UTC(2024, 11, 26, 15, 0, 0));

    global.describe('can detect an overlap', () => {
      global.it('forwards', () => {
        const rangeA = new DateRange(overlapA, overlapC);
        const rangeB = new DateRange(overlapB, overlapD);

        const expected = true;
        const results = rangeA.overlaps(rangeB);

        global.expect(results).toBe(expected);
      });
      global.it('backwards', () => {
        const rangeA = new DateRange(overlapA, overlapC);
        const rangeB = new DateRange(overlapB, overlapD);
  
        const expected = true;
        const results = rangeB.overlaps(rangeA);
  
        global.expect(results).toBe(expected);
      });
    });

    global.describe('has no overlap if the last millisecond is the same', () => {
      global.it('forwards', () => {
        const rangeA = new DateRange(overlapA, overlapB);
        const rangeB = new DateRange(overlapB, overlapC);

        const expected = false;
        const results = rangeA.overlaps(rangeB);

        global.expect(results).toBe(expected);
      });
      global.it('backwards', () => {
        const rangeA = new DateRange(overlapA, overlapB);
        const rangeB = new DateRange(overlapB, overlapC);

        const expected = false;
        const results = rangeB.overlaps(rangeA);
  
        global.expect(results).toBe(expected);
      });
    });

    global.describe('has no overlap if there is a gap between', () => {
      global.it('forwards', () => {
        const rangeA = new DateRange(overlapA, overlapB);
        const rangeB = new DateRange(overlapC, overlapD);

        const expected = false;
        const results = rangeA.overlaps(rangeB);

        global.expect(results).toBe(expected);
      });
      global.it('backwards', () => {
        const rangeA = new DateRange(overlapA, overlapB);
        const rangeB = new DateRange(overlapC, overlapD);

        const expected = false;
        const results = rangeB.overlaps(rangeA);
  
        global.expect(results).toBe(expected);
      });
    });
  });

  global.describe('contains detects a date', () => {
    const withinA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
    const withinB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
    const withinC = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
    const withinD = new Date(Date.UTC(2024, 11, 26, 15, 0, 0));
    const withinE = new Date(Date.UTC(2024, 11, 26, 16, 0, 0));

    global.it('can detect a date within the range', () => {
      const testDate = withinC;
      const range = new DateRange(withinB, withinD);

      const expected = true;
      const results = range.contains(testDate);

      global.expect(results).toStrictEqual(expected);
    });
    global.it('can detect a date at the exact start', () => {
      const testDate = withinB;
      const range = new DateRange(withinB, withinD);

      const expected = true;
      const results = range.contains(testDate);

      global.expect(results).toStrictEqual(expected);
    });
    global.it('can detect a date at the exact end', () => {
      const testDate = withinD;
      const range = new DateRange(withinB, withinD);

      const expected = true;
      const results = range.contains(testDate);

      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not have a date before', () => {
      const testDate = withinA;
      const range = new DateRange(withinB, withinD);

      const expected = false;
      const results = range.contains(testDate);

      global.expect(results).toStrictEqual(expected);
    });
    global.it('does not have a date after', () => {
      const testDate = withinE;
      const range = new DateRange(withinB, withinD);

      const expected = false;
      const results = range.contains(testDate);

      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('duration', () => {
    global.it('simple example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = 1000 * 60 * 60;
      const results = range.duration();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('day', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 27, 12, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = 1000 * 60 * 60 * 24;
      const results = range.duration();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('hours', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = 1000 * 60 * 60 * 2;
      const results = range.duration();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('minutes', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 30, 0));
      const range = new DateRange(durationA, durationB);
      const expected = 1000 * 60 * 30;
      const results = range.duration();
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('durationString', () => {
    global.it('simple example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '0 days, 1 hours, 0 minutes, 0.0 seconds';
      const results = range.durationString();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('day', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 27, 12, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '1 days, 0 hours, 0 minutes, 0.0 seconds';
      const results = range.durationString();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('hours', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '0 days, 2 hours, 0 minutes, 0.0 seconds';
      const results = range.durationString();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('minutes', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 30, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '0 days, 0 hours, 30 minutes, 0.0 seconds';
      const results = range.durationString();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('negative example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 27, 13, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '1 days, 1 hours, 0 minutes, 0.0 seconds';
      const results = range.durationString();
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('durationISO', () => {
    global.it('simple example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '0:01:00:00.000';
      const results = range.durationISO();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('day', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 27, 12, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '1:00:00:00.000';
      const results = range.durationISO();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('hours', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '0:02:00:00.000';
      const results = range.durationISO();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('minutes', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 30, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '0:00:30:00.000';
      const results = range.durationISO();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('negative example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 27, 13, 30, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '1:01:30:00.000';
      const results = range.durationISO();
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('isValid', () => {
    const isValidA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
    const isValidB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
    const invalidDate = new Date('cuca');
    global.it('can detect if neither are invalid', () => {
      const range = new DateRange(isValidA, isValidB);
      const expected = true;
      const results = range.isValid();
      global.expect(results).toBe(expected);
    });
    global.it('can detect if start is invalid', () => {
      const range = new DateRange(invalidDate, isValidB);
      const expected = false;
      const results = range.isValid();
      global.expect(results).toBe(expected);
    });
    global.it('can detect if end is invalid', () => {
      const range = new DateRange(isValidA, invalidDate);
      const expected = false;
      const results = range.isValid();
      global.expect(results).toBe(expected);
    });
    global.it('can detect if both are invalid', () => {
      const range = new DateRange(invalidDate, invalidDate);
      const expected = false;
      const results = range.isValid();
      global.expect(results).toBe(expected);
    });
  });

  global.describe('toString', () => {
    global.it('simple example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '2024-12-26T12:00:00.000Z to 2024-12-26T13:00:00.000Z';
      const results = range.toString();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('day', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 27, 12, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '2024-12-26T12:00:00.000Z to 2024-12-27T12:00:00.000Z';
      const results = range.toString();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('hours', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 14, 0, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '2024-12-26T12:00:00.000Z to 2024-12-26T14:00:00.000Z';
      const results = range.toString();
      global.expect(results).toStrictEqual(expected);
    });
    global.it('minutes', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 12, 30, 0));
      const range = new DateRange(durationA, durationB);
      const expected = '2024-12-26T12:00:00.000Z to 2024-12-26T12:30:00.000Z';
      const results = range.toString();
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('toLocaleString', () => {
    global.it('simple example', () => {
      const durationA = new Date(Date.UTC(2024, 11, 26, 12, 0, 0));
      const durationB = new Date(Date.UTC(2024, 11, 26, 13, 0, 0));
      const range = new DateRange(durationA, durationB);
      const results = range.toLocaleString();
      global.expect(results).toBeTruthy();

      // const expected = '2024-12-26T12:00:00.000Z to 2024-12-26T13:00:00.000Z';
      // global.expect(results).toStrictEqual(expected);
    });
  });
});
