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
 * * .chainMap(function) -> where it treats value as an array, and maps function on every item in the array
 * * .chainReduce(function, initialValue) -> where it treats value as an array, and reduces the value array
 * * .debug() - console.logs the value, and returns a new Chain with that value
 * 
 * For example:
 * 
 * ```
 * addTwo = (value) => value + 2;
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
 * addTwo = (value) => value + 2;
 * addTwo(3); // 5
 * 
 * console.log(
 *  utils.chain(3)
 *    .chain(addTwo) // (3 + 2)
 *    .chain(addTwo) // (5 + 2)
 *    .debug() // consoles 7 and passes the value along
 *    // define a function inline
 *    .chain((value) => value + 3) // (7 + 3)
 *    .value
 * );
 * 
 * // 7
 * // 10
 * ```
 * 
 * Note that we can also map against values in the array
 * 
 * ```
 * initializeArray = (size) => Array.from(Array(size)).map((val, index) => index);
 * initializeArray(3); // [0, 1, 2]
 * 
 * addTwo = (value) => value + 2;
 * addTwo(3); // 5
 * 
 * utils.chain(3)
 *   .chain(initializeArray) // [0, 1, 2]
 *   .chainMap(addTwo) // [2, 3, 4] or [0 + 2, 1 + 2, 2 + 2]
 *   .chainMap(addTwo)
 *   .value;
 * // [4, 5, 6]
 * ```
 * 
 * Or even combine with other utility methods
 * 
 * ```
 * badStr = 'I%20am%20the%20very%20model%20of%20a%20modern%20Major'
 *  + '-General%0AI\'ve%20information%20vegetable%2C%20animal%2C%20'
 *  + 'and%20mineral%0AI%20know%20the%20kings%20of%20England%2C%20'
 *  + 'and%20I%20quote%20the%20fights%0AHistorical%0AFrom%20Marath'
 *  + 'on%20to%20Waterloo%2C%20in%20order%20categorical';
 * 
 * chain(badStr)
 *     .chain(decodeURIComponent)
 *     .chain(v => v.split('\n'))
 *     // .debug()                  // check the values along the way
 *     .chainMap(line => ({ line, length: line.length }))
 *     .chain(values => utils.table(values).render());
 * ```
 * 
 * and it renders out a lovely table like this:
 * 
 * line                                               |length
 * --                                                 |--    
 * I am the very model of a modern Major-General      |45    
 * I've information vegetable, animal, and mineral    |47    
 * I know the kings of England, and I quote the fights|51    
 * Historical                                         |10    
 * From Marathon to Waterloo, in order categorical    |47    
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
    chainMap: function chainMap(fn) {
      if (!Array.isArray(value)) throw Error(`chainMap expected an array, but was passed:${value}`);
      return chain(value.map(fn));
    },
    chainReduce: function chainReduce(fn, initialValue) {
      if (!Array.isArray(value)) throw Error(`chainReduce expected an array, but was passed:${value}`);
      return chain(value.reduce(fn, initialValue));
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
