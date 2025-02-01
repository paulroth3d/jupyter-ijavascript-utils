/* eslint-disable class-methods-use-this */

/**
 * Simple monad like wrapper.
 * 
 * {@link module:chain|See the util.chain method} for more.
 * 
 * Very helpful for taking values and then progressively working on them,
 * instead of continually wrapping deeper in method calls.
 * 
 * Calling `chain(3)` - gives an object you can then chain calls against:
 * 
 * * {@link ChainContainer#close|.close()} - gets the value of the current chain
 * * {@link ChainContainer#chain|.chain(function)} - where it is passed the value, and returns a new Chain with that value.
 * * {@link ChainContainer#errorHandler|.errorHandler(fn)} - custom function called if an error is ever thrown
 * 
 * Along with methods that can iterate on each element, assuming the value in the chain is an Array.
 * 
 * * {@link ChainContainer#chainMap|.chainMap(function)} - where it calls the `.map` on value, and applies the function on every item in the array,
 *      storing the result from the function. <br /> <b>(Useful for changing values without changing the original object))</b>
 * * {@link ChainContainer#chainForEach|.chainForEach(function)} - where calls `.forEach` on value, and applies the function on every item,
 *      without storing the result from the function. <br /> <b>(Useful for changing objects in-place)</b>
 * * {@link ChainContainer#chainFlatMap|.chainFlatMap(function)} - where it calls `.flatMap` on value, and applies the function on every item,
 *        flattening the results. <br /> <b>(Useful for expanding an array based on values in the array)</b>
 * * {@link ChainContainer#chainFilter|.chainFilter(function)} - where it calls `.filter` on value, using the function on every item,
 *        keeping the item in the list if the function returns true.
 *        <br /> <b>(Useful for removing items from an array)</b>
 * * {@link ChainContainer#chainReduce|.chainReduce(function, initialValue)} - where it calls `.reduce` on value, and reduces the value
 *        to a single result.
 *        <br /> <b>(Useful for reducing the array to a single value <br /> - like a concatenated string or sum total)</b>
 * 
 * There may be times you want to run side effects, or replace the value entirely. (This isn't common, but may be useful on occasion)
 * 
 * * {@link ChainContainer#debug|.debug()} - continues with the current value, but executes a console.log first
 * * {@link ChainContainer#execute|.execute(function)} - where it calls a function, but doesn't pass on the result.
 *        <br /> (This is useful for side-effects, like writing to files)
 * * {@link ChainContainer#replace|.replace(value)} - replaces the value in the chain with a literal value,
 *        regardless of the previous value.
 * * {@link ChainContainer#toArray|.toArray()} - assuming the current value is an interatable, converts it to an array.
 * 
 * For example:
 * 
 * ```
 * addTwo = (value) => value + 2;
 * 
 * //-- we can always get the value
 * utils.chain(3).close();  // 3
 * ```
 * 
 * but this is much easier if we continue to chain it
 * 
 * ```
 * addTwo = (value) => value + 2;
 * addTwo(3); // 5
 * 
 * utils.chain(3)
 *   .chain(addTwo) // (3 + 2)
 *   .chain(addTwo) // (5 + 2)
 *   .debug() // consoles 7 and passes the value along
 *   // define a function inline
 *   .chain((value) => value + 3) // (7 + 3)
 *   .close()
 * 
 * // consoles out value `7`
 * // returns value 10
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
 *   .close();
 * // [4, 5, 6]
 * ```
 * 
 * Chain to log results while transforming values
 * 
 * ```
 * results = [{ userId: 'abc123' }, { userId: 'xyz987' }];
 * 
 * activeUsers = chain(results)
 *  .chainMap((record) => users.get(record.userId))
 *  .chainForEach(record => record.status =  'active')
 *  .chain(records => d3.csv.format(records))
 *  .execute(records => utils.file.writeFile('./log', d3.csv.format(records)))
 *  .close()
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
 * this can be more legible than the normal way to write this, <br />
 * especially if you need to troubleshoot the value halfway through.
 * 
 * ```
 * utils.table(
 *  decodeURIComponent(badStr)
 *    .split('\n')
 *    .map(line => ({ line, length: line.length }))
 * ).render()
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
 */
