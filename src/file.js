/** child process to execute the cli */
// const childProcess = require('child_process');

/** process to read / write files. */
const fs = require('fs-extra');
const fsStd = require('fs');

/** library to resolve paths */
const path = require('path');

// const TemporaryStore = require('./TemporaryStore');

//const DeveloperError = require('./DeveloperError');
const logger = require('./logger');

/**
 * Simple file for working with files,
 * (or storing and loading json data)
 * 
 * * Writing files
 *   * {@link module:file.writeFile|writeFile(path, string)} - write or append to file with plain text
 *   * {@link module:file.writeJSON|writeJSON(path, any)} - write or append to a file with objects converted to JSON
 * * reading files
 *   * {@link module:file.readFile|readFile(path, string)} - read a file as plain text
 *   * {@link module:file.readJSON|readJSON(path, any)} - read data as JSON
 * * listing directory
 *   * {@link module:file.pwd|pwd()} - list the current path
 *   * {@link module:file.listFiles|listFiles(path)} - list files in a diven path
 *   * {@link module:file.matchFiles|matchFiles(path, matchingFn)} - find files or directories based on type of file or name
 * * checking files exist
 *   * {@link module:file.checkFile|checkFile(...paths)} - check if a file at a path exists
 *   * {@link module:file.fileExists|fileExists(filePath)} - check if a single file at a path exists
 * * using a cache for long running executions
 *   * {@link module:file.useCache|file.useCache()} - perform an expensive calculation and write to a cache, or read from the cache transparently
 * 
 * ---
 * 
 * For example, we just generated a dataset we want to come back to.
 * 
 * ```
 * const weather = [
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
 * utils.file.writeJSON('./data/weather.json', weather);
 * ```
 * 
 * ... Later on
 * 
 * I forgot which directory that the notebook is running in:
 * 
 * ```
 * utils.file.pwd();
 * // /Users/path/to/notebook/
 * ```
 * 
 * Now, I'd like to look at the files I currently have saved:
 * 
 * ```
 * utils.file.listFiles('.');
 * // [ 'data', 'package.json', ... ]
 * 
 * utils.file.listFiles('./data');
 * // ['weather.json', 'barley.json', 'cars.json']
 * ```
 * 
 * Great! we can load in the data
 * 
 * ```
 * data = utils.file.loadJSON('./data/weather.json');
 * // -- data already deserialized
 * data.length
 * // 9
 * 
 * ... continue massaging the data as we wanted.
 * ```
 * 
 * @module file
 * @exports file
 */
module.exports = {};

// eslint-disable-next-line no-unused-vars
const FileUtil = module.exports;

//module.exports.TemporaryStore = TemporaryStore;

/**
 * Read JSON file.
 * 
 * Note that this uses 'utf-8' encoding by default
 * 
 * @param {string} filePath - path of the file to load
 * @param {Object} fsOptions - options to pass for fsRead (ex: { encoding: 'utf-8' })
 * @param {Function} fsOptions.formatter - formatter to use when writing the JSON
 * @param {String} fsOptions.encoding - the encoding to write the JSON out with
 * @example
 * const weather = [
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
 * utils.file.writeJSON('./data/weather.json', weather);
 * 
 * const myWeather = utils.file.readJSON('./data/weather.json');
 * myWeather.length; // 9
 * @see {@link module:file:writeJSON|writeJSON(path, data, fsOptions)} - to write the data
 */
module.exports.readJSON = function readJSON(filePath, fsOptions = {}) {
  const resolvedPath = path.resolve(filePath);
  const optionsDefaults = { encoding: 'utf-8' };
  let cleanedOptions = { ...optionsDefaults, ...fsOptions };

  //-- unfortunately we cannot pass the formatter in addition, it must replace
  //-- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
  if (cleanedOptions.formatter) cleanedOptions = cleanedOptions.formatter;

  /** @type {string} */
  let result;
  if (!fs.existsSync(resolvedPath)) {
    logger.error('File does not exist: %s', resolvedPath);
    return;
  }

  try {
    result = fs.readJsonSync(resolvedPath, cleanedOptions);
    return result;
  } catch (err) {
    logger.error(`unable to read file: ${resolvedPath}`);
  }
};

