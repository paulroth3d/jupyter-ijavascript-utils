/**
 * Set of all the types we use in the JupyterJSUtils that there aren't classes for
 */

/**
 * Description
 * @callback displayStrFn
 * @param {String} str - Description
 * @returns {void} - string description
 */

/**
 * @callback displayB64Fn
 * @param {String} b64 -
 * @returns {void}
 */

/**
 * @callback displayMimeFn
 * @param {Object} obj - each property key is the mime type
 * @returns {void}
 */

/**
 * @callback displayJSON
 * @param {any} value - values to be printed
 */

/**
 * @callback emptyFn
 * @returns {void}
 */

/**
 * @typedef {Object} JupyterDisplay
 * @property {displayStrFn} text -
 * @property {displayStrFn} html -
 * @property {displayStrFn} svg -
 * @property {displayB64Fn} png -
 * @property {displayB64Fn} jpeg -
 * @property {displayMimeFn} mime Displays with mime type via ({ mimeType: value })
 * @property {displayJSON} json -
 * @property {Function} close -
 */

//-- console

/**
 * @typedef {Object} Console
 * @property {Function} log - logs a message to the console
 * @property {Function} warn -
 * @property {Function} error -
 */

//-- jupyter $$

/**
 * Sends the result to a jupyter cell
 * @callback JupyterSendResult
 * @param {any} value -
 * @returns {void}
 */

/**
 * Creates a display
 * @callback JupyterCreateDisplay
 * @returns {JupyterDisplay}
 */

/**
 * @typedef {Object} Jupyter$$
 * @property {JupyterSendResult} sendResult -
 * @property {JupyterCreateDisplay} display -
 * @property {Function} async - tells jupyter to run asynchronously
 */

/**
 * @typedef {Object} IJavaScriptContext
 * @property {Jupyter$$} $$ - current display
 * @property {Jupyter$$} display - (alias for $$) - current display
 * @property {Console} console - current console
 */

/**
 * @typedef {Object} StaticMember
 * @property {Boolean} isMethod -
 * @property {String} type - the typeof for the member
 * @property {String} constructor - the type of constructor for the class
 * @property {String} name - the name of the member
 */

/**
 * @typedef {Object} FieldPath
 * @property {String} newFieldName - Dot notation path to value
 */

/**
 * @typedef {Object} FieldLabel
 * @property {String} newFieldName - value as the Label to be printed for that field
 */

/**
 * @typedef {Object} LabelValue
 * @property {String} label -
 * @property {String} value -
 */

/**
 * @typedef {Object} DateFormat
 * @property {String} LOCAL - local datetime
 * @property {String} LOCAL_DATE - local date
 * @property {String} LOCAL_TIME - local time
 * @property {String} GMT - toGMTString() format
 * @property {String} ISO - toISOString() format
 * @property {String} UTC - toUTCString() format
 * @property {String} NONE - toString() format
 */
