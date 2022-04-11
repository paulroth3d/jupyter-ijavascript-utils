const Vega = require('vega');
const VegaLite = require('vega-lite');
const VegaLiteApi = require('vega-lite-api');

const InternalHtmlScripts = require('./htmlScript_internal');
const IJSUtils = require('./ijs');

/**
 * Helper for working with [Vega-Lite](https://vega.github.io/vega-lite/) (and [Vega](https://vega.github.io/vega/)) within iJavaScript notebooks.
 * 
 * ([Vega-Lite-Api](https://vega.github.io/vega-lite-api/):
 * creates -> [Vega-Lite JSON specifications](https://vega.github.io/vega-lite/tutorials/getting_started.html):
 * creates -> [Vega charting specifications](https://vega.github.io/):
 * using -> [D3 as a visualization kernel](https://vega.github.io/vega/about/vega-and-d3/))
 * 
 * * Rendering directly as SVG within Jupyter
 *   * {@link module:vega.svg|vega.svg((vl) => vl)} - to render a chart as SVG directly in Jupyter - using the vega-lite-api
 *   * {@link module:vega.svgFromSpec|vega.svgFromSpec(Object | String)} - rendering a chart directly in Jupyter - using a vega-lite specification
 *   * {@link module:vega.svgFromVegaSpec|vega.svgFromSpec(Object | String)} - renders a chart directly in Jupyter - using a vega specificiation
 * * Rendering as HTML / JavaScript through {@link module:ijs.htmlScript|ijs.htmlScript()}
 *   * {@link module:vega.embed|vega.embed((vl) => vl)} - to render a chart in the browser - using the vega-lite-api
 *   * {@link module:vega.embedFromSpec|vega.embedFromSpec(Object | String)} - rendering a chart in the browser - using a vega-lite specification
 *   * {@link module:vega.embedFromVegaSpec|vega.embedFromVegaSpec(Object | String)} - renders a chart in the browser - using a vega specificiation
 * 
 * * Rendering specifications through the Jupyter Lab mime-type
 *   * {@link module:vega.vegaMimeType|vega.vegaMimeType(Object | String)} - render the chart using the Vega mime-type (as png)
 *   * {@link module:vega.vegaLiteMimeType|vega.vegaLiteMimeType(Object | String)} - render the chart using the Vega-Lite mime-type (as png)
 * -----
 * 
 * * Check out the {@tutorial vegaLite1} tutorials
 * * See the excellent [Vega-Lite-API Observable Notebooks](https://observablehq.com/collection/@vega/vega-lite-api)
 * and [Jeffrey Heer's Curriculum](https://observablehq.com/@uwdata/data-visualization-curriculum?collection=@uwdata/visualization-curriculum)
 * * or see the [Vega-Lite Examples](https://vega.github.io/vega-lite/examples/) and [Vega Examples](https://vega.github.io/vega/examples/)
 * * and of course the documentation is available:
 *   [Vega-Lite-API](https://vega.github.io/vega-lite-api/api/), 
 *   [Vega-Lite](https://vega.github.io/vega-lite/docs/spec.html), 
 *   [Vega](https://vega.github.io/vega/docs/specification/)
 * 
 * # What is Vega-Lite / Vega-Lite-API?
 * 
 * [Vega-Lite](https://vega.github.io/vega-lite) is a charting library that provides a great deal of flexibility and interaction
 * while also allowing for very simple use cases <br />
 * (and further simplified with [Vega-Lite-Api](https://vega.github.io/vega-lite-api/))
 * 
 * ![Screenshot of vega lite examples from vega-lite home](img/vegaLiteExamples.png)
 * 
 * It is built on [Vega](https://vega.github.io/vega/) that uses [d3 as a visualization kernel](https://vega.github.io/vega/about/vega-and-d3/).
 * 
 * Note that Vega-Lite is supported by two options within this library:
 * 
 * * through the [vega-lite JSON specification](https://vega.github.io/vega-lite/tutorials/getting_started.html) - a high level grammar that creates 
 *   * {@link module:vega.embed|vega.embed((vl) => vl)} - to render a chart in the browser - using the vega-lite-api
 *   * {@link module:vega.svg|vega.svg((vl) => vl)} - to render a chart as SVG directly in Jupyter - using the vega-lite-api
 * * through the [vega-lite-api](https://vega.github.io/vega-lite-api/) - a JavaScript api to write the vega-lite specifications
 *   * {@link module:vega.embedFromSpec|vega.embedFromSpec(Object | String)} - rendering a chart in the browser - using a vega-lite specification
 *   * {@link module:vega.svgFromSpec|vega.svgFromSpec(Object | String)} - rendering a chart directly in Jupyter - using a vega-lite specification
 * 
 * **(Where `svg` renders directly in Jupyter, and `embed` uses {@link module:ijs.htmlScript|ijs.htmlScript()} to render)**
 * 
 * Note that rendering in the browser (as html / javascript), will provide more interactivity options (like export options)
 * while also having consequences in exporting the notebook in some cases.
 * 
 * # What is Vega?
 * 
 * True [Vega](https://vega.github.io/vega/) is also supported, providing support for additional capabilities
 * (that to my knowledge cannot be done with vega-lite)
 * such as [Radar Charts](https://vega.github.io/vega/examples/radar-chart/),
 * [Contour Plots](https://vega.github.io/vega/examples/contour-plot/),
 * [Tree Layouts](https://vega.github.io/vega/examples/tree-layout/),
 * [Force Plots](https://vega.github.io/vega/examples/force-directed-layout/),
 * and others.
 * 
 * However Vega does not have a JavaScript API:
 *   * {@link module:vega.embedFromVegaSpec|vega.embedFromVegaSpec(Object | String)} - renders a chart in the browser - using a vega specificiation
 *   * {@link module:vega.svgFromVegaSpec|vega.svgFromSpec(Object | String)} - renders a chart directly in Jupyter - using a vega specificiation
 * 
 * ![Screenshot of Vega Charts](img/vegaChartExamples.jpg)
 * 
 * In the context of Notebooks - is expected that Vega-Lite will be sufficient for most cases.
 * 
 * # Embedding vs SVG
 * 
 * SVG versions of charts render directly within Jupyter Notebook (as svg output)
 * 
 * (As a rule - `embed...` calls and `svg...` calls can be easily interchanged)
 * 
 * Embedding means the charts run within the browser (through dynamic HTML in the output).
 * 
 * This provides greater flexibility
 * (at the consequence of complexity of splitting computation between jupyter and browser)
 * 
 * As opposed to the SVG version, we can now:
 * 
 * * use [vega-embed]() allowing for downloading of the chart
 * 
 * ![Screenshot of Vega-Embed](img/vegaEmbed.png);
 * 
 * * support for interactions and interactive dashboards
 * 
 * ```
 * utils.vega.svgFromSpec({
 *   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
 *   "data": {"url": "https://vega.github.io/vega-lite/examples/data/sp500.csv"},
 *   "vconcat": [{
 *     "width": 480,
 *     "mark": "area",
 *     "encoding": {
 *       "x": {
 *         "field": "date",
 *         "type": "temporal",
 *         "scale": {"domain": {"param": "brush"}},
 *         "axis": {"title": ""}
 *       },
 *       "y": {"field": "price", "type": "quantitative"}
 *     }
 *   }, {
 *     "width": 480,
 *     "height": 60,
 *     "mark": "area",
 *     "params": [{
 *       "name": "brush",
 *       "select": {"type": "interval", "encodings": ["x"]}
 *     }],
 *     "encoding": {
 *       "x": {
 *         "field": "date",
 *         "type": "temporal"
 *       },
 *       "y": {
 *         "field": "price",
 *         "type": "quantitative",
 *         "axis": {"tickCount": 3, "grid": false}
 *       }
 *     }
 *   }]
 * });
 * ```
 * 
 * ![Screenshot of interactive charts](img/vegaScript_interactiveCharts.png)
 * 
 * * support for tooltips within the Jupyter cell
 * 
 * ```
 * utils.vega.embedFromSpec({
 *   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
 *   "description": "A scatterplot showing horsepower and miles per gallons that opens a Google search for the car that you click on.",
 *   "data": {"url": "https://vega.github.io/vega-lite/examples/data/cars.json"},
 *   "height": 600,
 *   "width": 400,
 *   "mark": "point",
 *   "transform": [{
 *     "calculate": "'https://www.google.com/search?q=' + datum.Name", "as": "url"
 *   }],
 *   "encoding": {
 *     "x": {"field": "Horsepower", "type": "quantitative"},
 *     "y": {"field": "Miles_per_Gallon", "type": "quantitative"},
 *     "color": {"field": "Origin", "type": "nominal"},
 *     "tooltip": {"field": "Name", "type": "nominal"},
 *     "href": {"field": "url", "type": "nominal"}
 *   }
 * });
 * ```
 * 
 * ![Screenshot for tooltips](img/vegaScript_tooltips.png)
 * 
 * ---
 * 
 * For more:
 * 
 * * Check out the {@tutorial vegaLite1} tutorials
 * * See the excellent [Vega-Lite-API Observable Notebooks](https://observablehq.com/collection/@vega/vega-lite-api)
 * and [Jeffrey Heer's Curriculum](https://observablehq.com/@uwdata/data-visualization-curriculum?collection=@uwdata/visualization-curriculum)
 * * or see the [Vega-Lite Examples](https://vega.github.io/vega-lite/examples/) and [Vega Examples](https://vega.github.io/vega/examples/)
 * 
 * @module vega
 * @exports vega
 */
