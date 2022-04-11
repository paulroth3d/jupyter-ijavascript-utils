/* eslint-disable quotes */

const SvgUtils = require('../svg');
const IJSUtils = require('../ijs');

let htmlScriptSpy = jest.spyOn(IJSUtils, 'htmlScript').mockImplementation(() => null);

// const FileUtils = require('../file');

const {
  removeIJSContext,
  prepareIJSContext,
  mockConsole,
  removeConsoleMock
} = require('../__testHelper__/ijsContext');

global.describe('SVG', () => {
  global.describe('render', () => {
    global.beforeEach(() => {
      prepareIJSContext();
      mockConsole();
    });
    global.afterEach(() => {
      removeIJSContext();
      removeConsoleMock();
    });
    global.it('throws an error if not in iJavaScript context', () => {
      removeIJSContext();

      const expectedError = 'svg.draw(options): expected to be run within the iJavaScript context';

      global.expect(() => SvgUtils.render({
        width: 400,
        height: 200,
        onReady: () => {}
      })).toThrow(expectedError);
    });

    global.it('debugs the context to the console if debug is true', () => {
      global.expect(() => SvgUtils.render({
        width: 400,
        height: 400,
        onReady: ({ el }) => {
          el.line().plot(0, 0, 100, 100);
        },
        debug: true
      })).not.toThrow();

      const results = global.console.log.mock.calls[0][0];
      // FileUtils.writeFileStd('./tmp/tmp', results);

      global.expect(global.console.log).toHaveBeenCalled();
      global.expect(results).toContain('width="400" height="400"');
      global.expect(results).toContain('<line x1="0" y1="0" x2="100" y2="100">');
    });

    global.it('can render with a function instead', () => {
      global.expect(() => SvgUtils.render(({ el }) => {
        el.line().plot(0, 0, 100, 100);
      })).not.toThrow();

      const results = global.$$.svg.mock.calls[0][0];
      // FileUtils.writeFileStd('./tmp/tmp', results);

      global.expect(global.console.log).not.toHaveBeenCalled();
      global.expect(global.$$.svg).toHaveBeenCalled();
      global.expect(results).toContain('<svg xmlns=');
    });

    //-- failure scenarios

    global.it('renders normally as a baseline for the failure cases', () => {
      global.expect(() => SvgUtils.render({
        width: 400,
        height: 200,
        onReady: () => {}
      })).not.toThrow();

      global.expect(global.console.log).not.toHaveBeenCalled();
    });

    global.it('fails if no options are sent', () => {
      const expected = 'svg.draw(options): options.onReady is required';
      global.expect(() => SvgUtils.render(null)).toThrow(expected);
    });

    global.it('throws an error if not in iJavaScript context', () => {
      const expectedError = 'some custom error';
      global.expect(() => SvgUtils.render({
        width: 400,
        height: 200,
        onReady: () => {
          throw Error(expectedError);
        }
      })).not.toThrow();

      global.expect(global.console.error).toHaveBeenCalled();
      global.expect(global.console.trace).toHaveBeenCalled();
    });
  });
  global.describe('embed', () => {
    global.beforeEach(() => {
      prepareIJSContext();
      mockConsole();
      htmlScriptSpy = jest.spyOn(IJSUtils, 'htmlScript').mockImplementation(() => null);
    });
    global.afterEach(() => {
      removeIJSContext();
      removeConsoleMock();
      jest.restoreAllMocks();
    });

    global.it('throws an error if not in iJavaScript context', () => {
      removeIJSContext();

      const expectedError = 'svg.embed(options): expected to be run within the iJavaScript context';

      global.expect(() => SvgUtils.embed({
        width: 400,
        height: 200,
        onReady: () => {}
      })).toThrow(expectedError);
    });

    global.it('attempts to embed with the htmlScript', () => {
      const options = {
        width: 600,
        height: 600,
        onReady: function doThings({ el }) {
          globalThis.areThingsDone = true;
        }
      };

      global.expect(htmlScriptSpy).not.toHaveBeenCalled();

      SvgUtils.embed(options);

      global.expect(htmlScriptSpy).toHaveBeenCalled();
      const results = htmlScriptSpy.mock.calls[0][0];

      global.expect(results).toHaveProperty('width');
      global.expect(results.width).toBe(options.width);
      global.expect(results.height).toBe(options.height);

      global.expect(results.onReady).toContain('function doThings');
      global.expect(results.onReady).toContain('globalThis.areThingsDone = true');
    });

    global.it('attempts to embed with the htmlScript as function', () => {
      const options = function doThings(el) {
        globalThis.areThingsDone = true;
      };

      global.expect(htmlScriptSpy).not.toHaveBeenCalled();

      SvgUtils.embed(options);

      global.expect(htmlScriptSpy).toHaveBeenCalled();
      const results = htmlScriptSpy.mock.calls[0][0];

      global.expect(results).toHaveProperty('width');
      global.expect(results).toHaveProperty('height');

      global.expect(results.onReady).toContain('function doThings');
      global.expect(results.onReady).toContain('globalThis.areThingsDone = true');
    });

    //-- failure cases

    global.it('renders normally as a baseline for the failure cases', () => {
      global.expect(() => SvgUtils.embed({
        width: 400,
        height: 200,
        onReady: () => {}
      })).not.toThrow();

      global.expect(global.console.log).not.toHaveBeenCalled();
    });

    global.it('fails if no options are sent', () => {
      const expected = 'svg.embed(options): options.onReady is required and must be a function';
      global.expect(() => SvgUtils.embed(null)).toThrow(expected);
    });
  });
});
