/**
 * Simple monad like wrapper.
 * 
 * Very helpful for taking values and then progressively working on them,
 * instead of continually wrapping deeper in method calls.
 * 
 * Calling `chain(3)` - gives an object with two properties:
 * 
 * * .value - the original value passed - or 3 in this case
 * * .chain(function) - where it is passed the value, and returns a new Chain with that value.
 * * .debug() - console.logs the value, and returns a new Chain with that value
 * 
 * For example:
 * 
 * ```
 * const addTwo = (value) => value + 2;
 * 
 * //-- we can always get the value
 * console.log(
 *  utils.chain(3).value
 * ); // 3
 * ```
 * 
 * but this is much easier if we continue to chain it
 * 
 * ```
 * console.log(
 *  utils.chain(3)
 *    .chain(addTwo)
 *    .chain(addTwo)
 *    .debug()
 *    .chain((value) => value + 3)
 *    .value
 * );
 * // 7
 * // 10
 * 
 * const addTwo = (value) => value + 2;
 * 
 * console.log(
 *  utils.chain(3).value
 * ); // 3
 * 
 * @exports chain
 * @module chain
 */
module.exports = function chain(value) {
  return ({
    value,
    chain: function innerChain(fn) {
      return chain(fn(value));
    },
    debug: function debug(fn) {
      if (fn) {
        fn(value);
      } else {
        console.log(value);
      }
      return chain(value);
    }
  });
};