module.exports = {};

// eslint-disable-next-line no-unused-vars
const VegaUtils = module.exports;

//-- instance of vega lite used exclusively for SVG rendering
const vl = VegaLiteApi.register(Vega, VegaLite, {
  config: {
    // vega-lite default configuration
    config: {
      view: { continuousWidth: 400, continuousHeight: 300 },
      mark: {} // tooltip: null
    }
  },
  view: {
    renderer: 'svg'
  }
});

/**
 * Renders a svg of a vega lite diagram directly within Jupyter
 * 
 * Unlike {@link module:vega.embed|vega.embed()} - this renders directly within Jupyter.
 * 
 * ```
 * vl.svg((vl) => vl.markCircle()
 *   .title('Binned Rotten Tomatoes Rating by IMDB Rating')
 *   .data(movies)
 *   .encode(
 *     vl.x().fieldQ('Rotten Tomatoes Rating').bin({maxbins: 20}),
 *     vl.y().fieldQ('IMDB Rating').bin({maxbins: 20}),
 *     vl.size().count()
 *   ));
 * ```
 * 
 * ![Screenshot of Binned Vega Chart](img/MoviesRTbyIMDB.png)
 * 
 * See the {@tutorial vegaLite1} tutorial.
 * 
 * @param {Function} fn - function of type (vl) => {encodedVegaLite)
 *    that returns the vega lite instance encoded for a graph
 * @param {VegaLiteInstance} fn.vl - Parameter: The Vega Lite instance
 * @param {Display} display - the iJavaScript Display.
 *    (Note: $$ refers to the current display within the iJavaScript kernel)
 *    See [the NEL documentation for more](http://n-riesco.github.io/ijavascript/doc/custom.ipynb.html#Setting-the-output-using-the-global-object-$$)
 */
