const aggregate = require('./aggregate');
const array = require('./array');
const base64 = require('./base64');
const chain = require('./chain');
const datasets = require('./datasets');
const describe = require('./describe');
const group = require('./group');
const hashMap = require('./hashMap');
// const ijsUtils = require('./ijs');
const format = require('./format');
const set = require('./set');
const object = require('./object');
const random = require('./random');

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
const mainResults = {
  /** @see {@link module:aggregate} */
  aggregate,
  agg: aggregate,
  /** @see {@link module:array} */
  array,
  /** @see {@link module:base64} */
  base64,
  /** @see {@link module:chain} */
  chain,
  /** @see {@link module:datasets} */
  datasets,
  dataset: datasets,
  /** @see {@link module:describe} */
  describe,
  /** @see {@link module:group} */
  group,
  /** @see {@link module:hashMap} */
  hashMap,
  /** @see {@link module:format} */
  format,
  /** @see {@link module:object} */
  object,
  /** @see {@link module:random} */
  random,
  /** @see {@link module:set} */
  set,

  /** @see SourceMap */
  SourceMap,
  /** @see TableGenerator */
  TableGenerator,
  /** @see TableGenerator */
  table
};

globalThis.ijsUtils = mainResults;