/**
 * Reads a file in as text.
 * 
 * This can be handy for tinkering / cleaning of small sets of data.
 * 
 * Note that this uses `utf-8` by default for the encoding
 * 
 * @param {String} filePath - path of the file to load
 * @param {Object} fsOptions - options to pass for fsRead (ex: { encoding: 'utf-8' })
 * @returns {String} -
 * @see {@link module:file.writeFile|writeFile(filePath, contents, fsOptions)} - for writing
 * @example
 * sillySong = utils.file.load('../data/pirates.txt');
 * 
 * sillySong.split(/\n[ \t]*\n/)        // split on multiple line breaks
 *   .map(stanza => stanza.split(/\n/)  // split lines by newline
 *     .map(line => line.trim())        // trim each line
 *   );
 * sillySong[0][0]; // I am the very model of a modern Major-General,
 */
module.exports.readFile = function readFile(filePath, fsOptions = {}) {
  const resolvedPath = path.resolve(filePath);
  const optionsDefaults = { encoding: 'utf-8' };
  const cleanedOptions = { ...optionsDefaults, ...fsOptions };
  /** @type {string} */
  let result;

  if (!fs.existsSync(resolvedPath)) {
    logger.error('File does not exist: %s', resolvedPath);
    return;
  }

  try {
    result = fs.readFileSync(resolvedPath, cleanedOptions);
    return result;
  } catch (err) {
    logger.error(`unable to read file: ${resolvedPath}`);
  }
};

/**
 * Writes to a file
 * 
 * NOTE that this uses `utf-8` as the default encoding
 * 
 * ```
 * const weather = [
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
 * utils.file.writeJSON('./data/weather.json', weather);
 * 
 * const myWeather = utils.file.readJSON('./data/weather.json');
 * myWeather.length; // 9
 * ```
 * 
 * Note, passing `append:true` in the options, will let you append text before writing,
 * useful for dealing with large and complex files.
 * 
 * ```
 * weatherEntry1 = { id: 1, city: 'Seattle',  month: 'Aug', precip: 0.87 };
 * weatherEntry2 = { id: 0, city: 'Seattle',  month: 'Apr', precip: 2.68 };
 * weatherEntry3 = { id: 2, city: 'Seattle',  month: 'Dec', precip: 5.31 };
 * 
 * utils.file.writeJSON('./data/weather2.json', weatherEntry1, { prefix: '[' });
 * utils.file.writeJSON('./data/weather2.json', weatherEntry2, { append: true, prefix: ', ' });
 * utils.file.writeJSON('./data/weather2.json', weatherEntry3, { append: true, prefix: ', ', suffix: ']' });
 * 
 * utils.file.readJSON('./data/weather.json');
 * 
 * //-- single line shown here on multiple lines for clarity
 * // [{"id":1,"city":"Seattle","month":"Aug","precip":0.87}
 * // ,{"id":0,"city":"Seattle","month":"Apr","precip":2.68}
 * // ,{"id":2,"city":"Seattle","month":"Dec","precip":5.31}]
 * 
 * @param {string} filePath - path of the file to write
 * @param {string} contents - contents of the file
 * @param {Object} fsOptions - [nodejs fs writeFileSync, appendFileSync options](https://nodejs.org/api/fs.html)
 * @param {Boolean} fsOptions.append - if true, will append the text to the file
 * @param {Boolean} fsOptions.prefix - string to add before writing the json, like an opening bracket '[' or comma ','
 * @param {Boolean} fsOptions.prefix - string to add before writing the json, like a closing bracket ']'
 * @param {String} fsOptions.encoding - encoding to use when writing the file.
 * @see {@link module:file.readJSON|readJSON(filePath, fsOptions)} - for reading
 */