module.exports.svg = async function svg(fn, targetDisplay) {
  const context = IJSUtils.detectContext();
  if (!context) throw (Error('No display sent. Expected to be called within iJavaScript'));
  const { $$: display, console: cellConsole } = context;

  display.async();

  try {
    const vegaMarkers = fn.call(vl, vl);
    const { spec } = VegaLite.compile(vegaMarkers.toSpec());

    const view = new Vega.View(Vega.parse(spec), { renderer: 'none' });

    const svgText = await view.toSVG();
    display.svg(svgText);
  } catch (err) {
    display.sendResult(null);
    cellConsole.error('Error occurred');
    cellConsole.error(String(err));
    cellConsole.trace();
  }
};

/**
 * Renders a vega-lite diagram within {@link module:ijs.htmlScript|ijs.htmlScript} (browser).
 * 
 * Unlike {@link module:vega.embed|vega.svg()} - this renders with {@link module:ijs.htmlScript|ijs.htmlScript} (html)
 * 
 * Please note that `svg...` and `embed...` calls are meant to be easily interchangable.
 * 
 * ```
 * vl.embed((vl) => vl.markCircle()
 *   .title('Binned Rotten Tomatoes Rating by IMDB Rating')
 *   .data(movies)
 *   .encode(
 *     vl.x().fieldQ('Rotten Tomatoes Rating').bin({maxbins: 20}),
 *     vl.y().fieldQ('IMDB Rating').bin({maxbins: 20}),
 *     vl.size().count()
 *   ));
 * ```
 * 
 * ![Screenshot of embed](img/vegaEmbedExample.png)
 * 
 * See the {@tutorial vegaLite1} tutorial.
 * 
 * @param {Function} fn - function of type (vl) => {encodedVegaLite)
 *    that returns the vega lite instance encoded for a graph
 * @param {VegaLiteInstance} fn.vl - Parameter: The Vega Lite instance
 * @param {Display} display - the iJavaScript Display.
 *    (Note: $$ refers to the current display within the iJavaScript kernel)
 *    See [the NEL documentation for more](http://n-riesco.github.io/ijavascript/doc/custom.ipynb.html#Setting-the-output-using-the-global-object-$$)
 */
