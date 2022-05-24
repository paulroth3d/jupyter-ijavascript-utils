const vegaDatasets = require('vega-datasets');
const fetch = require('node-fetch');

/**
 * Utilities to facilitate working with [vega/vega-datasets](https://github.com/vega/vega-datasets)
 * 
 * Vega datasets are a collection of datasets used in Vega and in Vega-Lite examples.
 * 
 * The data lives at [https://github.com/vega/vega-datasets](https://github.com/vega/vega-datasets)
 * and [https://cdn.jsdelivr.net/npm/vega-datasets](https://cdn.jsdelivr.net/npm/vega-datasets)
 * 
 * **For those of you familiar with Pandas, please consider looking at [danfo.js](https://danfo.jsdata.org/)
 * and [DataFrame.js](https://gmousse.gitbooks.io/dataframe-js/content/#dataframe-js)**
 * 
 * * {@link module:datasets.list|list()} - retrieves the list of the datasets available
 * * {@link module:datasets.fetch|fetch(datasetName)} - returns a promise and fetches the dataset
 * 
 * @module datasets
 * @exports datasets
 * 
 * @example
 * 
 * datasets.list(); //-- prints the list of the datasets supported
 * myDataset = datasets.fetch('cars.json');
 * 
 */
module.exports = {};
const DatasetUtils = module.exports;

//-- setup datasets
/**
 * Polyfill for 'global.fetch' if your nodejs instance does not have an implementation
 * (and will only polyfill if so);
 * 
 * Once executed, global.fetch will have an implementation.
 * 
 * {@link https://www.npmjs.com/package/node-fetch|See the `node-fetch` library for more details}
 */
module.exports.polyfillFetch = function polyfillFetch() {
  if ((typeof global.fetch) === 'undefined') {
    global.fetch = fetch;
  }
};

/**
 * Prints the lists of datasets available
 * @returns {String[]} - list of dataset ids that can be fetched.
 * 
 * @example
 * 
 * datasets.list();
 * 
 * // [
 * // 'annual-precip.json',
 * // 'anscombe.json',
 * // 'barley.json',
 * // 'budget.json',
 * // 'budgets.json',
 * // 'burtin.json',
 * // 'cars.json',
 * // 'countries.json',
 * // 'crimea.json',
 * // 'driving.json',
 * // ... ];
 */
module.exports.list = () => Object.keys(vegaDatasets).filter((r) => r.endsWith('.json'));

/**
 * Shim for fetching things through the node-fetch library
 * @private
 */
module.exports.nodeFetch = fetch;

/**
 * Fetches a specific dataset from within the list available from [vega-datasets](https://github.com/vega/vega-datasets)
 * 
 * Example:
 * 
 * Using `utils.datasets.list()` we can see the list of datasets
 * ```
 * ['barley.json', 'cars.json', ...]
 * ```
 * 
 * We can then fetch the dataset using that key, and accepting the promise.
 * (Note that this option does not pause execution before running the next cell)
 * 
 * ```
 * datasets.fetch('cars.json').then(results => cars = results);
 * [
 *   {
 *     Name: 'chevrolet chevelle malibu',
 *     Miles_per_Gallon: 18,
 *     Cylinders: 8,
 *     Displacement: 307,
 *     Horsepower: 130,
 *     Weight_in_lbs: 3504,
 *     Acceleration: 12,
 *     Year: '1970-01-01',
 *     Origin: 'USA'
 *   },
 *   ...
 * ];
 * ```
 * 
 * **Note** - the {@link module:ijs.await|utils.ijs.await method} can simplify this call, to support await.
 * 
 * ```
 * utils.ijs.await(async ($$, console) => {
 *   gapMinder = await utils.datasets.load('gapminder.json');
 * });
 * ```
 * 
 * @param {string} library - one of the names of the libraries available from list
 * @returns {Promise<any>} - results from the dataset
 * @see #~list
 */
module.exports.fetch = (library) => {
  const listSet = new Set(DatasetUtils.list());
  if (!listSet.has(library)) {
    throw new Error(`datasets do not contain[${library}] : ${listSet}`);
  }

  DatasetUtils.polyfillFetch();
  return vegaDatasets[library]();
};

/**
 * Simple `fetch` call for JSON handling simple cases.
 * 
 * ```
 * const response = await fetch(targetAddress, options);
 * if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
 * return response.json();
 * ```
 * 
 * @param {String} targetAddress - Address of the file to load
 * @param {Object} options - options to pass to fetch
 * @returns {Object} - parsed JSON of the response
 * 
 * @example
 * utils.ijs.await(async ($$, console) => {
 *  worldJSON = await utils.datasets.fetchJSON('https://unpkg.com/world-atlas@1/world/110m.json');
 *  console.log(worldJSON.type); // Topology
 * });
 * 
 * // use worldJSON as global variable
 */
module.exports.fetchJSON = async function fetchJSON(targetAddress, options = {}) {
  const response = await fetch(targetAddress, options);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  return response.json();
};

/**
 * Simple `fetch` call for Text handling simple cases.
 * 
 * ```
 * const response = await fetch(targetAddress, options);
 * if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
 * return response.text();
 * ```
 * 
 * @param {String} targetAddress - Address of the file to load
 * @param {Object} options - options to pass to fetch
 * @returns {Object} - parsed JSON of the response
 * 
 * @example
 * utils.ijs.await(async ($$, console) => {
 *     myText = await utils.datasets.fetchText('https://unpkg.com/qr-image@3.2.0/LICENSE');
 *     return myText;
 * });
 * 
 * // use myText as global variable
 */
module.exports.fetchText = async function fetchText(targetAddress, options = {}) {
  const response = await fetch(targetAddress, options);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  return response.text();
};
