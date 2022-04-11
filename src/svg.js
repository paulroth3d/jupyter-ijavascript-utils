const {
  createSVGWindow
} = require('svgdom');

const svgJS = require('@svgdotjs/svg.js');

const SvgUtilityFunctions = require('./svg_utilityFunctions');

const IJSUtils = require('./ijs');

/**
 * Library for generating SVG programmatically and consistently within Jupyter Lab.
 * 
 * ![Screenshot of multiple rectangles expanding](img/svgRender_2.svg)
 * 
 * Note that there are a few libraries that provide great SVG programmatic support:
 * 
 * * [SVG.js](https://www.npmjs.com/package/@svgdotjs/svg.js)
 * * [Snap.svg](https://www.npmjs.com/package/snapsvg)
 * * [D3.js](https://d3js.org/)
 * * [Processing.org - p5.js](https://p5js.org/)
 * * and a number of others.
 * 
 * Unfortunately, most of them require a DOM, and must be run client side -
 * meaning that the results are lost on export.
 * 
 * The utility here is a wrapper for [SVG.js](https://svgjs.dev/),
 * so SVGs can be rendered either Server-Side (within the Notebook)
 * or Client Side (within the browser rendering the notebook - but lost on export)
 * 
 * **(NOTE: embed is executed client side simply through {@link module:ijs.htmlScript|ijs.htmlScript})**
 * 
 * ![Screenshot of dark animation](img/svgAnimation2Dark.gif)
 * ![Screenshot of light animation](img/svgAnimation2Light.gif)
 * 
 * # Note on Transforms
 * 
 * If you need to combine multiple transforms, we would recommend you use matrices instead, like the following:
 * 
 * ```
 * utils.svg.render({ width: 400, height: 200,
 *     onReady: ({el, width, height }) => {
 *         const yellowTransition = new SVG.Color('#FF0000').to('#00FF00');
 *         for (let i = 0; i <=5; i++){
 *             el.rect(100, 100)
 *                 .fill(yellowTransition.at(i * 0.2).toHex())
 *                 .transform(
 *                     new SVG.Matrix()
 *                         .translate(i * 20, 0)
 *                         .rotate(45)
 *                         .translate(100, 0)
 *                 );
 *         }
 *     }
 * })
 * ```
 * ![Screenshot of multiple transforms](img/svgRender_3.svg)
 * 
 * # Alternatives
 * 
 * Since many of the libraries require a `window` or `document` instance,
 * you can always do something similar to the following:
 * 
 * * create a new `jsdom` window and document 
 * * store the window and document to the `global` or `globalThis` scope
 * * create an instance of an [svg element](https://developer.mozilla.org/en-US/docs/Web/SVG)
 * * THEN import the libraries (now window and document are available)
 * * ... manipulate the svg with the library
 * * FINALLY - capture the svg.outerHTML, and render to $$.svg() / mimetype
 * 
 * The goal with this library is to provide a simple alternative for common scenarios
 * 
 * # P5
 * 
 * Note that other great SVG Libraries are always available:
 * 
 * * [P5.js](https://p5js.org/)
 * * [D3](https://d3js.org/)
 * * [Snap.svg](http://snapsvg.io/)
 * 
 * The simplest is to run them with {@link module:ijs.htmlScript|ijs.htmlScript} and run in the browser,
 * and pull requests are always welcome.
 * 
 * Here is an example running P5.js, without even using the svg module:
 * 
 * [See here for more on instance mode](https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace)
 * 
 * ```
 * utils.ijs.htmlScript({
 *     scripts: [
 *         'https://cdn.jsdelivr.net/npm/p5@1.4.1/lib/p5.js'
 *     ],
 *     debug: true,
 *     onReady: ({rootEl}) => {
 *         const p5_Setup = (p) => {
 *             let x = 100;
 *             let y = 100;
 *             
 *             p.setup = function() {
 *                 p.createCanvas(700, 410);
 *             }
 *             
 *             p.draw = function() {
 *                 p.background(0);
 *                 p.fill(255);
 *                 p.rect(x,y,50,50);
 *             }
 *         };
 *         const myP5 = new p5(p5_Setup, rootEl);
 *     }
 * })
 * ```
 * ![Screenshot with p5](img/svgP5Example.png)
 * 
 * @module svg
 * @exports svg
 */
module.exports = {};
// eslint-disable-next-line no-unused-vars
const SvgUtils = module.exports;