module.exports.embed = function embed(fn, options) {
  const context = IJSUtils.detectContext();
  if (!context) throw (Error('No display sent. Expected to be called within iJavaScript'));
  const { $$: display, console: cellConsole } = context;

  const {
    scripts = []
  } = options;

  display.async();

  try {
    const vegaMarkers = fn.call(vl, vl);
    const { spec } = VegaLite.compile(vegaMarkers.toSpec());

    IJSUtils.htmlScript({
      ...options,
      data: spec,
      scripts: [
        ...scripts,
        'https://cdn.jsdelivr.net/npm/vega@5',
        'https://cdn.jsdelivr.net/npm/vega-lite@5',
        'https://cdn.jsdelivr.net/npm/vega-embed@6'
      ],
      onReady: InternalHtmlScripts.embedFromSpecOnReady
    });
    
    // const view = new Vega.View(Vega.parse(compiledSpec), { renderer: 'none' });
    // const svgText = await view.toSVG();
    // display.svg(svgText);
  } catch (err) {
    display.sendResult(null);
    cellConsole.error('Error occurred');
    cellConsole.error(String(err));
    cellConsole.trace();
  }
};

/**
 * Renders a vega-lite chart from a JSON / Object specification.
 * 
 * Unlike {@link module:vega.embedFromSpec|vega.embedFromSpec()} - this renders directly within Jupyter.
 * 
 * Such as [this one for bar charts](https://vega.github.io/vega-lite/examples/bar.html)
 * from the [vega lite examples](https://vega.github.io/vega-lite/examples/)
 * 
 * You can either pass the Schema as:
 * 
 * * parsed JSON Objects (allowing for sending NodeJS data and config)
 * * or as a JSON encoded string
 * 
 * ## Parsed JSON 
 * 
 * ```
 * sampleData = [
 *   {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
 *   {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
 *   {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
 * ];
 * utils.vega.svgFromSpec(
 * {
 *   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
 *   "description": "A simple bar chart with embedded data.",
 *   "data": {
 *     "values": sampleData
 *   },
 *   "mark": "bar",
 *   "encoding": {
 *     "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
 *     "y": {"field": "b", "type": "quantitative"}
 *   }
 * });
 * ```
 * 
 * ![Screenshot of object schema](img/vegaObjectSchema.png)
 * 
 * * JSON encoded String
 * 
 * ```
 * utils.vega.svgFromSpec(`
 * {
 *   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
 *   "description": "A simple bar chart with embedded data.",
 *   "data": {
 *     "values": [
 *       {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
 *       {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
 *       {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
 *     ]
 *   },
 *   "mark": "bar",
 *   "encoding": {
 *     "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
 *     "y": {"field": "b", "type": "quantitative"}
 *   }
 * }`)
 * ```
 * 
 * ![Screenshot of the string parsed](img/vegaStringSchema.png)
 * 
 * @param {String} vegaSpec - Vega string specification
 * @param {Display} display - the iJavaScript display
 */
module.exports.svgFromSpec = async function svgFromSpec(spec, targetDisplay) {
  const context = IJSUtils.detectContext();
  if (!context) throw (Error('No display sent. Expected to be called within iJavaScript'));
  const { $$: display, console: cellConsole } = context;

  display.async();

  try {
    let jsonResult = spec;
    if (typeof spec === 'string') {
      jsonResult = JSON.parse(spec);
    }
    const compiledSpec = VegaLite.compile(jsonResult).spec;
    
    const view = new Vega.View(Vega.parse(compiledSpec), { renderer: 'none' });

    const svgText = await view.toSVG();
    display.svg(svgText);
  } catch (err) {
    display.sendResult(null);
    cellConsole.error('Error occurred');
    cellConsole.error(String(err));
    cellConsole.trace();
  }
};

