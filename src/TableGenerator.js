/* eslint-disable
  prefer-template,
  function-paren-newline,
  no-unused-vars,
  implicit-arrow-linebreak,
  max-len
*/

//-- TODO: review stringbuilder for large datasets

//-- review the api from observable
//-- https://observablehq.com/@observablehq/input-table

const { printValue } = require('./format');

// const generateRange = (length, defaultValue) => new Array(length).fill(defaultValue);

const IJSUtils = require('./ijs');

const ArrayUtils = require('./array');

const { createSort } = require('./array');

/**
 * Class that renders a table
 * 
 * For example:
 * 
 * ```
 * utils.datasets.fetch('cars.json').then(results => cars = results);
 * ```
 * 
 * ```
 * new utils.TableGenerator(cars)
 *    .limit(2)
 *    .render()
 * ```
 * 
 * ![Screenshot of simple example](img/TableGenerator_simple.png)
 * 
 * ```
 * new utils.TableGenerator(cars)
 *    .sort('-Year', '-Displacement', 'Name')
 *    .limit(10)
 *    .augment({
 *         'Kilometer_per_Litre': (row) => row.Miles_per_Gallon * 0.425144
 *    })
 *    .columns('Name', 'Kilometer_per_Litre', 'Cylinders', 'Displacement', 'Acceleration', 'Year')
 *    .formatter({
 *        Year: (value) => value ? value.slice(0,4) : value
 *    })
 *    .labels({
 *        'Kilometer_per_Litre': 'Km/L'
 *    })
 *    .render()
 * ```
 * 
 * ![Screenshot of complex example](img/TableGenerator_complex.png)
 * 
 * # Types of calls:
 * 
 * * constructor
 *   * {@link TableGenerator#constructor|new TableGenerator(object[])} - create with data
 * * change the columns and headers
 *   * {@link TableGenerator#columns|columns(field, field, ...)} - specify fields and order
 *   * {@link TableGenerator#columnsToExclude|columnsToExclude(field, ...)} - specify fields not to show
 *   * {@link TableGenerator#labels|lables(obj)} - labels for field headers
 * * augment and change the values (non-destructively)
 *   * {@link TableGenerator#formatter|formatter(obj)} - adjust values of specific fields
 *   * {@link TableGenerator#formatterFn|formatterFn(fn)} - row, column aware adjustment
 *   * {@link TableGenerator#printOptions|printOptions(object)} - options for value rendering
 *   * {@link TableGenerator#augment|augment(obj)} - add fields to table
 * * sort and limit the output
 *   * {@link TableGenerator#filter|filter(fn)} - determine which rows to include or not
 *   * {@link TableGenerator#limit|limit(number)} - limit only specific # of rows
 *   * {@link TableGenerator#sortFn|sortFn(fn)} - Standard Array sort function
 *   * {@link TableGenerator#sort|sort(field, field, ...)} - sorts by fields, or descending with '-'
 * * transpose the output
 *   * {@link TableGenerator#transpose|transpose()} - transposes the output prior to rendering
 * * style the table
 *   * {@link TableGenerator#styleTable|styleTable(string)} - css style for the table
 *   * {@link TableGenerator#styleHeader|styleHeader(string)} - css styles for the header row
 *   * {@link TableGenerator#styleRow|styleRow(fn)} - Function to style rows
 *   * {@link TableGenerator#styleCell|styleCell(fn)} - Function to style cells
 *   * {@link TableGenerator#border|border(string)} - Apply a border to the table data cells
 * * generate output
 *   * {@link TableGenerator#generateHTML|generateHTML()} - returns html table with the results
 *   * {@link TableGenerator#generateMarkdown|generateMarkdown()} - returns markdown with the results
 *   * {@link TableGenerator#generateCSV|generateCSV()} - generates a CSV with the results
 *   * {@link TableGenerator#generateArray|generateArray()} - generates an array of headers and data for further process
 *   * {@link TableGenerator#generateArray2|generateArray2()} - generates a single array for further process
 * * render in jupyter
 *   * {@link TableGenerator#render|render()} - renders the results in a table within jupyter
 * 
 */
class TableGenerator {
  /**
   * Collection of data
   * @type {Array}
   */
  #data = [];

  /**
   * Augment Function to append new fields
   * @type {Function}
   */
  #augmentFn = null;

  /**
   * Border CSS to also apply to the cells
   * @type {String}
   */
  #borderCSS = ''; // 'solid 1px #AAA';

  /**
   * Optional array of exclusive columns to show based on the properties of each row\n
   * ex: ['Miles_per_Gallon', 'Name', 'Cylinders', etc]
   * @type {String[]}
   **/
  #columns = null;

  /**
   * Optional array of columns to not show based on the properties of the row\n
   * ex: ['Serial_number']
   * @type {String[]}
   **/
  #columnsToExclude = [];

  /**
   * Map of key:value pairs, where the key is the property and value is dot notation access
   * (accessing children should use map).
   * This will always be accessed before any other action.
   * ex: {parentName:'child.parent.parent.name'}
   * @type {Object}
   */
  #fetch = null;

  /**
   * Function used to determine which rows to include
   * @type {Function}
   */
  #filterFn = null;

  /**
   * Function to transform the value for a specific cell
   * @type {Function}
   */
  #formatterFn = null;

