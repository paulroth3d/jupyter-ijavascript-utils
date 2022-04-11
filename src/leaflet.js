/* eslint-disable no-param-reassign */

const IjsUtils = require('./ijs');

const InternalHtmlScripts = require('./htmlScript_internal');

/**
 * Library for showing leaflet within Jupyter and the iJavaScript kernel.'
 * 
 * **Note that [Leaflet](https://leafletjs.com/)
 * and [Leaflet-Provider](https://leaflet-extras.github.io/leaflet-providers/preview/)
 * are both accessed from unpkg.com. The version is easily upgradable -
 * {@link module:leaflet.render|see render(options) for more} **
 * 
 * * Render Leaflet
 *   * {@link module:leaflet.render|leaflet.render(options)} - Render leaflet
 *   * {@link module:leaflet.renderMarkers|leaflet.renderMarkers(array, options)} - Convenience to render a set of markers
 * * Update Defaults
 *   * {@link module:leaflet.OPTION_DEFAULTS|leaflet.OPTION_DEFAULTS} - Object used for default options
 *   * {@link module:leaflet.setProvider|leaflet.setProvider(string)} - Use one of the providers available from
 *        {@link http://leaflet-extras.github.io/leaflet-providers/preview/index.html|leaflet-providers}
 *   * {@link module:leaflet.setProviderFn|leaflet.setProviderFn(function)} - Use a custom provider, or leaflet-provider with api keys, etc.
 * 
 * For example:
 * 
 * ```
 * utils.leaflet.renderMarkers([
 *   [52.230020586193795, 21.01083755493164, "point 1"],
 *   [52.22924516170657, 21.011320352554325, "point 2"],
 *   [52.229511304688444, 21.01270973682404, "point 3"],
 *   [52.23040500771883, 21.012146472930908, "point 4"]
 * ], {height: 400, provider: 'Stamen.Watercolor'});
 * ```
 * 
 * ![Screenshot](img/leafletRenderMarkers.png)
 * 
 * Further reading: 
 * 
 * * [leaflet-providers github page](https://github.com/leaflet-extras/leaflet-providers)
 * * [leaflet documentation](https://leafletjs.com/SlavaUkraini/reference.html#latlngbounds)
 * * [leaflet examples](https://tomik23.github.io/leaflet-examples/)
 * * [One off site for geocoding](https://www.latlong.net/)
 * 
 * @module leaflet
 * @exports leaflet
 */
module.exports = {};
const LeafletUtils = module.exports;

/**
 * Values are used for default leaflet rendering options.
 * 
 * (Can be overwritten at the top of your file, so you only need to change options for a specific render)
 * 
 * Note `version` and `providerVersion` are used to identify the unpkg cdn location:
 * 
 * * `https://unpkg.com/leaflet@${version}/dist/leaflet.css`
 * * `https://unpkg.com/leaflet@${version}/dist/leaflet.js`
 * * `https://unpkg.com/leaflet-providers@${providerVersion}/leaflet-providers.js`
 * 
 * To change the version used, change the `version` and `providerVersion` attributes
 * on the {@link module:leaflet.OPTION_DEFAULTS|leaflet.OPTION_DEFAULTS}
 * 
 * ```
 * OPTION_DEFAULTS = {
 *  version: '1.6.0',             // version of the leaflet library
 *  providerVersion: '1.13.0',    // version of the leaflet-provider library
 *  mapOptions: {}                // options passed to leaflet when initializing the map
 * }
 * ```
 */
module.exports.OPTION_DEFAULTS = {
  // 41.975813, -87.909428 // ord
  version: '1.6.0',
  providerVersion: '1.13.0',
  providerFn: ({ map, leaflet }) => leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
};

/**
 * Sets the default provider to be one of the
 * {@link https://leaflet-extras.github.io/leaflet-providers/preview/|providers from the leaflet-providers library}
 * 
 * For example:
 * 
 * ```
 * utils.leaflet.setProvider('OpenTopoMap');
 * ```
 * 
 * Then any separate calls to maps will use that provider by default.
 * 
 * ![Screenshot for defaulting providers](img/leafletDefaultProvider.png)
 * 
 * @param {String} providerName - the name of the provider from the list
 * @see {@link module:leaflet.setProviderFn|leaflet.setProviderFn()} - to use a function to specify a provider
 * @see {@link module:leaflet.resetProvider|leaflet.resetProvider()} - to reset the provider to default
 */