class ChainContainer {
  /**
   * Custom function to run if there is any error along the chain.
   * (Scoped to the current Container when running)
   * @type {Function}
   * @private
   */
  errorHandlerFn;

  /**
   * Value this container stores, can be anythhing.
   * 
   * Also access through {@link ChainContainer#close}
   * 
   * @type {any}
   */
  value;

  /**
   * Constructor that creates a new Container to pass along the chain.
   * 
   * If the context is null, then we assume we are binding the container to the current iJavaScript cell.
   * 
   * @param {any} value - the value to use along the chain
   */
  constructor(value) {
    this.value = value;
  }

  /**
   * Clones the value, and ties the output to this cell.
   * @returns {ChainContainer} - new chain container to use in this cell.
   * @example
   * 
   * customErrorHandler = (err) => console.error('Some custom warning');
   * initialChain = utils.chain(3)
   *   .errorHandler(customErrorHandler);
   * 
   * newChain = initialChain.clone()
   *   .chain(v => v + 2) // 3 + 2
   *   .close();
   * 
   * // 5
   */
  clone() {
    const result = new ChainContainer(this.value);
    result.errorHandlerFn = this.errorHandlerFn;
    return result;
  }

  /**
   * Creates a new chain container holding the value returned from functor(this.value)
   * 
   * ```
   * value = 2;
   * plus2 = (value) => value + 2;
   * 
   * chain(value)
   *  .chain(plus2) // 2 + 2
   *  .chain(plus2) // 4 + 2
   *  .debug()
   *  .chain(plu2)  // 6 + 2
   *  .close();
   * 
   * // 6
   * // 8
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
   * @param {Function} functor - the function given the value, returning a transformed value
   * @see {@link ChainContainer#chain} - to get the value
   * @see {@link ChainContainer#chainMap} - convenience to apply a function to each item in an array
   * @see {@link ChainContainer#chainReduce} - convenience to reduce the array
   * @see {@link ChainContainer#debug} - to see the value at a specific time
   * @returns {ChainContainer} - container with the results from functor(this.value)
   */
  chain(functor) {
    try {
      return this.update(functor(this.value));
    } catch (err) {
      this.handleError(err);

      //-- handle error throws again, line will never be called.
      // this.close();
    }
  }

  /**
   * Assuming that value is an array, this does a
   * [javascript array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
   * and applies `fn` to every value in the array.
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
   *   .close();
   * 
   * // [4, 5, 6]
   * ```
   * 
   * This is in contrast to {@link ChainContainer#chainForEach|chainForEach}
   * 
   * @param {Function} fn - applies function under every index of this.value
   * @returns {ChainContainer} 
   */
  chainMap(fn) {
    if (!Array.isArray(this.value)) throw Error(`chainMap expected an array, but was passed:${this.value}`);

    return this.chain((value) => value.map(fn));
  }

  /**
   * Assuming that value is an array, performs a 
   * [javaScript forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
   * against the results.
   * 
   * This will run the passed function against every element in the result,
   * without replacing the element with the returned value and makes inline editing simpler.
   * 
   * ```
   * list = [{ first: 'john', last: 'doe' }, { first: 'jane', last: 'doe' }];
   * utils.chain(list)
   *  .mapForEach((entry) => entry.name = `${entry.first} ${entry.last})
   *  .close();
   * // [{ first: 'john', last: 'doe', name: 'john doe' }, { first: 'jane', last: 'doe', name: 'jane doe' }]
   * ```
   * 
   * This is in contrast to {@link ChainContainer#chainMap|chainMap}, that replaces the element with the value returned.
   * @param {Function(any):any} fn - function to execute on each element
   * @returns {ChainContainer} - chainable container
   */
  chainForEach(fn) {
    if (!Array.isArray(this.value)
      && !(this.value instanceof Set)
      && !(this.value instanceof Map)
    ) {
      throw Error(`chainForEach expects an array, but was passed:${this.value}`);
    }

    this.value.forEach(fn);

    return this;
  }