  /**
   * Optional labels for columns by the property Name
   * ex: {Miles_per_Gallon:'Miles per Gallon'} or {0:'Miles per Gallon'} for arrays
   * @type {Object}
   **/
  #labels = {};

  /**
   * The number of rows to limit.
   * 
   * 10 : means ascending 10 records.
   * 
   * -10 : means descending 10 records
   * @type {Number}
   */
  #limit = 0;

  /**
   * PrintValue options to use when rendering the table values
   * @type {PrintOptions}
   **/
  #printOptions = null;

  /**
   * Sorting function
   * 
   * @example utils.array.createSort('index')
   * 
   * @type {Function}
   **/
  #sortFn = null;

  /**
   * Style to apply at the table
   * @type {String}
   */
  #styleTable = '';

  /**
   * Style to apply to all the headers
   * @type {String}
   */
  #styleHeader = '';

  /**
   * Style to apply at the row
   * @type {Function}
   */
  #styleRow = null;

  /**
   * Style to apply at the cell
   * @type {Function}
   */
  #styleCell = null;

  /**
   * Whether the data should be output transposed
   * @type {Boolean}
   */
  #isTransposed = false;

  /**
   * Function to format a value for a cell
   * 
   * @example
   * 
   * data = [{temp: 37, type: 'C'}, {temp: 310, type: 'K'}, {temp: 98, type: 'F'}];
   * 
   * //-- simple example where the temp property is converted, and type property overwritten
   * new TableGenerator(data)
   *  .generateMarkdown()
   * 
   * //-- gives
   * temp | type
   * ---- | ----
   * 37   | C   
   * 310  | K   
   * 98   | F   
   * 
   * @param {Object[]} - collection of objects
   */
  constructor(data) {
    this.reset();
    if (data) {
      this.data(data);
    }
  }

  /**
   * Resets the generator
   */
  reset() {
    this.#data = [];
    this.#augmentFn = null;
    this.#borderCSS = '';
    this.#columns = null;
    this.#columnsToExclude = [];
    this.#fetch = null;
    this.#filterFn = null;
    this.#formatterFn = null;
    this.#labels = {};
    this.#limit = 0;
    this.#printOptions = null;
    this.#sortFn = null;
    this.#styleTable = '';
    this.#styleHeader = '';
    this.#styleRow = null;
    this.#styleCell = null;
    this.#isTransposed = false;
  }

  //--    GETTER SETTERS

  /**
   * Assigns the data to be used in generating the table.
   * @param {Array} collection -
   * @returns {TableGenerator} - chainable instance
   * @see #constructor
   * @example
   * 
   * dataSet = [{temp: 37, type: 'C'}, {temp: 310, type: 'K'}, {temp: 98, type: 'F'}];
   * 
   * //-- simple example where the temp property is converted, and type property overwritten
   * new TableGenerator()
   *  .data(dataSet)
   *  .generateMarkdown()
   * 
   * //-- gives
   * temp | type
   * ---- | ----
   * 37   | C   
   * 310  | K   
   * 98   | F   
   */
  data(col) {
    this.#data = col || [];
    return this;
  }

  /**
   * Augments data with additional fields
   * 
   * (Convenience function to add additional values without augmenting the data.)
   * 
   * Note that doing a `.map()` on the dataset prior may have better performance
   * but doing so may modify the dataset - where this would not.
   * 
   * @example
   * 
   * sourceData = [{id: 1, temp_F:98}, {id: 2, temp_F:99}, {id: 3, temp_F:100}];
   * 
   * new utils.TableGenerator(sourceData)
   *  .augment({
   *    temp_C: (row) => (row.temp_F - 32) * 0.5556,
   *    temp_K: (row) => (row.temp_F - 32) * 0.5556 + 1000
   *  })
   *  .generateMarkdown()
   * 
   * //-- provides:
   * 
   * id | temp_F | temp_C | temp_K
   * -- | ------ | ------ | ------
   * 1  | 98     | 36.667 | 309.817
   * 2  | 99     | 37.222 | 310.372
   * 3  | 100    | 37.778 | 310.928
   * 
   * @param {Object} obj - Object with properties to add to the result data
   * @param {Function} obj.newProperty - Function per property to add
   * @param {Object} obj.newProperty.record - Each record within data
   * 
   * @returns {TableGenerator} - chainable instance
   */
  augment(obj) {
    if (!obj) {
      this.#augmentFn = null;
      return this;
    }

    const fnMap = new Map();
    const augmentKeys = Object.getOwnPropertyNames(obj);

    augmentKeys.forEach((key) => {
      if ((typeof obj[key]) !== 'function') {
        throw (Error(`Formatter properties must be functions. [${key}]`));
      }
    });

    this.#augmentFn = (record) => {
      const newRecord = { ...record };
      augmentKeys.forEach((key) => {
        newRecord[key] = obj[key](record);
      });
      return newRecord;
    };

