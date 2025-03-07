/* eslint-disable no-use-before-define, function-paren-newline, no-param-reassign */

const uuid = require('uuid').v4;

const FileUtil = require('./file');

require('./_types/global');

/**
 * Simple library to support working within the [iJavaScript kernel within Jupyter](https://github.com/n-riesco/ijavascript)
 * 
 * Note that this is available as `ijs` from within the
 * [jupyter-ijavascript-utils module](./index.html)
 * 
 * * Asynchronous Methods
 *   * {@link module:ijs.await|ijs.await} - Helper function to support Await / Async functions in iJavaScript
 *   * {@link module:ijs.asyncConsole|ijs.asyncConsole} - Utility function for consoling a value in a .then() clause
 *   * {@link module:ijs.asyncWait|ijs.asyncWait} - Utility function for waiting x seconds between promise resolutions
 * * iJavaScript Context Detection
 *   * {@link module:ijs.detectIJS|ijs.detectIJS} - Detect if we are within iJavaScript context
 *   * {@link module:ijs.detectContext|ijs.detectContext} - Identify the $$ and console variables of the current cell
 * * Introspection
 *   * {@link module:ijs.listGlobals|ijs.listGlobals} - List global variables
 *   * {@link module:ijs.listStatic|ijs.listStatic} - List the static values on a class
 * * Rendering
 *   * {@link module:ijs.markdown|ijs.markdown} - Render output as markdown
 *   * {@link module:ijs.htmlScript|ijs.htmlScript} - Leverage external libraries like D3, Leaflet, etc.
 * * Printing
 *   * {@link module:ijs.clearOutput|ijs.clearOutput} - clears the output to declutter results (like importing libraries, or functions)
 *   * {@link module:ijs.initializePageBreaks|ijs.initializePageBreaks} - call at least once to allow pageBreaks when rendering PDFs
 *   * {@link module:ijs.printPageBreak|ijs.printPageBreak} - call to print a page break when rendering PDFs
 *   * {@link module:ijs.generatePageBreakStylesHTML|ijs.printPageBreak} - generates the html used in to allow for pagebreaks
 *          (so you can render them as you'd like)
 *   * {@link module:ijs.generatePageBreakHTML|ijs.generatePageBreakHTML} - generates the html that uses the styles to render pagebreaks
 *          (so you can render them as you'd like)
 *   * {@link module:ijs.internalComment|ijs.internalComment} - render markdown, but be able to turn it off, prior to printing
 *   * {@link module:ijs.markDocumentPosition|ijs.markDocumentPosition} - render something in html for post processing
 *          (such as identifying the start of document and removing everything prior)
 *   * {@link module:ijs.markStartOfContent|ijs.markStartOfContent} - most comment mark - the start of content
 *   * {@link module:ijs.markEndOfContent|ijs.markEndOfContent} - most comment mark - the end of content
 * * using a cache for long running executions
 *   * {@link module:ijs.useCache|ijs.useCache()} - perform an expensive calculation and write to a cache, or read from the cache transparently
 * 
 * For example:
 * 
 * ```
 * //-- get the data
 * //-- fetch the data
 * //-- and do not execute the next cell until received.
 * utils.ijs.await(async ($$, console) => {
 *  barley = await utils.datasets.fetch('barley.json');
 * })
 * ```
 * 
 * ```
 * //-- use the data as though it was synchronously received
 * 
 * //-- get the min max of the types of barley
 * barleyByVarietySite = d3.group(barley, d => d.variety, d => d.site)
 * //-- now group by variety and year
 * barleyByVarietyYear = d3.group(barley, d => d.variety, d => d.year)
 * ```
 * 
 * then later
 * 
 * ```
 * utils.ijs.listGlobals();
 * // ['barley','d3','barleyByVariety','barleyByVarietySite',...]
 * ```
 * 
 * Or passing NodeJS variables to JavaScript
 * 
 * ({@link module:ijs.htmlScript|See ijs.htmlScript for more})
 * ```
 * utils.ijs.htmlScript({
 *     scripts: ['https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'],
 *     height: '100%',
 *     onReady: ({rootEl}) => {
 *         new QRCode(rootEl, "https://jupyter-ijavascript-utils.onrender.com/");
 *     }
 * });
 * ```
 * 
 * ![Screenshot of QR Code](img/htmlScript_qrCode.png)
 * 
 * @module ijs
 * @exports ijs
 */
module.exports = {};
const IJSUtils = module.exports;