  /**
   * Assuming that value is an array, performs a
   * [javaScript flatMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
   * against the results.
   * 
   * This can be very helpful in expanding the list of items in an array, or removing items from an array.
   * 
   * ```
   * // expanding size of the array
   * initializeArray = (size) => Array.from(Array(size)).map((val, index) => index);
   * initializeArray(3); // [0, 1, 2]
   * 
   * utils.chain([1, 2, 3, 4])
   *  .chainFlatMap(initializeArray)
   *  .close();
   * 
   * // [1, 1, 2, 1, 2, 3, 1, 2, 3, 4];
   * ```
   * 
   * or similar to {@link ChainContainer#chainFilter|chainFilter}
   * 
   * ```
   * // reducing the size of the array
   * filterOdd = (value) => value % 2 === 0 ? [value] : [];
   * filterOdd(2); // [2]
   * filterOdd(1); // []
   * 
   * chain([1, 2, 3, 4, 5])
   *  .chainFlatMap(filterOdd)
   *  .close();
   * 
   * // [2, 4];
   * ```
   * 
   * @param {function(any):any} fn - function that can either return a value or array of values.
   * @returns {ChainContainer}
   * @see {@link ChainContainer#chainFilter} - for other options in filtering
   */
  chainFlatMap(fn) {
    if (!Array.isArray(this.value)) throw Error(`chainFlatMap expects an array, but was passed:${this.value}`);

    return this.chain((value) => value.flatMap(fn));
  }

  /**
   * Assuming that value is an array, this maps fn to filter the results in the array.
   * 
   * ```
   * chain([1,2,3,4])
   *    .chainFilter((value) => value < 3)
   *    .close();
   * // [1, 2]
   * ```
   * 
   * @param {function(any):Boolean} fn - Function accepting a value and returning whether it should be included (true) or not (false)
   * @returns {ChainContainer}
   */
  chainFilter(fn) {
    if (!Array.isArray(this.value)) throw Error(`chainFilter expects an array, but was passed:${this.value}`);

    return this.chain((value) => value.filter(fn));
  }

  /**
   * Assuming that the value is an array, performs a reduce using fn and initialValue
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
   *   .debug()
   *   .chainReduce((result, value) => result + value, 0)
   *   .close();
   * 
   * // [2, 3, 4]
   * // 9
   * ```
   * 
   * @param {Function} fn - reducer function
   * @param {any} initialValue - initial value passed to the reducer
   * @returns {ChainContainer}
   */
  chainReduce(fn, initialValue) {
    if (!Array.isArray(this.value)) throw Error(`chainReduce expected an array, but was passed:${this.value}`);

    return this.chain((value) => value.reduce(fn, initialValue));
  }

  /**
   * Console.logs the value, and returns the unmodified current value.
   * 
   * ```
   * value = 2;
   * plus2 = (value) => value + 2;
   * 
   * chain(value)
   *  .chain(plus2) // 2 + 2
   *  .chain(plus2) // 4 + 2
   *  .debug()
   *  .chain(plu2)  // 6 + 2
   *  .debug((value) => console.log(value))
   *  .close();
   * 
   * // 6
   * // 8
   * // 8
   * ```
   * 
   * @param {Function} [fn=null] - optional custom function
   * @returns {ChainContainer} - the same value as current, regardless of the result from fn.
   */
  debug(fn) {
    if (fn) {
      fn(this.value);
    } else {
      this.console(this.value);
    }
    return this;
  }

  /**
   * Applies a function against the current value, while not passing the results along the chain.
   * 
   * ```
   * results = [{ userId: 'abc123' }, { userId: 'xyz987' }];
   * 
   * activeUsers = chain(results)
   *  .chainMap((record) => users.get(record.userId))
   *  .chainForEach(record => record.status =  'active')
   *  .chain(records => d3.csv.format(records))
   *  .execute(records => utils.file.writeFile('./log', d3.csv.format(records)))
   *  .close()
   * ```
   * 
   * @param {Function} fn - function to execute against the current value
   * @returns {ChainContainer}
   */
  execute(fn) {
    fn(this.value);
    return this;
  }