module.exports.writeJSON = function writeJSON(filePath, contents, fsOptions = {}) {
  //-- if it isn't desired, simply pass as a string.
  const optionsDefaults = { encoding: 'utf-8' };
  const cleanedOptions = { ...optionsDefaults, ...fsOptions };
  const isAppend = cleanedOptions.append === true;
  const prefix = cleanedOptions.prefix || '';
  const suffix = cleanedOptions.suffix || '';
  const formatter = cleanedOptions.formatter || null;
  const spacing = cleanedOptions.spacing || 2;
  const jsonContents = JSON.stringify(contents, formatter, spacing);

  // const resolvedPath = path.resolve(filePath);
  try {
    if (isAppend) {
      fs.appendFileSync(filePath, prefix + jsonContents + suffix, cleanedOptions);
    } else {
      fs.writeFileSync(filePath, prefix + jsonContents + suffix, cleanedOptions);
    }
  } catch (err) {
    logger.error(`unable to write to file: ${filePath}`);
  }
};

/**
 * Writes to a file
 * 
 * Note that this uses `utf-8` as the encoding by default
 * 
 * ```
 * const myString = `hello`;
 * utils.file.writeFile('./tmp', myString);
 * const newString = utils.file.readFile('./tmp');
 * newString; // 'hello';
 * ```
 * 
 * Note, you can append to the file by passing `{append:true}` in the options.
 * 
 * @param {string} filePath - path of the file to write
 * @param {string} contents - contents of the file
 * @param {Object} fsOptions - [nodejs fs writeFileSync, appendFileSync options](https://nodejs.org/api/fs.html)
 * @param {Boolean} fsOptions.append - if true, will append the text to the file
 * @param {String} fsOptions.encoding - encoding to use when writing the file.
 * @see {@link module:file.readFile|readFile(filePath, fsOptions)} - for reading
 */
module.exports.writeFile = function writeFile(filePath, contents, fsOptions = {}) {
  const resolvedPath = path.resolve(filePath);
  const optionsDefaults = { encoding: 'utf-8' };
  const cleanedOptions = { ...optionsDefaults, ...fsOptions };
  const isAppend = cleanedOptions.append === true;

  try {
    // fsStd.writeFileSync(resolvedPath, contents, { encoding: 'utf-8' });
    if (isAppend) {
      fs.appendFileSync(resolvedPath, contents, cleanedOptions);
    } else {
      fs.writeFileSync(resolvedPath, contents, cleanedOptions);
    }
  } catch (err) {
    logger.error(`unable to write to file: ${filePath}`);
    logger.error('err.message', err.message);
    logger.error(err.stack);
  }
};

/**
 * Useful when checking values for tests
 * @deprecated
 * @private
 */
module.exports.writeFileStd = function writeFileStd(filePath, contents) {
  //-- allow tests to use, but should be cleared prior to commit
  /* istanbul ignore next */
  if (process.env.JEST_WORKER_ID !== undefined) console.warn('Warning: Test using writeFileStd');
  
  const resolvedPath = path.resolve(filePath);
  try {
    fsStd.writeFileSync(resolvedPath, contents, { encoding: 'utf-8' });
    // fs.writeFileSync(resolvedPath, contents, { encoding: 'utf-8' });
  } catch (err) {
    logger.error(`unable to write to file: ${filePath}`);
    logger.error('err.message', err.message);
    logger.error(err.stack);
  }
};

/**
 * List the current path (working directory)
 * 
 * @returns {string}
 * @see {@link module:file.listFiles|listFiles(path)} - to list the files of a directory
 * @example
 * utils.file.pwd(); // /user/path/to/notebook
 */
module.exports.pwd = function pwd() {
  return path.resolve('.');
};

/**
 * List files in a directory
 * 
 * @param {String} directoryPath - path of the directory to list
 * @param {Object} [readdirOptions=null] - object with options to pass to fs readdir
 * @see {@link module:file.pwd|pwd()} - to get the current working directory
 * @see {@link module:file.matchFiles|matchFiles(path, matchingFn)} - find files or directories based on type of file or name
 * @example
 * utils.file.listFiles('./');
 * // ['.gitignore', 'data', ... ];
 */
module.exports.listFiles = function listFiles(directoryPath, readdirOptions = null) {
  const resolvedPath = path.resolve(directoryPath);
  if (!fs.existsSync(resolvedPath)) {
    logger.error('Path does not exist: %s', resolvedPath);
    return;
  } else if (fs.ensureDirSync(resolvedPath)) { // eslint-disable-line no-else-return
    logger.error(`Path is not a directory:${resolvedPath}`);
    return;
  }

  try {
    const results = fs.readdirSync(resolvedPath, readdirOptions);
    return results;
  } catch (err) {
    logger.error(`unable to read directory: ${resolvedPath}`);
  }
};

