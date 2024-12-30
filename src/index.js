const aggregate = require('./aggregate');
const array = require('./array');
const base64 = require('./base64');
const chain = require('./chain');
const color = require('./color');
const datasets = require('./datasets');
const date = require('./date');
const describe = require('./describe');
const group = require('./group');
const hashMap = require('./hashMap');
const ijsUtils = require('./ijs');
const file = require('./file');
const help = require('./help');
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
  /** @see {@link module:aggregate} */
  aggregate,
  agg: aggregate,
  /** @see {@link module:array} */
  array,
  /** @see {@link module:base64} */
  base64,
  /** @see {@link module:chain} */
  chain,
  /** @see {@link module:color} */
  color,
  /** @see {@link module:color} */
  colour: color,
  /** @see {@link module:datasets} */
  datasets,
  dataset: datasets,
  /** @see {@link module:date} */
  date,
  DateRange: date.DateRange,
  /** @see {@link module:describe} */
  describe,
  /** @see {@link module:file} */
  file,
  /** @see {@link module:group} */
  group,
  /** @see {@link module:hashMap} */
  hashMap,
  /** @see {@link module:format} */
  format,
  /** @see {@link IJSUtils} */
  ijs: ijsUtils,
  /** @see {@link module:latex} */
  latex,
  /** @see {@link module:leaflet} */
  leaflet,
  /** @see {@link module:object} */
  object,
  /** @see {@link module:plantuml} */
  plantuml,
  /** @see {@link module:random} */
  random,
  /** @see {@link module:set} */
  set,
  /** @see {@link module:svg} */
  svg,
  /** @see {@link module:vega} */
  vega,

  /** @see {@link module:help} */
  help,

  /** @see SourceMap */
  SourceMap,
  /** @see TableGenerator */
  TableGenerator,
  /** @see TableGenerator */
  table
};
