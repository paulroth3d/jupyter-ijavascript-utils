// const codeBlockHelper = require('../codeBlockHelper');
// const ijsUtils = require('../ijsUtils');

//-- unfortunately iJavaScript has a problem that we have to work with global variables.
// const jest = require('jest');

// const { UNIT_CHANNELS } = require('vega-lite/build/src/channel');
const IJSUtils = require('../ijs');

// eslint-disable-next-line no-unused-vars
const FileUtil = require('../file');
// const { prepare } = require('@svgdotjs/svg.js');

const removeIJSContext = () => {
  delete global.$$;
};

const createNewDisplay = (name) => {
  const valueFn = jest.fn((value) => `display:${name}:${(value)}`);
  const newDisplay = ({
    async: () => {},
    text: valueFn,
    png: valueFn,
    svg: valueFn,
    html: valueFn,
    jpg: valueFn,
    mime: valueFn,
    sendResults: valueFn
  });
  return newDisplay;
};

const prepareIJSContext = () => {
  const newContext = ({
    ...createNewDisplay(),
    createDisplay: createNewDisplay,
    sendResult: () => {}
  });
  global.$$ = newContext;

  global.console = ({
    error: jest.fn(),
    log: jest.fn(),
    warn: jest.fn()
  });
};

global.describe('codeBlockHelper', () => {
  const ORIGINAL_CONSOLE = global.console;

  global.beforeEach(() => {
    prepareIJSContext();
  });
  global.afterEach(() => {
    removeIJSContext();
  });
  global.afterAll(() => {
    global.console = ORIGINAL_CONSOLE;
  });
  global.describe('test setup', () => {
    global.it('normally has the IJavaScript context', () => {
      global.expect(1 + 2).toBe(3);
      global.expect(global.$$).not.toBeNull();
      global.expect(typeof global.$$.text).toBe('function');
    });
    global.it('doesnt have the context if told', () => {
      removeIJSContext();
      global.expect(global.$$).toBeFalsy();
    });
    global.it('normally has the IJavaScript context again', () => {
      global.expect(global.$$).not.toBeNull();
    });
  });
  global.describe('detectIJS', () => {
    global.it('detects ijscontext', () => {
      const result = IJSUtils.detectContext();
      global.expect(result).not.toBeNull();
    });

    global.it('detects ijscontext if not', () => {
      removeIJSContext();
      const result = IJSUtils.detectContext();
      global.expect(result).toBeNull();
    });
  });

  global.describe('detectIJS', () => {
    global.it('detects ijscontext', () => {
      const result = IJSUtils.detectIJS();
      global.expect(result).toBeTruthy();
    });

    global.it('detects ijscontext if not', () => {
      removeIJSContext();
      const result = IJSUtils.detectIJS();
      global.expect(result).toBeFalsy();
    });
  });

  global.describe('markdown', () => {
    global.it('prints markdown if in IJSContext', () => {
      try {
        IJSUtils.markdown('# Test');
      } catch (err) {
        global.expect(err).toBeNull();
      }
    });
    global.it('prints markdown if in IJSContext', () => {
      try {
        IJSUtils.markdown('# Test', global.$$);
      } catch (err) {
        global.expect(err).toBeNull();
      }
    });

    global.it('does not prints markdown if not in IJSContext', () => {
      removeIJSContext();
      try {
        IJSUtils.markdown('# Test');
      } catch (err) {
        global.expect(err).toBeNull();
      }
    });
    global.it('does not prints markdown if not in IJSContext', () => {
      removeIJSContext();
      try {
        IJSUtils.markdown('# Test', global.$$);
      } catch (err) {
        global.expect(err).toBeNull();
      }
    });
  });

  global.describe('listGlobals', () => {
    global.it('lists $$', () => {
      const results = IJSUtils.listGlobals();
      global.expect(results).toContain('$$');
    });
  });

  global.describe('listStatic', () => {
    global.it('lists listStatic', () => {
      const results = IJSUtils.listStatic(IJSUtils);
      const listStatic = results.filter((r) => r.name === 'listStatic')[0];

      const expected = ({
        constructor: 'Function',
        isMethod: true,
        name: 'listStatic',
        type: 'function'
      });
      global.expect(listStatic).toStrictEqual(expected);
    });
    global.it('returns empty if no object is sent', () => {
      const expected = [];
      const results = IJSUtils.listStatic(null);
      global.expect(results).toEqual(expected);
    });
  });

  global.describe('async', () => {
    global.it('normally has the IJavaScript context', () => {
      global.expect(1 + 2).toBe(3);
      global.expect(global.$$).not.toBeNull();
      global.expect(typeof global.$$.text).toBe('function');
    });
    global.it('can spy on the display', () => {
      global.expect(global.$$).toBeTruthy();
      global.expect(jest).toBeTruthy();

      const sendResultsSpy = jest.spyOn(global.$$, 'sendResults');

      global.expect(sendResultsSpy).not.toHaveBeenCalled();

      global.$$.sendResults(2);

      global.expect(sendResultsSpy).toHaveBeenCalled();
      global.expect(sendResultsSpy.mock.calls[0]).toEqual([2]);
    });
    global.it('throws an error if not in ijs', (done) => {
      global.expect(global.$$).not.toBeNull();

      removeIJSContext();
      global.expect(global.$$).toBeUndefined();

      let result;
      IJSUtils.await()
        .then(() => {
          result = 'no exception thrown';
        })
        .catch(() => {
          result = 'Exception';
        })
        .finally(() => {
          global.expect(result).toBe('Exception');
          done();
        });
    });
    global.it('has n error if the function passed had an error', () => {
      let result;
      IJSUtils.await(() => {
        throw Error('some exception');
      })
        .then(() => {
          result = 'no exception thrown';
        })
        .catch(() => {
          result = 'exception';
        })
        .finally(() => {
          global.expect(result).toBe('no exception thrown');
        });
    });
    global.it('can send a result after an async function', (done) => {
      // const sendResultsSpy = jest.spyOn(global.$$, 'sendResults');

      IJSUtils.await(async ($$, console) => {
        global.expect($$).toBeTruthy();
        global.expect(console).toBeTruthy();

        global.expect($$).toBe(global.$$);
        global.expect(console).toBe(global.console);

        //-- after the call, $$.sendResult will be sent
        //-- unsure how to test

        done();
      });
    });
  });
  global.describe('async console', () => {
    global.it('can console, but still pass through values', (done) => {
      // eslint-disable-next-line no-unused-vars
      const consoleLogSpy = jest.spyOn(global.console, 'log')
        .mockImplementation(() => {});
      
      Promise.resolve(100)
        .then(IJSUtils.asyncConsole('log message'))
        .then((results) => {
          global.expect(results).toBe(100);
          done();
        });
    });
    global.it('can console', (done) => {
      const consoleLogSpy = jest.spyOn(global.console, 'log')
        .mockImplementation(() => {});

      Promise.resolve(100)
        .then(IJSUtils.asyncConsole('log message'))
        .then((results) => {
          global.expect(consoleLogSpy).toHaveBeenCalled();
          global.expect(consoleLogSpy.mock.calls[0]).toEqual(['log message']);
          done();
        });
    });
  });
  global.describe('async wait', () => {
    // global.beforeEach(() => {
    //   jest.useFakeTimers();
    // })
    // global.afterEach(() => {
    //   jest.useRealTimers();
    // });
    global.it('can wait, and pass through values', (done) => {
      Promise.resolve(100)
        .then(IJSUtils.asyncWait(0))
        .then((results) => {
          global.expect(results).toBe(100);
          done();
        });
      
      //-- seems not to work with fake timers
      // jest.runAllTimers();

      //-- so the timeout is set to 0 instead
    });

    global.it('throws an error if not in iJavaScript', () => {
      //-- @TODO
      //-- (because it uses async AND it works in global,
      //-- every way I've tried to do this fails other tests...)
    });
  });

  global.describe('noOutputNeeded', () => {
    global.it('writes to text', () => {
      prepareIJSContext();
      try {
        IJSUtils.noOutputNeeded('some text');
      } catch (err) {
        global.expect(err).toBeNull();
      }
      global.expect(global.$$.text).toHaveBeenCalled();
    });
    global.it('prints the information provided', () => {
      prepareIJSContext();
      IJSUtils.noOutputNeeded('some text');
      global.expect(global.$$.text).toHaveBeenCalled();
      global.expect(global.$$.text).toHaveBeenCalledWith('some text');
    });
    global.it('writes to text even with no arguments', () => {
      prepareIJSContext();
      IJSUtils.noOutputNeeded();
      global.expect(global.$$.text).toHaveBeenCalled();
    });
    global.it('still works even without IJS context', () => {
      removeIJSContext();
      try {
        IJSUtils.noOutputNeeded();
      } catch (err) {
        global.expect(err).toBeNull();
      }
    });
  });

  global.describe('initializePageBreaks', () => {
    global.it('works even if no ijs context', () => {
      removeIJSContext();
      try {
        IJSUtils.initializePageBreaks();
      } catch (err) {
        global.expect(err).toBeNull();
      }
    });
    global.describe('works with ijs context', () => {
      global.it('calls html', () => {
        prepareIJSContext();
        IJSUtils.initializePageBreaks();
        global.expect(global.$$.html).toHaveBeenCalled();
      });
      global.it('calls html with page break', () => {
        prepareIJSContext();
        IJSUtils.initializePageBreaks();
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
        global.expect(global.$$.html.mock).toBeTruthy();
        global.expect(global.$$.html.mock.calls).toBeTruthy();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const args = global.$$.html.mock.calls[0];

        const [argText] = args;
        global.expect(argText).toContain('page-break-before');
      });
    });
  });

  global.describe('printPageBreak', () => {
    global.it('works even if no ijs context', () => {
      removeIJSContext();
      try {
        IJSUtils.printPageBreak();
      } catch (err) {
        global.expect(err).toBeNull();
      }
    });
    global.describe('works with ijs context', () => {
      global.it('calls html', () => {
        prepareIJSContext();
        IJSUtils.printPageBreak();
        global.expect(global.$$.html).toHaveBeenCalled();
      });
      global.it('calls html with page break', () => {
        prepareIJSContext();
        IJSUtils.printPageBreak();
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
        global.expect(global.$$.html.mock).toBeTruthy();
        global.expect(global.$$.html.mock.calls).toBeTruthy();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const args = global.$$.html.mock.calls[0];

        const [argText] = args;
        global.expect(argText).toContain('pagebreak');
      });
    });
  });
});