/**
 * Self-Contained functions - suitable to run client side
 * when running {@link module:svg.embed|svg.embed}
 */
module.exports.utilityFunctions = SvgUtilityFunctions;

/**
 * Renders an SVG through a server side instance of [SVG.js](https://svgjs.dev/)
 * 
 * This is a very nice library that generates, modifies and simplifies some aspects
 * of creating your own SVGs.
 * 
 * **Note: server side rendering is meant to be interchangable with the embed version,
 * however there are some differences**
 * 
 * * SVGs created on the server are often included in exports.
 * * Animations are only possible on `embed` versions -
 *    using [requestAnimationFrame](https://caniuse.com/requestanimationframe)
 *    and [cancelAnimationFrame](https://caniuse.com/mdn-api_window_cancelanimationframe)
 * 
 * ## Simple Example
 * 
 * ```
 * utils.svg.render(({el, SVG, width, height}) => {
 *     const colorTransition = new SVG.Color('#FF00FF').to('#0FF');
 * 
 *     // draw a rectangle
 *     const firstRect = el.rect(100, 100)
 *         .fill('#0FF')
 *         .center(300, 100);
 *     
 *     // clone the rectangle, color it with the color range, and move it relative
 *     const secondRect = firstRect.clone()
 *         .fill(colorTransition.at(0))
 *         .dx(-200)
 *         .addTo(el);
 *     
 *     firstRect.clone()
 *         .fill(colorTransition.at(0.5))
 *         .dx(-100)
 *         .addTo(el);
 * });
 * ```
 * ![Screenshot of three boxes](img/svgRender_1.svg)
 * 
 * ## More Complex Example
 * 
 * ```
 * //-- use loops and logic to create shapes
 * utils.svg.render({
 *     width: 400, height: 400, debug: false,
 *     onReady: ({ el, SVG, width, height }) => {
 *         const transition = new SVG.Color('#0d4fa6').to('#ffff00');
 *         const colorTransition = (val) => transition.at(val).toHex();
 *                 
 *         const centerBox = el.rect(10, 10)
 *             .center(width / 2, height / 2)
 *             .fill(colorTransition(0));
 *         let currentBox = centerBox;
 *         let beforeBox = centerBox;
 *         
 *         const numSteps = 20;
 *         for (let i = 0; i < numSteps; i++) {
 *             beforeBox = currentBox;
 *             currentBox = beforeBox.clone()
 *                 .insertBefore(beforeBox)
 *                 .fill({ color: colorTransition((1/numSteps) * i) })
 *                 .scale(1.2)
 *                 .rotate(16)
 *         }
 *     }
 * })
 * ```
 * ![Screenshot of multiple rectangles expanding](img/svgRender_2.svg)
 * 
 * @param {Object} options - options to use for drawing - or an onReady function
 * @param {Function} options.onReady - the function to call to generate the SVG
 * @param {Element} options.onReady.el - the SVG.js primed element to use for drawing
 * @param {any} options.onReady.SVG - the SVG.js library instance
 * @param {Number} options.onReady.width - the options.width value passed, for positioning
 * @param {Number} options.onReady.height - the options.height value passed, for positioning
 * @param {Object} options.onReady.utilityFunctions - the options.utilityFunctions object
 * @param {Object} options.onReady.options - the options object passed
 * @param {boolean} [options.default = false] - whether to print the svg result text
 * @param {Number} [options.width = 400] - the width of the svg to generate
 * @param {Number} [options.height = 200] - ... height
 * @param {Object} [options.utilityFunctions = {}] - an object for self contained functions that can be used in onReady
 */
module.exports.render = function draw(options) {
  const cleanOptions = !options
    ? {}
    : typeof options === 'function'
      ? ({ onReady: options })
      : options;
  const {
    onReady,
    debug = false,
    width = 400,
    height = 200,
    data,
    utilityFunctions = {}
  } = cleanOptions;
  
  if (!onReady) throw Error('svg.draw(options): options.onReady is required');

  const context = IJSUtils.detectContext();
  if (!context) throw Error('svg.draw(options): expected to be run within the iJavaScript context');

  //-- the code running in this function is synchronous
  const window = createSVGWindow();
  svgJS.registerWindow(window, window.document);

  //-- pass the canvas
  const el = svgJS.SVG(window.document.documentElement);

  el.size(width, height);

  try {
    onReady({ el, SVG: svgJS, data, width, height, utilityFunctions, options: cleanOptions });
  } catch (err) {
    context.$$.sendResult(null);
    context.console.error('Error occurred');
    context.console.error(String(err));
    context.console.trace();
    return;
  }

  //-- we now have the svg applied to the el.
  const svgBody = el.svg();

  context.$$.svg(svgBody);

  //-- no need to remove the element from the document
  //-- as the whole window is garbage collected
  // window.document.removeChild(svgJS.el);

  if (debug) context.console.log(svgBody);
};