/**
 * Renders a vega-lite chart from a JSON / Object specification.
 * 
 * Unlike {@link module:vega.svgFromSpec|vega.svgFromSpec()} - this renders with {@link module:ijs.htmlScript|ijs.htmlScript} (html)
 * 
 * You can either pass directly the Schema Objects
 * (ex: parsed JSON [from the vega lite examples](https://vega.github.io/vega-lite/examples/))
 * 
 * [Such as this one for bar charts](https://vega.github.io/vega-lite/examples/bar.html)
 * 
 * ```
 * sampleData = [
 *   {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
 *   {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
 *   {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
 * ];
 * utils.vega.embedFromSpec(
 * {
 *   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
 *   "description": "A simple bar chart with embedded data.",
 *   "data": {
 *     "values": sampleData
 *   },
 *   "mark": "bar",
 *   "encoding": {
 *     "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
 *     "y": {"field": "b", "type": "quantitative"}
 *   }
 * });
 * ```
 * 
 * ![Screenshot of object schema](img/vegaObjectSchema.png)
 * 
 * ... or the strings directly from [the vega lite examples](https://vega.github.io/vega-lite/examples/).
 * 
 * ```
 * utils.vega.embedFromSpec(`
 * {
 *   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
 *   "description": "A simple bar chart with embedded data.",
 *   ...
 * }`)
 * ```
 * 
 * @param {String} vegaSpec - Vega string specification
 * @param {Display} display - the iJavaScript display
 */
module.exports.embedFromSpec = function embedFromSpec(spec, options) {
  const context = IJSUtils.detectContext();
  if (!context) throw (Error('No display sent. Expected to be called within iJavaScript'));
  const { $$: display, console: cellConsole } = context;

  display.async();

  try {
    let jsonResult = spec;
    if (typeof spec === 'string') {
      jsonResult = JSON.parse(spec);
    }
    const compiledSpec = VegaLite.compile(jsonResult).spec;

    IJSUtils.htmlScript({
      ...options,
      data: compiledSpec,
      scripts: [
        'https://cdn.jsdelivr.net/npm/vega@5',
        'https://cdn.jsdelivr.net/npm/vega-lite@5',
        'https://cdn.jsdelivr.net/npm/vega-embed@6'
      ],
      onReady: InternalHtmlScripts.embedFromSpecOnReady
    });
    
    // const view = new Vega.View(Vega.parse(compiledSpec), { renderer: 'none' });
    // const svgText = await view.toSVG();
    // display.svg(svgText);
  } catch (err) {
    display.sendResult(null);
    cellConsole.error('Error occurred');
    cellConsole.error(String(err));
    cellConsole.trace();
  }
};

/**
 * Renders a Vega (not Vega-lite) chart from a JSON / Object specification.
 * 
 * Unlike {@link module:vega.embedFromVegaSpec|vega.embedFromVegaSpec()} - this renders directly within Jupyter.
 * 
 * Similar to {@link module:vega.svgFromSpec|vega.svgFromSpec()},
 * the specification can either be an object or JSON encoded string. 
 * 
 * This example is from the [Vega Line Chart example](https://vega.github.io/vega/examples/line-chart/)
 * 
 * ```
 * utils.vega.svgFromSpec({
 *   "$schema": "https://vega.github.io/schema/vega/v5.json",
 *   "description": "A basic line chart example.",
 *   "width": 500,
 *   "height": 200,
 *   "padding": 5,
 * 
 *   "signals": [
 *     {
 *       "name": "interpolate",
 *       "value": "linear",
 *       "bind": {
 *         "input": "select",
 *         "options": [
 *           "basis",
 *           "cardinal",
 *           "catmull-rom",
 *           "linear",
 *           "monotone",
 *           "natural",
 *           "step",
 *           "step-after",
 *           "step-before"
 *         ]
 *       }
 *     }
 *   ],
 * 
 *   "data": [
 *     {
 *       "name": "table",
 *       "values": [
 *         {"x": 0, "y": 28, "c":0}, {"x": 0, "y": 20, "c":1},
 *         {"x": 1, "y": 43, "c":0}, {"x": 1, "y": 35, "c":1},
 *         {"x": 2, "y": 81, "c":0}, {"x": 2, "y": 10, "c":1},
 *         {"x": 3, "y": 19, "c":0}, {"x": 3, "y": 15, "c":1},
 *         {"x": 4, "y": 52, "c":0}, {"x": 4, "y": 48, "c":1},
 *         {"x": 5, "y": 24, "c":0}, {"x": 5, "y": 28, "c":1},
 *         {"x": 6, "y": 87, "c":0}, {"x": 6, "y": 66, "c":1},
 *         {"x": 7, "y": 17, "c":0}, {"x": 7, "y": 27, "c":1},
 *         {"x": 8, "y": 68, "c":0}, {"x": 8, "y": 16, "c":1},
 *         {"x": 9, "y": 49, "c":0}, {"x": 9, "y": 25, "c":1}
 *       ]
 *     }
 *   ],
 * 
 *   "scales": [
 *     {
 *       "name": "x",
 *       "type": "point",
 *       "range": "width",
 *       "domain": {"data": "table", "field": "x"}
 *     },
 *     {
 *       "name": "y",
 *       "type": "linear",
 *       "range": "height",
 *       "nice": true,
 *       "zero": true,
 *       "domain": {"data": "table", "field": "y"}
 *     },
 *     {
 *       "name": "color",
 *       "type": "ordinal",
 *       "range": "category",
 *       "domain": {"data": "table", "field": "c"}
 *     }
 *   ],
 * 
 *   "axes": [
 *     {"orient": "bottom", "scale": "x"},
 *     {"orient": "left", "scale": "y"}
 *   ],
 * 
 *   "marks": [
 *     {
 *       "type": "group",
 *       "from": {
 *         "facet": {
 *           "name": "series",
 *           "data": "table",
 *           "groupby": "c"
 *         }
 *       },
 *       "marks": [
 *         {
 *           "type": "line",
 *           "from": {"data": "series"},
 *           "encode": {
 *             "enter": {
 *               "x": {"scale": "x", "field": "x"},
 *               "y": {"scale": "y", "field": "y"},
 *               "stroke": {"scale": "color", "field": "c"},
 *               "strokeWidth": {"value": 2}
 *             },
 *             "update": {
 *               "interpolate": {"signal": "interpolate"},
 *               "strokeOpacity": {"value": 1}
 *             },
 *             "hover": {
 *               "strokeOpacity": {"value": 0.5}
 *             }
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * });
 * ```
 * 
 * ![Screenshot of vega svg chart](img/vegaSvgSpecExample.png)
 * 
 * @param {String | Object} spec - Vega specification
 */
