const aggregate = require('./aggregate');
const array = require('./array');
const base64 = require('./base64');
const datasets = require('./datasets');
const group = require('./group');
const hashMap = require('./hashMap');
const ijsUtils = require('./ijs');
const file = require('./file');
const vega = require('./vega');
const format = require('./format');
const set = require('./set');
const object = require('./object');
const plantuml = require('./plantuml');
const leaflet = require('./leaflet');
const latex = require('./latex');
const random = require('./random');
const svg = require('./svg');

const SourceMap = require('./SourceMap');
const TableGenerator = require('./TableGenerator');

const table = function table(...rest) {
  return new TableGenerator(...rest);
};

/**
 * Default module
 * @module index
 * @exports index
 * @private
 */
module.exports = {
  /** @see module:aggregate */
  aggregate,
  agg: aggregate,
  /** @see module:array */
  array,
  /** @see module:base64 */
  base64,
  /** @see module:datasets */
  datasets,
  dataset: datasets,
  /** @see module:file */
  file,
  /** @see module:group */
  group,
  /** @see modue:hashMap */
  hashMap,
  /** @see module:format */
  format,
  /** @see IJSUtils */
  ijs: ijsUtils,
  /** @see module:latex */
  latex,
  /** @see module:leaflet */
  leaflet,
  /** @see module:object */
  object,
  /** @see {@link module:plantuml} */
  plantuml,
  /** @see module:random */
  random,
  /** @see module:set */
  set,
  /** @see module:svg */
  svg,
  /** @see module:vega */
  vega,

  /** @see SourceMap */
  SourceMap,
  /** @see TableGenerator */
  TableGenerator,
  /** @see TableGenerator */
  table
};