/**
 * Finds files in a directory, returning only the file names and paths of those that match a function.
 * 
 * Note the matching function passes both fileNames and {@link https://nodejs.org/api/fs.html#class-fsdirent|DirEnt} objects<br />
 * {(fileName:String, file:{@link https://nodejs.org/api/fs.html#class-fsdirent|DirEnt}) => Boolean}<br />
 * allowing for checking for files:`.isFile()`, directories:`.isDirectory()`, symbolic links:`.isSymbolicLink()`, etc.
 * 
 * For example, if there is a `./tmp` folder, with:
 * 
 * * ./tmp/fileA (file)
 * * ./tmp/fileB (file)
 * * ./tmp/dirA  (directory)
 * * ./tmp/dirB  (directory)
 * 
 * You could find only files like the following:
 * 
 * ```
 * utils.file.matchFiles('./tmp', (fileName, file) => file.isFile());
 * // ['./tmp/fileA', './tmp/fileB'];
 * ```
 * 
 * or find directories ending with the letter B:
 * 
 * ```
 * utils.file.matchFiles('./tmp',
 *  (fileName, file) => file.isDirectory() && fileName.endsWith('B')
 * );
 * // ['./tmp/dirB'];
 * ```
 * 
 * Note: passing false as the last parameter will only return file names
 * 
 * ```
 * utils.file.matchFiles('./tmp', (fileName) => fileName.startsWith('file'), false);
 * // ['fileA', 'fileB']
 * ```
 * 
 * @param {String} directoryPath - path of the directory to match within
 * @param {Function} matchingFunction - (DirEnt) => Boolean function to determine
 *  if the path should be returned or not
 * @param {Boolean} [returnFullPath=true] - whether the full path should be returned
 * @see {@link module:file.listFiles|listFiles(path)} - list files in a diven path
 * @returns {String[]} - list of the files that match 

 */
module.exports.matchFiles = function matchFiles(directoryPath, matchingFunction, returnFullPath = true) {
  return FileUtil.listFiles(directoryPath, { withFileTypes: true })
    .filter((dirExt) => matchingFunction(dirExt.name, dirExt))
    .map((dirExt) => returnFullPath
      ? path.resolve(directoryPath, dirExt.name)
      : dirExt.name);
};

/**
 * Synchronously checks if any of the files provided do not exist.
 * 
 * For example:
 * 
 * ```
 * //-- these exist
 * // ./data/credentials.env
 * // ./data/results.json
 * 
 * if (!utils.file.checkFile('./data/results.json')) {
 *    //-- retrieve the results
 *    utils.ijs.await(async($$, console) => {
 *      results = await connection.query('SELECT XYZ from Contacts');
 *      utils.file.write('./data/results.json', results);
 *    });
 * } else {
 *    results = utils.file.readJSON('./data/results.json');
 * }
 * ```
 * 
 * Note, you can also ask for multiple files at once
 * 
 * ```
 * utils.file.checkFile(
 *    './data/credentials.env',
 *    './data/results.json',
 *    './data/results.csv'
 * );
 * // false
 * ```
 * 
 * or as an array:
 * 
 * ```
 * utils.file.checkFile(['./data/credentails.env']);
 * // true
 * ```
 * 
 * @param  {...String} files - List of file paths to check (can use relative paths, like './') <br />
 *    see {@link file:listFiles|listFiles()} or {@link file:pwd|pwd()} to help you)
 * @returns {String[]} - null if all files are found, or array of string paths of files not found
 */
module.exports.checkFile = function checkFile(...files) {
  //-- allow passing an array of files
  const cleanFiles = files.length === 1 && Array.isArray(files[0])
    ? files[0]
    : files;
  
  const resolvedFiles = cleanFiles.map((unresolvedPath) => path.resolve(unresolvedPath));

  const notFoundFiles = resolvedFiles.map((resolvedPath) => fs.existsSync(resolvedPath)
    ? null
    : resolvedPath);
  
  //-- do not filter empty files, as position in array is helpful
  if (notFoundFiles.filter((p) => p).length === 0) {
    return null;
  }

  return notFoundFiles;
};