  /**
   * Function to call if an error occurs anywhere on the chain.
   * 
   * ```
   * someErrorOccurred = false;
   * flipSwitch = (err) => {
   *   console.log('custom handler');
   *   someErrorOccurred = true;
   * };
   * throwError = () => {
   *   throw Error('Custom Error');
   * };
   * 
   * chain(2)
   *   .errorHandler(flipSwitch)
   *   .chain((value) => value + 2)
   *   .chain(throwError);
   * 
   * // customHandler
   * // {
   * //   "name": "Error",
   * //   "message": "Custom Error"
   * // }
   * // /Users/proth/Documents/notebooks/jupyter-ijavascript-utils/src/chain.js:175
   * //     throw err;
   * //     ^
   * // 
   * // Error: Custom Error
   * //     at throwError (evalmachine.<anonymous>:7:9)
   * ```
   * 
   * @param {Function} errorHandler - function that is passed the error caught
   */
  errorHandler(errorHandlerFn) {
    this.errorHandlerFn = errorHandlerFn;
    return this;
  }

  /**
   * Normally, you will want to replace the value in the chain
   * based on the current value.
   * 
   * This replaces the value regardless, and is rarely used.
   * 
   * @param {any} value - new value in the chain.
   * @returns {ChainContainer}
   */
  replace(value) {
    this.value = value;
    return this;
  }

  /**
   * Closes the chain and returns the current value.
   * @param {Function} [functor = null] - optional function (similar to {@link module:chain.chain|chain.chain})
   * @returns {any}
   * @see {@link ChainContainer#chain}
   * @example
   * 
   * utils.chain(3)
   *   .chain(v => v + 2) // 3 + 2
   *   .close();
   * 
   * // 5
   * 
   * //-- or pass an optional function on close
   * 
   * doubler = (num) => num + num;
   * 
   * utils.chain(3)
   *  .chain(doubler)
   *  .close(doubler);
   * // 12
   * 
   */
  close(functor) {
    if ((typeof functor) === 'function') {
      this.value = this.chain(functor).value;
    }

    return this.value;
  }

  /**
   * Converts the current value to an array to be further chained.
   * (Assumes it is iteratable);
   * 
   * Example: 
   * 
   * ```
   * new Chain(document.querySelectorAll('div'))
   *  .toArray()
   *  .execute((passedValue) => Array.isArray(passedValue))
   *  .close(); // [... list of div elements on the page]
   * ```
   * 
   * @returns {ChainContainer}
   */
  toArray() {
    return this.update(Array.from(this.value));
  }

  //-- private methods

  /**
   * Clones the value, and ties the output to this cell.
   * @param {any} newValue - new value of the clone
   * @returns {ChainContainer} - new chain container to use in this cell.
   * @private
   */
  update(newValue) {
    const result = new ChainContainer(newValue);
    result.errorHandlerFn = this.errorHandlerFn;
    return result;
  }

  /**
   * Default handler catching any error that happens along the chain.
   * @param {Error} err - the error caught
   * @private
   */
  handleError(err) {
    if (this.errorHandlerFn) {
      this.errorHandlerFn.apply(this, [err]);
    }

    console.error(JSON.stringify(err, ['name', 'message'], 2));

    // Assert.fail('error occurred. halting.');
    throw err;
  }

  /**
   * call the console regardless of context
   * @param {any} msg - message to send
   * @private
   */
  console(msg) {
    console.log(msg); // eslint-disable-line no-console
  }

  /**
   * toString replacement
   * @private
   */
  toString() {
    const { context, ...cleanThis } = this; // eslint-disable-line
    return JSON.stringify(cleanThis, 2, false);
  }

  /**
   * inspect replacement
   * @private
   */
  inspect() {
    return this.toString();
  }

  /**
   * toJSON replacement
   * @private
   */
  toJSON() {
    const { context, ...cleanThis } = this; // eslint-disable-line
    return cleanThis;
  }

  /**
   * toStringTag used for inspect
   */
  // get [Symbol.toStringTag]() {
  //   return 'Chain';
  // }
}

