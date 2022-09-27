/* eslint-disable no-empty, class-methods-use-this, no-redeclare */

//-- encode the strings into the format needed for the plantuml server
const plantUMLEncoder = require('plantuml-encoder');

//-- used for polyfilling fetch
const DatasetUtils = require('./datasets');

//-- used for accessing iJavaScript context
const IJSUtils = require('./ijs');

/**
 * PlantUML Render diagrams in Jupyter Lab
 * Renderer for PlantUML - a rendering engine that converts text to diagrams.
 * 
 * ![Screenshot of plantUML](img/plantumlSequence.png)
 * 
 * * Setting defaults:
 *   * {@link module:plantuml.protocol|plantuml.protocol} - ex: 'http://'
 *   * {@link module:plantuml.host|plantuml.host} - ex: 'localhost:8080'
 *   * {@link module:plantuml.setDefaultFormat|plantuml.setDefaultFormat(format)} - whether to use 'png' or 'svg' as default
 *   * {@link module:plantuml.getDefaultFormat|plantuml.getDefaultFormat()} - get the current default
 * * rendering
 *   * {@link module:plantuml.generateURL|plantuml.generateURL(string, options)} - determine a url to generate the image
 *   * {@link module:plantuml.render|plantuml.render(string, options)} - render the results in a jupyter cell
 * 
 * # Types of Diagrams Supported
 * 
 * All PlantUML diagrams are supported - as they are managed by the server.
 * 
 * ![Screenshot of types of PlantUML Diagrams](img/plantUmlDiagrams.jpg)
 * 
 * Such as:
 * <a href="https://plantuml.com/sequence-diagram">Sequence diagrams</a>,
 * <a href="https://plantuml.com/use-case-diagram">Usecase diagrams</a>,
 * <a href="https://plantuml.com/class-diagram">Class diagrams</a>,
 * <a href="https://plantuml.com/object-diagram">Object diagrams</a>,
 * <a href="https://plantuml.com/activity-diagram-beta">Activity diagrams</a>,
 * <a href="https://plantuml.com/component-diagram">Component diagrams</a>,
 * <a href="https://plantuml.com/deployment-diagram">Deployment diagrams</a>,
 * <a href="https://plantuml.com/state-diagram">State diagrams</a>,
 * <a href="https://plantuml.com/timing-diagram">Timing diagrams</a>,
 * and many others...
 * 
 * # Running your own PlantUML Server
 * 
 * **This library requires a PlantUML server to render the images,
 * however the images will be preserved upon export.**
 * 
 * (We are currently evaluating additional options like [MermaidJS]().
 * They are available still through {@link module:ijs.htmlScript|ijs.htmlScript},
 * but are still determining a sufficient option)
 * 
 * [PlantUML PicoWeb](https://plantuml.com/picoweb) is a very simple PlantUML Server.
 * 
 * [Learn more here](https://plantuml.com/picoweb)
 * 
 * @module plantuml
 * @exports plantuml
 */
module.exports = {};
const PlantUML = module.exports;

// require('./_types/global');

/**
 * simple / empty plantuml diagram
 * @private
 */
const emptyPlantUML = '@startuml\n@enduml';

/**
 * default format for retrieving values
 * @default
 * @private
*/
let defaultFormat = 'svg';

/**
 * The protocol used to access the PlantUML results
 * @type {String}
 * @default
 */
module.exports.protocol = 'http://';

/**
 * The host domain of the PlantUML server
 * @type {String}
 * @default
 */
module.exports.host = 'localhost:8080';

/**
 * Resets the defaults
 * 
 * * format
 * * protocol
 * * host
 */
module.exports.reset = function reset() {
  PlantUML.defaultFormat = 'svg';
  PlantUML.protocol = 'http://';
  PlantUML.host = 'localhost:8080';
};

/**
 * Verify that a format is acceptable
 * @param {String} format
 * @throws {Error} - if the format is not acceptable
 * @private
 */