/**
 * Checks if a single file exists
 * @param {String} filePath - path to check if the file exists.
 * @returns {Boolean} - if the file exists (true) or not (false)
 * @see {@link module:file.checkFile|file.checkFile} - if checking multiple files
 */
module.exports.fileExists = function fileExists(filePath) {
  const resolvedPath = path.resolve(filePath);
  return fs.existsSync(resolvedPath);
};

/*
//-- not needed - dates already serialize to iso Strings
module.exports.cacheSerializer = (key, value) => {
  if (key && (key === 'date' || key.endsWith('_date')) && (value instanceof Date)) {
    return value.toISOString();
  }
  return value;
};
*/

module.exports.cacheDeserializer = (key, value) => {
  if (key && (key === 'date' || key.endsWith('_date'))) {
    return new Date(value);
  }
  return value;
};

/**
 * For very long or time-intensive executions, sometimes it is better to cache the results
 * than to execute them every single time.
 * 
 * Note that this works synchronously, and can be easier to use than if promises are involved.
 * 
 * As opposed to {@link module:ijs.useCache|ijs.useCache} - which works with promises.
 * 
 * ```
 * shouldWrite = true; /// we will write to the cache with the results from the execution
 * expensiveResults = utils.file.useCache(shouldWrite, './cache', 'expensive.json', () => {
 *    const data = d3.csvParse(utils.file.readFile('./someFile.csv'))
 *      .map(obj => ({ ...obj, date: Date.parse(obj.epoch) }));
 *    
 *    const earliestDate = utils.date.startOfDay( utils.agg.min(data, 'date') );
 *    const lastDate = utils.date.endOfDay( utils.agg.max(data, 'date') );
 * 
 *    // binning or lots of other things.
 * 
 *    return finalResults;
 * });
 * 
 * expensiveresults.length = 1023424;
 * ```
 * 
 * but sometimes I would rather just skip to the end
 * 
 * ```
 * shouldWrite = false; /// we will read from the cache instead,
 * // everything else remains the same
 * 
 * expensiveResults = utils.file.useCache(shouldWrite, './cache', 'expensive.json', () => {
 *    const data = d3.csvParse(utils.file.readFile('./someFile.csv'))
 *      .map(obj => ({ ...obj, date: Date.parse(obj.epoch) }));
 * 
 *    //-- function can remain untouched,
 *    //-- BUT nothing in here will be executed
 *    //-- since we are reading from the cache
 * });
 * 
 * //-- completely transparent to the runner
 * expensiveresults.length = 1023424;
 * ```
 * 
 * @param {Boolean} shouldWrite - whether we should write to the cache (true) or read from the cache (false)
 * @param {String} cachePath - Path to the cache folder, ex: './cache'
 * @param {String} cacheFile - Filename of the cache file to use for this execution, ex: 'ExecutionsPerMin.js'
 * @param {Function} expensiveFn - function that returns the results to be stored in the cache
 * @param {Object} fsOptions - options to use when writing or reading files
 * @returns {any} - either the deserialized json from the cache or the results from the expensive function
 * @see {@link module:file.readJSON|file.readJSON} - reads a local JSON file
 * @see {@link module:file.writeJSON|file.writeJSON} - writes to a JSON file
 * @see {@link module:ijs.useCache|ijs.useCache} - similar idea - but supports promises
 */
module.exports.useCache = function useCache(shouldWrite, cachePath, cacheFile, expensiveFn, fsOptions = null) {
  const ensureEndsWithSlash = (str) => str.endsWith('/') ? str : `${str}/`;
  const cacheFilePath = `${ensureEndsWithSlash(cachePath)}${cacheFile}`;
  
  if (!shouldWrite) {
    const cleanOptions = { ...fsOptions, formatter: FileUtil.cacheDeserializer };
    const results = FileUtil.readJSON(cacheFilePath, cleanOptions);
    return results;
  }

  const results = expensiveFn();

  const cleanOptions = { ...fsOptions, formatter: null }; // FileUtil.cacheSerializer not needed

  FileUtil.writeJSON(cacheFilePath, results, cleanOptions);

  return results;
};
