const LatexUtils = require('../latex');
const IJSUtils = require('../ijs');

let htmlScriptSpy = jest.spyOn(IJSUtils, 'htmlScript').mockImplementation(() => null);

const {
  removeIJSContext,
  prepareIJSContext,
} = require('../__testHelper__/ijsContext');

global.describe('LaTeX', () => {
  global.describe('render', () => {
    global.beforeEach(() => {
      prepareIJSContext();
    });
    global.afterEach(() => {
      removeIJSContext();
    });
    global.it('can render a string', () => {
      const str = 'Some latex';

      LatexUtils.render(str);

      global.expect(global.$$.mime).toHaveBeenCalled();

      const mimeCall = global.$$.mime.mock.calls[0][0];
      global.expect(mimeCall).toHaveProperty('text/latex');
      global.expect(mimeCall['text/latex']).toStrictEqual(str);
    });
    global.it('throws an error if not in ijs', () => {
      removeIJSContext();

      global.expect(() => LatexUtils.render('some latex'))
        .toThrow('latex.render: expected to be run within the iJavaScript context');
    });
  });

  global.describe('katex', () => {
    global.beforeEach(() => {
      prepareIJSContext();
      htmlScriptSpy = jest.spyOn(IJSUtils, 'htmlScript').mockImplementation(() => null);
      // htmlScriptSpy.mockClear();
    });
    global.afterEach(() => {
      removeIJSContext();
      jest.restoreAllMocks();
    });
    global.it('does not call htmlScript if it is not called', () => {
      global.expect(htmlScriptSpy).not.toHaveBeenCalled();
    });
    global.it('can render without option', () => {
      const str = 'Some KaTeX';

      global.expect(htmlScriptSpy).not.toHaveBeenCalled();

      LatexUtils.katex(str);

      global.expect(htmlScriptSpy).toHaveBeenCalled();
    });
    global.it('can render with katex options', () => {
      const str = 'Some KaTeX';
      const katexOptions = { displayMode: false };
      
      global.expect(htmlScriptSpy).not.toHaveBeenCalled();
      LatexUtils.katex(str, katexOptions);
      
      const htmlScriptCall = htmlScriptSpy.mock.calls[0][0];

      global.expect(htmlScriptCall.data.expression).toEqual(str);
      global.expect(htmlScriptCall.data.katexOptions.displayMode).toStrictEqual(katexOptions.displayMode);
    });
    global.it('can render with katex options and script options', () => {
      const str = 'Some KaTeX';
      const katexOptions = { displayMode: false };
      const scriptOptions = { debug: true };
      
      global.expect(htmlScriptSpy).not.toHaveBeenCalled();
      LatexUtils.katex(str, katexOptions, scriptOptions);
      
      const htmlScriptCall = htmlScriptSpy.mock.calls[0][0];

      global.expect(htmlScriptCall.data.expression).toEqual(str);
      global.expect(htmlScriptCall.data.katexOptions.displayMode).toStrictEqual(katexOptions.displayMode);
      global.expect(htmlScriptCall.debug).toEqual(scriptOptions.debug);
    });
  });
});