/**
 * Simple monad like wrapper.
 * 
 * {@link ChainContainer|See the ChainContainer} for more.
 * 
 * Very helpful for taking values and then progressively working on them,
 * instead of continually wrapping deeper in method calls.
 * 
 * Calling `chain(3)` - gives an object you can then chain calls against:
 * 
 * * {@link ChainContainer#close|.close()} - gets the value of the current chain
 * * {@link ChainContainer#chain|.chain(function)} - where it is passed the value, and returns a new Chain with that value.
 * * {@link ChainContainer#errorHandler|.errorHandler(fn)} - custom function called if an error is ever thrown
 * * {@link ChainContainer#debug|.debug()} - console.logs the current value, and continues the chain with that value
 * 
 * Along with methods that can iterate on each element, assuming the value in the chain is an Array.
 * 
 * * {@link ChainContainer#chainMap|.chainMap(function)} - where it calls the `.map` on value, and applies the function on every item in the array,
 *      storing the result from the function. <br /> <b>(Useful for changing values without changing the original object))</b>
 * * {@link ChainContainer#chainForEach|.chainForEach(function)} - where calls `.forEach` on value, and applies the function on every item,
 *      without storing the result from the function. <br /> <b>(Useful for changing objects in-place)</b>
 * * {@link ChainContainer#chainFlatMap|.chainFlatMap(function)} - where it calls `.flatMap` on value, and applies the function on every item,
 *        flattening the results. <br /> <b>(Useful for expanding an array based on values in the array)</b>
 * * {@link ChainContainer#chainFilter|.chainFilter(function)} - where it calls `.filter` on value, using the function on every item,
 *        keeping the item in the list if the function returns true.
 *        <br /> <b>(Useful for removing items from an array)</b>
 * * {@link ChainContainer#chainReduce|.chainReduce(function, initialValue)} - where it calls `.reduce` on value, and reduces the value
 *        to a single result.
 *        <br /> <b>(Useful for reducing the array to a single value <br /> - like a concatenated string or sum total)</b>
 * 
 * There may be times you want to run side effects, or replace the value entirely. (This isn't common, but may be useful on occasion)
 * 
 * * {@link ChainContainer#execute|.execute(function)} - where it calls a function, but doesn't pass on the result.
 *        <br /> (This is useful for side-effects, like writing to files)
 * * {@link ChainContainer#replace|.replace(value)} - replaces the value in the chain with a literal value,
 *        regardless of the previous value.
 * 
 * For example:
 * 
 * ```
 * addTwo = (value) => value + 2;
 * 
 * //-- we can always get the value
 * utils.chain(3).close();  // 3
 * ```
 * 
 * but this is much easier if we continue to chain it
 * 
 * ```
 * addTwo = (value) => value + 2;
 * addTwo(3); // 5
 * 
 * utils.chain(3)
 *   .chain(addTwo) // (3 + 2)
 *   .chain(addTwo) // (5 + 2)
 *   .debug() // consoles 7 and passes the value along
 *   // define a function inline
 *   .chain((value) => value + 3) // (7 + 3)
 *   .close()
 * 
 * // consoles out value `7`
 * // returns value 10
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
 *   .close();
 * // [4, 5, 6]
 * ```
 * 
 * Chain to log results while transforming values
 * 
 * ```
 * results = [{ userId: 'abc123' }, { userId: 'xyz987' }];
 * 
 * activeUsers = chain(results)
 *  .chainMap((record) => users.get(record.userId))
 *  .chainForEach(record => record.status =  'active')
 *  .chain(records => d3.csv.format(records))
 *  .execute(records => utils.file.writeFile('./log', d3.csv.format(records)))
 *  .close()
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
 * this can be more legible than the normal way to write this, <br />
 * especially if you need to troubleshoot the value halfway through.
 * 
 * ```
 * utils.table(
 *  decodeURIComponent(badStr)
 *    .split('\n')
 *    .map(line => ({ line, length: line.length }))
 * ).render()
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
  return new ChainContainer(value);
};

// example gist: https://gist.github.com/paulroth3d/fc97580636ba706783c6a84467a625db