/**
 * Set with names of common global variables that aren't needed to be listed.
 * @see #.listGlobals
 * @private
 */
module.exports.COMMON_GLOBALS = new Set([
  'global', 'clearInterval', 'clearTimeout', 'setInterval', 'setTimeout', 'queueMicrotask',
  'clearImmediate', 'setImmediate', 'module', 'exports', 'require', '$$mimer$$', '$$done$$'
]);

/**
 * Set with names of static methods that often belong to a class.
 * @see #.listStatic
 * @private
 */
module.exports.COMMON_STATIC = new Set(['length', 'prototype', 'name']);

/**
 * Allow for asynchronous programming within iJavaScript nodes.
 * 
 * * see [iJavaScript Async option docs](https://n-riesco.github.io/ijavascript/doc/async.ipynb.html)
 * * see [iJavaScript issue #73](https://github.com/n-riesco/ijavascript/issues/73)
 * * see [iJavaScript issue #173](https://github.com/n-riesco/ijavascript/issues/173)
 * 
 * ![Screenshot](img/IJS_awaitBarley.png)
 * @example
 * 
 * utils.ijs.await(async ($$, console) => {
 *    //-- $$ is the display for the current cell
 *    //-- console is the console for the current cell
 *    
 *    barley = await utils.datasets.fetch('barley.json');
 *    
 *    console.log(`retrieved:${barley.length} nodes`);
 * 
 *    // return will be the value sent to $$.sendResults()
 *    // and shown alongside console
 *    return barley.slice(0,1)
 * })
 * 
 * //-- outputs
 * 
 * retrieved:120 nodes
 * 
 * [
 *  {
 *    yield: 27,
 *    variety: 'Manchuria',
 *    year: 1931,
 *    site: 'University Farm'
 *  }
 * ]
 */
module.exports.await = async function ijsAsync(fn) {
  const context = IJSUtils.detectContext();
  
  if (!context) {
    throw (Error('IJSUtils.async must be run within iJavaScript. Otherwise, use normal async methods'));
  }

  context.$$.async();

  try {
    const results = await fn(context.$$, context.console);
    context.$$.sendResult(results);
  } catch (err) {
    context.console.error('error occurred');
    context.console.error(err);
    context.$$.sendResult(err);
  }
};

/**
 * Simple promise chain for sending a console message
 * @param {String} message - the message to be sent to console
 * @returns {Function} - (results) => results passthrough
 * 
 * @example
 * 
 * Promise.resolve(200)
 *  .then(utils.ijs.asyncWait(2))
 *  .then(utils.ijs.asyncConsole('after waiting for 2 seconds'))
 *  .then((results) => console.log('results passed through: ${results}`));
 * 
 * //--
 * after waiting for 2 seconds
 * results passed through: 200
 */
module.exports.asyncConsole = (...messages) => (results) => {
  console.log.apply(module.exports, messages);
  return results;
};

/**
 * Simple promise chain for waiting N seconds.
 * @param {Number} seconds - the number of seconds to wait
 * @returns {Function} - (results) => results passthrough
 * 
 * @example
 * 
 * Promise.resolve(200)
 *  .then(utils.ijs.asyncConsole('before waiting for 2 seconds'))
 *  .then(utils.ijs.asyncWait(2))
 *  .then(utils.ijs.asyncConsole('after waiting for 2 seconds'))
 *  .then((results) => console.log('results passed through: ${results}`));
 * 
 * //--
 * before waiting for 2 seconds
 * after waiting for 2 seconds
 * results passed through: 200
 */
module.exports.asyncWait = (seconds) => (results) => new Promise(
  (resolve, reject) => {
    setTimeout(() => {
      resolve(results);
    }, seconds * 1000);
  }
);

/**
 * Determines the current global display and console from iJavaScript
 * (or null if not within iJavaScript)
 * @returns {IJavaScriptContext} - ({ display, console }) or null if not within iJavaScript
 */
module.exports.detectContext = function detectContext() {
  if (
    ((typeof global.$$) === 'undefined')
    || ((typeof global.console) === 'undefined')
  ) {
    return null;
  }

  return {
    $$: global.$$,
    display: global.$$,
    console: global.console
  };
};

/**
 * Determines if we are currently within the iJavaScript context
 * @returns {Boolean} - true if the code is running within an iJavaScript kernel
 */
module.exports.detectIJS = function detectIJS() {
  return IJSUtils.detectContext() ? true : false;
};

