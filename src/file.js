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
 *   * {@link module:file.writeFile|writeFile(path, string)} - write a file as plain text
 *   * {@link module:file.writeJSON|writeJSON(path, any)} - write data as JSON
 * * reading files
 *   * {@link module:file.readFile|readFile(path, string)} - read a file as plain text
 *   * {@link module:file.readJSON|readJSON(path, any)} - read data as JSON
 * * listing directory
 *   * {@link module:file.pwd|pwd()} - list the current path
 *   * {@link module:file.listFiles|listFiles(path)} - list files in a diven path
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
  const cleanedOptions = { ...optionsDefaults, ...fsOptions };

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
 * @param {string} filePath - path of the file to write
 * @param {Object} fsOptions - options to pass for fsRead (ex: { encoding: 'utf-8' })
 * @param {string} contents - contents of the file
 * @see {@link module:file.readJSON|readJSON(filePath, fsOptions)} - for reading
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
 */
module.exports.writeJSON = function writeJSON(filePath, contents, fsOptions = {}) {
  //-- if it isn't desired, simply pass as a string.
  const jsonContents = JSON.stringify(contents, null, 2);
  const optionsDefaults = { encoding: 'utf-8' };
  const cleanedOptions = { ...optionsDefaults, ...fsOptions };

  // const resolvedPath = path.resolve(filePath);
  try {
    fs.writeFileSync(filePath, jsonContents, cleanedOptions);
  } catch (err) {
    logger.error(`unable to write to file: ${filePath}`);
  }
};

/**
 * Writes to a file
 * 
 * Note that this uses `utf-8` as the encoding by default
 * 
 * @param {string} filePath - path of the file to write
 * @param {string} contents - contents of the file
 * @see {@link module:file.readFile|readFile(filePath, fsOptions)} - for reading
 * @example
 * const myString = `hello`;
 * utils.file.writeFile('./tmp', myString);
 * const newString = utils.file.readFile('./tmp');
 * newString; // 'hello';
 */
module.exports.writeFile = function writeFile(filePath, contents, fsOptions = {}) {
  const resolvedPath = path.resolve(filePath);
  const optionsDefaults = { encoding: 'utf-8' };
  const cleanedOptions = { ...optionsDefaults, ...fsOptions };

  try {
    // fsStd.writeFileSync(resolvedPath, contents, { encoding: 'utf-8' });
    fs.writeFileSync(resolvedPath, contents, cleanedOptions);
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
  // eslint-disable-next-line no-console
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
 * @see {@link module:file.pwd|pwd()} - to get the current working directory
 * @example
 * utils.file.listFiles('./');
 * // ['.gitignore', 'data', ... ];
 */
module.exports.listFiles = function listFiles(directoryPath) {
  const resolvedPath = path.resolve(directoryPath);
  if (!fs.existsSync(resolvedPath)) {
    logger.error('Path does not exist: %s', resolvedPath);
    return;
  } else if (fs.ensureDirSync(resolvedPath)) { // eslint-disable-line no-else-return
    logger.error(`Path is not a directory:${resolvedPath}`);
    return;
  }

  try {
    const results = fs.readdirSync(resolvedPath);
    return results;
  } catch (err) {
    logger.error(`unable to read directory: ${resolvedPath}`);
  }
};
