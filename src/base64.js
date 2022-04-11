/**
 * Simple library for working with base64 strings
 * 
 * * {@link module:base64.toBase64|toBase64(str)} - convert a string to base64
 * * {@link module:base64.fromBase64|fromBase64(str)} - parse a base64 encoded string
 * 
 * @module base64
 * @exports base64
 * @example
 * const str = 'Hello';
 * utils.base64.toBase64(str); // 'SGVsbG8=';
 * 
 * const b64Str = 'SGVsbG8=';
 * utils.base64.fromBase64(b64Str); // 'Hello';
 */
module.exports = {};

// const Base64Utils = module.exports;

/**
 * Convert a string to base64
 * @param {String} str - string to be converted
 * @returns {String} - base64 encoding of the string
 * @example
 * const str = 'Hello';
 * utils.base64.toBase64(str); // 'SGVsbG8=';
 */
module.exports.toBase64 = function toBase64(str) {
  return Buffer.from(str).toString('base64');
};

/**
 * Transfers a base64 string back.
 * @param {String} str - base64 encoded string
 * @returns {String} - decoded string
 * @example
 * const b64Str = 'SGVsbG8=';
 * utils.base64.fromBase64(b64Str); // 'Hello';
 */
module.exports.fromBase64 = function fromBase64(str) {
  return Buffer.from(str, 'base64').toString();
};