module.exports.setProvider = function setProvider(providerName) {
  if (providerName) {
    LeafletUtils.OPTION_DEFAULTS.providerFn = providerName;
  } else {
    LeafletUtils.resetProvider();
  }
};

/**
 * Sets a provider function
 * 
 * Note that the function should not only create the provider,
 * but should also add the provider to the map (ex: `.addTo(map)`)
 * 
 * Otherwise, you can get a grey map like the following:
 * 
 * ![Screenshot of missing .addToMap](img/leafletMissingAddToMap.png)
 * 
 * Instead, do the following:
 * 
 * ```
 * utils.leaflet.setProviderFn({map, leaflet} => leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 *   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
 * }).addTo(map));
 * ```
 * 
 * @param {Function} providerFn - ({map, leaflet}) => {provider}
 * @param {any} providerFn.map - The leaflet map instance
 * @param {any} providerFn.leaflet - the Leaflet library instance
 * 
 * @see {@link module:leaflet.setProvider|leaflet.setProvider()} - to use a leaflet-extra provider name
 * @see {@link module:leaflet.resetProvider|leaflet.resetProvider()} - to reset the provider to default
 */
module.exports.setProviderFn = function setProviderFn(providerFn) {
  if (providerFn) {
    LeafletUtils.OPTION_DEFAULTS.providerFn = providerFn;
  } else {
    LeafletUtils.resetProvider();
  }
};

/**
 * Resets the map / tile provider to the default.
 * 
 * @see {@link module:leaflet.setProvider|leaflet.setProvider()} - to use a leaflet-extra provider name
 * @see {@link module:leaflet.setProviderFn|leaflet.setProviderFn()} - to use a function to specify a provider
 */
module.exports.resetProvider = function resetProvider() {
  LeafletUtils.OPTION_DEFAULTS.providerFn = ({ map, leaflet }) => leaflet
    .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
};

/**
 * Renders a {@link https://leafletjs.com/|leaflet map}
 * 
 * This extends {@link module:ijs.htmlScript|ijs.htmlScript}, so those options are also available.
 * 
 * (Such as `debug: true` to run a `debugger;` and step through your `onReady` javascript)
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
 * @param {Object} options - the options passed and then forwarded to {@link module:ijs.htmlScript|ijs.htmlScript()}
 * @param {any} options.data - JSON.serializable data available in node we want available in JavaScript
 * @param {Function} options.onReady - JavaScript to run once the leaflet map is ready.
 * @param {ELement} options.onReady.rootEl - Destructured div Html Element available for the cell (to add or modify)
 * @param {any} options.onReady.data - the JavaScript equivalent of the NodeJS options.data passed
 * @param {any} options.onReady.leaflet - the Leaflet library instance
 * @param {Object} options.onReady.options - the options passed from NodeJS available in JavaScript
 * @param {Object} options.mapOptions - the object passed to leaflet when created
 * @param {String} [options.version = '1.6.0'] - the leaflet unpkg version we want to use
 * @param {String} [options.providerVersion = ''] - the leaflet-provider unpkg library version to use
 * @param {String} [provider] - The name of the leaflet-provider to use instad of leaflet.setProvider()
 * @param {String} [providerFn] - The function to use instad of leaflet.setProviderFn()
 * 
 * @see {@link module:ijs.htmlScript|ijs.htmlScript(options)} - for additional options
 */