module.exports.svgFromVegaSpec = async function svgFromVegaSpec(spec) {
  const context = IJSUtils.detectContext();
  if (!context) throw (Error('No display sent. Expected to be called within iJavaScript'));
  const { $$: display, console: cellConsole } = context;

  display.async();

  try {
    let jsonResult = spec;
    if (typeof spec === 'string') {
      jsonResult = JSON.parse(spec);
    }
    
    const view = new Vega.View(Vega.parse(jsonResult), { renderer: 'svg' });

    const svgText = await view.toSVG();
    display.svg(svgText);
  } catch (err) {
    display.sendResult(null);
    cellConsole.error('Error occurred');
    cellConsole.error(String(err));
    cellConsole.trace();
  }
};

/**
 * Renders an Vega (not Vega-lite) chart from a JSON / Object specification.
 * 
 * Unlike {@link module:vega.svgFromVegaSpec|vega.svgFromVegaSpec()} - this renders with {@link module:ijs.htmlScript|ijs.htmlScript} (html)
 * 
 * Similar to {@link module:vega.svgFromSpec|vega.svgFromSpec()},
 * the specification can either be an object or JSON encoded string. 
 * 
 * This example is from the [Vega Line Chart example](https://vega.github.io/vega/examples/line-chart/)
 * 
 * ```
 * utils.vega.embedFromVegaSpec({
 *   "$schema": "https://vega.github.io/schema/vega/v5.json",
 *   "description": "A basic line chart example.",
 *   "width": 500,
 *   "height": 200,
 *   "padding": 5,
 * 
 *   "signals": [
 *     {
 *       "name": "interpolate",
 *       "value": "linear",
 *       "bind": {
 *         "input": "select",
 *         "options": [
 *           "basis",
 *           "cardinal",
 *           "catmull-rom",
 *           "linear",
 *           "monotone",
 *           "natural",
 *           "step",
 *           "step-after",
 *           "step-before"
 *         ]
 *       }
 *     }
 *   ],
 * 
 *   "data": [
 *     {
 *       "name": "table",
 *       "values": [
 *         {"x": 0, "y": 28, "c":0}, {"x": 0, "y": 20, "c":1},
 *         {"x": 1, "y": 43, "c":0}, {"x": 1, "y": 35, "c":1},
 *         {"x": 2, "y": 81, "c":0}, {"x": 2, "y": 10, "c":1},
 *         {"x": 3, "y": 19, "c":0}, {"x": 3, "y": 15, "c":1},
 *         {"x": 4, "y": 52, "c":0}, {"x": 4, "y": 48, "c":1},
 *         {"x": 5, "y": 24, "c":0}, {"x": 5, "y": 28, "c":1},
 *         {"x": 6, "y": 87, "c":0}, {"x": 6, "y": 66, "c":1},
 *         {"x": 7, "y": 17, "c":0}, {"x": 7, "y": 27, "c":1},
 *         {"x": 8, "y": 68, "c":0}, {"x": 8, "y": 16, "c":1},
 *         {"x": 9, "y": 49, "c":0}, {"x": 9, "y": 25, "c":1}
 *       ]
 *     }
 *   ],
 * 
 *   "scales": [
 *     {
 *       "name": "x",
 *       "type": "point",
 *       "range": "width",
 *       "domain": {"data": "table", "field": "x"}
 *     },
 *     {
 *       "name": "y",
 *       "type": "linear",
 *       "range": "height",
 *       "nice": true,
 *       "zero": true,
 *       "domain": {"data": "table", "field": "y"}
 *     },
 *     {
 *       "name": "color",
 *       "type": "ordinal",
 *       "range": "category",
 *       "domain": {"data": "table", "field": "c"}
 *     }
 *   ],
 * 
 *   "axes": [
 *     {"orient": "bottom", "scale": "x"},
 *     {"orient": "left", "scale": "y"}
 *   ],
 * 
 *   "marks": [
 *     {
 *       "type": "group",
 *       "from": {
 *         "facet": {
 *           "name": "series",
 *           "data": "table",
 *           "groupby": "c"
 *         }
 *       },
 *       "marks": [
 *         {
 *           "type": "line",
 *           "from": {"data": "series"},
 *           "encode": {
 *             "enter": {
 *               "x": {"scale": "x", "field": "x"},
 *               "y": {"scale": "y", "field": "y"},
 *               "stroke": {"scale": "color", "field": "c"},
 *               "strokeWidth": {"value": 2}
 *             },
 *             "update": {
 *               "interpolate": {"signal": "interpolate"},
 *               "strokeOpacity": {"value": 1}
 *             },
 *             "hover": {
 *               "strokeOpacity": {"value": 0.5}
 *             }
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * });
 * ```
 * 
 * ![Screenshot of vega schema chart](img/vegaSpecExample.png)
 * 
 * @param {String | Object} spec - Vega specification
 */