/**
 * Prints markdown if in the context of iJavaScript.
 * 
 * This can be deceptively helpful, as it allows your text to be data driven:
 * 
 * ![Screenshot of markdown](img/ijsMarkdown.png)
 * 
 * @param {String} markdownText - The markdown to be rendered
 * @param {*} markdownText - the markdown text to render
 * @param {Jupyter$$} [display] - the display to render the output to.
 * @example
 * 
 * utils.ijs.markdown(`# Overview
 * This is markdown rendered in a cell.`);
 */
module.exports.markdown = function markdown(markdownText, display) {
  if (!IJSUtils.detectIJS()) return;
  const displayToUse = display || global.$$;
  displayToUse.mime({ 'text/markdown': markdownText });
};

/**
 * Capture internal comments that can render as markdown (including images)
 * but be turned off - so they are not rendered in the final output
 * 
 * ```
 * utils.ijs.internalComment(true, `![Screenshot](localhost://path-to-file)`);
 * ```
 * 
 * and then when preparing to ship, you don't include it
 * 
 * ```
 * printable=true
 * utils.ijs.internalComment(!printable, `![Screenshot](localhost://path-to-file)`);
 * ```
 * 
 * @param {Boolean} shouldRender - whether the comment should be rendered to the output
 * @param {String} markdownText - the markdown text to render
 * @param {Jupyter$$} [display] - the display to render the output to.
 */
module.exports.internalComment = function internalComment(shouldRender, markdownText, display) {
  if (!IJSUtils.detectIJS()) return;
  const displayToUse = display || global.$$;
  if (shouldRender) {
    displayToUse.mime({ 'text/markdown': markdownText });
  } else {
    displayToUse.html('<span class="output-to-be-removed-from-printing">&nbsp;</span>');
  }
};

/**
 * List the globals currently defined.
 * 
 * This can be very useful when keeping track of values after a few cells.
 * 
 * For example:
 * 
 * ```
 * cars = utils.datasets.fetch('cars.json').then(data => global.cars = data);
 * ```
 * 
 * then later
 * 
 * ```
 * utils.ijs.listGlobals();
 * // cars
 * ```
 * 
 * @returns {String[]} - list of the global variables
 * @see #.COMMON_GLOBALS
 */
module.exports.listGlobals = function listGlobals() {
  return Object.keys(global)
    .filter((key) => !IJSUtils.COMMON_GLOBALS.has(key));
};

/**
 * List the static members and functions of a class.
 * 
 * @param {class} target - the target class
 * @returns {StaticMember[]} 
 * @see #.COMMON_STATIC
 * 
 * @example
 * 
 * utils.ijs.listStatic(utils.ijs)
 * // [{type:'function', constructor:'Function', isMethod:true, name:'listStatic'}, ...]
 */
module.exports.listStatic = function listStatic(target) {
  if (!target) return [];

  return Object.getOwnPropertyNames(target)
    .filter((prop) => !IJSUtils.COMMON_STATIC.has(prop))
    .map((prop) => {
      const propType = typeof target[prop];
      const constructor = target[prop].constructor.name;
      const isMethod = propType === 'function';
      return ({
        type: propType,
        constructor,
        isMethod,
        name: prop
      });
    });
};