module.exports.render = function render(options) {
  if (!options) options = {};
  const sanitizedOptions = {
    ...LeafletUtils.OPTION_DEFAULTS,
    ...options
  };

  const {
    version,
    providerVersion,
    mapOptions = {},
    provider,
    providerFn,
    onReady,
    scripts = [],
    css = [],
    ...optionsRest
  } = sanitizedOptions;

  const sanitizedProvider = provider || providerFn;
  if (!sanitizedProvider) throw Error('leaflet.render(setupFn, options): options.providerFn is required');

  let providerCode = '';
  if (typeof sanitizedProvider === 'function') {
    providerCode = `(${sanitizedProvider.toString()})({map, leaflet:L});`;
  } else if (typeof sanitizedProvider === 'string') {
    // assume it is a provider name from leaflet-providers
    providerCode = `L.tileLayer.provider('${sanitizedProvider}').addTo(map);`;
  } else {
    throw Error('error leaflet.render(setupFn, options): setupFn must be a function ({ map, leaflet })');
  }

  if (!onReady || (typeof onReady !== 'function')) {
    throw Error('leaflet.render: onReady is required and must be a function');
  }

  let mapOptionsCode = '{}';
  if (mapOptions) {
    mapOptionsCode = JSON.stringify(mapOptions);
  }

  return IjsUtils.htmlScript({
    ...optionsRest,
    scripts: [
      ...scripts,
      `https://unpkg.com/leaflet@${version}/dist/leaflet.js`,
      `https://unpkg.com/leaflet-providers@${providerVersion}/leaflet-providers.js`
    ],
    css: [
      ...css,
      `https://unpkg.com/leaflet@${version}/dist/leaflet.css`
    ],
    onReady: `
        if (!L.tileLayer.provider) console.error('Leaflet.tileLayer.provider is null');
        map = L.map(rootEl, ${mapOptionsCode});
        
        ${providerCode}

        (${onReady.toString()})({rootEl, data, map, leaflet:L, options});
      `
  });
};

/**
 * Renders a collection of markers for simple use cases with Leaflet.
 * 
 * Marker data can be either:
 * 
 * * Objects
 *   * With at least the `lat` and `lon` attributes, with optional 'title' attributes
 *   * ex: `[{ lat: 41.991576, lon: -87.915822, title: 'AA Hanger'}, { lat: 41.991071, lon: -87.920961, title: 'Ozark Hanger'}]`
 * * Arrays
 *   * With at least 2 values for the second dimension.
 *   * Assumed [lat, lon, title]
 *   * ex: `[[41.991576, -87.915822, 'AA Hanger'], [41.991071, -87.920961, 'Ozark Hanger']]`
 * 
 * For example:
 * 
 * ```
 * utils.leaflet.renderMarkers([
 *   [52.230020586193795, 21.01083755493164, "point 1"],
 *   [52.22924516170657, 21.011320352554325, "point 2"],
 *   [52.229511304688444, 21.01270973682404, "point 3"],
 *   [52.23040500771883, 21.012146472930908, "point 4"]
 * ], {height: 400, provider: 'Stamen.Watercolor'});
 * ```
 * 
 * ![Screenshot](img/leafletRenderMarkers.png)
 * 
 * @param {Array} markers - of either of the two supported definition types
 * @param {Object} options - options forwarded to {@link module:leaflet.render|leaflet.render()}
 * 
 * @see {@link module:leaflet.render|leaflet.render(options)} - for additional options supported
 */
module.exports.renderMarkers = function renderMarkers(markers, mapOptions) {
  if (!markers || !Array.isArray(markers) || markers.length < 1) {
    throw Error('leaflet.renderMarkers(markers, options): markers are required');
  }
  const firstMarker = markers[0];
  
  let cleanMarkers = [];
  if (Array.isArray(firstMarker)) {
    if (firstMarker.length < 2) {
      throw Error('leaflet.renderMarkers(markers, options): array markers must follow schema: [lat, lon, title?]');
    }
    cleanMarkers = markers;
  } else if (typeof firstMarker === 'object') {
    if (typeof firstMarker.lat === 'undefined'
      || typeof firstMarker.lon === 'undefined'
    ) {
      throw Error('leaflet.renderMarkers(markers, options): object markers must follow schema: ({ lat, lon, title? })');
    }
    cleanMarkers = markers.map(({ lat, lon, title }) => [lat, lon, title]);
  }

  //-- will be executed as JavaScript - not Node
  const onReady = InternalHtmlScripts.leafletMarkersOnReady;

  return LeafletUtils.render({ ...mapOptions, onReady, data: cleanMarkers });
};