module.exports.embedFromVegaSpec = function embedFromVegaSpec(spec, options) {
  const context = IJSUtils.detectContext();
  if (!context) throw (Error('No display sent. Expected to be called within iJavaScript'));
  const { $$: display, console: cellConsole } = context;

  display.async();

  try {
    let jsonResult = spec;
    if (typeof spec === 'string') {
      jsonResult = JSON.parse(spec);
    }
    const compiledSpec = jsonResult;

    IJSUtils.htmlScript({
      ...options,
      data: compiledSpec,
      scripts: [
        'https://cdn.jsdelivr.net/npm/vega@5',
        'https://cdn.jsdelivr.net/npm/vega-lite@5',
        'https://cdn.jsdelivr.net/npm/vega-embed@6'
      ],
      onReady: InternalHtmlScripts.embedFromSpecOnReady
    });
    
    // const view = new Vega.View(Vega.parse(compiledSpec), { renderer: 'none' });
    // const svgText = await view.toSVG();
    // display.svg(svgText);
  } catch (err) {
    display.sendResult(null);
    cellConsole.error('Error occurred');
    cellConsole.error(String(err));
    cellConsole.trace();
  }
};

/**
 * Renders the vega-lite-api to its JSON spec in the console.
 * 
 * (The spec objects are what the vega-lite and vega ultimately use to render)
 * 
 * This can be helpful in converting a vega-lite-api example to spec,
 * or in understanding what the vega-lite-api is doing - to allow for finer control.
 *  
 * @param {Function} fn - (vl) => {vega lite object} - function to be evaluated
 * @param {Object} fn.vl - the default vega-lite-api instance
 * @example
 * utils.vega.renderSpec((vl) => vl.markBar()
 *   .data({ url: 'data/movies.json' })
 *   .encode(
 *     vl.x().fieldQ('IMDB_Rating').bin(true),
 *     vl.y().count()
 *   ));
 * 
 * //-- the following is output to the console:
 * // {
 * //   "mark": "bar",
 * //   "data": {"url": "data/movies.json"},
 * //   "encoding": {
 * //     "x": {
 * //       "bin": true,
 * //       "field": "IMDB_Rating",
 * //       "type": "quantitative"
 * //     },
 * //     "y": {
 * //       "aggregate": "count",
 * //       "type": "quantitative"
 * //     }
 * //   }
 * // }
 */