/**
 * Generates and renders an html block that loads external css and javascript.
 * 
 * **For example, allows running browser side {@link https://d3js.org/|d3js} in a Jupyter cell, {@link https://leafletjs.com/|Leaflet}, etc.**
 * 
 * Remember, your cells in Jupyter are running in NodeJS.
 * 
 * Once all the files have loaded, then `onReady` will execute in JavaScript.
 * 
 * Note that only the function in onReady is executed in JavaScript
 * (i.e. Data from other cells in Jupyter would normally not be available).
 * 
 * If data is needed from jupyter, pass them through `options.data`. (ex: airportData example below)
 * 
 * **For More - See the {@tutorial htmlScript} tutorial.**
 * 
 * # Example
 * 
 * For example {@link https://github.com/davidshimjs/qrcodejs|using a cdn library for qr codes}
 * 
 * ```
 * utils.ijs.htmlScript({
 *     scripts: ['https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'],
 *     height: '100%',
 *     onReady: ({rootEl}) => {
 *         new QRCode(rootEl, "https://jupyter-ijavascript-utils.onrender.com/");
 *     }
 * });
 * ```
 * 
 * ![Screenshot of QR Code](img/htmlScript_qrCode.png)
 * 
 * Or working with {@link https://leafletjs.com/|Leaflet - to show maps}
 * 
 * ```
 * //-- nodeJS Variable
 * airportData = { ohareORD: { lat: 41.975813, lon: -87.909428, title: "O'Hare Intl Airport" } };
 * //-- render out html
 * utils.ijs.htmlScript({
 *     scripts: ['https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
 *               'https://unpkg.com/leaflet-providers@1.13.0/leaflet-providers.js'],
 *     css: ['https://unpkg.com/leaflet@1.6.0/dist/leaflet.css'],
 *     data: airportData,
 *     height: 150,
 *     //-- function will be executed in javaScript
 *     onReady: ({rootEl, data}) => {
 *         // L is globally available from the leaflet.js script.
 *         
 *         //-- capture the nodeJS data and use in JavaScript. Neat!
 *         ohareORD = data.ohareORD;
 * 
 *         map = L.map(rootEl);
 *         map.setView([ohareORD.lat, ohareORD.lon], 14);
 *         
 *         new L.marker([ohareORD.lat, ohareORD.lon]).bindPopup(ohareORD.title).addTo(map);
 *         
 *         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 *            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 *         }).addTo(map);
 *     }
 * });
 * ```
 * 
 * ![Screenshot of Leaflet](img/htmlScript_leaflet.png)
 * 
 * @param {Object} options - additional options available during rendering
 * @param {String | Function} options.onReady - JavaScript to run once all files have loaded
 * @param {Element} options.onReady.rootEl - results div container
 * @param {any} [options.onReady.data] - the options.data parameter
 * @param {Object} options.onReady.utilityFunctions - the options.utilityFunctions object
 * @param {Object} options.onReady.options - the options object passed
 * @param {Object} options.onReady.animate - alias to requestAnimationFrame with additional checks to avoid leaks
 * @param {String[]} [options.scripts = []] - Array of JavaScript file addresses to load
 * @param {String[]} [options.css = []] - Array of CSS file addresses to load
 * @param {any} [options.data = undefined] - any nodejs data you would like available in javaScript
 * @param {String} [options.html = ''] - html elements to include within the result
 * @param {String | Number} [options.width = '100%'] - width of the div container (ex: 400 or '400px')
 * @param {String | Number} [options.height = '200px'] - height of the div container (ex: 200 or '200px')
 * @param {Boolean} [options.debug = false] - whether to incude a `debugger` breakpoint (once scripts are loaded)
 * @param {Boolean} [options.console = true] - whether to include console statements
 */
