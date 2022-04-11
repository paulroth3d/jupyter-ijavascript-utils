const LoggerUtil = require('../logger');

global.describe('logger', () => {
  global.describe('Log Levels', () => {
    global.it('has log level ERROR_LEVEL_NONE', () => {
      global.expect(LoggerUtil.ERROR_LEVEL_NONE).not.toBeNull();
      global.expect(LoggerUtil.ERROR_LEVEL_NONE).not.toBeUndefined();
    });
    global.it('has log level ERROR_LEVEL_BASIC', () => {
      global.expect(LoggerUtil.ERROR_LEVEL_BASIC).not.toBeNull();
      global.expect(LoggerUtil.ERROR_LEVEL_BASIC).not.toBeUndefined();
    });
    global.it('has log level ERROR_LEVEL_DETAIL', () => {
      global.expect(LoggerUtil.ERROR_LEVEL_DETAIL).not.toBeNull();
      global.expect(LoggerUtil.ERROR_LEVEL_DETAIL).not.toBeUndefined();
    });
    global.it('Log Levels are Unique', () => {
      //global.expect(LoggerUtil.ERROR_LEVEL_NONE).not.toBe(LoggerUtil.ERROR_LEVEL_NONE);
      global.expect(LoggerUtil.ERROR_LEVEL_NONE).not.toBe(LoggerUtil.ERROR_LEVEL_BASIC);
      global.expect(LoggerUtil.ERROR_LEVEL_NONE).not.toBe(LoggerUtil.ERROR_LEVEL_DETAIL);

      global.expect(LoggerUtil.ERROR_LEVEL_BASIC).not.toBe(LoggerUtil.ERROR_LEVEL_NONE);
      //global.expect(LoggerUtil.ERROR_LEVEL_BASIC).not.toBe(LoggerUtil.ERROR_LEVEL_BASIC);
      global.expect(LoggerUtil.ERROR_LEVEL_BASIC).not.toBe(LoggerUtil.ERROR_LEVEL_DETAIL);

      global.expect(LoggerUtil.ERROR_LEVEL_DETAIL).not.toBe(LoggerUtil.ERROR_LEVEL_NONE);
      global.expect(LoggerUtil.ERROR_LEVEL_DETAIL).not.toBe(LoggerUtil.ERROR_LEVEL_BASIC);
      //global.expect(LoggerUtil.ERROR_LEVEL_DETAIL).not.toBe(LoggerUtil.ERROR_LEVEL_DETAIL);
    });
  });

  global.describe('setOptions', () => {
    global.describe('uses process.env', () => {
      const ORIGINAL_ENV = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...ORIGINAL_ENV };
      });

      afterAll(() => {
        process.env = ORIGINAL_ENV;
      });

      global.it('uses basic if no TRACE_LEVEL found', () => {
        LoggerUtil.setOptions({});

        global.expect(LoggerUtil.traceLevel).toBe(LoggerUtil.ERROR_LEVEL_BASIC);
      });

      global.it('uses TRACE_LEVEL', () => {
        process.env.TRACE_LEVEL = LoggerUtil.ERROR_LEVEL_NONE;

        LoggerUtil.setOptions({});

        global.expect(LoggerUtil.traceLevel).toBe(LoggerUtil.ERROR_LEVEL_NONE);
      });

      global.it('does not use TRACE_LEVEL if not an integer', () => {
        process.env.TRACE_LEVEL = 'A';

        LoggerUtil.setOptions({});

        global.expect(LoggerUtil.traceLevel).not.toBe('A');
      });
    });
  });
});