    return this;
  }

  /**
   * Convenience function to set an a border on the Data Cells.
   * 
   * This only applies when {@link TableGenerator#render|rendering HTML}
   * or {@link TableGenerator#generateHTML|generating HTML}
   * 
   * As this adds additional CSS, the styling applied:
   *   * {@link TableGenerator#styleTable|to the whole table}
   *   * or {@link TableGenerator#styleRow|to the rows}
   *   * or {@link TableGenerator#styleCell|to the data cells} will be affected
   * 
   * For example:
   * 
   * ```
   * sourceData = [{id: 1, temp_F:98}, {id: 2, temp_F:99}, {id: 3, temp_F:100}];
   * 
   * new utils.TableGenerator(sourceData)
   *    .border('1px solid #aaa')
   *    .render();
   * ```
   * 
   * <table cellspacing="0px" >
   * <tr >
   *   <th>id</th>
   *   <th>temp_F</th>
   * </tr>
   * <tr >
   *   <td style=" border: 1px solid #aaa">1</td>
   *   <td style=" border: 1px solid #aaa">98</td>
   * </tr>
   * <tr >
   *   <td style=" border: 1px solid #aaa">2</td>
   *   <td style=" border: 1px solid #aaa">99</td>
   * </tr>
   * <tr >
   *   <td style=" border: 1px solid #aaa">3</td>
   *   <td style=" border: 1px solid #aaa">100</td>
   * </tr>
   * </table>
   * 
   * @param {String | Boolean} borderCSS - CSS String to additionally apply HTML TD elements
   */
  border(borderCSS) {
    let cleanCSS = '';

    if (borderCSS === true) {
      cleanCSS = 'border: 1px solid #AAA';
    } else if (borderCSS) {
      cleanCSS = `border: ${borderCSS}`;
    }

    this.#borderCSS = cleanCSS;

    return this;
  }

  /**
   * Applies an optional set of columns / properties to render
   * 
   * @param {String[]} values - Optional array of exclusive fields to render\n
   *    If not provided, then all fields are rendered.\n
   *    If provided, then only the fields listed will be rendered\n
   * @returns {TableGenerator} - chainable instance
   * @example
   * 
   * dataSet = [{reg:'z', source: 'A', temp: 99},
   *    {reg: 'z', source: 'B', temp: 98},
   *    {reg: 'z', source:'A', temp: 100}
   * ];
   * 
   * //-- only show the temp and source columns
   * new TableGenerator(dataSet)
   *  .columns('temp', 'source') // or .columns(['temp', 'source'])
   *  .generateMarkdown();
   * 
   * //-- provides
   * 
   * temp | source
   * ---- | ------
   * 99   | A
   * 98   | B
   * 100  | A
   **/
  columns(values, ...rest) {
    //-- make safer because I keep making this mistake.
    if (typeof values === 'string') {
      this.#columns = [values, ...rest];
    } else if (Array.isArray(values)) {
      this.#columns = values;
    } else {
      throw (new Error('columns expects array of strings'));
    }
    return this;
  }
   
  /**
   * Applies an optional set of columns / properties not to render
   * 
   * @param {String[]} values - Optional array of columns not to render\n
   *    If not provided, then all fields are rendered.\n
   *    If provided, then these fields will not be rendered under any circumstance.\n
   * @returns {TableGenerator} - chainable instance
   * @example
   * 
   * dataSet = [{reg:'z', source: 'A', temp: 99},
   *    {reg: 'z', source: 'B', temp: 98},
   *    {reg: 'z', source:'A', temp: 100}
   * ];
   * 
   * //-- only show the temp and source columns
   * new TableGenerator(dataSet)
   *  .columnsToExclude('reg') // or .columnsToExclude(['reg'])
   *  .generateMarkdown();
   * 
   * //-- provides
   * 
   * temp | source
   * ---- | ------
   * 99   | A
   * 98   | B
   * 100  | A
   **/
  columnsToExclude(values, ...rest) {
    //-- make safer because I keep making this mistake.
    if (typeof values === 'string') {
      this.#columnsToExclude = [values, ...rest];
    } else if (Array.isArray(values)) {
      this.#columnsToExclude = values;
    } else {
      throw (new Error('columns to exclude expects array of strings'));
    }
    return this;
  }

  /**
   * Filter the dataset
   * 
   * (This is a alternative to calling `.filter()` on the source data)
   * 
   * For example:
   * 
   * ```
   * data = [{temp: 98, type: 'F'}, {temp: 37, type: 'C'}, {temp: 309, type: 'K'}];
   * 
   * //-- simple example where the temp property is converted, and type property overwritten
   * new TableGenerator(data)
   *  .filter((row) => row.type === 'C')
   *  .generateMarkdown()
   * 
   * //-- gives
   * temp | type
   * ---- | ----
   * 37   | C   
   * ```
   * 
   * @param {Function} filterFn - A function that returns `true` to include the row in output
   * @param {Object} filterFn.row - a record from within `data`
   * 
   * @returns {TableGenerator}
   */
  filter(filterFn) {
    this.#filterFn = filterFn;
    return this;
  }

  /**
   * Object that provides translations functions for matching properties.
   * 
   * (This is an alternate to {@link formatterFn} or simple `.map()` call on the source data)
   * 
   * **NOTE: Only matching properties on the formatter object are changed - all others are left alone.**
   * 
   * For example:
   * 
   * ```
   * data = [
   *   {station: 'A', temp: 98, type: 'F', descr: '0123'},
   *   {station: 'A', temp: 99, type: 'F', descr: '0123456'},
   *   {station: 'A', temp: 100, type: 'F', descr: '0123456789'}
   * ];
   * 
   * //-- simple example where the temp property is converted, and type property overwritten
   * new TableGenerator(data)
   *  .formatter({
   *    //-- property 'station' not mentioned, so no change
   *    
   *    //-- convert temperature to celsius
   *    temp: (value) => (value - 32) * 0.5556,
   *    //-- overwrite type from 'F' to 'C'
   *    type: 'C',
   *    //-- ellipsify to shorten the description string, if longer than 8 characters
   *    descr: (str) => utils.format.ellipsify(str, 8)
   *  }).renderMarkdown()
   * ```
   * 
   * station|temp  |type|descr    
   * --     |--    |--  |--       
   * A      |36.67 |F   |0123     
   * A      |37.225|F   |0123456  
   * A      |37.781|F   |01234567…
   * 
   * Note, due to frequent requests, simple datatype conversions can be requested.
   * 
   * Only ('String', 'Number', and 'Boolean') are supported
   * 
   * ```
   * data = [
   *   { propA: ' 8009', propB: 8009, isBoolean: 0},
   *   { propA: ' 92032', propB: 92032, isBoolean: 1},
   *   { propA: ' 234234', propB: 234234, isBoolean: 1},
   * ];
   * 
   * new utils.TableGenerator(data)
   *   .formatter({
   *     //-- convert Prop A to Number - so render with Locale Number Formatting
   *     propA: 'number',
   *     //-- conver PropB to String - so render without Locale Number Formatting
   *     propB: 'string',
   *     //-- render 'True' or 'False'
   *     isBoolean: 'boolean'
   *   }).renderMarkdown();
   * ```
   * 
   * propA|propB|isBoolean
   * --                  |--                |--       
   * 8,009               |8009              |false    
   * 92,032              |92032             |true     
   * 234,234             |234234            |true 
   * 
   * @param {Object} obj - object with properties storing arrow functions
   * @param {Function} obj.PropertyToTranslate - (value) => result
   * 
   * @returns {TableGenerator}
   */
  formatter(obj) {
    if (!obj) {
      this.#formatterFn = null;
      return this;
    }

    const fnMap = new Map();
    Object.getOwnPropertyNames(obj).forEach((key) => {
      if ((typeof obj[key]) === 'string') {
        let fn;
        const str = obj[key].toLowerCase();
        if (str === 'string') {
          fn = (val) => String(val);
        } else if (str === 'number') {
          fn = (val) => Number(val);
        } else if (str === 'boolean') {
          fn = (val) => val ? 'true' : 'false';
        } else {
          throw Error(`TableGenerator.format: property ${key} formatter of ${str} is unsupported. Only (String, Number, Boolean) are supported`);
        }
        fnMap.set(key, fn);
      } else {
        if ((typeof obj[key]) !== 'function') {
          throw (Error(`Formatter properties must be functions. [${key}]`));
        }
        fnMap.set(key, obj[key]);
      }
    });
    
    this.#formatterFn = ({ value, property }) => fnMap.has(property)
      ? fnMap.get(property)(value)
      : value;
    return this;
  }

  /**
   * Function that can format a value for a given row, cell
   * 
   * (value, cellIndex, header, rowIndex, row, record) => string
   * 
   * @param {function(*):any} fn - Translation function to apply to all cells.
   * 
   * When it runs, you will recieve a single parameter representing the current cell and row.
   * 
   * Return what the new value should be.
   * @param {any}    fn.value - destructured value of the cell
   * @param {Number} fn.columnIndex - destructured 0 index column of the cell
   * @param {String} fn.property - destructured property used for that column
   * @param {Number} fn.rowIndex - destructured 0 index row of the cell
   * @param {Array}  fn.record - destructured original record
   * 
   * @returns {TableGenerator}
   */
  formatterFn(fn) {
    this.#formatterFn = fn;
    return this;
  }

  /**
   * The number of rows to limit.
   * 
   * 10 : means ascending 10 records.
   * 
   * -10 : means descending 10 records
   * 
   * @param {Number} limitRecords - 0 for all records, + for ascending, - for descending
   * @return {TableGenerator} - chainable interface
   */
  limit(limitRecords) {
    this.#limit = limitRecords;
    return this;
  }

  /**
   * Sets the alternative labels to be used for specific fields.
   * 
   * single object with properties that should show a different label\n
   *  
   * @example
   * 
   * dataSet = [{source: 'A', temp: 99},
   *    {source: 'B', temp: 98},
   *    {source:'A', temp: 100}
   * ];
   * 
   * //-- only show the temp and source columns
   * new TableGenerator(dataSet)
   *  .lables({ temp: 'temperature})
   *  .generateMarkdown();
   * 
   * //--
   * 
   * source | temperature
   * ------ | -----------
   * A      | 99
   * B      | 98
   * C      | 100
   * 
   * @param {Object} labelsObj -
   * @returns {TableGenerator} - chainable instance
   */
  labels(labelsObj) {
    this.#labels = labelsObj;
    return this;
  }

  /**
   * Options to give to printOptions
   * 
   * @example
   * 
   * dataSet = [
   *    {id: 1, dateTime:new Date(2022,3,2,9), child: { results: true }},
   *    {id: 1, dateTime:new Date(2022,3,3,9), child: { results: false }},
   *    {id: 1, dateTime:new Date(2022,3,4,9), child: { results: true }}
   * ];
   * 
   * console.log(new utils.TableGenerator(dataSet)
   *     .generateMarkdown({align: true})
   * )
   * 
   * //--
   * 
   * id|dateTime            |child            
   * --|--                  |--               
   * 1 |4/2/2022, 9:00:00 AM|{"results":true} 
   * 1 |4/3/2022, 9:00:00 AM|{"results":false}
   * 1 |4/4/2022, 9:00:00 AM|{"results":true} 
   * 
   * dataSet = [
   *    {id: 1, dateTime:new Date(2022,3,2,9), child: { results: true }},
   *    {id: 1, dateTime:new Date(2022,3,3,9), child: { results: false }},
   *    {id: 1, dateTime:new Date(2022,3,4,9), child: { results: true }}
   * ];
   * 
   * console.log(new utils.TableGenerator(dataSet)
   *     .printOptions({ collapseObjects: true, dateFormat: 'toISOString'})
   *     .generateMarkdown({align: true})
   * )
   * 
   * id|dateTime            |child          
   * --|--                  |--             
   * 1 |2022-04-02T14:00:00.000Z|[object Object]
   * 1 |2022-04-03T14:00:00.000Z|[object Object]
   * 1 |2022-04-04T14:00:00.000Z|[object Object]
   * 
   * @param {any} value - the value to print
   * @param {Object} options - collection of options
   * @param {Boolean} options.collapseObjects - if true, typesof Object values are not expanded
   * @param {String} options.dateFormat - ('LOCAL'|'LOCAL_DATE','LOCAL_TIME','GMT','ISO','UTC','NONE')
   * 
   * @see module:format.printValue
   * @returns {TableGenerator} - chainable instance
   */
  printOptions(options) {
    this.#printOptions = options;
    return this;
  }
  
  /**
   * Applies a [standard array sort function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
   * to the data.
   * 
   * @param {Function} fn - optional sort function
   * @returns {TableGenerator} - chainable instance
   * @see module:array.createSort
   **/
  sortFn(fn) {
    this.#sortFn = fn;
    return this;
  }

  /**
   * Convenience function that creates a sort based on properties.
   * 
   * Sorting always occurs left to right - sort('First', 'Second', etc.)
   * 
   * NOTE: prefixing a field with `-` will sort it descending.
   * 
   * @example
   * 
   * ```
   * sampleData = [{val: 3}, {val:1}, {val:2}];
   * new TableGenerator(sampleData)
   *  //-- sort ascending by the val property
   *  .sort('val')
   *  .render();
   * ```
   * 
   * @see module:array.createSort
   */
  sort(...rest) {
    return this.sortFn(createSort.apply(this, rest));
  }

  /** 
   * Defines the style to render on the table
   * 
   * **Note: this is only used on render / generateHTML currently**
   * 
   * ```
   * dataSet = [{reg:'z', source: 'A', temp: 99},
   *     {reg: 'z', source: 'B', temp: 98},
   *     {reg: 'z', source:'A', temp: 100}
   *  ];
   *  
   * //-- only show the temp and source columns
   * new utils.TableGenerator(dataSet)
   *   .columns('temp', 'source') // or .columns(['temp', 'source'])
   *   .styleTable('border:1px solid #000')
   *   .render();
   * ```
   * ![Screenshot of styling the table with a border on the outside](img/Table_StyleTable.png)
   * 
   * @param {String} value - style to apply to the table
   *    ex: `border: 1px solid black`
   * @returns {TableGenerator} - chainable instance
   **/
  styleTable(value) {
    this.#styleTable = value;
    return this;
  }

  /** 
   * Override the styles for the the header row
   * 
   * **Note: this is only used on render / generateHTML currently**
   * 
   * ```
   * dataSet = [{reg:'z', source: 'A', temp: 99},
   *     {reg: 'z', source: 'B', temp: 98},
   *     {reg: 'z', source:'A', temp: 100}
   *  ];
   *  
   * //-- only show the temp and source columns
   * new utils.TableGenerator(dataSet)
   *   .columns('temp', 'source') // or .columns(['temp', 'source'])
   *   .styleHeader('border: 1px solid #000;')
   *   .render();
   * ```
   * ![Screenshot of styling the table with a border on the header](img/Table_StyleHeader.png)
   * 
   * @param {String} value - style to apply to the table
   *    ex: `font-weight: bold`
   * @returns {TableGenerator} - chainable instance
   **/
  styleHeader(value) {
    this.#styleHeader = value;
    return this;
  }

  /**
   * Function that can apply a style to a given row
   * 
   * (rowIndex, row, record) => string
   * 
   * ```
   * dataSet = [{reg:'z', source: 'A', temp: 10},
   *   {reg: 'z', source: 'B', temp: 98},
   *   {reg: 'z', source:'A', temp: 100}
   * ];
   * 
   * //-- only show the temp and source columns
   * new utils.TableGenerator(dataSet)
   *   .columns('temp', 'source') // or .columns(['temp', 'source'])
   *   .styleRow(({rowIndex, row, record}) => {
   *     return (record.source === 'A') ? `color: #0A0;` : `color: #A00`;
   *   })
   *   .render();
   * ```
   * ![Screenshot of styling a row](img/Table_StyleRow.png)
   * 
   * @param {function(*):any} styleFn - Translation function to apply to all cells.
   * 
   * When it runs, you will receive a single parameter representing the current cell and row.
   * 
   * Return what the new value should be.
   * @param {Number} styleFn.rowIndex - destructured 0 index row of the cell
   * @param {Array}  styleFn.row - destructured full row provided
   * @param {Array}  styleFn.record - destructured original record
   * @returns {TableGenerator} - chainable instance
   */
  styleRow(styleFn) {
    this.#styleRow = styleFn;
    return this;
  }

  /**
   * Function that can apply a style to a given cell
   * 
   * (value, columnIndex, rowIndex, row, record) => string
   * 
   * ```
   * dataSet = [
   *  { title:'row 0', a: 0.608, b: 0.351, c: 0.823, d: 0.206, e: 0.539 },
   *  { title:'row 1', a: 0.599, b: 0.182, c: 0.197, d: 0.352, e: 0.338 },
   *  { title:'row 2', a: 0.275, b: 0.715, c: 0.304, d: 0.482, e: 0.248 },
   *  { title:'row 3', a: 0.974, b: 0.287, c: 0.323, d: 0.875, e: 0.017 },
   *  { title:'row 4', a: 0.491, b: 0.479, c: 0.428, d: 0.252, e: 0.288 }
   * ];
   * 
   * // color range from Green to Red
   * colorRange = new utils.svg.svgJS.Color('#0A0').to('#F00');
   * 
   * //-- only show the temp and source columns
   * new utils.TableGenerator(dataSet)
   *   .styleCell(({value, columnIndex, rowIndex, row, record}) => {
   *     //-- style the color of the cell from Red:0 to Green:1
   *     // record is the exact record provided to data / the generator
   *     // row is the array provided to the renderer (which may be re-arranged)
   *     //   with rowIndex and Column index also relative to the final array
   *     if (columnIndex >= 1) {
   *       return `color: ${colorRange.at(value).toHex()}`;
   *     }
   *   })
   *   .render();
   * ```
   * ![Screenshot of styling the cell](img/Table_StyleCell.png)
   * 
   * @param {function(*):any} formatterFn - Translation function to apply to all cells.
   * 
   * When it runs, you will receive a single parameter representing the current cell and row.
   * 
   * Return what the new value should be.
   * @param {any}    formatterFn.value - destructured value of the cell
   * @param {Number} formatterFn.columnIndex - destructured 0 index column of the cell
   * @param {Number} formatterFn.rowIndex - destructured 0 index row of the cell
   * @param {Array}  formatterFn.row - destructured full row provided
   * @param {Array}  formatterFn.record - destructured original record
   * @returns {TableGenerator}
   */
  styleCell(styleFn) {
    this.#styleCell = styleFn;
    return this;
  }

  /**
   * Transposes (flips along the diagonal) prior to output.
   * 
   * This can be very handy for wide, but short, tables.
   * 
   * For example, given the data:
   * 
   * ```
   * const data = [
   *   { name: 'John', color: 'green', age: 23, hair: 'blond', state: 'IL' },
   *   { name: 'Jane', color: 'brown', age: 23, hair: 'blonde', state: 'IL' }
   * ];
   * ```
   * 
   * Running normally would give
   * 
   * ```
   * new utils.TableGenerator(data)
   *    .generateMarkdown();
   * ```
   * 
   * name|color|age|hair  |state
   * --  |--   |-- |--    |--
   * John|green|23 |blond |IL
   * Jane|brown|23 |blonde|IL
   * 
   * Running that transposed flips it.
   * 
   * ```
   * new utils.TableGenerator(data)
   *  .transpose()
   *  .generateMarkdown();
   * ```
   * 
   * name |John |Jane
   * --   |--   |--
   * color|green|brown
   * age  |23   |23
   * hair |blond|blonde
   * state|IL   |IL
   * @returns {TableGenerator}
   */
  transpose() {
    this.#isTransposed = true;
    return this;
  }

  //-- Table Generation

  /**
   * Prepares the data prior to any rendering.
   * @returns {TableData} -
   * @private
   */
  prepare() {
    let cleanCollection = this.#data || [];
    if (this.#sortFn) {
      cleanCollection = cleanCollection.sort(this.#sortFn);
    }

    //-- augment
    if (this.#augmentFn) {
      cleanCollection = cleanCollection.map(this.#augmentFn);
    }

    //-- filter
    if (this.#filterFn) {
      cleanCollection = cleanCollection.filter(this.#filterFn);
    }

    //-- determine the columns to use
    //-- (based on fields of first record or columns provided)
    const firstRow = cleanCollection.length > 0
      ? cleanCollection[0]
      : {};
    
    let keys = this.#columns || Object.keys(firstRow);
    keys = keys.filter((key) => this.#columnsToExclude.indexOf(key) === -1);

    //-- identify the formatter to use
    const cleanFormatter = this.#formatterFn ? this.#formatterFn : ({ value }) => value;

    const translateHeader = (key) => {
      if (Object.prototype.hasOwnProperty.call(this.#labels, key)) {
        return this.#labels[key];
      }
      return key;
    };

    const translateData = (row, rowIndex) =>
      keys.map((property, columnIndex) =>
        cleanFormatter({
          value: row[keys[columnIndex]],
          columnIndex,
          property,
          rowIndex,
          record: row
        }));

    let headers = keys.map(translateHeader);
    let data = cleanCollection.map(translateData);

    if (this.#limit < 0) {
      data = data.reverse().slice(0, -this.#limit);
    } else if (this.#limit > 0) {
      data = data.slice(0, this.#limit);
    }

    if (this.#isTransposed) {
      let transposedResults = [headers, ...data];
      transposedResults = ArrayUtils.transpose(transposedResults);

      // eslint-disable-next-line prefer-destructuring
      headers = transposedResults[0];
      data = transposedResults.slice(1);
    }

    return ({ headers, data });
  }

  /**
   * Generates an html table
   * @returns {string}
   * @see {@link TableGenerator#render}
   */
  generateHTML() {
    const results = this.prepare();

    //-- @TODO: review giving a set of columns as objects instead

    const styleTable = this.#styleTable;
    const styleHeader = this.#styleHeader;
    const styleRowFn = this.#styleRow;
    const styleCellFn = this.#styleCell;
    const printOptions = this.#printOptions;
    const borderCSS = this.#borderCSS;
    
    const cleanFn = printValue;

    const printHeader = (headers, style) => '\n<tr '
      + (!styleHeader ? '' : `style="${styleHeader}"`)
      + '>\n\t'
      + headers.map((header) => `<th>${header}</th>`)
        .join('\n\t')
      + '\n</tr>\n';

    const printBody = (collection) => collection
      .map((dataRow, rowIndex) => {
        const record = this.#data[rowIndex];
        const rowStyle = !styleRowFn ? null : styleRowFn({ rowIndex, row: dataRow, record });
        return '<tr '
          + (!rowStyle ? '' : `style="${rowStyle}"`)
          + '>\n\t'
          + dataRow.map((value, columnIndex) => {
            //-- note - the data is from the original dataset, not the results
            const cellStyle = !styleCellFn
              ? ''
              : styleCellFn({ value, columnIndex, rowIndex, row: dataRow, record });
            return '<td '
              + (borderCSS || cellStyle ? `style="${cellStyle} ${borderCSS}"` : '')
              + `>${cleanFn(value, printOptions)}</td>`;
          }).join('\n\t')
          + '\n</tr>';
      }).join('\n');
    
    const tableResults = '<table '
      + 'cellspacing="0px" '
      + (!styleTable ? '' : `style="${styleTable}"`)
      + '>'
      + printHeader(results.headers, '')
      + printBody(results.data)
      + '\n</table>';

    return tableResults;
  }

  /**
   * Generates a markdown table
   * @returns {string}
   * @see {@link TableGenerator#renderMarkdown}
   */
  generateMarkdown(options) {
    const {
      align = true
    } = options || {};

    const styleCellFn = this.#styleCell;
    const printOptions = this.#printOptions;
    const cleanFn = printValue;

    // eslint-disable-next-line prefer-const
    let { headers, data } = this.prepare();

    //-- add in the --|--|-- lines but in reverse order
    data.unshift(headers.map((v) => '--'));
    data.unshift(headers);

    const maxWidths = new Array(data[0].length).fill(0);
    data = data.map((row, rowIndex) =>
      row.map((value, columnIndex) => {
        //-- shift down because the headers are added
        const record = rowIndex > 0 ? this.#data[rowIndex - 1] : {};
        const cleanedValue = cleanFn(value, printOptions);
        
        //-- @TODO - we want to bold / make italic, but this needs more thought
        // const cellStyle = !styleCellFn
        //   ? null
        //   : styleCellFn({ value, columnIndex, rowIndex, row, record });

        if (align) {
          const valueLen = cleanedValue.length;
          if (maxWidths[columnIndex] < valueLen) {
            maxWidths[columnIndex] = valueLen;
          }
        }
        return cleanedValue;
      })
    );

    if (align) {
      //-- pad now we know how long to pad
      //-- @TODO - replace inline?
      data = data.map((row, rowIndex) =>
        row.map((value, columnIndex) =>
          value.padEnd(maxWidths[columnIndex], ' '))
      );
    }

    const tableResults = data.map((row) =>
      row.join('|')
    ).join('\n');

    return tableResults;
  }

  /**
   * Generates a CSV Table
   * @see {@link TableGenerator#renderCSV}
   */
  generateCSV() {
    const results = this.prepare();

    const printOptions = this.#printOptions;
    
    const cleanFn = printValue;
    const csvify = (a) => JSON.stringify(a)
      .slice(1)
      .slice(0, -1);

    const printHeader = (headers, style) => csvify(headers)
      + '\n';

    const printBody = (collection) => collection
      .map((dataRow, rowIndex) => csvify(
        dataRow.map((value, columnIndex) => csvify(
          cleanFn(value, printOptions))
        )
      )).join('\n');
    
    const tableResults = printHeader(results.headers, '')
      + printBody(results.data);

    return tableResults;
  }

  /**
   * @typedef {Object} TableArray
   * @property {String} headers -
   * @property {any[][]} data -
   */

  /**
   * Generates an a result set to allow for further processing
   * 
   * @see {@link TableGenerator#generateArray2|generateArray2()}
   * @returns {TableArray}
   * @example
   * 
   * dataSet = [{reg:'z', source: 'A', temp: 99},
   *    {reg: 'z', source: 'B', temp: 98},
   *    {reg: 'z', source:'A', temp: 100}
   * ];
   * 
   * //-- only show the temp and source columns
   * new TableGenerator(dataSet)
   *  .columnsToExclude('reg') // or .columnsToExclude(['reg'])
   *  .generateArray();
   * 
   * //--
   * 
   * {
   *   headers: ['source', 'temp'],
   *   data: [
   *     ['A', 99],
   *     ['B', 98],
   *     ['A', 100],
   *   ]
   * }
   */
  generateArray(returnUnifiedArray = false) {
    const results = this.prepare();
    return results;
  }

  /**
   * Generates an array of objects in a 2d Array
   * 
   * NOTE: this can be helpful for needing to transpose results
   * 
   * @returns {any[][]} - 2d array with both headers and data included
   * @see {@link TableGenerator#generateArray|generateArray()}
   * @example
   * 
   * dataSet = [{reg:'z', source: 'A', temp: 99},
   *    {reg: 'z', source: 'B', temp: 98},
   *    {reg: 'z', source:'A', temp: 100}
   * ];
   * 
   * //-- only show the temp and source columns
   * new TableGenerator(dataSet)
   *  .columnsToExclude('reg') // or .columnsToExclude(['reg'])
   *  .generateArray2();
   * 
   * //--
   * [
   *  ['source', 'temp'],
   *  ['A', 99],
   *  ['B', 98],
   *  ['A', 100],
   * ];
   */
  generateArray2() {
    const results = this.prepare();
    return [...results.headers, ...results.data];
  }

  /**
   * Renders the html table in the cell results.
   * 
   * ```
   * weather = [
   *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
   *   { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
   *   { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31 },
   *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
   *   { id: 4, city: 'New York', month: 'Aug', precip: 4.13 },
   *   { id: 5, city: 'New York', month: 'Dec', precip: 3.58 },
   *   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 },
   *   { id: 8, city: 'Chicago',  month: 'Dec', precip: 2.56 },
   *   { id: 7, city: 'Chicago',  month: 'Aug', precip: 3.98 }
   * ];
   * new utils.TableGenerator(weather)
   *     .render();
   * ```
   * 
   * ![Screenshot of Table](img/tableGeneratorRender.png)
   * 
   * @see {@link TableGenerator#generateHTML}
   */
  render() {
    const context = IJSUtils.detectContext();
    if (!context) {
      throw (Error('Not in iJavaScript, no $$ variable available'));
    }

    context.$$.html(this.generateHTML());
  }

  /**
   * Renders Markdown in the cell results.
   * 
   * Used quite frequently in making the documentation used here.
   * 
   * @see {@link TableGenerator#generateMarkdown}
   * @example
   * weather = [
   *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
   *   { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
   *   { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31 },
   *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
   *   { id: 4, city: 'New York', month: 'Aug', precip: 4.13 },
   *   { id: 5, city: 'New York', month: 'Dec', precip: 3.58 },
   *   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 },
   *   { id: 8, city: 'Chicago',  month: 'Dec', precip: 2.56 },
   *   { id: 7, city: 'Chicago',  month: 'Aug', precip: 3.98 }
   * ];
   * new utils.TableGenerator(weather)
   *     .renderMarkdown();
   * 
   * // id|city    |month|precip
   * // --|--      |--   |--    
   * // 1 |Seattle |Aug  |0.87  
   * // 0 |Seattle |Apr  |2.68  
   * // 2 |Seattle |Dec  |5.31  
   * // 3 |New York|Apr  |3.94  
   * // 4 |New York|Aug  |4.13  
   * // 5 |New York|Dec  |3.58  
   * // 6 |Chicago |Apr  |3.62  
   * // 8 |Chicago |Dec  |2.56  
   * // 7 |Chicago |Aug  |3.98
   */
  renderMarkdown() {
    const context = IJSUtils.detectContext();
    if (!context) {
      throw (Error('Not in iJavaScript, no $$ variable available'));
    }

    context.console.log(this.generateMarkdown());
  }

  /**
   * Renders Markdown in the cell results
   * @see {@link TableGenerator#generateCSV}
   * @example
   * weather = [
   *   { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 },
   *   { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 },
   *   { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31 },
   *   { id: 3, city: 'New York', month: 'Apr', precip: 3.94 },
   *   { id: 4, city: 'New York', month: 'Aug', precip: 4.13 },
   *   { id: 5, city: 'New York', month: 'Dec', precip: 3.58 },
   *   { id: 6, city: 'Chicago',  month: 'Apr', precip: 3.62 },
   *   { id: 8, city: 'Chicago',  month: 'Dec', precip: 2.56 },
   *   { id: 7, city: 'Chicago',  month: 'Aug', precip: 3.98 }
   * ];
   * new utils.TableGenerator(weather)
   *     .renderCSV();
   * 
   * // "id","city","month","precip"
   * // "1","Seattle","Aug","0.87"
   * // "0","Seattle","Apr","2.68"
   * // "2","Seattle","Dec","5.31"
   * // "3","New York","Apr","3.94"
   * // "4","New York","Aug","4.13"
   * // "5","New York","Dec","3.58"
   * // "6","Chicago","Apr","3.62"
   * // "8","Chicago","Dec","2.56"
   * // "7","Chicago","Aug","3.98"
   */
  renderCSV() {
    const context = IJSUtils.detectContext();
    if (!context) {
      throw (Error('Not in iJavaScript, no $$ variable available'));
    }

    context.console.log(this.generateCSV());
  }
}

module.exports = TableGenerator;