module.exports.htmlScript = function htmlScripts(
  options
) {
  //-- you must be in iJavaScript container to rendeer
  const context = IJSUtils.detectContext();
  if (!context) {
    throw new Error('ijsUtils.htmlScript: Must be in iJavaScript context to render html');
  }

  if (!options) options = {};

  const {
    debug: renderDebug = false,
    console: renderConsole = true,
    html = '',
    data,
    utilityFunctions = {}
  } = options;

  let {
    width,
    height,
    uuid: rootUUID,
    scripts: scriptAddresses,
    css: stylesheetAddresses,
    onReady: onReadyCode
  } = options;

  //-- verify the options sent are expected
  const validKeys = new Set(['debug', 'console', 'width', 'height',
    'uuid', 'scripts', 'css', 'html', 'data', 'onReady', 'utilityFunctions'
  ]);
  const sentOptions = Object.keys(options);
  const invalidOptions = sentOptions.filter((k) => !validKeys.has(k));
  if (invalidOptions.length > 0) {
    throw Error(`ijsUtils.htmlScript: invalid options: ${invalidOptions}, must be within: ${[...validKeys].join(', ')}`);
  }

  //-- check that utilityFunctions are properly set.
  let utilityFunctionStr = '';
  if (utilityFunctions) {
    if ((typeof utilityFunctions) !== 'object') {
      throw Error('ijsUtils.htmlScript: utilityFunctions is an object that has only functions');
    }
    Object.keys(utilityFunctions).forEach((key) => {
      if ((typeof utilityFunctions[key]) !== 'function') {
        throw Error(`ijsUtils.htmlScript: utilityFunctions must have only functions:${key}`);
      }
      utilityFunctionStr += `utilityFunctions.${key} = ${utilityFunctions[key].toString()};\n`;
    });
  }

  if (!width) {
    width = '100%';
  } else if (typeof width === 'number') {
    width = `${width}px`;
  }
  if (!height) {
    height = '200px';
  } else if (typeof height === 'number') {
    height = `${height}px`;
  }

  if (!scriptAddresses) {
    scriptAddresses = [];
  }
  if (!stylesheetAddresses) {
    stylesheetAddresses = [];
  }

  //-- allow this as there is some value over html now.
  // if (scriptAddresses.length + stylesheetAddresses.length < 1) {
  //   throw Error('ijsUtils.htmlScript: options have no `css` or `scripts`. If none are needed, use $$.html()');
  // }

  if (!onReadyCode) {
    throw Error('ijsUtils.htmlScript: onReadyCode is required');
  } else if (typeof onReadyCode === 'function') {
    onReadyCode = `(${onReadyCode.toString()})({rootEl, data, utilityFunctions, options, animate})`;
  } else if (typeof onReadyCode === 'string') {
    onReadyCode = onReadyCode.trim();
    if (!onReadyCode.endsWith(';')) {
      onReadyCode += ';';
    }
  } else {
    throw Error('ijsUtils.htmlScript: onReadyCode must be a string or function');
  }

  //-- the unique identifier for this run
  //-- (corrects race conditions)
  if (!rootUUID) rootUUID = uuid();

  const generateCSS = (address, rootElementUUID, onloadFn) => `
<link
  rel="stylesheet"
  href="${address}"
  crossorigin=""
  uuid="${rootElementUUID}"
/>`;

  // const scriptCode = scriptAddresses.map(
  //   (addr) => generateScript(addr, rootUUID, 'externalScriptLoaded')
  // ).join('\n');

  const cssCode = stylesheetAddresses.map(
    (addr) => generateCSS(addr, rootUUID, 'externalScriptLoaded')
  ).join('\n');

  /* eslint-disable quotes, indent */

  let results = `<html><body>
  <div uuid="${rootUUID}" style="width:${width}; height: ${height}">${html}</div>
  <div scriptUUID="${rootUUID}" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('${rootUUID}', {
      scriptIndex: -1,
      scriptsToLoad: ${JSON.stringify(scriptAddresses)},
      onReady: (rootUUID) => {
        ${!renderConsole
          ? ''
          : `console.log('IJSUtils.htmlScript:' + rootUUID + ' starting render');`
        }
  
        ${!renderDebug ? '' : 'debugger;'}
  
        const rootEl = document.querySelector('div[uuid="${rootUUID}"]');

        const options = {
          uuid: '${rootUUID}',
          width: '${width}',
          height: '${height}',
          scripts: ${JSON.stringify(scriptAddresses)},
          css: ${JSON.stringify(scriptAddresses)},
        };

        const animate = function (requestAnimationFrameTarget) {
          requestAnimationFrame((...passThroughArgs) => {
            if (!document.contains(rootEl)) {
              console.log('old animation stopping. rootEl has been removed from DOM');
              return;
            }
            requestAnimationFrameTarget.apply(globalThis, passThroughArgs);
          })
        }

        //-- ijsUtils.htmlScipt options.data
        const data = ${JSON.stringify(data)};

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};
        ${utilityFunctionStr}
        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        ${onReadyCode}
        //-- ijsUtils.htmlScript options.onRender end
  
        ${!renderConsole
          ? ''
          : `console.log('IJSUtils.htmlScript:' + rootUUID + ' ending render');`
        }
      }
    });

    //-- script tags created dynamically have race conditions, load sequentially
    function externalScriptLoaded(rootUUID) {
      const result = globalThis.uuidCountdown.get(rootUUID);
      result.scriptIndex += 1;
      if (result.scriptIndex >= result.scriptsToLoad.length) {
        result.onReady(rootUUID);
        globalThis.uuidCountdown.delete(rootUUID);
      } else {
        const newScript = document.createElement('script');
        newScript.src = result.scriptsToLoad[result.scriptIndex];
        newScript.crossorigin='';
        newScript.uuid=rootUUID;
        newScript.onload = () => externalScriptLoaded(rootUUID);

        const scriptRoot = document.querySelector('div[scriptUUID="' + rootUUID + '"]');
        scriptRoot.append(newScript);
      }
    }

    externalScriptLoaded('${rootUUID}');
  </script>
  ${cssCode}
</body></html>
`;
  results = results
    .replace(/\n[ \t]*\n\s*\n/g, '\n\n')
    .replace(/\n[ \t]*\n/g, '\n\n');

  /* eslint-enable quotes */

  context.$$.html(results);

  return results;
};

