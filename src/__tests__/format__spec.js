/* eslint-disable max-len */

const FormatUtils = require('../format');

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
});