const checkFormat = function checkFormat(format) {
  if (format === 'svg') {
  } else if (format === 'png') {
  } else {
    throw new Error(`Unexpected PlantUML format:${format}. Expected are: svg, png`);
  }
  return format;
};

/**
 * Determines the default format to retrieve
 * @returns {String} [svg | png]
 */
module.exports.getDefaultFormat = function getDefaultFormat() {
  return defaultFormat;
};

/**
 * Sets the default format to retrieve
 * @param {('svg'|'png')} format - which format to default from now on 
 */
module.exports.setDefaultFormat = function setDefaultFormat(format) {
  defaultFormat = checkFormat(format);
};

/**
 * Generates a URL for a given plantUMLText
 * 
 * ```
 * //-- note there should be no space after '@' character
 * //-- ex: '@' + 'startuml' and '@' + 'enduml' 
 * utils.plantuml.generateURL(`@ startuml
 *   Alice -> Bob: Authentication Request
 *   Bob --> Alice: Authentication Response
 *   
 *   Alice -> Bob: Another authentication Request
 *   Alice <-- Bob: Another authentication Response
 *   @ enduml`);
 * // 'http://localhost:8080/plantuml/svg/SoWkIImgAStDuNBCoKnELT2rKt3AJx9IS2mjo...'
 * ```
 * 
 * @param {String} plantUMLText - the text to render
 * @param {Object} plantUMLOptions - the options to use
 * @param {('svg'|'png')} [plantUMLOptions.format = 'svg'] - the format to use for this render
 */
module.exports.generateURL = function generateURL(plantUMLText, plantUMLOptions) {
  const cleanOptions = plantUMLOptions || {};
  let {
    format = 'svg'
  } = cleanOptions;
  format = checkFormat(format);
  const plantUMLTextStr = plantUMLText || emptyPlantUML;

  const encodedStr = plantUMLEncoder.encode(plantUMLTextStr);

  return `${PlantUML.protocol}${PlantUML.host}/plantuml/${format}/${encodedStr}`;
};

/**
 * Renders a PlantUML Text
 * 
 * ![Screenshot of plantUML](img/plantumlSequence.png)
 * 
 * ```
 * //-- note there should be no space after '@' character
 * //-- ex: '@' + 'startuml' and '@' + 'enduml' 
 * utils.plantuml.render(`@ startuml
 *   Alice -> Bob: Authentication Request
 *   Bob --> Alice: Authentication Response
 *   
 *   Alice -> Bob: Another authentication Request
 *   Alice <-- Bob: Another authentication Response
 *   @ enduml`)
 * ```
 * 
 * @param {String} plantUMLText - the text to render
 * @param {Object} plantUMLOptions - the options to use
 * @param {('svg'|'png')} [plantUMLOptions.format = 'svg'] - the format to use for this render
 * @param {Boolean} [showURL = false] - whether to show the URL at the bottom
 * @param {Boolean} [debug = false] - whether to provide debugging information
 */
module.exports.render = function render(plantUMLText, plantUMLOptions) {
  const cleanOptions = plantUMLOptions || {};

  // const context = IJSUtils.detectContext();
  // if (!context) throw Error('PlantUML.render: expecting to run in iJavaScript context');
  // const { $$: display, console } = context;

  let {
    format = 'svg'
  } = cleanOptions;
  
  const {
    showURL = false,
    debug = false
  } = cleanOptions;

  format = checkFormat(format);

  DatasetUtils.polyfillFetch();

  IJSUtils.await(async ($$, console) => {
    const targetURL = this.generateURL(plantUMLText, plantUMLOptions);
    if (showURL || debug) console.log(`url:${targetURL}`);

    const result = await fetch(targetURL);

    if (format === 'png') {
      const buf = await result.buffer();
      $$.png(buf.toString('base64'));
      return;
    }

    //-- assume svg
    const svgStr = await result.text();
    $$.svg(svgStr);
  });
};