/**
 * Clears the output.
 * 
 * (This is useful to put after importing libraries,
 * or defining a list of functions)
 */
module.exports.clearOutput = function clearOutput(outputText = '', outputHTML = '') {
  //-- you must be in iJavaScript container to rendeer
  const context = IJSUtils.detectContext();
  
  if (!context) {
    return;
  }

  if (!outputHTML) {
    context.$$.text(outputText);
  } else {
    context.$$.html(outputHTML);
  }
};
module.exports.noOutputNeeded = module.exports.clearOutput;

/**
 * Marks the start of content.
 * 
 * This could be useful for removing all cells and content prior from printing
 * when reviewing the html output.
 * 
 * @see {@link module:ijs.markDocumentPosition|ijs.markDocumentPosition}
 * @example
 * utils.ijs.markStartOfContent();
 * 
 * //-- will render the following in the cell
 * // <!-- ##Start of content. This could be used to remove everything prior from printing.## -->
 * // <span id="ijsutils-start-of-content">&nbsp;</span>
 */
module.exports.markStartOfContent = function markStartOfContent() {
  IJSUtils.markDocumentPosition('ijsutils-start-of-content', 'Start of content. This could be used to remove everything prior from printing.');
};

/**
 * Marks the end of content.
 * 
 * This could be useful for removing all cells and content after this point from printing
 * when reviewing the html output.
 * 
 * @see {@link module:ijs.markDocumentPosition|ijs.markDocumentPosition}
 * @example
 * utils.ijs.markEndOfContent();
 * 
 * //-- will render the following in the cell
 * // <!-- ##End of content. This could be used to remove everything after from printing.## -->
 * // <span id="ijsutils-end-of-content">&nbsp;</span>
 */
module.exports.markEndOfContent = function markEndOfContent() {
  IJSUtils.markDocumentPosition('ijsutils-end-of-content', 'End of content. This could be used to remove everything after from printing.');
};

/**
 * Renders HTML that can be easily found in the HTML of an exported document.
 * 
 * This allows for simpler and consistent post-processing
 * (such as which cells to remove prior to rendering to PDF)
 * 
 * @param {String} elementId - id of the element that could be found through document.querySelector
 * @param {String} [markerComment] - Any additional text to put in an html comment
 * @param {String} [innerHTML] - Optional text to be shown in the span (useful for making it easier to find)
 * @returns {String} the html
 * @private
 */