/**
Renders an SVG through a browser side instance of [SVG.js](https://svgjs.dev/)
 * 
 * This is a very nice library that generates, modifies and simplifies some aspects
 * of creating your own SVGs.
 * 
 * **Note: server side rendering is meant to be interchangable with the embed version,
 * however there are some differences**
 * 
 * * SVGs created on the server are often included in exports.
 * * Animations are only possible on `embed` versions -
 *    using [requestAnimationFrame](https://caniuse.com/requestanimationframe)
 *    and [cancelAnimationFrame](https://caniuse.com/mdn-api_window_cancelanimationframe)
 * 
 * ## Simple Example
 * ```
 * //-- same instance as the svg.render example
 * utils.svg.render(({el, SVG, width, height}) => {
 *     const colorTransition = new SVG.Color('#FF00FF').to('#0FF');
 * 
 *     // draw a rectangle
 *     const firstRect = el.rect(100, 100)
 *         .fill('#0FF')
 *         .center(300, 100);
 *     
 *     // clone the rectangle, color it with the color range, and move it relative
 *     const secondRect = firstRect.clone()
 *         .fill(colorTransition.at(0))
 *         .dx(-200)
 *         .addTo(el);
 *     
 *     firstRect.clone()
 *         .fill(colorTransition.at(0.5))
 *         .dx(-100)
 *         .addTo(el);
 * });
 * ```
 * ![Screenshot of the embed example](img/svgEmbed1.png)
 * 
 * ## Animation Example
 * 
 * ```
 * utils.svg.embed(({ el, SVG, width, height }) => {
 *     var rect1 = el.rect(100, 100)
 *         .move(width/2, 0);
 * 
 *     rect1.animate(1000, 0, 'absolute')
 *         .move(width/2, 100)
 *         .loop(true, true);
 * })
 * ```
 * ![Screenshot of animation with SVG.js](img/svgAnimation1.gif)
 * 
 * With many other complex animations possible
 * 
 * ![Screenshot of dark animation](img/svgAnimation2Dark.gif)
 * 
 * @param {Object} options - options to use for drawing - or an onReady function
 * @param {Function} options.onReady - the function to call to generate the SVG
 * @param {Element} options.onReady.el - the SVG.js primed element to use for drawing
 * @param {any} options.onReady.SVG - the SVG.js library instance
 * @param {Number} options.onReady.width - the options.width value passed, for positioning
 * @param {Number} options.onReady.height - the options.height value passed, for positioning
 * @param {Object} options.onReady.utilityFunctions - the options.utilityFunctions object
 * @param {Object} options.onReady.options - the options object passed
 * @param {boolean} options.debug - default: false - whether to print the svg result text
 * @param {Number} options.width - default: 400 - the width of the svg to generate
 * @param {Number} options.height - default 200 - ... height
 * @param {Object} options.utilityFunctions - optional object for self contained functions that can be used in onReady
 */
module.exports.embed = function embed(options) {
  const cleanOptions = !options
    ? {}
    : typeof options === 'function'
      ? ({ onReady: options })
      : options;
  const {
    onReady,
    debug = false,
    width = 400,
    height = 200,
    version = '3.0',
    scripts = [],
    ...htmlScriptOptions
  } = cleanOptions;
  
  if (!onReady || (typeof onReady !== 'function')) {
    throw Error('svg.embed(options): options.onReady is required and must be a function');
  }

  const context = IJSUtils.detectContext();
  if (!context) throw Error('svg.embed(options): expected to be run within the iJavaScript context');

  return IJSUtils.htmlScript({
    ...htmlScriptOptions,
    scripts: [
      ...scripts,
      `https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@${version}/dist/svg.min.js`
    ],
    width,
    height,
    debug,
    onReady: `
const el = SVG().addTo(rootEl);
const width = ${width};
const height = ${height};
el.size(width, height);

(${onReady.toString()})({ rootEl, el, SVG, data, width, height, utilityFunctions, options });
`
  });
};

module.exports.svgJS = svgJS;
