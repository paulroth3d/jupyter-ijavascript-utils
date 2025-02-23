// const codeBlockHelper = require('../codeBlockHelper');
// const ijsUtils = require('../ijsUtils');

//-- unfortunately iJavaScript has a problem that we have to work with global variables.
// const jest = require('jest');

jest.mock('fs');

const fs = require('fs');
const fsExtra = require('fs-extra');
const pino = require('pino');

// const { UNIT_CHANNELS } = require('vega-lite/build/src/channel');
const IJSUtils = require('../ijs');

// eslint-disable-next-line no-unused-vars
const FileUtil = require('../file');
// const { prepare } = require('@svgdotjs/svg.js');

const removeIJSContext = () => {
  delete global.$$;
};

const createNewDisplay = (name) => {
  const makeFn = (type) => jest.fn((value) => `${type}:${name}:${value}`);
  const newDisplay = ({
    async: () => {},
    text: makeFn('text'),
    png: makeFn('png'),
    svg: makeFn('svg'),
    html: makeFn('html'),
    jpg: makeFn('jpg'),
    mime: makeFn('mime'),
    markdown: makeFn('markdown'),
    sendResults: makeFn('sendResults')
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

global.describe('IJS', () => {
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

  global.describe('internalComment', () => {
    global.beforeEach(() => {
      prepareIJSContext();
    });
    global.afterEach(() => {
      removeIJSContext();
    });
    global.describe('should render output', () => {
      global.it('prints markdown if in IJSContext', () => {
        try {
          IJSUtils.internalComment(true, '# Test');
        } catch (err) {
          global.expect(err).toBeNull();
        }
      });
      global.it('prints markdown if in IJSContext', () => {
        try {
          IJSUtils.internalComment(true, '# Test', global.$$);
        } catch (err) {
          global.expect(err).toBeNull();
        }
      });
      global.it('should call markdown', () => {
        const commentStr = 'This is some comment';
        IJSUtils.internalComment(true, commentStr, global.$$);
  
        global.expect(global.$$.markdown).toHaveBeenCalled();
      });
      global.it('should not call html', () => {
        const commentStr = 'This is some comment';
        IJSUtils.internalComment(true, commentStr, global.$$);
  
        global.expect(global.$$.markdown).toHaveBeenCalled();
        global.expect(global.$$.html).not.toHaveBeenCalled();
      });
      global.it('should have only one call to markdown', () => {
        const commentStr = 'This is some comment';
        IJSUtils.internalComment(true, commentStr, global.$$);
  
        global.expect(global.$$.markdown).toHaveBeenCalled();
        global.expect(global.$$.html).not.toHaveBeenCalled();

        global.expect(global.$$.markdown.mock.calls.length).toEqual(1);
      });
      global.it('should include the comment requested', () => {
        const commentStr = 'This is some comment';
        IJSUtils.internalComment(true, commentStr, global.$$);
  
        global.expect(global.$$.markdown).toHaveBeenCalled();
        global.expect(global.$$.html).not.toHaveBeenCalled();

        global.expect(global.$$.markdown.mock.calls.length).toEqual(1);
        global.expect(global.$$.markdown.mock.calls[0][0]).toContain(commentStr);
      });
      global.it('should NOT include the text to remove the cell', () => {
        const commentStr = 'This is some comment';
        IJSUtils.internalComment(true, commentStr, global.$$);
  
        global.expect(global.$$.markdown).toHaveBeenCalled();
        global.expect(global.$$.html).not.toHaveBeenCalled();

        const notToPrintStr = 'output-to-be-removed-from-printing';

        global.expect(global.$$.markdown.mock.calls.length).toEqual(1);
        global.expect(global.$$.markdown.mock.calls[0][0]).toContain(commentStr);
        global.expect(global.$$.markdown.mock.calls[0][0]).not.toContain(notToPrintStr);
      });
    });
    global.describe('should not render output if false', () => {
      global.it('should not call markdown', () => {
        const commentStr = 'This is some comment';
        IJSUtils.internalComment(false, commentStr, global.$$);
  
        global.expect(global.$$.markdown).not.toHaveBeenCalled();
      });
      global.it('should call html', () => {
        const commentStr = 'This is some comment';
        IJSUtils.internalComment(false, commentStr, global.$$);
  
        global.expect(global.$$.markdown).not.toHaveBeenCalled();
        global.expect(global.$$.html).toHaveBeenCalled();
      });
      global.it('should include the remove marker', () => {
        const commentStr = 'This is some comment';
        IJSUtils.internalComment(false, commentStr, global.$$);
  
        global.expect(global.$$.markdown).not.toHaveBeenCalled();
        global.expect(global.$$.html).toHaveBeenCalled();
  
        const notToPrintStr = 'output-to-be-removed-from-printing';
  
        global.expect(global.$$.html.mock.calls.length).toEqual(1);
        global.expect(global.$$.html.mock.calls[0][0]).toContain(notToPrintStr);
      });
    });

    global.it('does not prints markdown if not in IJSContext', () => {
      removeIJSContext();
      try {
        IJSUtils.internalComment(true, '# Test');
      } catch (err) {
        global.expect(err).toBeNull();
      }
    });
    global.it('does not prints markdown if not in IJSContext', () => {
      removeIJSContext();
      try {
        IJSUtils.internalComment(true, '# Test', global.$$);
      } catch (err) {
        global.expect(err).toBeNull();
      }
    });
    global.it('does not print markdown if told not to', () => {
      removeIJSContext();
      try {
        IJSUtils.internalComment(false, '# Test', global.$$);
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

  global.describe('markPositionInDocument', () => {
    global.it('renders html', () => {
      const elementId = 'marker-start';
      const markerComment = 'Start of Marker';
      // const innerHTML = null;
      const testArguments = [elementId, markerComment];
      const expected = `<!-- ##Start of Marker## -->
<span id="marker-start">&nbsp;</span>`;
      const results = IJSUtils.generatePositionMarkerHTML(...testArguments).trim();
      global.expect(results).toBe(expected);
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
      global.it('can include text prior', () => {
        const textToIncludePrior = '<h1>TextToIncludePrior</h1>';
        const textToIncludeAfter = '<h1>TextToIncludeAfter</h1>';
        prepareIJSContext();
        IJSUtils.initializePageBreaks(textToIncludePrior, null);
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
        global.expect(global.$$.html.mock).toBeTruthy();
        global.expect(global.$$.html.mock.calls).toBeTruthy();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const args = global.$$.html.mock.calls[0];

        const [argText] = args;
        global.expect(argText).toContain('page-break-before');
        global.expect(argText).toContain(textToIncludePrior);
        global.expect(argText).not.toContain(textToIncludeAfter);
      });
      global.it('can include text after', () => {
        const textToIncludePrior = '<h1>TextToIncludePrior</h1>';
        const textToIncludeAfter = '<h1>TextToIncludeAfter</h1>';
        prepareIJSContext();
        IJSUtils.initializePageBreaks(null, textToIncludeAfter);
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
        global.expect(global.$$.html.mock).toBeTruthy();
        global.expect(global.$$.html.mock.calls).toBeTruthy();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const args = global.$$.html.mock.calls[0];

        const [argText] = args;
        global.expect(argText).toContain('page-break-before');
        global.expect(argText).not.toContain(textToIncludePrior);
        global.expect(argText).toContain(textToIncludeAfter);
      });
      global.it('can include text both before and after', () => {
        const textToIncludePrior = '<h1>TextToIncludePrior</h1>';
        const textToIncludeAfter = '<h1>TextToIncludeAfter</h1>';
        prepareIJSContext();
        IJSUtils.initializePageBreaks(textToIncludePrior, textToIncludeAfter);
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
        global.expect(global.$$.html.mock).toBeTruthy();
        global.expect(global.$$.html.mock.calls).toBeTruthy();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const args = global.$$.html.mock.calls[0];

        const [argText] = args;
        global.expect(argText).toContain('page-break-before');
        global.expect(argText).toContain(textToIncludePrior);
        global.expect(argText).toContain(textToIncludeAfter);
      });
    });
  });

  global.describe('generatePageBreakHTML', () => {
    global.it('returns text', () => {
      const expected = '<div class="pagebreak"></div>';
      const results = IJSUtils.generatePageBreakHTML();
      global.expect(results).toBe(expected);
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
      global.it('can inject html prior', () => {
        const textToIncludePrior = '<h1>TextToIncludePrior</h1>';

        prepareIJSContext();
        IJSUtils.printPageBreak(textToIncludePrior);
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
        global.expect(global.$$.html.mock).toBeTruthy();
        global.expect(global.$$.html.mock.calls).toBeTruthy();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const args = global.$$.html.mock.calls[0];

        const [argText] = args;
        global.expect(argText).toContain('pagebreak');
        global.expect(argText).toContain(textToIncludePrior);
      });
      global.it('can inject html after', () => {
        const textToIncludeAfter = '<h1>TextToIncludeAfter</h1>';

        prepareIJSContext();
        IJSUtils.printPageBreak(null, textToIncludeAfter);
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
        global.expect(global.$$.html.mock).toBeTruthy();
        global.expect(global.$$.html.mock.calls).toBeTruthy();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const args = global.$$.html.mock.calls[0];

        const [argText] = args;
        global.expect(argText).toContain('pagebreak');
        global.expect(argText).toContain(textToIncludeAfter);
      });
      global.it('can inject html before and after', () => {
        const textToIncludePrior = '<h1>TextToIncludePrior</h1>';
        const textToIncludeAfter = '<h1>TextToIncludeAfter</h1>';

        prepareIJSContext();
        IJSUtils.printPageBreak(textToIncludePrior, textToIncludeAfter);
        global.expect(global.$$).toBeTruthy();
        global.expect(global.$$.html).toBeTruthy();
        global.expect(global.$$.html.mock).toBeTruthy();
        global.expect(global.$$.html.mock.calls).toBeTruthy();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const args = global.$$.html.mock.calls[0];

        const [argText] = args;
        global.expect(argText).toContain('pagebreak');
        global.expect(argText).toContain(textToIncludePrior);
        global.expect(argText).toContain(textToIncludeAfter);
      });
    });
  });

  global.describe('useCache', () => {
    beforeEach(() => {
      fs.resetMock();
      fsExtra.resetMock();
      pino.mockInstance.resetMock();
    });
    afterAll(() => {
      fs.resetMock();
      fsExtra.resetMock();
      pino.mockInstance.resetMock();
    });
    global.it('normally has the IJavaScript context', () => {
      global.expect(1 + 2).toBe(3);
      global.expect(global.$$).not.toBeNull();
      global.expect(typeof global.$$.text).toBe('function');
    });
    global.describe('can write the cache', () => {
      global.it('can write to the cache', (done) => {
        prepareIJSContext();
        const cachePath = './tmp';
        const cacheFile = 'sampleFile';

        const dateValue = new Date('2025-01-01T00:00:00.000Z');
        const expensiveResults = { success: true, date: dateValue };
        const expensiveFn = jest.fn(() => Promise.resolve(expensiveResults));

        fsExtra.writeFileSync.mockReturnValue(true);

        let result;
        IJSUtils.useCache(true, cachePath, cacheFile, expensiveFn)
          .then((results) => {
            result = results;
          })
          .catch((err) => {
            result = `Exception caught: ${err.message}`;
          })
          .finally(() => {
            global.expect(result).toStrictEqual(expensiveResults);
            done();
          });
      });
      global.it('can write to the cache if there is a slash in the path', (done) => {
        prepareIJSContext();
        const cachePath = './tmp/';
        const cacheFile = 'sampleFile';

        const dateValue = new Date('2025-01-01T00:00:00.000Z');
        const expensiveResults = { success: true, date: dateValue };
        const expensiveFn = jest.fn(() => Promise.resolve(expensiveResults));

        fsExtra.writeFileSync.mockReturnValue(true);

        let result;
        IJSUtils.useCache(true, cachePath, cacheFile, expensiveFn)
          .then((results) => {
            result = results;
          })
          .catch((err) => {
            result = `Exception caught: ${err.message}`;
          })
          .finally(() => {
            global.expect(result).toStrictEqual(expensiveResults);
            done();
          });
      });
      global.it('can catch correctly if there is a failure thrown', async () => {
        prepareIJSContext();
        const cachePath = './tmp';
        const cacheFile = 'sampleFile';

        // const dateValue = new Date('2025-01-01T00:00:00.000Z');
        // const expensiveResults = { success: true, date: dateValue };
        const expectedMessage = 'expected exception';
        const expensiveFn = () => {
          throw Error('expected exception');
          // return Promise.resolve(expensiveResults);
        };
        await expect(IJSUtils.useCache(true, cachePath, cacheFile, expensiveFn))
          .rejects
          .toThrow(expectedMessage);
      });
      global.it('throws an error if not in ijs', async () => {
        prepareIJSContext();
        const cachePath = './tmp';
        const cacheFile = 'sampleFile';
        const expensiveFn = jest.fn(() => Promise.resolve({ success: true }));

        fsExtra.writeFileSync.mockReturnValue(true);

        global.expect(global.$$).not.toBeNull();
  
        removeIJSContext();
        global.expect(global.$$).toBeUndefined();

        const expectedMessage = 'IJSUtils.async must be run within iJavaScript. Otherwise, use normal async methods';
        await expect(IJSUtils.useCache(true, cachePath, cacheFile, expensiveFn))
          .rejects
          .toThrow(expectedMessage);
      });
      /*
      global.it('can throw an error gracefully', () => {
        global.expect(() => {
          IJSUtils.useCache2(true, 'cache', 'file', () => Promise.resolve('something'));
        }).toThrow('Some Message');
      });
      */
    });
    global.describe('can read from the cache', () => {
      global.it('can read from the cache', (done) => {
        prepareIJSContext();
        const cachePath = './tmp';
        const cacheFile = 'sampleFile';

        const dateValue = new Date('2025-01-01T00:00:00.000Z');
        const data = ({
          date: dateValue,
          series: 'a'
        });
        const dataJSON = JSON.stringify(data, null, 0);
        const parsedJSON = JSON.parse(dataJSON, FileUtil.cacheDeserializer);

        const expensiveFn = jest.fn(() => Promise.resolve(data));

        fsExtra.existsSync.mockReturnValue(true);
        fsExtra.readJsonSync.mockReturnValue(parsedJSON);

        let result;
        IJSUtils.useCache(false, cachePath, cacheFile, expensiveFn)
          .then((results) => {
            result = results;
          })
          .catch((err) => {
            result = `Exception caught: ${err.message}`;
          })
          .finally(() => {
            global.expect(result).toStrictEqual(data);
            done();
          });
      });
    });
  });

  global.describe('clearOutput', () => {
    global.beforeEach(() => {
      prepareIJSContext();
    });
    global.afterEach(() => {
      removeIJSContext();
    });
    global.afterAll(() => {
      global.console = ORIGINAL_CONSOLE;
    });
    global.describe('does nothing if not in IJS', () => {
      global.it('should be in ijs out of the box', () => {
        global.expect(IJSUtils.detectIJS()).toBe(true);
      });
      global.it('is not in ijs if the context is removed', () => {
        global.expect(IJSUtils.detectIJS()).toBe(true);

        removeIJSContext();
        
        global.expect(IJSUtils.detectIJS()).toBe(false);
      });
      global.it('does not send to text if not in ijs', () => {
        global.expect(IJSUtils.detectIJS()).toBe(true);

        removeIJSContext();
        
        global.expect(IJSUtils.detectIJS()).toBe(false);

        const textOutput = 'Text to find';
        const htmlOutput = 'html to find';
        const testArgs = [textOutput, htmlOutput];

        IJSUtils.clearOutput(...testArgs);

        //-- doesn't exist - so we can't tell it wasn't called
        // global.expect(global.$$.text).not.toHaveBeenCalled();

        //-- doesn't exist - so we can't tell it wasn't called
        // global.expect(global.$$.html).not.toHaveBeenCalled();
      });
    });
    global.describe('print text', () => {
      global.it('prints to text if html is not provided', () => {
        global.expect(IJSUtils.detectIJS()).toBe(true);

        const textOutput = 'Text to find';
        // const htmlOutput = 'html to find';
        const testArgs = [textOutput];

        IJSUtils.clearOutput(...testArgs);

        global.expect(global.$$.text).toHaveBeenCalled();

        global.expect(global.$$.text.mock.calls.length).toBe(1);
        global.expect(global.$$.text.mock.calls[0][0]).toContain(textOutput);

        global.expect(global.$$.html).not.toHaveBeenCalled();
      });
    });
    global.describe('print html', () => {
      global.it('prints to text if text is provided', () => {
        global.expect(IJSUtils.detectIJS()).toBe(true);

        const textOutput = 'Text to find';
        const htmlOutput = 'html to find';
        const testArgs = [textOutput, htmlOutput];

        IJSUtils.clearOutput(...testArgs);

        global.expect(global.$$.html).toHaveBeenCalled();

        global.expect(global.$$.html.mock.calls.length).toBe(1);
        global.expect(global.$$.html.mock.calls[0][0]).toContain(htmlOutput);

        global.expect(global.$$.text).not.toHaveBeenCalled();
      });
    });
  });

  global.describe('markContent', () => {
    global.describe('generates the output as expected', () => {
      global.it('prints the element id', () => {
        const elementId = 'test-element-id';
        // const markerComment = 'some comment';
        // const innerHTML = '<div class="text" />';
        const testArgs = [elementId];

        const results = IJSUtils.generatePositionMarkerHTML(...testArgs).trim();

        global.expect(results).toContain(elementId);
      });
      global.it('prints the inner HTML', () => {
        const elementId = 'test-element-id';
        // const markerComment = 'some comment';
        const innerHTML = '<div class="text" />';
        const testArgs = [elementId, null, innerHTML];

        const results = IJSUtils.generatePositionMarkerHTML(...testArgs).trim();

        global.expect(results).toContain(elementId);
        global.expect(results).toContain(innerHTML);
      });
      global.it('does not include any comment if not provided', () => {
        const elementId = 'test-element-id';
        // const markerComment = 'some comment';
        // const innerHTML = '<div class="text" />';
        const testArgs = [elementId];

        const results = IJSUtils.generatePositionMarkerHTML(...testArgs).trim();

        global.expect(results).toContain(elementId);
        global.expect(results).not.toContain('<!--');
      });
      global.it('does include comment if one is provided', () => {
        const elementId = 'test-element-id';
        const markerComment = 'some comment';
        // const innerHTML = '<div class="text" />';
        const testArgs = [elementId, markerComment];

        const results = IJSUtils.generatePositionMarkerHTML(...testArgs).trim();

        global.expect(results).toContain(elementId);
        global.expect(results).toContain('<!--');
        global.expect(results).toContain(markerComment);
      });
    });
    global.describe('markPositionInDocument', () => {
      global.it('calls html', () => {
        const elementId = 'test-element-id';
        const markerComment = 'some comment';
        const testArgs = [elementId, markerComment];

        IJSUtils.markPositionInDocument(...testArgs);

        global.expect(global.$$.html).toHaveBeenCalled();
        global.expect(global.$$.html.mock.calls.length).toBe(1);
      });
      global.it('calls html with the element and comment', () => {
        const elementId = 'test-element-id';
        const markerComment = 'some comment';
        const testArgs = [elementId, markerComment];

        IJSUtils.markPositionInDocument(...testArgs);

        global.expect(global.$$.html).toHaveBeenCalled();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const results = global.$$.html.mock.calls[0][0];
        global.expect(results).toContain(elementId);
        global.expect(results).toContain(markerComment);
      });
    });
    global.describe('markStartOfDocument', () => {
      global.it('calls html with the element and comment', () => {
        const elementId = 'ijsutils-start-of-content';
        const markerComment = 'Start of content';
        
        IJSUtils.markStartOfContent();

        global.expect(global.$$.html).toHaveBeenCalled();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const results = global.$$.html.mock.calls[0][0];
        global.expect(results).toContain(elementId);
        global.expect(results).toContain(markerComment);
      });
    });
    global.describe('markEndOfDocument', () => {
      global.it('calls html with the element and comment', () => {
        const elementId = 'ijsutils-end-of-content';
        const markerComment = 'End of content';
        
        IJSUtils.markEndOfContent();

        global.expect(global.$$.html).toHaveBeenCalled();
        global.expect(global.$$.html.mock.calls.length).toBe(1);

        const results = global.$$.html.mock.calls[0][0];
        global.expect(results).toContain(elementId);
        global.expect(results).toContain(markerComment);
      });
    });
  });
});