module.exports.generatePositionMarkerHTML = function generatePositionMarkerHTML(elementId, markerComment, innerHTML) {
  const cleanInnerHTML = innerHTML || '&nbsp;';
  const html = `
${!markerComment ? '' : `<!-- ##${markerComment}## -->`}
<span id="${elementId}">${cleanInnerHTML}</span>
`;
  return html;
};

/**
 * Renders HTML that can be easily found in the HTML of an exported document.
 * 
 * This allows for simpler and consistent post-processing
 * (such as which cells to remove prior to rendering to PDF)
 * 
 * For example, within a Jupyter / Jupyter Lab Notebook:
 * 
 * ```
 * utils.ijs.markDocumentPosition('ijsutils-start-of-content', 'Remove this and everything above', '<h1>Start of content</h1>');
 * 
 * //-- this will render a cell with the following:
 * // <!-- ##start of stuff## -->
 * // <span id="ijsutils-start-of-content"><h1>Start of content</h1></span>
 * ```
 * 
 * We can then look for that id within the output of the notebook.<br />
 * (Like within a bookmarklet)
 * 
 * ```
 * parentCell = document.querySelector('#ijsutils-start-of-content').closest('.jp-Cell');
 * ```
 * 
 * and then remove it - and any cells before it
 * 
 * ```
 * cellsToRemove = [];
 * while(parentCell) {
 *     cellsToRemove.push(parentCell);
 *     parentCell = parentCell.previousElementSibling;
 * }
 * 
 * //-- to remove them
 * cellsToRemove.forEach((el) => el.remove())
 * ```
 * 
 * @param {String} elementId - id of the element that could be found through document.querySelector
 * @param {String} [markerComment] - Any additional text to put in an html comment
 * @param {String} [innerHTML] - Optional text to be shown in the span (useful for making it easier to find)
 * @see {@link module:ijs.markStartOfContent|ijs.markStartOfContent} 
 * @see {@link module:ijs.markEndOfContent|ijs.markEndOfContent} 
 */
module.exports.markDocumentPosition = function markDocumentPosition(elementId, markerComment, innerHTML) {
  const resultHTML = IJSUtils.generatePositionMarkerHTML(elementId, markerComment, innerHTML);

  IJSUtils.clearOutput(null, resultHTML);
};

/**
 * Returns the HTML used for generating pageBreaks within the library.
 * 
 * This gives you control over rendering the text together
 * 
 * ```
 * utils.ijs.generatePageBreakStylesHTML();
 * // <style>
 * 
 * //-- an identifier that can be used to find if this script exists on the page
 * \/\* ID:___InitializePageBreaks___ \*\/
 * 
 * // @media print {
 * // .pagebreak { page-break-before: always; }
 * // }
 * 
 * // </style>
 * ```
 * 
 * @returns {String} - the html styles tag used to allow for page breaks to be generated
 */
module.exports.generatePageBreakStylesHTML = function generatePageBreakStylesHTML() {
  return `<style>
/* ID:___InitializePageBreaks___ */
@media print {
.pagebreak { page-break-before: always; } /* page-break-after works, as well */
}
</style>`;
};

/**
 * Required to be called first - in order to write page-breaks in the html results.
 * 
 * (For Example:)
 * 
 * Assume you have the following cells:
 * 
 * ```
 * * Some Text
 * * utils.ijs.initializePageBreaks()
 * * some other text
 * * utils.ijs.printPageBreak();
 * * end of document
 * ```
 * 
 * When you print to HTML and then render to PDF, you'll see the following:
 * 
 * ```
 * * Some Text
 * * utils.ijs.initializePageBreaks()
 * 
 * //-- page break
 * 
 * * some other text
 * * utils.ijs.printPageBreak();
 * 
 * //-- page break
 * 
 * * end of document
 * ```
 * 
 * Note, sometimes you want to include a text prior to the page break,
 * like mentioning that a page is left intentionally blank - or to identify
 * this is the cell that has the style - so it shouldn't be removed prior to printing.
 * 
 * ```
 * utils.ijs.initializePageBreaks('<h1>This page left intentionally blank</h1>');
 * ```
 * 
 * Or, perhaps you always want a page break after defining the styles
 * 
 * ```
 * utils.ijs.initializePageBreaks(null, utils.ijs.generatePageBreakHTML());
 * ```
 * 
 * @param {String} [htmlToInjectBefore] - optional html text to include prior to the pageBreak
 *      (This can be helpful like - page left intentionally blank)
 * @param {String} [htmlToInjectAfter] - optional html text to include prior to the pageBreak
 */
module.exports.initializePageBreaks = function initializePageBreaks(htmlToInjectBefore, htmlToInjectAfter) {
  //-- you must be in iJavaScript container to rendeer
  const context = IJSUtils.detectContext();
    
  if (!context) {
    return;
  }

  const cleanInjectionPrior = htmlToInjectBefore || '';
  const htmlToRender = IJSUtils.generatePageBreakStylesHTML();
  const cleanInjectionAfter = htmlToInjectAfter || '';

  context.$$.html(`
${cleanInjectionPrior}
${htmlToRender}
${cleanInjectionAfter}`);
};

/**
 * Generates the html used for creating a page break used by the library.
 * 
 * This gives you options about when and how to render it.
 * 
 * ```
 * utils.ijs.generatePageBreakHTML();
 * //-- uses the style defined in initializePageBreaks
 * // <div class="pagebreak"></div>
 * ```
 * 
 * For example, you can use this so you automatically have a page break after generating the styles
 * 
 * ```
 * utils.ijs.initializePageBreaks(null, utils.ijs.generatePageBreakHTML());
 * ```
 * 
 * @returns {String}
 * @see {@link module:ijs.printPageBreak|ijs.printPageBreak}
 * @see {@link module:ijs.initializePageBreaks|ijs.initializePageBreaks}
 */
module.exports.generatePageBreakHTML = function generatePageBreakHTML() {
  return '<div class="pagebreak"></div>';
};

/**
 * After the {@see module:ijs.initializePageBreaks|utils.ijs.initializePageBreaks} is called,
 * this will create another page break.
 * 
 * @param {String} [htmlToInjectBefore] - optional html text to include prior to the pageBreak
 *      (This can be helpful like - page left intentionally blank)
 * @param {String} [htmlToInjectAfter] - optional html text to include prior to the pageBreak
 */
module.exports.printPageBreak = function printPageBreak(htmlToInjectBefore, htmlToInjectAfter) {
  //-- you must be in iJavaScript container to rendeer
  const context = IJSUtils.detectContext();
  
  if (!context) {
    return;
  }

  const htmlToRender = IJSUtils.generatePageBreakHTML();

  context.$$.html(`${htmlToInjectBefore || ''}${htmlToRender}${htmlToInjectAfter || ''}`);
};

/**
 * For very long or time-intensive executions, sometimes it is better to cache the results
 * than to execute them every single time.
 * 
 * Note that this supports promises, and can be a bit harder to understand.
 * 
 * As opposed to {@link module:file.useCache|file.useCache} - which works synchronously
 * 
 * ```
 * shouldWrite = true; /// we will write to the cache with the results from the execution
 * utils.file.useCache(shouldWrite, './cache', 'expensive.json', () => {
 *   //-- all the items to cache 
 *   return Promise.resolve()
 *      .then(() => ajax.retrieve(...))
 *      .then((results) => {
 *          const data = results
 *            .map(obj => ({ ...obj, date: Date.parse(obj.epoch) }));
 *          .. other things to do
 *          return data;
 *       });
 * })
 *   //-- using the information AFTER the expensive function or retrieval from cache
 *   //-- this can ALSO be run in a subsequence cell
 *   .then((results) => {
 *      expensiveresults = results;
 *      conosole.log(`expensiveResults.length: ${results.length}`);
 *    });
 * ```
 * 
 * but sometimes I would rather just skip to the end
 * 
 * ```
 * shouldWrite = false; /// we will read from the cache instead,
 * // everything else remains the same
 * 
 * utils.file.useCache(shouldWrite, './cache', 'expensive.json', () => {
 *   //-- all the items to cache 
 *   return Promise.resolve()
 *     ... blah blah - none of this will get executed
 * })
 *   //-- using the information AFTER the expensive function or retrieval from cache
 *   //-- this can ALSO be run in a subsequence cell
 *   .then((results) => {
 *      expensiveresults = results;
 *      conosole.log(`expensiveResults.length: ${results.length}`);
 *    });
 * 
 * //-- completely transparent to the runner
 * expensiveresults.length = 1023424;
 * ```
 * 
 * @param {Boolean} shouldWrite - whether we should write to the cache (true) or read from the cache (false)
 * @param {String} cachePath - Path to the cache folder, ex: './cache'
 * @param {String} cacheFile - Filename of the cache file to use for this execution, ex: 'ExecutionsPerMin.js'
 * @param {Function} expensiveFn - function that returns the results to be stored in the cache
 * @param {Object} fsOptions - options to use when writing or reading files
 * @returns {any} - either the deserialized json from the cache or the results from the expensive function
 * @see {@link module:file.readJSON|file.readJSON} - reads a local JSON file
 * @see {@link module:file.writeJSON|file.writeJSON} - writes to a JSON file
 * @see {@link module:file.useCache|file.useCache} - can be much easier than using promises
 */
module.exports.useCache = async function useCache(shouldWrite, cachePath, cacheFile, expensiveFn, fsOptions = null) {
  const ensureEndsWithSlash = (str) => str.endsWith('/') ? str : `${str}/`;
  const cacheFilePath = `${ensureEndsWithSlash(cachePath)}${cacheFile}`;
  const context = IJSUtils.detectContext();

  if (!shouldWrite) {
    const cleanOptions = { ...fsOptions, formatter: FileUtil.cacheDeserializer };
    //-- we read the info and be done with it
    //context.console.log(`before retrieving cache:${cacheFilePath}`);
    const results = FileUtil.readJSON(cacheFilePath, cleanOptions);
    //context.console.log(`after retrieving cache`);
    return Promise.resolve(results);
  }

  if (!context) {
    throw (Error('IJSUtils.async must be run within iJavaScript. Otherwise, use normal async methods'));
  }

  context.$$.async();

  try {
    context.console.log('before starting expensive fn');
    const results = await expensiveFn(context.$$, context.console);
    context.console.log('AFTER starting expensive fn');

    FileUtil.writeJSON(cacheFilePath, results);
    // context.$$.sendResult('success');
    return results;
  } catch (err) {
    context.console.error('error occurred');
    context.console.error(err);
    context.$$.sendResult(err);

    // return Promise.reject(err);
    throw err;
  }
};