/*
module.exports.renderSpec = function renderSpec(fn) {
  const context = IJSUtils.detectContext();
  if (!context) throw (Error('No display sent. expected vega.svg(fn, display) within iJavaScript'));
  const { $$: display } = context;

  display.async();

  try {
    const vegaMarkers = fn.call(vl, vl);
    const spec = vegaMarkers.toSpec();
  
    context.console(JSON.stringify(spec));
  } catch (err) {
    display.sendResult(null);
    console.error('Error occurred');
    console.error(String(err));
    console.trace();
  }
};
*/

/**
 * Send a vega specification using the vega mime-type.
 * 
 * Note, the {@link module:vega.svgFromVegaSpec|vega.svgFromVegaSpec()}
 * and {@link module:vega.embedFromVegaSpec|vega.embedFromVegaSpec()} are recommended,
 * as there are some situations this has seemed to fail.
 * 
 * [See the supported Jupyter Lab mime-types for additional detail](https://jupyterlab.readthedocs.io/en/2.2.x/user/file_formats.html#vega-vega-lite)
 * 
 * @param {Object | String} vegaSpec - vega specification
 * @example
 * // vega specification examples found here: https://vega.github.io/vega/examples/
 * utils.vega.vegaMimeType({
 *   "$schema": "https://vega.github.io/schema/vega/v5.json",
 *   "description": "An example of a space-fulling radial layout for hierarchical data.",
 *   "width": 600,
 *   "height": 600,
 *   "padding": 5,
 *   "autosize": "none",
 * 
 *   "data": [
 *     {
 *       "name": "tree",
 *       "url": "https://vega.github.io/vega/data/flare.json",
 *       "transform": [
 *         {
 *           "type": "stratify",
 *           "key": "id",
 *           "parentKey": "parent"
 *         },
 *         {
 *           "type": "partition",
 *           "field": "size",
 *           "sort": {"field": "value"},
 *           "size": [{"signal": "2 * PI"}, {"signal": "width / 2"}],
 *           "as": ["a0", "r0", "a1", "r1", "depth", "children"]
 *         }
 *       ]
 *     }
 *   ],
 *   ...
 * });
 */
module.exports.vegaMimeType = function vegaMimeType(vegaSpec) {
  const context = IJSUtils.detectContext();
  if (!context) throw (Error('No display sent. Expected to be called within iJavaScript'));
  const { $$: display } = context;

  display.mime({ 'application/vnd.vega.v5+json': vegaSpec });
};

/**
 * Sends a vega-lite specification using the vega-lite mime-type.
 * 
 * Note, the {@link module:vega.svgFromSpec|vega.svgFromSpec()} and {@link module:vega.embedFromSpec|vega.embedFromSpec()} are recommended,
 * as there are a few situations this has seemed to fail.
 * 
 * [See the supported Jupyter Lab mime-types for additional detail](https://jupyterlab.readthedocs.io/en/2.2.x/user/file_formats.html#vega-vega-lite)
 * 
 * @param {Object | String} vegaLiteSpec - vega-lite specification
 * @example
 * // vega-lite spec examples found here: https://vega.github.io/vega-lite/examples/
 * utils.vega.vegaLiteMimeType({
 *   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
 *   "description": "A simple bar chart with embedded data.",
 *   "data": {
 *     "values": [
 *       {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
 *       {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53},
 *       {"a": "G", "b": 19}, {"a": "H", "b": 87}, {"a": "I", "b": 52}
 *     ]
 *   },
 *   "mark": "bar",
 *   "encoding": {
 *     "x": {"field": "a", "type": "nominal", "axis": {"labelAngle": 0}},
 *     "y": {"field": "b", "type": "quantitative"}
 *   }
 * });
 */
module.exports.vegaLiteMimeType = function vegaLiteMimeType(vegaLiteSpec) {
  const context = IJSUtils.detectContext();
  if (!context) throw (Error('No display sent. Expected to be called within iJavaScript'));
  const { $$: display } = context;

  display.mime({ 'application/vnd.vegalite.v3+json': vegaLiteSpec });
};
