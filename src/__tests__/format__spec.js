/* eslint-disable max-len */

const FormatUtils = require('../format');
const { mockConsole, removeConsoleMock } = require('../__testHelper__/ijsContext');

global.describe('format', () => {
  global.describe('printValue', () => {
    global.it('shows the value of an integer', () => {
      const value = 2;
      const expected = '2';
      const result = FormatUtils.printValue(value);
      global.expect(result).toBe(expected);
    });

    global.it('shows the value of null', () => {
      const value = null;
      const expected = 'null';
      const result = FormatUtils.printValue(value);
      global.expect(result).toBe(expected);
    });

    global.it('shows the value of undefined', () => {
      const value = undefined;
      const expected = 'undefined';
      const result = FormatUtils.printValue(value);
      global.expect(result).toBe(expected);
    });

    global.it('shows the value of a float', () => {
      const value = 2.5;
      const expected = '2.5';
      const result = FormatUtils.printValue(value);
      global.expect(result).toBe(expected);
    });
    
    global.it('shows the value of a string', () => {
      const value = 'hello';
      const expected = 'hello';
      const result = FormatUtils.printValue(value);
      global.expect(result).toBe(expected);
    });
    
    global.describe('object', () => {
      global.it('shows the value of an object', () => {
        const value = { first: 'name', last: 'name' };
        const expected = '{"first":"name","last":"name"}';
        const result = FormatUtils.printValue(value);
        global.expect(result).toBe(expected);
      });
      global.it('shows the value of an object if expanded', () => {
        const value = { first: 'name', last: 'name' };
        const expected = '{"first":"name","last":"name"}';
        const result = FormatUtils.printValue(value, { collapseObjects: false });
        global.expect(result).toBe(expected);
      });
      global.it('collapses objects if expansion is false', () => {
        const value = { first: 'name', last: 'name', alias: 'cuca', duration: 20 };
        const expected = '{"first":"name","last":"name"}';
        const result = FormatUtils.printValue(value, { collapseObjects: true });
        global.expect(result).not.toBe(expected);
        global.expect(result).toBeTruthy();
        global.expect(result.length).toBeLessThan(20);
      });
      global.it('prints a map correctly', () => {
        const value = new Map([['A', 1], ['B', 2]]);
        const expected = '{"dataType":"Map","value":[["A",1],["B",2]]}';
        const result = FormatUtils.printValue(value);
        global.expect(result).toBe(expected);
      });
      global.it('prints a collapsed map correctly', () => {
        const value = new Map([['A', 1], ['B', 2]]);
        const expected = '[Map length=2 ]';
        const result = FormatUtils.printValue(value, { collapse: true });
        global.expect(result).toBe(expected);
      });
      global.it('prints a collapsed map correctly', () => {
        const value = new Map([['A', 1], ['B', 2]]);
        const expected = '[Map length=2 ]';
        const result = FormatUtils.printValue(value, { collapseObjects: true });
        global.expect(result).toBe(expected);
      });
      global.it('prints an iteratable correctly', () => {
        const value = new Map([['A', 1], ['B', 2]]).keys();
        const expected = '["A","B"]';
        const result = FormatUtils.printValue(value);
        global.expect(result).toBe(expected);
      });
      global.it('prints a 2d map correctly', () => {
        const value = new Map();
        value.set('C', new Map([['A', 1], ['B', 2]]));
        value.set('D', new Map([['C', 3], ['D', 4]]));
        const expected = '{"dataType":"Map","value":[["C",{"dataType":"Map","value":[["A",1],["B",2]]}],["D",{"dataType":"Map","value":[["C",3],["D",4]]}]]}';
        const result = FormatUtils.printValue(value);
        global.expect(result).toBe(expected);
      });
    });

    global.describe('date', () => {
      global.it('with locale string by default', () => {
        const value = new Date('2021-04-01T00:00:00');
        const result = FormatUtils.printValue(value);
        const exppected = value.toISOString();
        //-- local dates are tricky because they depend on the machine
        global.expect(result).toBe(exppected);
      });
      global.it('with locale string', () => {
        const value = new Date('2021-04-01T00:00:00');
        const result = FormatUtils.printValue(value,
          { dateFormat: FormatUtils.DATE_FORMAT.LOCAL });
        const exppected = value.toLocaleString();
        //-- local dates are tricky because they depend on the machine
        global.expect(result).toBe(exppected);
      });
      global.it('with locale date string', () => {
        const value = new Date('2021-04-01T00:00:00');
        const result = FormatUtils.printValue(value,
          { dateFormat: FormatUtils.DATE_FORMAT.LOCAL_DATE });
        const exppected = value.toLocaleDateString();
        //-- local dates are tricky because they depend on the machine
        global.expect(result).toBe(exppected);
      });
      global.it('with locale time string', () => {
        const value = new Date('2021-04-01T00:00:00');
        const result = FormatUtils.printValue(value,
          { dateFormat: FormatUtils.DATE_FORMAT.LOCAL_TIME });
        const exppected = value.toLocaleTimeString();
        //-- local dates are tricky because they depend on the machine
        global.expect(result).toBe(exppected);
      });
      global.it('with NONE Formatting', () => {
        const value = new Date('2021-04-01T00:00:00');
        const result = FormatUtils.printValue(value,
          { dateFormat: FormatUtils.DATE_FORMAT.NONE });
        const exppected = value.toString();
        //-- local dates are tricky because they depend on the machine
        global.expect(result).toBe(exppected);
      });
      global.it('with ISO Formatting', () => {
        const value = new Date('2021-04-01T00:00:00');
        const result = FormatUtils.printValue(value,
          { dateFormat: FormatUtils.DATE_FORMAT.ISO });
        const exppected = value.toISOString();
        //-- local dates are tricky because they depend on the machine
        global.expect(result).toBe(exppected);
      });
      global.it('with GMT Formatting', () => {
        const value = new Date('2021-04-01T00:00:00');
        const result = FormatUtils.printValue(value,
          { dateFormat: FormatUtils.DATE_FORMAT.GMT });
        const exppected = value.toGMTString();
        //-- local dates are tricky because they depend on the machine
        global.expect(result).toBe(exppected);
      });
      global.it('with UTC Formatting', () => {
        const value = new Date('2021-04-01T00:00:00');
        const result = FormatUtils.printValue(value,
          { dateFormat: FormatUtils.DATE_FORMAT.UTC });
        const exppected = value.toUTCString();
        //-- local dates are tricky because they depend on the machine
        global.expect(result).toBe(exppected);
      });
      global.it('with null date Formatting', () => {
        const value = new Date('2021-04-01T00:00:00');
        const result = FormatUtils.printValue(value,
          { dateFormat: null });
        const exppected = value.toISOString();
        //-- local dates are tricky because they depend on the machine
        global.expect(result).toBe(exppected);
      });
    });
  });

  global.describe('divideR', () => {
    global.it('divide 5/3', () => {
      const expected = ({ value: 1, remainder: 2 });
      const result = FormatUtils.divideR(5, 3);
      global.expect(result).toEqual(expected);
    });
    global.it('divide 0/3', () => {
      const expected = ({ value: 0, remainder: 0 });
      const result = FormatUtils.divideR(0, 3);
      global.expect(result).toEqual(expected);
    });
    global.it('divide 3/0', () => {
      const expected = ({ value: Infinity, remainder: NaN });
      const result = FormatUtils.divideR(3, 0);
      global.expect(result).toEqual(expected);
    });
  });

  global.describe('millisecondDuration', () => {
    global.it('duration of 2 seconds', () => {
      const duration = 2000;
      const results = FormatUtils.millisecondDuration(duration);
      const expected = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 2,
        milliseconds: 0,
        epoch: duration
      };
      global.expect(results).toStrictEqual(expected);
    });
    global.it('duration of 2 minutes', () => {
      const duration = 1000 * 60 * 2;
      const results = FormatUtils.millisecondDuration(duration);
      const expected = {
        days: 0,
        hours: 0,
        minutes: 2,
        seconds: 0,
        milliseconds: 0,
        epoch: duration
      };
      global.expect(results).toStrictEqual(expected);
    });
    global.it('duration of 2 hours', () => {
      const duration = 1000 * 60 * 60 * 2;
      const results = FormatUtils.millisecondDuration(duration);
      const expected = {
        days: 0,
        hours: 2,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        epoch: duration
      };
      global.expect(results).toStrictEqual(expected);
    });
    global.it('duration of 2 days', () => {
      const duration = 1000 * 60 * 60 * 24 * 2;
      const results = FormatUtils.millisecondDuration(duration);
      const expected = {
        days: 2,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        epoch: duration
      };
      global.expect(results).toStrictEqual(expected);
    });
    global.it('complicated', () => {
      const day1 = new Date(2022, 2, 27, 22, 43, 40);
      const day2 = new Date(2022, 4, 3, 9);
      const duration = day2.getTime() - day1.getTime();
      const results = FormatUtils.millisecondDuration(duration);
      const expected = {
        days: 36,
        hours: 10,
        minutes: 16,
        seconds: 20,
        milliseconds: 0,
        epoch: duration
      };
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('ellipsify', () => {
    global.it('ellipsifies a long string', () => {
      const str = '0123456789';
      const expected = '01234' + FormatUtils.ELLIPSIS; // eslint-disable-line
      const results = FormatUtils.ellipsify(str, 5);
      global.expect(results).toBe(expected);
    });
    global.it('does not ellipsify a short enough string', () => {
      const str = '0123456789';
      const expected = '0123456789';
      const results = FormatUtils.ellipsify(str, 20);
      global.expect(results).toBe(expected);
    });
    global.it('does not ellipsify a string of exact length', () => {
      const str = '0123456789';
      const expected = '0123456789';
      const results = FormatUtils.ellipsify(str, 10);
      global.expect(results).toBe(expected);
    });
    global.it('ellipsifies by default on long strings', () => {
      const str = '012345678901234567890123456789012345678901234567891';
      const expected = `01234567890123456789012345678901234567890123456789${FormatUtils.ELLIPSIS}`;
      const results = FormatUtils.ellipsify(str);
      global.expect(results).toBe(expected);
    });
    global.it('ellipsifies by default on long strings with null passed', () => {
      const str = '012345678901234567890123456789012345678901234567891';
      const expected = `01234567890123456789012345678901234567890123456789${FormatUtils.ELLIPSIS}`;
      const results = FormatUtils.ellipsify(str, null);
      global.expect(results).toBe(expected);
    });
    global.it('can ellipsify on null', () => {
      const str = null;
      const expected = '';
      const results = FormatUtils.ellipsify(str, 10);
      global.expect(results).toBe(expected);
    });
    global.it('can ellipsify on undefined', () => {
      const str = undefined;
      const expected = '';
      const results = FormatUtils.ellipsify(str, 10);
      global.expect(results).toBe(expected);
    });
    global.it('can ellipsify an object', () => {
      const str = { first: 'name', last: 'name' };
      const expected = '{"first":"…';
      const results = FormatUtils.ellipsify(str, 10);
      global.expect(results).toBe(expected);
    });
  });

  global.describe('zeroFill', () => {
    global.it('pads a normal number', () => {
      const expected = '003';
      const results = FormatUtils.zeroFill(3);
      global.expect(results).toBe(expected);
    });
    global.it('zeroFill(23, 5)', () => {
      const expected = '00023';
      const results = FormatUtils.zeroFill(23, 5);
      global.expect(results).toBe(expected);
    });
    global.it('add spaces beforehand with zeroFill(23, 5, " ")', () => {
      const expected = '   23';
      const results = FormatUtils.zeroFill(23, 5, ' ');
      global.expect(results).toBe(expected);
    });
  });

  global.describe('randomInt', () => {
    global.it('random 0, 10', () => {
      const result = FormatUtils.randomInt(10);
      global.expect(Number.isInteger(result)).toBeTruthy();
      global.expect(result).toBeGreaterThanOrEqual(0);
      global.expect(result).toBeLessThanOrEqual(10);
    });
    global.it('random 10, 20', () => {
      const result = FormatUtils.randomInt(20, 10);
      global.expect(Number.isInteger(result)).toBeTruthy();
      global.expect(result).toBeGreaterThanOrEqual(10);
      global.expect(result).toBeLessThanOrEqual(20);
    });
  });

  global.describe('randomFloat', () => {
    global.it('random 0, 10', () => {
      const result = FormatUtils.randomFloat(10);
      global.expect(result).toBeGreaterThanOrEqual(0);
      global.expect(result).toBeLessThanOrEqual(10);
    });
    global.it('random 10, 20', () => {
      const result = FormatUtils.randomFloat(20, 10);
      global.expect(result).toBeGreaterThanOrEqual(10);
      global.expect(result).toBeLessThanOrEqual(20);
    });
  });

  global.describe('mapDomain', () => {
    global.it('should give min range if value is below domain', () => {
      const val = -2;
      const domain = [1, 10];
      const range = [0, 1];
      
      const expected = 0;
      const result = FormatUtils.mapDomain(val, domain, range);
      global.expect(result).toBeCloseTo(expected, 5);
    });
    global.it('should give min range if value is at domain', () => {
      const val = 0;
      const domain = [0, 10];
      const range = [0, 1];
      
      const expected = 0;
      const result = FormatUtils.mapDomain(val, domain, range);
      global.expect(result).toBeCloseTo(expected, 5);
    });
    global.it('should give half if value is halfway in domain', () => {
      const val = 5;
      const domain = [0, 10];
      const range = [0, 1];
      
      const expected = 0.5;
      const result = FormatUtils.mapDomain(val, domain, range);
      global.expect(result).toBeCloseTo(expected, 5);
    });
    global.it('should give max range if value is at domain', () => {
      const val = 12;
      const domain = [0, 10];
      const range = [0, 1];
      
      const expected = 1;
      const result = FormatUtils.mapDomain(val, domain, range);
      global.expect(result).toBeCloseTo(expected, 5);
    });
    global.it('should give 5 if half of domain with range of 10', () => {
      const val = 0.5;
      const domain = [0, 1];
      const range = [0, 10];
      
      const expected = 5;
      const result = FormatUtils.mapDomain(val, domain, range);
      global.expect(result).toBeCloseTo(expected, 5);
    });
    global.it('should give Pi if half of domain and range of 2PI', () => {
      const val = 0.5;
      const domain = [0, 1];
      const range = [0, Math.PI + Math.PI];
      
      const expected = Math.PI;
      const result = FormatUtils.mapDomain(val, domain, range);
      global.expect(result).toBeCloseTo(expected, 5);
    });
    global.it('should works with 0,1 as the default range', () => {
      const val = 12;
      const domain = [0, 10];
      
      const expected = 1;
      const result = FormatUtils.mapDomain(val, domain, []);
      global.expect(result).toBeCloseTo(expected, 5);
    });
  });

  global.describe('clampDomain', () => {
    global.it('clamps if the value is less than mimimum', () => {
      const val = -1;
      const min = 0;
      const max = 1;
      const expected = 0;
      const result = FormatUtils.clampDomain(val, [min, max]);

      global.expect(result).toBeCloseTo(expected, 5);
    });
    global.it('clamps if the value is greater than the maximum', () => {
      const val = 2;
      const min = 0;
      const max = 1;
      const expected = 1;
      const result = FormatUtils.clampDomain(val, [min, max]);

      global.expect(result).toBeCloseTo(expected, 5);
    });
    global.it('does not clamp if in the domain', () => {
      const val = 0.5;
      const min = 0;
      const max = 1;
      const expected = 0.5;
      const result = FormatUtils.clampDomain(val, [min, max]);

      global.expect(result).toBeCloseTo(expected, 5);
    });
  });

  global.describe('timePeriod', () => {
    global.describe('can mock time', () => {
      global.it('can mock a fake time', () => {
        jest
          .useFakeTimers()
          .setSystemTime(new Date('2020-01-01'));

        const expected = 1577836800000;
        const results = new Date().getTime();

        global.expect(results).toBe(expected);
      });
      global.it('can mock another time', () => {
        jest
          .useFakeTimers()
          .setSystemTime(new Date('2020-01-01T09:00:00'));

        const expected = 1577869200000;
        const results = new Date().getTime();

        global.expect(results).toBe(expected);
      });
    });
    global.describe('with start time', () => {
      global.it('can determine the period with a start time', () => {
        jest.useRealTimers();

        const currentTime = new Date('2020-01-01T09:00:03');
        const startTime = new Date('2020-01-01T09:00:00');
        const expected = 0.3;

        global.expect(currentTime.getTime() - startTime.getTime()).toBe(3000);
        
        const results = FormatUtils.timePeriod(10000, currentTime.getTime(), startTime.getTime());

        global.expect(results).toBeCloseTo(expected, 5);
      });
      global.it('can determine the period without a start time', () => {
        jest.useRealTimers();

        const currentTime = new Date('2020-01-01T09:00:03');
        const expected = 157786920.3;

        const results = FormatUtils.timePeriod(10000, currentTime.getTime());

        global.expect(results).toBeCloseTo(expected, 5);
      });
      global.it('can determine the current time with a start time', () => {
        jest
          .useFakeTimers()
          .setSystemTime(new Date('2020-01-01T09:01:03'));

        const startTime = new Date('2020-01-01T09:00:00').getTime();
        const expected = 6.3;

        const results = FormatUtils.timePeriod(10000, null, startTime);

        global.expect(results).toBeCloseTo(expected, 5);
      });
      global.it('can determine the period without current or start time', () => {
        jest
          .useFakeTimers()
          .setSystemTime(new Date('2020-01-01T09:00:03'));

        const expected = 157786920.3;

        const results = FormatUtils.timePeriod(10000);

        global.expect(results).toBeCloseTo(expected, 5);
      });
    });
  });

  global.describe('timePeriodPercent', () => {
    global.describe('can mock time', () => {
      global.it('can mock a fake time', () => {
        jest
          .useFakeTimers()
          .setSystemTime(new Date('2020-01-01'));

        const expected = 1577836800000;
        const results = new Date().getTime();

        global.expect(results).toBe(expected);
      });
      global.it('can mock another time', () => {
        jest
          .useFakeTimers()
          .setSystemTime(new Date('2020-01-01T09:00:00'));

        const expected = 1577869200000;
        const results = new Date().getTime();

        global.expect(results).toBe(expected);
      });
    });
    global.describe('with start time', () => {
      global.it('can determine the period with specific time', () => {
        jest.useRealTimers();

        const currentTime = new Date('2020-01-01T09:00:03');
        const expected = 0.3;

        const results = FormatUtils.timePeriodPercent(10000, currentTime.getTime());

        global.expect(results).toBeCloseTo(expected, 5);
      });
      global.it('can determine the period hours after', () => {
        jest.useRealTimers();

        const currentTime = new Date('2020-01-01T10:27:03');
        const expected = 0.3;

        const results = FormatUtils.timePeriodPercent(10000, currentTime.getTime());

        global.expect(results).toBeCloseTo(expected, 5);
      });
      global.it('can determine the period without current or start time', () => {
        jest
          .useFakeTimers()
          .setSystemTime(new Date('2020-01-01T09:00:03'));

        const expected = 0.3;

        const results = FormatUtils.timePeriodPercent(10000);

        global.expect(results).toBeCloseTo(expected, 5);
      });
    });
  });

  global.describe('capitalize', () => {
    global.it('non word', () => {
      const str = null;
      const expected = '';
      const results = FormatUtils.capitalize(str);
      global.expect(results).toBe(expected);
    });
    global.it('empty string', () => {
      const str = '';
      const expected = '';
      const results = FormatUtils.capitalize(str);
      global.expect(results).toBe(expected);
    });
    global.it('one word', () => {
      const str = 'null';
      const expected = 'Null';
      const results = FormatUtils.capitalize(str);
      global.expect(results).toBe(expected);
    });
    global.describe('multiple words', () => {
      const str = 'john doe';
      const expected = 'John doe';
      const results = FormatUtils.capitalize(str);
      global.expect(results).toBe(expected);
    });
    global.it('unicode', () => {
      const str = '𐐶𐐲𐑌𐐼𐐲𐑉';
      const expected = '𐐎𐐲𐑌𐐼𐐲𐑉';
      const results = FormatUtils.capitalize(str);
      global.expect(results).toBe(expected);
    });
  });
  global.describe('capitalize all', () => {
    global.it('non word', () => {
      const str = null;
      const expected = '';
      const results = FormatUtils.capitalizeAll(str);
      global.expect(results).toBe(expected);
    });
    global.it('empty string', () => {
      const str = '';
      const expected = '';
      const results = FormatUtils.capitalizeAll(str);
      global.expect(results).toBe(expected);
    });
    global.it('one word', () => {
      const str = 'null';
      const expected = 'Null';
      const results = FormatUtils.capitalizeAll(str);
      global.expect(results).toBe(expected);
    });
    global.it('space before word', () => {
      const str = ' null';
      const expected = ' Null';
      const results = FormatUtils.capitalizeAll(str);
      global.expect(results).toBe(expected);
    });
    global.it('multiple words', () => {
      const str = 'john doe';
      const expected = 'John Doe';
      const results = FormatUtils.capitalizeAll(str);
      global.expect(results).toBe(expected);
    });
    global.it('space before and after word', () => {
      const str = ' null ';
      const expected = ' Null ';
      const results = FormatUtils.capitalizeAll(str);
      global.expect(results).toBe(expected);
    });
    global.it('formatting', () => {
      const str = 'vw chevrolet-malibu';
      const expected = 'Vw Chevrolet-Malibu';
      const results = FormatUtils.capitalizeAll(str);
      global.expect(results).toBe(expected);
    });
    global.it('unicode', () => {
      const str = '𐐶𐐲𐑌𐐼𐐲𐑉';
      const expected = '𐐎𐐲𐑌𐐼𐐲𐑉';
      const results = FormatUtils.capitalizeAll(str);
      global.expect(results).toBe(expected);
    });
    /*
    //-- see issue #9
    //-- https://github.com/paulroth3d/jupyter-ijavascript-utils/issues/9
    
    global.it('unicode space', () => {
      const str = 'alpha 𐐶𐐲𐑌𐐼𐐲𐑉';
      const expected = 'Alpha 𐐎𐐲𐑌𐐼𐐲𐑉';
      const results = FormatUtils.capitalizeAll(str);
      global.expect(results).toBe(expected);
    });
    */
  });

  global.describe('compact', () => {
    global.describe('compactParse', () => {
      global.it('(0, 1)', () => {
        const { num, digits } = { num: 0, digits: 1 };
        const expected = '0';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(12, 0)', () => {
        const { num, digits } = { num: 12, digits: 0 };
        const expected = '12';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(12, 1)', () => {
        const { num, digits } = { num: 12, digits: 1 };
        const expected = '12.0';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(1234, 0)', () => {
        const { num, digits } = { num: 1234, digits: 0 };
        const expected = '1K';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(1234, 1)', () => {
        const { num, digits } = { num: 1234, digits: 1 };
        const expected = '1.2K';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(1234, 2)', () => {
        const { num, digits } = { num: 1234, digits: 2 };
        const expected = '1.23K';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(10^8, 1)', () => {
        const { num, digits } = { num: 100000000, digits: 1 };
        const expected = '100.0M';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(299792458, 1)', () => {
        const { num, digits } = { num: 299792458, digits: 1 };
        const expected = '299.8M';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(759878, 1)', () => {
        const { num, digits } = { num: 759878, digits: 1 };
        const expected = '759.9K';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(759878, 0)', () => {
        const { num, digits } = { num: 759878, digits: 0 };
        const expected = '760K';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(123.456, 1)', () => {
        const { num, digits } = { num: 123.456, digits: 1 };
        const expected = '123.5';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(123.456, 2)', () => {
        const { num, digits } = { num: 123.456, digits: 2 };
        const expected = '123.46';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(123.456, 4)', () => {
        const { num, digits } = { num: 123.456, digits: 4 };
        const expected = '123.4560';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(87, 1)', () => {
        const { num, digits } = { num: 87, digits: 1 };
        const expected = '87.0';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(10, 1)', () => {
        const { num, digits } = { num: 10, digits: 1 };
        const expected = '10.0';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(4, 1)', () => {
        const { num, digits } = { num: 4, digits: 1 };
        const expected = '4.0';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(1, 1)', () => {
        const { num, digits } = { num: 1, digits: 1 };
        const expected = '1.0';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(0.02, 1)', () => {
        const { num, digits } = { num: 0.02, digits: 0 };
        const expected = '2c';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(0.0000002, 1)', () => {
        const { num, digits } = { num: 0.0000002, digits: 0 };
        const expected = '200n';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(10^-25, 1)', () => {
        const { num, digits } = { num: 2 * 10 ** -25, digits: 1 };
        const expected = '0.2y';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(NaN, 1)', () => {
        const { num, digits } = { num: NaN, digits: 1 };
        const expected = '';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(Null, 1)', () => {
        const { num, digits } = { num: null, digits: 1 };
        const expected = '';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(Undefined, 1)', () => {
        const { num, digits } = { num: undefined, digits: 1 };
        const expected = '';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('(0, 1)', () => {
        const { num, digits } = { num: 0, digits: 1 };
        const expected = '0';
        const results = FormatUtils.compactNumber(num, digits);
        global.expect(results).toBe(expected);
      });
      global.it('default digits as 0', () => {
        const num = 100;
        const expected = '100';
        const results = FormatUtils.compactNumber(num);
        global.expect(results).toBe(expected);
      });
    });

    global.describe('compactNumber', () => {
      global.it('(0.2y', () => {
        const str = '0.2y';
        const results = FormatUtils.compactParse(str);
        const expected = 2 * 10 ** -25;
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('10k', () => {
        const str = '10K';
        const expected = 10000;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBe(expected);
      });
      global.it('200n', () => {
        const str = '200n';
        const expected = 0.0000002;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('2c', () => {
        const str = '2c';
        const expected = 0.02;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('1', () => {
        const str = '1';
        const expected = 1;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('12', () => {
        const str = '12';
        const expected = 12;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('87', () => {
        const str = '87';
        const expected = 87;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('123.456', () => {
        const str = '123.456';
        const expected = 123.456;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('760K', () => {
        const str = '760K';
        const expected = 760000;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('299.8M', () => {
        const str = '299.8M';
        const expected = 299800000;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('100.0M', () => {
        const str = '100.0M';
        const expected = 100000000;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('0', () => {
        const str = '0';
        const expected = 0;
        const result = FormatUtils.compactParse(str);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('NaN', () => {
        const str = 'NaN';
        const expected = 0;
        const expectedError = 'Unable to parse short number:NaN';
        global.expect(() => {
          const result = FormatUtils.compactParse(str);
          global.expect(result).toBeCloseTo(expected);
        }).toThrow(expectedError);
      });
      global.it('undefined', () => {
        const str = 'undefined';
        const expected = 0;
        const expectedError = 'Unable to parse short number:undefined';
        global.expect(() => {
          const result = FormatUtils.compactParse(str);
          global.expect(result).toBeCloseTo(expected);
        }).toThrow(expectedError);
      });
      global.it('abc', () => {
        const str = 'abc';
        const expected = 0;
        const expectedError = 'Unable to parse short number:abc';
        global.expect(() => {
          const result = FormatUtils.compactParse(str);
          global.expect(result).toBeCloseTo(expected);
        }).toThrow(expectedError);
      });
      global.it('actual null', () => {
        const str = null;
        const expected = 0;
        const expectedError = 'Unable to parse short number:null';
        global.expect(() => {
          const result = FormatUtils.compactParse(str);
          global.expect(result).toBeCloseTo(expected);
        }).toThrow(expectedError);
      });
      global.it('actual undefined', () => {
        const str = undefined;
        const expected = 0;
        const expectedError = 'Unable to parse short number:undefined';
        global.expect(() => {
          const result = FormatUtils.compactParse(str);
          global.expect(result).toBeCloseTo(expected);
        }).toThrow(expectedError);
      });
    });
  });

  global.describe('safeConvertFloat', () => {
    global.describe('fails conversion', () => {
      global.it('null', () => {
        const val = null;
        const expected = Number.NaN;
        const result = FormatUtils.safeConvertFloat(val);
        global.expect(result).toBe(expected);
      });
      global.it('Nan', () => {
        const val = Number.NaN;
        const expected = Number.NaN;
        const result = FormatUtils.safeConvertFloat(val);
        global.expect(result).toBe(expected);
      });
      global.it('empty string', () => {
        const val = '';
        const expected = Number.NaN;
        const result = FormatUtils.safeConvertFloat(val);
        global.expect(result).toBe(expected);
      });
      global.it('catches error', () => {
        const otherwise = 1234;
        const MyClass = function MyClass(val) {
          this.val = val;
          return this;
        };
        MyClass.prototype.valueOf = function valueOf() {
          throw Error('Some Error');
        };
        const val = new MyClass(10);
        const result = FormatUtils.safeConvertFloat(val, otherwise);
        global.expect(result).toBe(otherwise);
      });
      global.it('uses standard valueOf', () => {
        const expected = 1234;
        const val = {
          value: 1234,
          toString: () => `${this.value}`,
          valueOf: () => this.value
        };
        const result = FormatUtils.safeConvertFloat(val, expected);
        global.expect(result).toBe(expected);
      });
      global.it('uses otherwise if NaN', () => {
        const otherwise = 1234;
        const val = Number.NaN;
        const result = FormatUtils.safeConvertFloat(val, otherwise);
        global.expect(result).toBe(otherwise);
      });
    });
    global.describe('succeeds conversion', () => {
      global.it('2', () => {
        const val = '2';
        const expected = 2;
        const result = FormatUtils.safeConvertFloat(val);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('number 2', () => {
        const val = 2;
        const expected = 2;
        const result = FormatUtils.safeConvertFloat(val);
        global.expect(result).toBeCloseTo(expected);
      });
    });
  });
  global.describe('safeConvertInteger', () => {
    global.describe('fails conversion', () => {
      global.it('null', () => {
        const val = null;
        const expected = Number.NaN;
        const result = FormatUtils.safeConvertInteger(val);
        global.expect(result).toBe(expected);
      });
      global.it('Nan', () => {
        const val = Number.NaN;
        const expected = Number.NaN;
        const result = FormatUtils.safeConvertInteger(val);
        global.expect(result).toBe(expected);
      });
      global.it('empty string', () => {
        const val = '';
        const expected = Number.NaN;
        const result = FormatUtils.safeConvertInteger(val);
        global.expect(result).toBe(expected);
      });
      global.it('catches error', () => {
        const otherwise = 1234;
        const MyClass = function MyClass(val) {
          this.val = val;
          return this;
        };
        MyClass.prototype.valueOf = function valueOf() {
          throw Error('Some Error');
        };
        const val = new MyClass(10);
        const result = FormatUtils.safeConvertInteger(val, otherwise);
        global.expect(result).toBe(otherwise);
      });
    });
    global.describe('succeeds conversion', () => {
      global.it('2', () => {
        const val = '2';
        const expected = 2;
        const result = FormatUtils.safeConvertInteger(val);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('number 2', () => {
        const val = 2;
        const expected = 2;
        const result = FormatUtils.safeConvertInteger(val);
        global.expect(result).toBeCloseTo(expected);
      });
      global.it('uses standard valueOf', () => {
        const expected = 1234.5;
        const val = {
          value: 1234.5,
          toString: () => `${this.value}`,
          valueOf: () => this.value
        };
        const result = FormatUtils.safeConvertInteger(val, expected);
        global.expect(result).toBe(expected);
      });
      global.it('uses otherwise if NaN', () => {
        const otherwise = 1234;
        const val = Number.NaN;
        const result = FormatUtils.safeConvertInteger(val, otherwise);
        global.expect(result).toBe(otherwise);
      });
    });
  });

  global.describe('safeConvertString', () => {
    global.describe('fails conversion', () => {
      global.it('null', () => {
        const val = null;
        const expected = 'null';
        const result = FormatUtils.safeConvertString(val);
        global.expect(result).toBe(expected);
      });
      global.it('Nan', () => {
        const val = Number.NaN;
        const expected = 'NaN';
        const result = FormatUtils.safeConvertString(val);
        global.expect(result).toBe(expected);
      });
      global.it('empty string', () => {
        const val = '';
        const expected = '';
        const result = FormatUtils.safeConvertString(val);
        global.expect(result).toBe(expected);
      });
      global.it('attempt to throw exception', () => {
        const expected = 'otherwise';
        const MyClass = function MyClass(val) {
          this.val = val;
          return this;
        };
        MyClass.prototype.toString = function toString() {
          throw Error('String conversion error');
        };

        const val = new MyClass(10);
        const result = FormatUtils.safeConvertString(val, expected);
        global.expect(result).toBe(expected);
      });
    });
    global.describe('succeeds conversion', () => {
      global.it('string 2', () => {
        const val = '2';
        const expected = '2';
        const result = FormatUtils.safeConvertString(val);
        global.expect(result).toBe(expected);
      });
      global.it('number 2', () => {
        const val = 2;
        const expected = '2';
        const result = FormatUtils.safeConvertString(val);
        global.expect(result).toBe(expected);
      });
      global.it('uses standard toString', () => {
        const expected = 'expected';
        const MyClass = function MyClass(val) {
          this.val = val;
          return this;
        };
        MyClass.prototype.toString = function toString() {
          return this.val;
        };
        const val = new MyClass(expected);
        const result = FormatUtils.safeConvertString(val, 'otherwise');
        global.expect(result).toBe(expected);
      });
    });
  });

  global.describe('safeConvertBoolean', () => {
    global.describe('fails conversion', () => {
      global.it('null', () => {
        const val = null;
        const expected = false;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('Nan', () => {
        const val = Number.NaN;
        const expected = false;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('empty string', () => {
        const val = '';
        const expected = false;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
    });
    global.describe('succeeds conversion', () => {
      global.it('string True', () => {
        const val = 'True';
        const expected = true;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('string TRUE', () => {
        const val = 'True';
        const expected = true;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('string False', () => {
        const val = 'False';
        const expected = false;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('string FALSE', () => {
        const val = 'FALSE';
        const expected = false;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('number 10', () => {
        const val = 10;
        const expected = true;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('number 0', () => {
        const val = 0;
        const expected = false;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('string yes', () => {
        let val = 'yes';
        const expected = true;
        let result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);

        val = 'YES';
        result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('string no', () => {
        let val = 'no';
        const expected = false;
        let result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);

        val = 'NO';
        result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('string 1', () => {
        const val = '1';
        const expected = true;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
      global.it('string 0', () => {
        const val = '0';
        const expected = false;
        const result = FormatUtils.safeConvertBoolean(val);
        global.expect(result).toBe(expected);
      });
    });
  });
  global.describe('can parse commands', () => {
    global.describe('successfully', () => {
      global.it('without parentheses', () => {
        const str = 'ellipsify';
        const [expectedCommand, expectedArgs] = ['ellipsify', undefined];
        const [command, args] = FormatUtils.parseCommand(str);
        global.expect(command).toBe(expectedCommand);
        global.expect(args).toStrictEqual(expectedArgs);
      });
      global.it('with parentheses', () => {
        const str = 'ellipsify(20)';
        const [expectedCommand, expectedArgs] = ['ellipsify', ['20']];
        const [command, args] = FormatUtils.parseCommand(str);
        global.expect(command).toBe(expectedCommand);
        global.expect(args).toStrictEqual(expectedArgs);
      });
      global.it('with multiple arguments', () => {
        const str = 'ellipsify(20, 21, 22)';
        const [expectedCommand, expectedArgs] = ['ellipsify', ['20', '21', '22']];
        const [command, args] = FormatUtils.parseCommand(str);
        global.expect(command).toBe(expectedCommand);
        global.expect(args).toStrictEqual(expectedArgs);
      });
      global.it('with empty parentheses', () => {
        const str = 'ellipsify()';
        const [expectedCommand, expectedArgs] = ['ellipsify', []];
        const [command, args] = FormatUtils.parseCommand(str);
        global.expect(command).toBe(expectedCommand);
        global.expect(args).toStrictEqual(expectedArgs);
      });
    });
    global.describe('does not accept the command', () => {
      global.it('if there are spaces around the command', () => {
        const str = ' ellipsify(20)';
        const [expectedCommand, expectedArgs] = [' ellipsify(20)'];
        const [command, args] = FormatUtils.parseCommand(str);
        global.expect(command).toBe(expectedCommand);
        global.expect(args).toStrictEqual(expectedArgs);
      });
      global.it('if there are missing paren 1', () => {
        const str = 'ellipsify20)';
        const [expectedCommand, expectedArgs] = ['ellipsify20)'];
        const [command, args] = FormatUtils.parseCommand(str);
        global.expect(command).toBe(expectedCommand);
        global.expect(args).toStrictEqual(expectedArgs);
      });
      global.it('if there are missing paren 2', () => {
        const str = 'ellipsify(20';
        const [expectedCommand, expectedArgs] = ['ellipsify(20'];
        const [command, args] = FormatUtils.parseCommand(str);
        global.expect(command).toBe(expectedCommand);
        global.expect(args).toStrictEqual(expectedArgs);
      });
      global.it('if there are missing paren both', () => {
        const str = 'ellipsify20';
        const [expectedCommand, expectedArgs] = ['ellipsify20'];
        const [command, args] = FormatUtils.parseCommand(str);
        global.expect(command).toBe(expectedCommand);
        global.expect(args).toStrictEqual(expectedArgs);
      });
    });
  });

  global.describe('isEmptyValue', () => {
    global.describe('can detect a value', () => {
      global.it('number 0', () => {
        const val = 0;
        const expected = false;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
      global.it('number 1', () => {
        const val = 1;
        const expected = false;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
      global.it('number 99', () => {
        const val = 99;
        const expected = false;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
      global.it('string abc', () => {
        const val = 'abc';
        const expected = false;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
      global.it('array with one item', () => {
        const val = [0];
        const expected = false;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
      global.it('array with two items', () => {
        const val = [0, 'a'];
        const expected = false;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
    });
    global.describe('can detect an empty value', () => {
      global.it('null', () => {
        const val = null;
        const expected = true;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
      global.it('undefined', () => {
        const val = undefined;
        const expected = true;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
      global.it('empty string', () => {
        const val = '';
        const expected = true;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
      global.it('empty array', () => {
        const val = [];
        const expected = true;
        const results = FormatUtils.isEmptyValue(val);
        global.expect(results).toBe(expected);
      });
    });
  });

  global.describe('parseBoolean', () => {
    global.describe('captures true', () => {
      global.it('boolean TRUE', () => {
        const val = true;
        const expected = true;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('number 1', () => {
        const val = 1;
        const expected = true;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('string TRUE', () => {
        const val = 'TRUE';
        const expected = true;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('string True', () => {
        const val = 'True';
        const expected = true;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('string true', () => {
        const val = 'TRUE';
        const expected = true;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
    });
    global.describe('captures false', () => {
      global.it('boolean false', () => {
        const val = false;
        const expected = false;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('number 0', () => {
        const val = 0;
        const expected = false;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('string FALSE', () => {
        const val = 'FALSE';
        const expected = false;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('string False', () => {
        const val = 'False';
        const expected = false;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
      global.it('string false', () => {
        const val = 'false';
        const expected = false;
        const result = FormatUtils.parseBoolean(val);
        global.expect(result).toStrictEqual(expected);
      });
    });
  });
  global.describe('parseNumber', () => {
    global.describe('null', () => {
      global.it('parses correctly', () => {
        const val = null;
        const expected = null;
        const result = FormatUtils.parseNumber(val);
        global.expect(result).toBe(expected);
      });
    });
    global.describe('undefined', () => {
      global.it('parses correctly', () => {
        const val = undefined;
        const expected = undefined;
        const result = FormatUtils.parseNumber(val);
        global.expect(result).toBe(expected);
      });
    });
    global.describe('bigInt', () => {
      global.it('parses correctly', () => {
        const val = BigInt(10);
        const expected = 10;
        const result = FormatUtils.parseNumber(val);
        global.expect(result).toBe(expected);
      });
    });
    global.describe('number', () => {
      global.it('parses correctly', () => {
        const val = 10;
        const expected = 10;
        const result = FormatUtils.parseNumber(val);
        global.expect(result).toBe(expected);
      });
      global.it('0', () => {
        const val = 0;
        const expected = 0;
        const result = FormatUtils.parseNumber(val);
        global.expect(result).toBe(expected);
      });
      global.it('-1', () => {
        const val = -1;
        const expected = -1;
        const result = FormatUtils.parseNumber(val);
        global.expect(result).toBe(expected);
      });
    });
    global.describe('string', () => {
      global.describe('default locale', () => {
        global.it('0', () => {
          const val = '0';
          const expected = 0;
          const result = FormatUtils.parseNumber(val);
          global.expect(result).toBe(expected);
        });
        global.it('1', () => {
          const val = '1';
          const expected = 1;
          const result = FormatUtils.parseNumber(val);
          global.expect(result).toBe(expected);
        });
        global.it('1000', () => {
          const val = '1000';
          const expected = 1000;
          const result = FormatUtils.parseNumber(val);
          global.expect(result).toBe(expected);
        });
        global.it('1000.00', () => {
          const val = '1000.00';
          const expected = 1000.0;
          const result = FormatUtils.parseNumber(val);
          global.expect(result).toBe(expected);
        });
        global.it('10.5', () => {
          const val = '10.5';
          const expected = 10.5;
          const result = FormatUtils.parseNumber(val);
          global.expect(result).toBe(expected);
        });
        global.it('-1', () => {
          const val = '-1';
          const expected = -1;
          const result = FormatUtils.parseNumber(val);
          global.expect(result).toBe(expected);
        });
        global.it('-10.5', () => {
          const val = '-10.5';
          const expected = -10.5;
          const result = FormatUtils.parseNumber(val);
          global.expect(result).toBe(expected);
        });
        global.it('-1,000.0', () => {
          const val = '-1,000.0';
          const expected = -1000.0;
          const result = FormatUtils.parseNumber(val);
          global.expect(result).toBe(expected);
        });
      });
      global.describe('en-us', () => {
        global.it('us: 1', () => {
          const locale = 'en-US';
          const val = '1';
          const expected = 1;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: 1.234', () => {
          const locale = 'en-US';
          const val = '1.234';
          const expected = 1.234;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: 1,234', () => {
          const locale = 'en-US';
          const val = '1,234';
          const expected = 1234;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: 1,234.56', () => {
          const locale = 'en-US';
          const val = '1,234.56';
          const expected = 1234.56;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: -1,234.56', () => {
          const locale = 'en-US';
          const val = '-1,234.56';
          const expected = -1234.56;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: twice', () => {
          const locale = 'en-US';
          let val = '-1,234.56';
          let expected = -1234.56;
          let result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);

          val = '-1,000.5';
          expected = -1000.5;
          result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: us + fr', () => {
          let locale = 'en-US';
          let val = '-1,234.56';
          let expected = -1234.56;
          let result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);

          locale = 'fr-FR';
          val = '-1 000,5';
          expected = -1000.5;
          result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
      });
      global.describe('fr-FR', () => {
        global.it('us: 1', () => {
          const locale = 'fr-FR';
          const val = '1';
          const expected = 1;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: 1,234', () => {
          const locale = 'fr-FR';
          const val = '1,234';
          const expected = 1.234;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: 1 234', () => {
          const locale = 'fr-FR';
          const val = '1 234';
          const expected = 1234;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: 1 234,56', () => {
          const locale = 'fr-FR';
          const val = '1 234,56';
          const expected = 1234.56;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: -1 234,56', () => {
          const locale = 'fr-FR';
          const val = '-1 234,56';
          const expected = -1234.56;
          const result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('fr: twice', () => {
          const locale = 'fr-FR';
          let val = '-1 234,56';
          let expected = -1234.56;
          let result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);

          val = '-1 000,5';
          expected = -1000.5;
          result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
        global.it('us: fr + us', () => {
          let locale = 'fr-FR';
          let val = '-1 000,5';
          let expected = -1000.5;
          let result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
          
          locale = 'en-US';
          val = '-1,234.56';
          expected = -1234.56;
          result = FormatUtils.parseNumber(val, locale);
          global.expect(result).toBe(expected);
        });
      });
    });
  });
  global.describe('limitLines', () => {
    global.describe('can limit', () => {
      global.describe('strings', () => {
        global.it('empty', () => {
          const target = '';
          const expected = '';
          const results = FormatUtils.limitLines(target, 2, undefined, '\n');
          global.expect(results).toBe(expected);
        });
        global.it('4 lines, sliced to 2', () => {
          const target = '1\n2\n3\n4';
          const expected = '1\n2';
          const results = FormatUtils.limitLines(target, 2, undefined, '\n');
          global.expect(results).toBe(expected);
        });
        global.it('4 lines, sliced to 1:2', () => {
          const target = '1\n2\n3\n4';
          const expected = '2';
          const results = FormatUtils.limitLines(target, 2, 1, '\n');
          global.expect(results).toBe(expected);
        });
        global.it('4 lines, sliced to 1:2', () => {
          const target = '1\n2\n3\n4';
          const expected = '3\n4';
          const results = FormatUtils.limitLines(target, undefined, 2, '\n');
          global.expect(results).toBe(expected);
        });
      });
      global.describe('object', () => {
        global.it('simple object', () => {
          const target = { first: 1, second: 2, third: 3 };
          const expected = '{\n  "first": 1,';
          const results = FormatUtils.limitLines(target, 2, undefined, '\n');
          global.expect(results).toBe(expected);
        });
      });
      global.describe('standard datatypes', () => {
        global.it('number', () => {
          const target = 4;
          global.expect(() => FormatUtils.limitLines(target, 1, 0, '\n')).not.toThrow();
        });
      });
      global.describe('line separator', () => {
        global.it('explicitly set', () => {
          const target = '1\n2\n3\n4';
          const expected = '2';
          const results = FormatUtils.limitLines(target, 2, 1, '\n');
          global.expect(results).toBe(expected);
        });
        global.it('explicitly set', () => {
          const target = '1\n2\n3\n4';
          const expected = '2';
          const results = FormatUtils.limitLines(target, 2, 1);
          global.expect(results).toBe(expected);
        });
      });
      global.describe('invalid values', () => {
        global.it('null string', () => {
          const target = null;
          const expected = '';
          const results = FormatUtils.limitLines(target, 3, 5);
          global.expect(results).toBe(expected);
        });
        global.it('string out of bounds 1', () => {
          const target = null;
          const expected = '';
          const results = FormatUtils.limitLines(target, 3, 5);
          global.expect(results).toBe(expected);
        });
        global.it('string out of bounds 2', () => {
          const target = '1\n2';
          const expected = '';
          const results = FormatUtils.limitLines(target, 3, 5);
          global.expect(results).toBe(expected);
        });
        global.it('string in bounds', () => {
          const target = '1\n2';
          const expected = '1\n2';
          const results = FormatUtils.limitLines(target, 2);
          global.expect(results).toBe(expected);
        });
        global.it('string partially in bounds', () => {
          const target = '1\n2';
          const expected = '1\n2';
          const results = FormatUtils.limitLines(target, 4);
          global.expect(results).toBe(expected);
        });
      });
    });
  });
  global.describe('consoleLines', () => {
    const ORIGINAL_CONSOLE = global.console;

    global.beforeEach(() => {
      // prepareWindow();
      mockConsole();
    });
    global.afterEach(() => {
      // restoreWindow();
      removeConsoleMock();
    });
    global.afterAll(() => {
      global.console = ORIGINAL_CONSOLE;
    });
    global.it('can detect console', () => {
      console.log('test');
      global.expect(console.log).toHaveBeenCalled();
    });
    global.it('can detect it not being called', () => {
      global.expect(console.log).not.toHaveBeenCalled();
    });
    global.it('can console a value', () => {
      global.expect(console.log).not.toHaveBeenCalled();

      const target = '1\n2\n3\n4';
      const expected = '2';
      const results = FormatUtils.limitLines(target, 2, 1, '\n');
      global.expect(results).toBe(expected);

      FormatUtils.consoleLines(target, 2, 1, '\n');

      global.expect(console.log).toHaveBeenCalled();
    });
  });
  global.describe('stripHtmlTags', () => {
    global.describe('can remove tags', () => {
      global.it('single tag should be replaced', () => {
        const str = '<br />';
        const expected = '';
        const results = FormatUtils.stripHtmlTags(str);

        global.expect(results).toBe(expected);
      });
      global.it('single tag in text - should be replaced', () => {
        const str = 'hello <br /> there';
        const expected = 'hello  there';
        const results = FormatUtils.stripHtmlTags(str);

        global.expect(results).toBe(expected);
      });
      global.it('paired tags - should be replaced', () => {
        const str = 'I said <b>Hello There</b>';
        const expected = 'I said Hello There';
        const results = FormatUtils.stripHtmlTags(str);

        global.expect(results).toBe(expected);
      });
      global.it('unclosed tags - should be replaced', () => {
        const str = 'I said <b>Hello There';
        const expected = 'I said Hello There';
        const results = FormatUtils.stripHtmlTags(str);

        global.expect(results).toBe(expected);
      });
    });
    global.describe('can leave strings alone', () => {
      global.it('2 + 2 < 5', () => {
        const str = '2 + 2 < 5';
        const expected = '2 + 2 < 5';
        const results = FormatUtils.stripHtmlTags(str);

        global.expect(results).toBe(expected);
      });
      global.it('some example text - should be left alone', () => {
        const str = 'some example text';
        const expected = 'some example text';
        const results = FormatUtils.stripHtmlTags(str);

        global.expect(results).toBe(expected);
      });
      global.it('single_word - should be left alone', () => {
        const str = 'single_word';
        const expected = 'single_word';
        const results = FormatUtils.stripHtmlTags(str);

        global.expect(results).toBe(expected);
      });
      global.it('passes unchanged if null', () => {
        const str = null;
        const expected = null;
        const results = FormatUtils.stripHtmlTags(str);

        global.expect(results).toBe(expected);
      });
      global.it('passes unchanged if undefined', () => {
        const str = undefined;
        const expected = undefined;
        const results = FormatUtils.stripHtmlTags(str);

        global.expect(results).toBe(expected);
      });
    });
  });
  global.describe('wordWrap', () => {
    global.describe('can wrap a string', () => {
      global.describe('short string', () => {
        global.it('with null options', () => {
          const str = '0123456789';
          const options = null;
          const expected = ['0123456789'];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
      });
      global.describe('long string', () => {
        global.it('with null options', () => {
          const str = '012345678901234567890123456789012345678901234567890123456789';
          const options = null;
          const expected = ['012345678901234567890123456789012345678901234567890123456789'];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('with width of 10 - cut', () => {
          const str = '012345678901234567890123456789012345678901234567890123456789';
          const options = { width: 10, cut: true };
          const expected = ['0123456789', '0123456789', '0123456789', '0123456789', '0123456789', '0123456789'];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('with width of 10 - cut not defined', () => {
          const str = '012345678901234567890123456789012345678901234567890123456789';
          const options = { width: 10 };
          const expected = ['012345678901234567890123456789012345678901234567890123456789'];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('with width of 10 - no cut', () => {
          const str = '012345678901234567890123456789012345678901234567890123456789';
          const options = { width: 10, cut: false };
          const expected = ['012345678901234567890123456789012345678901234567890123456789'];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
      });
      global.describe('lorem ipsum', () => {
        global.it('example 1', () => {
          const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
          + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation';
          const options = null;
          const expected = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing',
            'elit, sed do eiusmod tempor incididunt ut labore',
            'et dolore magna aliqua. Ut enim ad minim veniam,',
            'quis nostrud exercitation'
          ];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('example 2', () => {
          const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
          + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation';
          const options = { cut: true, width: 70 };
          const expected = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmo',
            'd tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim',
            'veniam, quis nostrud exercitation'
          ];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('with null options', () => {
          const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
          + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation '
          + 'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in '
          + 'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non '
          + 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
          const options = null;
          const expected = [
            'Lorem ipsum dolor sit amet, consectetur adipiscing',
            'elit, sed do eiusmod tempor incididunt ut labore',
            'et dolore magna aliqua. Ut enim ad minim veniam,',
            'quis nostrud exercitation ullamco laboris nisi ut',
            'aliquip ex ea commodo consequat. Duis aute irure',
            'dolor in reprehenderit in voluptate velit esse',
            'cillum dolore eu fugiat nulla pariatur. Excepteur',
            'sint occaecat cupidatat non proident, sunt in',
            'culpa qui officia deserunt mollit anim id est',
            'laborum.'
          ];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('with width of 30, no cut', () => {
          const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
          + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation '
          + 'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in '
          + 'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non '
          + 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
          const options = { width: 10, cut: false };
          const expected = ['Lorem', 'ipsum', 'dolor sit', 'amet,', 'consectetur', 'adipiscing', 'elit, sed',
            'do eiusmod', 'tempor', 'incididunt', 'ut labore', 'et dolore', 'magna', 'aliqua. Ut', 'enim ad',
            'minim', 'veniam,', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi ut', 'aliquip ex',
            'ea commodo', 'consequat.', 'Duis aute', 'irure', 'dolor in', 'reprehenderit', 'in', 'voluptate',
            'velit esse', 'cillum', 'dolore eu', 'fugiat', 'nulla', 'pariatur.', 'Excepteur', 'sint', 'occaecat',
            'cupidatat', 'non', 'proident,', 'sunt in', 'culpa qui', 'officia', 'deserunt', 'mollit', 'anim id',
            'est', 'laborum.'];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('with width of 30, cut not defined', () => {
          const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
          + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation '
          + 'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in '
          + 'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non '
          + 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
          const options = { width: 10 };
          const expected = ['Lorem', 'ipsum', 'dolor sit', 'amet,', 'consectetur', 'adipiscing', 'elit, sed',
            'do eiusmod', 'tempor', 'incididunt', 'ut labore', 'et dolore', 'magna', 'aliqua. Ut', 'enim ad',
            'minim', 'veniam,', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi ut', 'aliquip ex',
            'ea commodo', 'consequat.', 'Duis aute', 'irure', 'dolor in', 'reprehenderit', 'in', 'voluptate',
            'velit esse', 'cillum', 'dolore eu', 'fugiat', 'nulla', 'pariatur.', 'Excepteur', 'sint', 'occaecat',
            'cupidatat', 'non', 'proident,', 'sunt in', 'culpa qui', 'officia', 'deserunt', 'mollit', 'anim id',
            'est', 'laborum.'];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('with width of 30, cut', () => {
          const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
          + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation '
          + 'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in '
          + 'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non '
          + 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
          const options = { width: 10, cut: true };
          const expected = [
            'Lorem ipsu',
            'm dolor si',
            't amet, co',
            'nsectetur',
            'adipiscing',
            'elit, sed',
            'do eiusmo',
            'd tempor i',
            'ncididunt',
            'ut labore',
            'et dolore',
            'magna aliq',
            'ua. Ut eni',
            'm ad minim',
            'veniam, q',
            'uis nostru',
            'd exercita',
            'tion ullam',
            'co laboris',
            'nisi ut a',
            'liquip ex',
            'ea commodo',
            'consequat',
            '. Duis aut',
            'e irure do',
            'lor in rep',
            'rehenderit',
            'in volupt',
            'ate velit',
            'esse cillu',
            'm dolore e',
            'u fugiat n',
            'ulla paria',
            'tur. Excep',
            'teur sint',
            'occaecat c',
            'upidatat n',
            'on proiden',
            't, sunt in',
            'culpa qui',
            'officia d',
            'eserunt mo',
            'llit anim',
            'id est lab',
            'orum.',
          ];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });

        global.it('with width of 30, trimmed', () => {
          const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
          + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation '
          + 'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in '
          + 'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non '
          + 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
          const options = { width: 10, trim: true };
          const expected = ['Lorem', 'ipsum', 'dolor sit', 'amet,', 'consectetur', 'adipiscing', 'elit, sed',
            'do eiusmod', 'tempor', 'incididunt', 'ut labore', 'et dolore', 'magna', 'aliqua. Ut', 'enim ad',
            'minim', 'veniam,', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi ut', 'aliquip ex',
            'ea commodo', 'consequat.', 'Duis aute', 'irure', 'dolor in', 'reprehenderit', 'in', 'voluptate',
            'velit esse', 'cillum', 'dolore eu', 'fugiat', 'nulla', 'pariatur.', 'Excepteur', 'sint', 'occaecat',
            'cupidatat', 'non', 'proident,', 'sunt in', 'culpa qui', 'officia', 'deserunt', 'mollit', 'anim id',
            'est', 'laborum.'];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('with width of 30, trim not defined', () => {
          const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
          + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation '
          + 'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in '
          + 'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non '
          + 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
          const options = { width: 10 };
          const expected = ['Lorem', 'ipsum', 'dolor sit', 'amet,', 'consectetur', 'adipiscing', 'elit, sed',
            'do eiusmod', 'tempor', 'incididunt', 'ut labore', 'et dolore', 'magna', 'aliqua. Ut', 'enim ad',
            'minim', 'veniam,', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi ut', 'aliquip ex',
            'ea commodo', 'consequat.', 'Duis aute', 'irure', 'dolor in', 'reprehenderit', 'in', 'voluptate',
            'velit esse', 'cillum', 'dolore eu', 'fugiat', 'nulla', 'pariatur.', 'Excepteur', 'sint', 'occaecat',
            'cupidatat', 'non', 'proident,', 'sunt in', 'culpa qui', 'officia', 'deserunt', 'mollit', 'anim id',
            'est', 'laborum.'];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
        global.it('with width of 30, no trim', () => {
          const str = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
          + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation '
          + 'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in '
          + 'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non '
          + 'proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
          const options = { width: 20, trim: false };
          const expected = [
            'Lorem ipsum dolor ',
            'sit amet, ',
            'consectetur ',
            'adipiscing elit, sed ',
            'do eiusmod tempor ',
            'incididunt ut labore ',
            'et dolore magna ',
            'aliqua. Ut enim ad ',
            'minim veniam, quis ',
            'nostrud exercitation ',
            'ullamco laboris nisi ',
            'ut aliquip ex ea ',
            'commodo consequat. ',
            'Duis aute irure ',
            'dolor in ',
            'reprehenderit in ',
            'voluptate velit esse ',
            'cillum dolore eu ',
            'fugiat nulla ',
            'pariatur. Excepteur ',
            'sint occaecat ',
            'cupidatat non ',
            'proident, sunt in ',
            'culpa qui officia ',
            'deserunt mollit anim ',
            'id est laborum.',
          ];

          const results = FormatUtils.wordWrap(str, options);
          global.expect(results).toEqual(expected);
        });
      });
    });
    global.describe('handles non-strings', () => {
      global.it('null', () => {
        const str = undefined;
        const options = null;
        const expected = undefined;

        const results = FormatUtils.wordWrap(str, options);
        global.expect(results).toBe(expected);
      });

      global.it('null', () => {
        const str = null;
        const options = null;
        const expected = null;

        const results = FormatUtils.wordWrap(str, options);
        global.expect(results).toBe(expected);
      });
      global.it('number 4', () => {
        const str = 4;
        const options = null;
        const expected = 4;

        const results = FormatUtils.wordWrap(str, options);
        global.expect(results).toBe(expected);
      });
      global.it('emptyString', () => {
        const str = '';
        const options = null;
        const expected = '';

        const results = FormatUtils.wordWrap(str, options);
        global.expect(results).toBe(expected);
      });
    });
  });

  global.describe('lineCount', () => {
    global.describe('for non strings', () => {
      global.it('undefined', () => {
        const str = undefined;
        const newLine = null;
        const expected = 0;
        const result = FormatUtils.lineCount(str, newLine);

        global.expect(result).toEqual(expected);
      });
      global.it('null', () => {
        const str = null;
        const newLine = null;
        const expected = 0;
        const result = FormatUtils.lineCount(str, newLine);

        global.expect(result).toEqual(expected);
      });
      global.it('number 4', () => {
        const str = 4;
        const newLine = null;
        const expected = 0;
        const result = FormatUtils.lineCount(str, newLine);

        global.expect(result).toEqual(expected);
      });
    });
    global.describe('can count lines', () => {
      global.it('example 1', () => {
        const str = 'single line';
        const expected = 1;
        const results = FormatUtils.lineCount(str);
        global.expect(results).toBe(expected);
      });
      global.it('example 2', () => {
        const str = `line 1
          line 2
          line 3`;
        const expected = 3;
        const results = FormatUtils.lineCount(str);
        global.expect(results).toBe(expected);
      });
      global.describe('default newline', () => {
        global.it('one line', () => {
          const str = 'line1';
          const newLine = null;
          const expected = 1;
          const result = FormatUtils.lineCount(str, newLine);

          global.expect(result).toEqual(expected);
        });
        global.it('one line, no newline', () => {
          const str = 'line1';
          const expected = 1;
          const result = FormatUtils.lineCount(str);

          global.expect(result).toEqual(expected);
        });
        global.it('two line', () => {
          const str = 'line1\nline2';
          const newLine = null;
          const expected = 2;
          const result = FormatUtils.lineCount(str, newLine);

          global.expect(result).toEqual(expected);
        });
        global.it('one line, no newline', () => {
          const str = 'line1\nline2';
          const expected = 2;
          const result = FormatUtils.lineCount(str);

          global.expect(result).toEqual(expected);
        });
      });
      global.describe('\\n', () => {
        global.it('one line', () => {
          const str = 'line1';
          const newLine = '\n';
          const expected = 1;
          const result = FormatUtils.lineCount(str, newLine);

          global.expect(result).toEqual(expected);
        });
        global.it('one line, no newline', () => {
          const str = 'line1';
          const expected = 1;
          const result = FormatUtils.lineCount(str);

          global.expect(result).toEqual(expected);
        });
        global.it('two line', () => {
          const str = 'line1\nline2';
          const newLine = '\n';
          const expected = 2;
          const result = FormatUtils.lineCount(str, newLine);

          global.expect(result).toEqual(expected);
        });
        global.it('one line, no newline', () => {
          const str = 'line1\nline2';
          const expected = 2;
          const result = FormatUtils.lineCount(str);

          global.expect(result).toEqual(expected);
        });
      });
      global.describe('\\r', () => {
        global.it('one line', () => {
          const str = 'line1';
          const newLine = '\r';
          const expected = 1;
          const result = FormatUtils.lineCount(str, newLine);

          global.expect(result).toEqual(expected);
        });
        global.it('two line', () => {
          const str = 'line1\rline2';
          const newLine = '\r';
          const expected = 2;
          const result = FormatUtils.lineCount(str, newLine);

          global.expect(result).toEqual(expected);
        });
      });
      global.describe('\\r\\n', () => {
        global.it('one line', () => {
          const str = 'line1';
          const newLine = '\r\n';
          const expected = 1;
          const result = FormatUtils.lineCount(str, newLine);

          global.expect(result).toEqual(expected);
        });
        global.it('two line', () => {
          const str = 'line1\r\nline2';
          const newLine = '\r\n';
          const expected = 2;
          const result = FormatUtils.lineCount(str, newLine);

          global.expect(result).toEqual(expected);
        });
        global.it('three line', () => {
          const str = 'line1\r\nline2\r\nline3';
          const newLine = '\r\n';
          const expected = 3;
          const result = FormatUtils.lineCount(str, newLine);

          global.expect(result).toEqual(expected);
        });
      });
    });
  });
  global.describe('mapArrayDomain', () => {
    global.describe('canMap', () => {
      global.describe('outside the domain', () => {
        global.it('below the minim', () => {
          const expected = 0;
          const val = -0.5;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('above the maximum', () => {
          const expected = 4;
          const val = 1.2;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('exactly at the minimum', () => {
          const expected = 0;
          const val = 0;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('exactly at the maximum', () => {
          const expected = 4;
          const val = 1;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
      });
      global.describe('with a custom boundaries', () => {
        global.describe('domain from [1,6]', () => {
          global.it('below the minim', () => {
            const expected = 0;
            const val = 0.9;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('at the minim', () => {
            const expected = 0;
            const val = 1;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('just above minimum', () => {
            const expected = 0;
            const val = 1.00001;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('middle of first cutoff', () => {
            const expected = 0;
            const val = 1.5;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right before first cutoff', () => {
            const expected = 0;
            const val = 1.999;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('exactly at the first cutoff', () => {
            const expected = 1;
            const val = 2;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right after first cutoff', () => {
            const expected = 1;
            const val = 2.000001;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right before last cutoff', () => {
            const expected = 3;
            const val = 4.9999;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('exactly at the last cutoff', () => {
            const expected = 4;
            const val = 5;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right after last cutoff', () => {
            const expected = 4;
            const val = 5.0001;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right before max', () => {
            const expected = 4;
            const val = 5.999999999;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('at the max', () => {
            const expected = 4;
            const val = 6;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('above the max', () => {
            const expected = 4;
            const val = 6.1;
            const domainRange = [1, 6];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
        });
        global.describe('domain from [0,5]', () => {
          global.it('below the minim', () => {
            const expected = 0;
            const val = -0.1;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('at the minim', () => {
            const expected = 0;
            const val = 0;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('just above minimum', () => {
            const expected = 0;
            const val = 0.00001;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('middle of first cutoff', () => {
            const expected = 0;
            const val = 0.5;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right before first cutoff', () => {
            const expected = 0;
            const val = 0.999;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('exactly at the first cutoff', () => {
            const expected = 1;
            const val = 1;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right after first cutoff', () => {
            const expected = 1;
            const val = 1.000001;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right in the middle', () => {
            const expected = 2;
            const val = 2.5;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right before last cutoff', () => {
            const expected = 3;
            const val = 3.9999;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('exactly at the last cutoff', () => {
            const expected = 4;
            const val = 4;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right after last cutoff', () => {
            const expected = 4;
            const val = 4.0001;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('right before max', () => {
            const expected = 4;
            const val = 4.999999999;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('at the max', () => {
            const expected = 4;
            const val = 5;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
          global.it('above the max', () => {
            const expected = 4;
            const val = 5.1;
            const domainRange = [0, 5];
            const targetArray = [0, 1, 2, 3, 4];
            const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
            global.expect(results).toBe(expected);
          });
        });
      });
      global.describe('with default boundaries', () => {
        global.it('below the minim', () => {
          const expected = 0;
          const val = -0.0001;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('at the minim', () => {
          const expected = 0;
          const val = 0;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('just above minimum', () => {
          const expected = 0;
          const val = 0.00001;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('middle of first cutoff', () => {
          const expected = 0;
          const val = 0.15;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('right before first cutoff', () => {
          const expected = 0;
          const val = 0.1999;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('exactly at the first cutoff', () => {
          const expected = 1;
          const val = 0.2;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('right after first cutoff', () => {
          const expected = 1;
          const val = 0.2000001;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('right before last cutoff', () => {
          const expected = 3;
          const val = 0.79999;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('exactly at the last cutoff', () => {
          const expected = 4;
          const val = 5;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('right after last cutoff', () => {
          const expected = 4;
          const val = 0.8001;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('right before max', () => {
          const expected = 4;
          const val = 0.9999;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('at the max', () => {
          const expected = 4;
          const val = 1;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray);
          global.expect(results).toBe(expected);
        });
        global.it('above the max', () => {
          const expected = 4;
          const val = 1.001;
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, null);
          global.expect(results).toBe(expected);
        });
      });
      global.describe('within the boundaries', () => {
        global.it('just above minimum', () => {
          const expected = 0;
          const val = 0.00001;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('middle of first cutoff', () => {
          const expected = 0;
          const val = 0.1;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('right before first cutoff', () => {
          const expected = 0;
          const val = 0.1999;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('exactly at the first cutoff', () => {
          const expected = 1;
          const val = 0.2;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('right after first cutoff', () => {
          const expected = 1;
          const val = 0.200001;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('right before last cutoff', () => {
          const expected = 3;
          const val = 0.7999;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('exactly at the last cutoff', () => {
          const expected = 4;
          const val = 0.8;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('right after first cutoff', () => {
          const expected = 4;
          const val = 0.800001;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
        global.it('right before max', () => {
          const expected = 4;
          const val = 0.999999999;
          const domainRange = [0, 1];
          const targetArray = [0, 1, 2, 3, 4];
          const results = FormatUtils.mapArrayDomain(val, targetArray, domainRange);
          global.expect(results).toBe(expected);
        });
      });
    });
    global.describe('cannot map', () => {
      global.it('if the target array is not an array', () => {
        const expected = 'mapArrayDomain: targetArray is not an array';
        const val = 0.5;
        const domainRange = [0, 1];
        // const targetArray = [0, 1, 2, 3, 4];
        const targetArray = 2;
        global.expect(() => FormatUtils.mapArrayDomain(val, targetArray, domainRange))
          .toThrow(expected);
      });
      global.it('if the target array is null', () => {
        const expected = 'mapArrayDomain: targetArray is not an array';
        const val = 0.5;
        const domainRange = [0, 1];
        // const targetArray = [0, 1, 2, 3, 4];
        const targetArray = null;
        global.expect(() => FormatUtils.mapArrayDomain(val, targetArray, domainRange))
          .toThrow(expected);
      });
      global.it('if the target array is null', () => {
        const expected = 'mapArrayDomain: targetArray is not a populated array';
        const val = 0.5;
        const domainRange = [0, 1];
        // const targetArray = [0, 1, 2, 3, 4];
        const targetArray = [];
        global.expect(() => FormatUtils.mapArrayDomain(val, targetArray, domainRange))
          .toThrow(expected);
      });
    });
  });

  global.describe('replaceStrings', () => {
    global.describe('can replace', () => {
      global.describe('a set of strings', () => {
        global.describe('with an array', () => {
          global.it('of strings', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = [['jack', 'john'], ['jill', 'ringo']];
            const expected = [
              'john and ringo went up the hill',
              'to fetch the pail of water',
              'john fell down and broke his crown',
              'and ringo came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('of strings with nulls', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              null,
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = [['jack', 'john'], ['jill', 'ringo']];
            const expected = [
              'john and ringo went up the hill',
              null,
              'john fell down and broke his crown',
              'and ringo came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('of strings with unexpected replace values', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              null,
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = [['jack', 'john'], ['jill', 'ringo'], 23];
            const expected = [
              'john and ringo went up the hill',
              null,
              'john fell down and broke his crown',
              'and ringo came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('of regexp', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = [[/JACK/i, 'john'], [/\s+jill/, ' ringo']];
            const expected = [
              'john and ringo went up the hill',
              'to fetch the pail of water',
              'john fell down and broke his crown',
              'and ringo came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with empty', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = [['down ', '']];
            const expected = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell and broke his crown',
              'and jill came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with undefined', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = [['down ']];
            const expected = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell and broke his crown',
              'and jill came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with null', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = [['down ', null]];
            const expected = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell and broke his crown',
              'and jill came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with a 1d array', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = ['down '];
            const expected = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell and broke his crown',
              'and jill came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with a longer 1d array', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = ['down ', ' of water'];
            const expected = [
              'jack and jill went up the hill',
              'to fetch the pail',
              'jack fell and broke his crown',
              'and jill came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('mixed', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = [['jack', 'john'], [/\s+jill/i, ' ringo'], ' down'];
            const expected = [
              'john and ringo went up the hill',
              'to fetch the pail of water',
              'john fell and broke his crown',
              'and ringo came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
        });
        global.describe('with a map', () => {
          global.it('of strings', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = new Map([['jack', 'john'], ['jill', 'ringo']]);
            const expected = [
              'john and ringo went up the hill',
              'to fetch the pail of water',
              'john fell down and broke his crown',
              'and ringo came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with empty', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = new Map([['down ', '']]);
            const expected = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell and broke his crown',
              'and jill came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with undefined', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = new Map([['down ', undefined]]);
            const expected = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell and broke his crown',
              'and jill came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with null', () => {
            const targetStrings = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell down and broke his crown',
              'and jill came tumbling after'
            ];
            const replaceValues = new Map([['down ', null]]);
            const expected = [
              'jack and jill went up the hill',
              'to fetch the pail of water',
              'jack fell and broke his crown',
              'and jill came tumbling after'
            ];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
        });
      });
      global.describe('a single string', () => {
        global.describe('with an array', () => {
          global.it('of strings', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['jack', 'john'], ['jill', 'ringo']];
            const expected = ['john and ringo went up the hill to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('of strings with nulls', () => {
            const targetStrings = null;
            const replaceValues = [['jack', 'john'], ['jill', 'ringo']];
            const expected = [];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('of strings with unexpected replace values', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['jack', 'john'], ['jill', 'ringo'], 23];
            const expected = ['john and ringo went up the hill to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('of regexp', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [[/JACK/i, 'john'], [/\s+jill/, ' ringo']];
            const expected = ['john and ringo went up the hill to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with empty', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['down ', '']];
            const expected = ['jack and jill went up the hill to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with undefined', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['down ']];
            const expected = ['jack and jill went up the hill to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with null', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['down ', null]];
            const expected = ['jack and jill went up the hill to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with a 1d array', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = ['down '];
            const expected = ['jack and jill went up the hill to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with a longer 1d array', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [' the hill', ' of water'];
            const expected = ['jack and jill went up to fetch the pail'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('mixed', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['jack', 'john'], [/\s+jill/i, ' ringo'], ' the hill'];
            const expected = ['john and ringo went up to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
        });
        global.describe('with a map', () => {
          global.it('of strings', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = new Map([['jack', 'john'], ['jill', 'ringo']]);
            const expected = ['john and ringo went up the hill to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with empty', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = new Map([[' the hill', '']]);
            const expected = ['jack and jill went up to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with undefined', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = new Map([[' the hill', undefined]]);
            const expected = ['jack and jill went up to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with null', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = new Map([[' the hill', null]]);
            const expected = ['jack and jill went up to fetch the pail of water'];
            const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
        });
      });
    });
    global.describe('cannot replace', () => {
      global.it('do nothing if not passed an array or map', () => {
        const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
        const replaceValues = null;
        const expected = ['jack and jill went up the hill to fetch the pail of water'];
        const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('of strings', () => {
        const targetStrings = [
          'jack and jill went up the hill',
          'to fetch a pail of water',
          'jack fell down and broke his crown',
          'and jill came tumbling after'
        ];
        const replaceValues = [[/.+/], ['jack', 'john']];
        const expected = [
          '',
          '',
          '',
          ''
        ];
        const results = FormatUtils.replaceStrings(targetStrings, replaceValues);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });

  global.describe('replaceString', () => {
    global.describe('can replace', () => {
      global.describe('a single string', () => {
        global.describe('with an array', () => {
          global.it('of strings', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['jack', 'john'], ['jill', 'ringo']];
            const expected = 'john and ringo went up the hill to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('of strings with nulls', () => {
            const targetStrings = null;
            const replaceValues = [['jack', 'john'], ['jill', 'ringo']];
            const expected = null;
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('of strings with unexpected replace values', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['jack', 'john'], ['jill', 'ringo'], 23];
            const expected = 'john and ringo went up the hill to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('of regexp', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [[/JACK/i, 'john'], [/\s+jill/, ' ringo']];
            const expected = 'john and ringo went up the hill to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with empty', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['down ', '']];
            const expected = 'jack and jill went up the hill to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with undefined', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['down ']];
            const expected = 'jack and jill went up the hill to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with null', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['down ', null]];
            const expected = 'jack and jill went up the hill to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with a 1d array', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = ['down '];
            const expected = 'jack and jill went up the hill to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with a longer 1d array', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [' the hill', ' of water'];
            const expected = 'jack and jill went up to fetch the pail';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('mixed', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = [['jack', 'john'], [/\s+jill/i, ' ringo'], ' the hill'];
            const expected = 'john and ringo went up to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
        });
        global.describe('with a map', () => {
          global.it('of strings', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = new Map([['jack', 'john'], ['jill', 'ringo']]);
            const expected = 'john and ringo went up the hill to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove strings with empty', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = new Map([[' the hill', '']]);
            const expected = 'jack and jill went up to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with undefined', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = new Map([[' the hill', undefined]]);
            const expected = 'jack and jill went up to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
          global.it('remove 2d strings with null', () => {
            const targetStrings = 'jack and jill went up the hill to fetch the pail of water';
            const replaceValues = new Map([[' the hill', null]]);
            const expected = 'jack and jill went up to fetch the pail of water';
            const results = FormatUtils.replaceString(targetStrings, replaceValues);
            global.expect(results).toStrictEqual(expected);
          });
        });
      });
    });
    global.describe('cannot replace', () => {
      global.it('an array of strings', () => {
        const targetStrings = [
          'jack and jill went up the hill',
          'to fetch the pail of water',
          'jack fell down and broke his crown',
          'and jill came tumbling after'
        ];
        const replaceValues = [['jack', 'john'], ['jill', 'ringo']];
        const expected = 'replaceString(targetStr, stringTupletsOrMap): targetStr was sent an array - please use replaceStrings instead';
        global.expect(() => FormatUtils.replaceString(targetStrings, replaceValues)).toThrow(expected);
      });
      global.it('do nothing if not passed an array or map', () => {
        const targetStrings = 'jack and jill went up the hill to fetch the pail of water '
          + 'jack fell down and broke his crown and jill came tumbling after';
        const replaceValues = 23;
        const expected = 'jack and jill went up the hill to fetch the pail of water '
          + 'jack fell down and broke his crown and jill came tumbling after';
        const results = FormatUtils.replaceString(targetStrings, replaceValues);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('of strings', () => {
        const targetStrings = 'jack and jill went up the hill';
        const replaceValues = [[/.+/], ['jack', 'john']];
        const expected = '';
        const results = FormatUtils.replaceString(targetStrings, replaceValues);
        global.expect(results).toStrictEqual(expected);
      });
    });
  });
});

global.describe('extractWords', () => {
  global.describe('can extract', () => {
    global.describe('english', () => {
      global.it('single sentence', () => {
        const strs = 'I am Modern "major-general".';
        const expected = ['I', 'am', 'Modern', 'major', 'general'];
        const results = FormatUtils.extractWords(strs);
        global.expect(results).toEqual(expected);
      });
      global.it('single sentence with hypen', () => {
        const strs = 'I am Modern "major-general".';
        const additionalNonBreakingCharacters = '-';
        const expected = ['I', 'am', 'Modern', 'major-general'];
        const results = FormatUtils.extractWords(strs, additionalNonBreakingCharacters);
        global.expect(results).toEqual(expected);
      });
      global.it('multiple sentences', () => {
        const strs = ['I am Modern "major-general"', 'I have information animal, vegitable and mineral'];
        const additionalNonBreakingCharacters = '-';
        const expected = ['I', 'am', 'Modern', 'major-general', 'I', 'have', 'information', 'animal', 'vegitable', 'and', 'mineral'];
        const results = FormatUtils.extractWords(strs, additionalNonBreakingCharacters);
        global.expect(results).toEqual(expected);
      });
    });
    global.describe('spanish', () => {
      global.it('single sentence', () => {
        const strs = 'Las versalitas (letras mayúsculas de tamaño igual a las minúsculas)';
        const expected = ['Las', 'versalitas', 'letras', 'mayúsculas', 'de', 'tamaño', 'igual', 'a', 'las', 'minúsculas'];
        const results = FormatUtils.extractWords(strs);
        global.expect(results).toEqual(expected);
      });
      global.it('single sentence with hypen', () => {
        const strs = 'Las versalitas (letras mayúsculas de tamaño igual a las min-úsculas).';
        const additionalNonBreakingCharacters = '-';
        const expected = ['Las', 'versalitas', 'letras', 'mayúsculas', 'de', 'tamaño', 'igual', 'a', 'las', 'min-úsculas'];
        const results = FormatUtils.extractWords(strs, additionalNonBreakingCharacters);
        global.expect(results).toEqual(expected);
      });
      global.it('multiple sentences', () => {
        const strs = ['Las versalitas (letras mayúsculas de tamaño igual a las minúsculas)',
          'han sido sustituidas por letras mayúsculas de tamaño normal.'];
        const additionalNonBreakingCharacters = '-';
        const expected = ['Las', 'versalitas', 'letras', 'mayúsculas', 'de', 'tamaño', 'igual', 'a', 'las', 'minúsculas',
          'han', 'sido', 'sustituidas', 'por', 'letras', 'mayúsculas', 'de', 'tamaño', 'normal'];
        const results = FormatUtils.extractWords(strs, additionalNonBreakingCharacters);
        global.expect(results).toEqual(expected);
      });
    });
    global.describe('arabic', () => {
      global.it('single sentence', () => {
        const strs = 'إنه الكتاب الألكتروني ';
        const expected = ['إنه', 'الكتاب', 'الألكتروني'];
        const results = FormatUtils.extractWords(strs);
        global.expect(results).toEqual(expected);
      });
      global.it('multiple sentences', () => {
        const strs = ['إنه الكتاب الألكتروني', 'الاختراع، ومايكل هارت'];
        const additionalNonBreakingCharacters = '-';
        const expected = ['إنه', 'الكتاب', 'الألكتروني', 'الاختراع', 'ومايكل', 'هارت'];
        const results = FormatUtils.extractWords(strs, additionalNonBreakingCharacters);
        global.expect(results).toEqual(expected);
      });
    });
    global.it('docs example', () => {
      const strs = ['letras mayúsculas de tamaño igual a las minúsculas',
        'الاختراع، ومايكل هارت'];
      const expected = [
        'letras',
        'mayúsculas',
        'de',
        'tamaño',
        'igual',
        'a',
        'las',
        'minúsculas',
        'الاختراع',
        'ومايكل',
        'هارت'
      ];
      const results = FormatUtils.extractWords(strs);
      global.expect(results).toEqual(expected);
    });
  });
  //إنه الكتاب الألكتروني "eBook".. الاختراع، ومايكل هارت Michael S Hart"".. المخترع..
  //Svako ima pravo na školovanje. Školovanje treba da bude besplatno bar u osnovnim i nižim školama. Osnovna nastava je obavezna. Tehnička i stručna nastava treba da bude opšte dostupna, a viša nastava treba da bude svima podjednako pristupačna na osnovu utvrdjenih kriterijuma.
  global.describe('cannot extract', () => {
    global.it('if not passed a string', () => {
      const strs = 23;
      const additionalNonBreakingCharacters = null;
      // const expected = 'something';
      global.expect(() => FormatUtils.extractWords(strs, additionalNonBreakingCharacters))
        .toThrow();
    });
    global.it('cannot extract from undefined', () => {
      const strs = undefined;
      const expected = undefined;
      const results = FormatUtils.extractWords(strs);
      global.expect(results).toEqual(expected);
    });
    global.it('cannot extract from null', () => {
      const strs = null;
      const expected = null;
      const results = FormatUtils.extractWords(strs);
      global.expect(results).toEqual(expected);
    });
    global.it('cannot extract from null in array', () => {
      const strs = ['four score', 'and seven years ago', undefined, null, 'something something'];
      const expected = ['four', 'score', 'and', 'seven', 'years', 'ago', 'something', 'something'];
      const results = FormatUtils.extractWords(strs);
      global.expect(results).toEqual(expected);
    });
  });
});
