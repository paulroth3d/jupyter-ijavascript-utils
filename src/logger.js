/**
 * Logging library
 * 
 * (uses pino under the sheets)
 */
const logger = require('pino')({
  prettyPrint: true
});

/** Error level: none @type {Number} */
logger.ERROR_LEVEL_NONE = -1;

/** Error level: Basic @type {Number} */
logger.ERROR_LEVEL_BASIC = 0;

/** Error level: Detail @type {Number} */
logger.ERROR_LEVEL_DETAIL = 1; // eslint-disable-line no-unused-vars

/** The current traceLevel within the logger */
logger.traceLevel = logger.ERROR_LEVEL_BASIC;

/**
 * Flags to send for the connector
 * @public
 * @param {Object} options -
 */
logger.setOptions = (options) => {
  const defaults = {
    traceLevel: logger.ERROR_LEVEL_BASIC
  };

  //-- check environment variables
  // eslint-disable-next-line no-prototype-builtins
  if (process && process.env && process.env.hasOwnProperty('TRACE_LEVEL')) {
    const envTraceLevel = Number.parseInt(process.env.TRACE_LEVEL, 10);
    if (Number.isSafeInteger(envTraceLevel)) {
      defaults.traceLevel = envTraceLevel;
    }
  }

  const cleanOptions = Object.assign(defaults, options);

  /**
   * The level that we will be tracing the output.
   * (By default - 0, no trace.)
   * @type {number}
   */
  logger.traceLevel = cleanOptions.traceLevel;
};

module.exports = logger;
