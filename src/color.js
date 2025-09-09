/**
 * Bare Bones utility for converting and interpolating between colors.
 * 
 * This is very helpful for graphs and diagrams.
 * 
 * (apologies for my `colour` spelling friends, but please note
 * that this is accessible through both utils.color or utils.colour.
 * 
 * There are 6 types of formats supported:
 * * Hex - 6-8 character hexadecimal colors as RRGGBB or RRGGBBAA, like red for #ff0000 or #ff000080 for semi-transparency
 * * Hex3 - 3-4 character hexadecimal colors: RGB or RGBA, like red for #F00 or #F008 for semi-transparency
 * * RGB - color with format `rgb(RR,GG,BB)` - like red for `rgb(255,0,0)`
 * * RGBA - RGB format with alpha: `rgba(RR,GG,BB,AA)` - like red for `rgba(255,0,0,0.5)` for semi-transparency
 * * ARRAY - 3 to 4 length array, with format: `[r,g,b]` or `[r,g,b,a]` - like red for [255,0,0] or [255,0,0,0.5] for semi-transparency
 * * OBJECT - objects with properties: r, g, b and optionally: a (the object is not modified and only those properties are checked)
 * 
 * These align to the {@link module:color.COLOR_VALIDATION|color.COLOR_VALIDATION} enum.
 * 
 * You can also set the default type to convert to, by assigning the {@link module:color.defaultFormat|color.defaultFormat}
 * to one of the {@link module:color.FORMATS|color.FORMATS} values.
 * 
 * See other common libraries for working with color on NPM:
 * like [d3/color](https://d3js.org/d3-color)
 * or [d3-scale-chromatic scales](https://d3js.org/d3-scale-chromatic)
 * or [d3-color-interpolation](https://d3js.org/d3-interpolate/color)
 * 
 * * Parsing color formats
 *   * {@link module:color.parse|color.parse(string|array|object, optionalAlpha 0-1)} - intelligently parse any of the types to an array format
 *   * {@link module:color.parseHex3|color.parseHex3(string, optionalAlpha)} - parse a 3-4 character Hexadecimal color
 *   * {@link module:color.parseHex|color.parseHex(string, optionalAlpha)} - parse a 6-8 character Hexadecimal color
 *   * {@link module:color.parseRGB|color.parseRGB(string, optionalAlpha)} - parses a RGB format color, like `rgb(255,0,0)`
 *   * {@link module:color.parseRGBA|color.parseRGB(string, optionalAlpha)} - parses a RGB format color, like `rgba(255,0,0,0.5)`
 *   * {@link module:color.parseColorArray|color.parseColorArray(Array, optionalAlpha)} - converts a 3 or 4 length array into a colorArray
 *   * {@link module:color.parseColorObject|color.parseColorObject(object, optionalAlpha)} - captures the r,g,b,a fields from an object
 * * Convert
 *   * {@link module:color.convert|color.convert(target, formatType = defaultFormat)} - intelligently converts any formats into another format
 *   * {@link module:color.toHex|color.toHex(string|array|object)} - converts any of the formats to a 6 character Hexadecimal color
 *   * {@link module:color.toHexA|color.toHexA(string|array|object)} - converts any of the formats to am 8 character Hexadecimal color (with alpha)
 *   * {@link module:color.toRGB|color.toRGB(string|array|object)} - converts any of the formats to an RGB color
 *   * {@link module:color.toRGBA|color.toRGBA(string|array|object)} - converts any of the formats to an RGBA color
 *   * {@link module:color.toColorArray|color.toColorArray(string|array|object, optionalAlpha)} - converts any of the formats to an array of [r,g,b,a]
 *   * {@link module:color.toColorObject|color.toColorObject(string|array|object, optionalAlpha)}  - converts any of the fomrats to an object
 *      with properties: {r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]}
 * * interpolate
 *   * {@link module:color.interpolate|color.interpolate(fromColor, toColor, percent, formatType)} - gradually converts one color to another
 *   * {@link module:color.interpolator|color.interpolator} - create a function you can then call with a percentage over and over again.
 *   * {@link module:color.generateSequence|color.generateSequence} - generate a sequence of colors from one to another, in X number of steps
 *   * {@link module:color.interpolationStrategy|color.interpolationStrategy} - the function to use for interpolation,
 *      a function of signature (fromColor:Number[0-255], toColor:Number[0-255], percentage:Number[0-1]):Number[0-255]
 *   * {@link module:color.INTERPOLATION_STRATEGIES|color.INTERPOLATION_STRATEGIES} - a list of strategies for interpolation you can choose from
 * 
 * ```
 * utils.svg.render({ width: 800, height: 100,
 *     onReady: ({el, width, height, SVG }) => {
 *         const fromColor = '#ff0000';
 *         const toColor = 'rgb(0, 255, 0)';
 * 
 *         const numBoxes = 5;
 *         const boxWidth = width / numBoxes;
 *         const boxHeight = 100;
 * 
 *         // utils.color.interpolationStrategy = utils.color.INTERPOLATION_STRATEGIES.linear;
 *         // utils.color.defaultFormat = utils.color.FORMATS.hex;
 * 
 *         const colorSequence = utils.color.generateSequence(fromColor, toColor, numBoxes);
 *         // [ '#ff0000', '#9d6200', '#4bb400', '#13ec00', '#00ff00' ]
 * 
 *         colorSequence.forEach((boxColor, boxIndex) => {
 *             el.rect(boxWidth, boxHeight)
 *                 .fill(boxColor)
 *                 .translate(boxIndex * boxWidth);
 *         });
 *     }
 * });
 * ```
 * 
 * ![Example SVG](img/interpolationExample.svg)
 * 
 * @module color
 * @exports color
 */
module.exports = {};
const ColorUtils = module.exports;

module.exports.COLOR_VALIDATION = {
  isHex: (str) => Array.isArray(str) ? false : /^#([0-9A-F]{8}$)|([0-9A-F]{6}$)|([0-9A-F]{3}$)/i.test(str),
  isRGB: (str) => /^rgba?\s*\(/.test(str),
  isColorArray: (a) => Array.isArray(a),
  isColorObject: (obj) => (Object.hasOwn(obj, 'r'))
    && (Object.hasOwn(obj, 'g'))
    && (Object.hasOwn(obj, 'b'))
};

/**
 * Enum strings of types expected
 * 
 * There are 6 types of formats supported:
 * * HEX - 6 character hexadecimal colors as RRGGBB, like red for #ff0000
 *   * alternatively - 3 character hexadecimal colors #RGB are supported: like red for #F00
 * * HEXA - 8 character hexadecimal colors as RRGGBBAA, like red for #ff000080 with semi-transparency
 *   * alternatively - 4 character hexadecimal colors #RGBA are supported: #F008
 * * RGB - color with format `rgb(RR,GG,BB)` - like red for `rgb(255,0,0)`
 * * RGBA - RGB format with alpha: `rgba(RR,GG,BB,AA)` - like red for `rgba(255,0,0,0.5)` for semi-transparency
 * * ARRAY - 3 to 4 length array, with format: `[r,g,b]` or `[r,g,b,a]` - like red for [255,0,0] or [255,0,0,0.5] for semi-transparency
 * * OBJECT - objects with properties: r, g, b and optionally: a (the object is not modified and only those properties are checked)
 * 
 * For example:
 * 
 * ```
 * baseColor = '#b1d1f3';
 * 
 * utils.color.convert(baseColor, utils.color.FORMATS.HEX); // '#b1d1f3'
 * utils.color.convert(baseColor, utils.color.FORMATS.HEXA); // #b1d1f3ff
 * utils.color.convert(baseColor, utils.color.FORMATS.RGB); // rgb( 177, 209, 243)
 * utils.color.convert(baseColor, utils.color.FORMATS.RGBA); // rgba(177, 209, 243, 1)
 * utils.color.convert(baseColor, utils.color.FORMATS.ARRAY); // [ 177, 209, 243, 1 ]
 * utils.color.convert(baseColor, utils.color.FORMATS.OBJECT); // { r: 177, g: 209, b: 243, a: 1 }
 * ```
 * 
 * @see {@link module:color.defaultFormat|color.defaultFormat}
 */
module.exports.FORMATS = {
  HEX: 'HEX',
  HEXA: 'HEXA',
  RGB: 'RGB',
  RGBA: 'RGBA',
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT'
};

/**
 * Default format used when converting to types
 * (allowing the conversion type to be optional)
 * 
 * ```
 * baseColor = '#b1d1f3';
 * utils.color.defaultFormat = utils.color.FORMATS.RGBA;
 * 
 * utils.color.convert(baseColor); // rgba(177, 209, 243, 1)
 * ```
 * 
 * @see {@link module:color.FORMATS|color.FORMATS}
 */
module.exports.defaultFormat = ColorUtils.FORMATS.HEX;

const PI2 = Math.PI * 0.5;

/**
 * Different types of interpolation strategies:
 * 
 * ![example](img/interpolationStrategies.svg)
 * 
 * * linear - linear interpolation between one value to another (straight line)
 * * easeInOut - slows in to the change and slows out near the end
 * * easeIn - slow then fast
 * * easeOut - fast then slow
 * 
 * @see {@link module:color.interpolationStrategy|color.interpolationStrategy} - which strategy to use
 */
module.exports.INTERPOLATION_STRATEGIES = {
  linear: (a, b, pct) => a + (b - a) * pct,
  easeInOut: (a, b, pct) => a + (b - a) * (Math.cos(pct * Math.PI + Math.PI) * 0.5 + 0.5),
  easeIn: (a, b, pct) => a + (b - a) * (1 - (Math.cos(pct * PI2))),
  easeOut: (a, b, pct) => a + (b - a) * (Math.sin(pct * PI2))
};

/**
 * Default interpolation strategy used when interpolating
 * from one color to another.
 * 
 * (Defaults to linear)
 * 
 * ![example](img/interpolationStrategies.svg)
 * 
 * For example, you can specify how you would like to interpolate
 * and even which format you'd like to receive the results in.
 * 
 * ```
 * //-- same as utils.color.INTERPOLATION_STRATEGIES.linear;
 * red = '#FF0000';
 * green = '#00FF00';
 * linear = (a, b, pct) => a + (b - a) * pct;
 * format = utils.color.FORMATS.ARRAY;
 * utils.color.interpolate(red, green, 0, linear, format); // [255, 0, 0, 1]
 * ```
 * 
 * or instead, you can set this property and set the default
 * 
 * ```
 * // or set the default
 * utils.color.interpolationStrategy = linear;
 * utils.color.defaultFormat = utils.color.FORMATS.ARRAY;
 * 
 * //-- note that the interpolation strategy or format isn't passed
 * utils.color.interpolate(red, green, 0.5); // [127.5, 127.5, 0, 1]
 * ```
 * 
 * @see {@link module:color.INTERPOLATION_STRATEGIES}
 */
module.exports.interpolationStrategy = ColorUtils.INTERPOLATION_STRATEGIES.linear;

// alternatives to check for objects:
// deconstruct: ({r, g, b}) = obj; typeof r !== 'undefined
// deconstruct: ({r, g, b}) = obj; r !== undefined

/**
 * Parses a 3-4 character Hexadecimal color.
 * 
 * For example: #F00 for Red or #F008 for semi-transparent red.
 * 
 * ```
 * red = `#F00`;
 * transparentRed = `#F00F`;
 * green = `#0F0`;
 * 
 * utils.color.parseHex(red, 0.5); // [255, 0, 0, 0.5];
 * utils.color.parseHex(transparenRed); // [255, 0, 0, 1];
 * utils.color.parseHex(green); // [0, 255, 0, 1];
 * ```
 * 
 * @param {String} hexStr - 3 or 4 character Hexadecimal Color like `#F00` or `#F008`
 * @param {Number} [optionalAlpha = 1] - value [0-1] to use for the alpha, if not provided
 * @returns {Array} - array of format [r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]]
 * @see {@link module:color.FORMATS|color.FORMATS}
 */
module.exports.parseHex3 = function parseHex3(hexStr, optionalAlpha = 1) {
  if (!ColorUtils.COLOR_VALIDATION.isHex(hexStr)) {
    return undefined;
  }
  if (hexStr.length > 5) return ColorUtils.parseHex(hexStr, optionalAlpha);

  const alphaDefault = optionalAlpha * 255;
  const [r, g, b, a = alphaDefault] = hexStr.match(/[a-fA-F0-9]/g)
    .map((hexPair) => Number.parseInt(hexPair, 16))
    .map((num) => num * 16 + num);
  const cleanedA = (a / 255);
  return [r, g, b, cleanedA];
};

/**
 * Parses a 6 or 8 character Hexadecimal color.
 * 
 * For example: #FF0000 for Red or #FF000080 for semi-transparent red.
 * 
 * ```
 * red = `#FF0000`;
 * transparentRed = `#FF0000FF`;
 * green = `#00FF00`;
 * 
 * utils.color.parseHex(red, 0.5); // [255, 0, 0, 0.5];
 * utils.color.parseHex(transparenRed); // [255, 0, 0, 1];
 * utils.color.parseHex(green); // [0, 255, 0, 1];
 * ```
 * 
 * @param {String} hexStr - 6 or 8 character Hexadecimal Color like: #FF0000
 * @param {Number} [optionalAlpha = 1] - value [0-1] to use for the alpha, if not provided
 * @returns {Array} - array of format [r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]]
 * @see {@link module:color.FORMATS|color.FORMATS}
 */
module.exports.parseHex = function parseHex(hexStr, optionalAlpha = 1) {
  if (!ColorUtils.COLOR_VALIDATION.isHex(hexStr)) {
    return undefined;
  }
  const alphaDefault = Math.round(optionalAlpha * 255);
  if (hexStr.length < 7) return ColorUtils.parseHex3(hexStr, optionalAlpha);
  const [r, g, b, a = alphaDefault] = hexStr.match(/[a-fA-F0-9]{2}/g)
    .map((hexPair) => Number.parseInt(hexPair, 16));
  const cleanedA = (a / 255);
  return [r, g, b, cleanedA];
};

/**
 * Converts any of {@link module:color.FORMATS|of the formats available},
 * and converts it into a 6 character hexadecimal string (no alpha)
 * 
 * ```
 * red = '#FF000088';
 * green = { r: 0, g: 255, b: 0, a: 0.5};
 * blue = 'rgb(0, 0, 255, 1)';
 * 
 * utils.color.toHex(red); // `#FF0000`
 * utils.color.toHex(green); // `#00FF00`
 * utils.color.toHex(blue); // `#0000FF`
 * ```
 * 
 * @param {string|array|object} target - any of the Formats provided
 * @returns {String} - 6 character Hexadecimal color: #RRGGBB
 */
module.exports.toHex = function toHex(target) {
  const [r, g, b] = ColorUtils.parse(target);
  const hexOut = (num) => num.toString(16).padStart(2, '0');
  return `#${hexOut(r)}${hexOut(g)}${hexOut(b)}`;
};

/**
 * Converts any of {@link module:color.FORMATS|of the formats available},
 * and converts it into a 8 character hexadecimal string with alpha
 * 
 * ```
 * red = '#FF000088';
 * green = { r: 0, g: 255, b: 0, a: 0.5};
 * blue = 'rgb(0, 0, 255, 1)';
 * 
 * utils.color.toHexA(red); // `#FF000088`
 * utils.color.toHexA(green); // `#00FF0080`
 * utils.color.toHexA(blue); // `#0000FFFF`
 * ```
 * 
 * @param {string|array|object} target - any of the Formats provided
 * @returns {String} - 8 character Hexadecimal color: #RRGGBBAA
 */
module.exports.toHexA = function toHexA(target, optionalAlpha = 1) {
  const [r, g, b, a] = ColorUtils.parse(target, optionalAlpha);
  const hexOut = (num) => num.toString(16).padStart(2, '0');
  return `#${hexOut(r)}${hexOut(g)}${hexOut(b)}${hexOut(a * 255)}`;
};

/**
 * Parses a color of format `rgb(r, g, b)`
 * 
 * For example: `rgb(255, 0, 0)` for Red
 * 
 * ```
 * red = `rgb(255, 0, 0, 1)`;
 * green = `rgb(0, 255, 0)`;
 * 
 * utils.color.parse(red, 0.9); // [255, 0, 0, 0.9];
 * utils.color.parse(green); // [0, 255, 0, 1];
 * ```
 * 
 * @param {String} rgbStr - string
 * @param {Number} [optionalAlpha = 1] - value [0-1] to use for the alpha, if not provided
 * @returns {Array} - array of format [r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]]
 * @see {@link module:color.FORMATS|color.FORMATS}
 */
module.exports.parseRGB = function parseRGB(rgbStr, optionalAlpha = 1) {
  if (!ColorUtils.COLOR_VALIDATION.isRGB(rgbStr)) return undefined;

  const [r, g, b, a = optionalAlpha] = rgbStr.replace(/[^[0-9,.]/g, '')
    .split(',')
    .map((decStr, index) => index < 3 ? Number.parseInt(decStr, 10) : Number.parseFloat(decStr, 10));
  return [r, g, b, a];
};

/**
 * Parses a color of format `rgba(r, g, b, a)`
 * 
 * For example: `rgba(255, 0, 0, 1)` for a solid red, or `rgba(255, 0, 0, 0.5)` for a semi-transparent red
 * 
 * ```
 * red = `rgba(255, 0, 0, 1)`;
 * transparentRed = `rgba(255, 0, 0, 0.5)`;
 * green = `rgb(0, 255, 0, 1)`;
 * 
 * //-- does not use the optionalAlpha, because the alpha was passed in the string
 * utils.color.parse(red, 0.9); // [255, 0, 0, 1];
 * utils.color.parse(transparentRed); // [255, 0, 0, 0.5];
 * utils.color.parse(green); // [0, 255, 0, 1];
 * ```
 * 
 * @param {String} rgbStr - string
 * @param {Number} [optionalAlpha = 1] - value [0-1] to use for the alpha, if not provided
 * @returns {Array} - array of format [r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]]
 * @see {@link module:color.FORMATS|color.FORMATS}
 */
module.exports.parseRGBA = module.exports.parseRGB;

/**
 * Converts any of {@link module:color.FORMATS|of the formats available},
 * and converts it into a an rgb string (no alpha)
 * 
 * ```
 * red = '#FF000088';
 * green = { r: 0, g: 255, b: 0, a: 0.5};
 * blue = 'rgb(0, 0, 255, 1)';
 * 
 * utils.color.toHex(red); // `rgb(255, 0, 0)`
 * utils.color.toHex(green); // `rgb(0, 255, 0)`
 * utils.color.toHex(blue); // `rgb(0, 0, 255)`
 * ```
 * 
 * @param {string|array|object} target - any of the Formats provided
 * @returns {String} - an rgb string (no alpha)
 */
module.exports.toRGB = function toRGB(target) {
  const [r, g, b] = ColorUtils.parse(target);
  return `rgb( ${r}, ${g}, ${b})`;
};

/**
 * Converts any of {@link module:color.FORMATS|of the formats available},
 * and converts it into a an rgba string (includes alpha)
 * 
 * ```
 * red = '#FF000080';
 * green = { r: 0, g: 255, b: 0, a: 0.5};
 * blue = 'rgb(0, 0, 255, 1)';
 * 
 * utils.color.toRGBA(red); // `rgba(255, 0, 0, 0.5)`
 * utils.color.toRGBA(green); // `rgba(0, 255, 0, 0.5)`
 * utils.color.toRGBA(blue); // `rgba(0, 0, 255, 1)`
 * ```
 * 
 * @param {string|array|object} target - any of the Formats provided
 * @returns {String} - an rgba string (includes alpha)
 */
module.exports.toRGBA = function toRGBA(target, optionalAlpha = 1) {
  const [r, g, b, a] = ColorUtils.parse(target, optionalAlpha);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/**
 * Parses a 3 or 4 length array of numbers, in format of [Red:Number[0-255], Green:Number[0-255], Blue:Number[0-255], Alpha:Number[0-1]]
 * 
 * For example: `[255, 0, 0]` for Red, or `[255, 0, 0, 0.5]` for a semi-transparent red
 * 
 * ```
 * red = [255, 0, 0];
 * transparentRed = [255, 0, 0, 0];
 * green = [0, 255, 0];
 * 
 * utils.color.parseColorArray(red, 0.5); // [255, 0, 0, 0.5];
 * utils.color.parseColorArray(transparentRed); // [255, 0, 0, 0];
 * utils.color.parseColorArray(green); // [0, 255, 0, 1];
 * ```
 * 
 * @param {Array} targetArray - string
 * @param {Number} [optionalAlpha = 1] - value [0-1] to use for the alpha, if not provided
 * @returns {Array} - array of format [r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]]
 * @see {@link module:color.FORMATS|color.FORMATS}
 */
module.exports.parseColorArray = function parseColorArray(targetArray, optionalAlpha) {
  if (!Array.isArray(targetArray)) return undefined;
  const [r, g, b, a = optionalAlpha] = targetArray;
  return [r, g, b, a];
};

/**
 * Converts any of {@link module:color.FORMATS|of the formats available},
 * and converts it into a - array
 * of format [r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]]
 * 
 * ```
 * red = '#FF000080';
 * green = { r: 0, g: 255, b: 0, a: 0.5};
 * blue = 'rgb(0, 0, 255, 1)';
 * 
 * utils.color.toColorArray(red); // [255, 0, 0, 0.5]
 * utils.color.toColorArray(green); // [0, 255, 0, 0.5]
 * utils.color.toColorArray(blue); // [0, 0, 255, 1]
 * ```
 * 
 * @param {string|array|object} target - any of the Formats provided
 * @returns {Array} - array of format [r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]]
 */
module.exports.toColorArray = function toColorArray(target, optionalAlpha = 1) {
  const [r, g, b, a] = ColorUtils.parse(target, optionalAlpha);
  return [r, g, b, a];
};

/**
 * Captures properties: `r:Number[0-255]`, `g:Number[0-255]`, `b:Number[0-255]`, `a:Number[0-1]` from an object.
 * 
 * Only those properties are checked and the object is not modified
 * 
 * For example: `{ r: 255, g: 0, b: 0}` for Red or `{ r: 255, g: 0, b: 0, a: 0.5 }` for a semi-transparent red
 * 
 * ```
 * red = { r: 255, g: 0, b: 0 };
 * green = { r: 0, g: 255, b: 0, a: 1};
 * transparentBlue: { r: 0, g: 0, b: 255, a: 0};
 * 
 * utils.color.parseColorObject(red, 0.5); // [255, 0, 0, 0.5];
 * utils.color.parseColorObject(red); // [255, 0, 0, 1];
 * utils.color.parseColorObject(green); // [0, 255, 0, 1];
 * utils.color.parseColorObject(transparentBlue); // [0, 0, 255, 0];
 * ```
 * 
 * @param {Object} target - string
 * @param {Number} [optionalAlpha = 1] - value [0-1] to use for the alpha, if not provided
 * @returns {Array} - array of format [r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]]
 * @see {@link module:color.FORMATS|color.FORMATS}
 */
module.exports.parseColorObject = function parseColorObject(target, optionalAlpha = 1) {
  if (!ColorUtils.COLOR_VALIDATION.isColorObject(target)) return undefined;
  const { r, g, b, a = optionalAlpha } = target;
  return [r, g, b, a];
};

/**
 * Converts any of {@link module:color.FORMATS|of the formats available},
 * and converts it into an object with the following properties:
 * 
 * Object {
 *  r: Number[0-255],
 *  g: Number[0-255],
 *  b: Number[0-255],
 *  a: Number[0-1]]
 * }
 * 
 * 
 * ```
 * red = '#FF000080';
 * green = { r: 0, g: 255, b: 0, a: 0.5};
 * blue = 'rgb(0, 0, 255, 1)';
 * 
 * utils.color.toColorObject(red); // { r: 255, g: 0, b: 0, a: 0.5 }
 * utils.color.toColorObject(green); // { r: 0, g: 255, b: 0, a: 0.5 }
 * utils.color.toColorObject(blue); // { r: 0, g: 0, b: 255, a: 1 }
 * ```
 * 
 * @param {string|array|object} target - any of the Formats provided
 * @returns {Object} - object with properties {r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]}
 */
module.exports.toColorObject = function toColorObject(target, optionalAlpha = 1) {
  const [r, g, b, a] = ColorUtils.parse(target, optionalAlpha);
  return ({ r, g, b, a });
};

/**
 * Pareses any of the types of available formats, and returns an array.
 * 
 * There are 6 types of formats supported:
 * * Hex - 6-8 character hexadecimal colors as RRGGBB or RRGGBBAA, like red for #ff0000 or #ff000080 for semi-transparency
 * * Hex3 - 3-4 character hexadecimal colors: RGB or RGBA, like red for #F00 or #F008 for semi-transparency
 * * RGB - color with format `rgb(RR,GG,BB)` - like red for `rgb(255,0,0)`
 * * RGBA - RGB format with alpha: `rgba(RR,GG,BB,AA)` - like red for `rgba(255,0,0,0.5)` for semi-transparency
 * * ARRAY - 3 to 4 length array, with format: `[r,g,b]` or `[r,g,b,a]` - like red for [255,0,0] or [255,0,0,0.5] for semi-transparency
 * * OBJECT - objects with properties: r, g, b and optionally: a (the object is not modified and only those properties are checked)
 * 
 * by passing a value of any of those types, they will be recognized and parsed accordingly.
 * 
 * The result array format is an array 3 or 4 length array of numbers,
 * in format of [Red:Number[0-255], Green:Number[0-255], Blue:Number[0-255], Alpha:Number[0-1]]
 * 
 * ```
 * red = '#FF000088';
 * green = { r: 0, g: 255, b: 0};
 * blue = 'rgb(0, 0, 255, 1)';
 * 
 * utils.color.parse(red); // [255, 0, 0, 128]
 * utils.color.parse(green); // [0, 255, 0, 1]
 * utils.color.parse(blue); // [0, 0, 255, 1]
 * ```
 * 
 * @param {String} rgbStr - string
 * @param {Number} [optionalAlpha = 1] - value [0-1] to use for the alpha, if not provided
 * @returns {Array} - array of format [r:Number[0-255], g: Number[0-255], b: Number[0-255], a: Number[0-1]]
 * @see {@link module:color.FORMATS|color.FORMATS}
 */
module.exports.parse = function parse(target, optionalAlpha = 1) {
  return ColorUtils.parseColorArray(target, optionalAlpha)
    || ColorUtils.parseHex(target, optionalAlpha)
    || ColorUtils.parseRGB(target, optionalAlpha)
    || ColorUtils.parseColorObject(target, optionalAlpha);
};

/**
 * Converts any of {@link module:color.FORMATS|of the formats available},
 * and converts it to any other format.
 * 
 * This is by far the most versatile.
 * 
 * 
 * ```
 * red = '#FF000080';
 * green = { r: 0, g: 255, b: 0, a: 0.5};
 * blue = 'rgb(0, 0, 255, 1)';
 * 
 * utils.color.convert(red, color.FORMATS.OBJECT); // { r: 255, g: 0, b: 0, a: 0.5 }
 * utils.color.convert(green, color.FORMATS.ARRAY); // [0, 255, 0, 0.5]
 * utils.color.convert(blue, color.FORMATS.HEXA); // `#0000FFFF`
 * ```
 * 
 * NOTE: you can also set the default format on the color utility,
 * so you don't have to specify the format each time.
 * 
 * ```
 * red = '#FF000080';
 * green = { r: 0, g: 255, b: 0, a: 0.5};
 * blue = 'rgb(0, 0, 255, 1)';
 * 
 * //-- converts to hex because color.defaultFormat is set to hex by default
 * utils.color.convert(red); // #FF000080
 * 
 * utils.color.defaultFormat = utils.color.FORMATS.ARRAY
 * utils.color.convert(green); // [0, 255, 0, 0.5]
 * utils.color.convert(blue); // [0, 0, 255, 1]
 * ```
 * 
 * @param {string|array|object} target - any of the Formats provided
 * @param {string} [formatType = color.defaultFormat] - optional format to convert to, if not using the default
 * @returns {string|array|object} - any of the format types provided
 * 
 * @see {@link module:color.defaultFormat|color.defaultFormat} - to set the default format
 */
module.exports.convert = function convert(target, formatType = ColorUtils.defaultFormat) {
  if (formatType === ColorUtils.FORMATS.ARRAY) {
    return ColorUtils.toColorArray(target);
  } else if (formatType === ColorUtils.FORMATS.HEX) {
    return ColorUtils.toHex(target);
  } else if (formatType === ColorUtils.FORMATS.HEXA) {
    return ColorUtils.toHexA(target);
  } else if (formatType === ColorUtils.FORMATS.RGB) {
    return ColorUtils.toRGB(target);
  } else if (formatType === ColorUtils.FORMATS.RGBA) {
    return ColorUtils.toRGBA(target);
  } else if (formatType === ColorUtils.FORMATS.OBJECT) {
    return ColorUtils.toColorObject(target);
  }
  return target;
};

/**
 * Interpolates from one color to another color, by a percentage (from 0-1)
 * 
 * ```
 * red = `#FF0000`;
 * green = `#00FF00`;
 * 
 * utils.color.interpolate(red, green, 0); // `#FF0000`
 * utils.color.interpolate(red, green, 0.5); // `#808000`
 * utils.color.interpolate(red, green, 1); // `#00FF00`
 * ```
 * 
 * You can also specify how you would like to interpolate
 * and even which format you'd like to receive the results in.
 * 
 * ```
 * //-- same as utils.color.INTERPOLATION_STRATEGIES.linear;
 * linear = (a, b, pct) => a + (b - a) * pct;
 * format = utils.color.FORMATS.ARRAY;
 * 
 * utils.color.interpolate(red, green, 0, linear, format); // [255, 0, 0, 1]
 * 
 * // or set the default
 * utils.color.interpolationStrategy = linear;
 * utils.color.defaultFormat = utils.color.FORMATS.ARRAY;
 * 
 * utils.color.interpolate(red, green, 0.5); // [127.5, 127.5, 0, 1]
 * ```
 * 
 * @param {string|array|object} fromColor -the color to interpolate from
 * @param {string|array|object} toColor - the color to interpolate to
 * @param {Number} percent - value from 0-1 on where we should be on the sliding scale
 * @param {Function} [interpolationFn = ColorUtils.interpolationStrategy] - function of
 *  signature (fromVal:Number[0-255], toVal:Number[0-255], pct:Number[0-1]):Number[0-255]
 * @param {String} [formatType = ColorUtils.defaultFormat] - the format to convert the result to 
 * @returns {string|array|object} - any of the formats provided
 * 
 * @see {@link module:color.interpolationStrategy|color.interpolationStrategy} - the default interpolation
 *    used to calculate how the percentages come up with the color
 * @see {@link module:color.defaultFormat|color.defaultFormat} - the default format to use if not specified
 * @see {@link module:format.mapArrayDomain|format.mapArrayDomain}
 */
module.exports.interpolate = function interpolate(
  fromColor,
  toColor,
  percent = 0,
  interpolationFn = ColorUtils.interpolationStrategy,
  formatType = ColorUtils.defaultFormat
) {
  const cleanPercent = percent < 0 ? 0
    : percent > 1 ? 1
      : percent;
  const parsedA = ColorUtils.parse(fromColor);
  const parsedB = ColorUtils.parse(toColor);

  const newColor = parsedA.map((aValue, index) => interpolationFn(aValue, parsedB[index], cleanPercent));
  newColor[0] = Math.round(newColor[0]);
  newColor[1] = Math.round(newColor[1]);
  newColor[2] = Math.round(newColor[2]);
  return ColorUtils.convert(newColor, formatType);
};

/**
 * Curried function for color interpolation, so only the percent between [0-1] inclusive is needed.
 * 
 * Meaning that you can do something like this:
 * 
 * ```
 * black = `#000000`;
 * white = `#FFFFFF`;
 * 
 * colorFn = utils.color.interpolator(black, white);
 * 
 * colorFn(0);   // '#000000';
 * colorFn(0.5); // '#808080';
 * colorFn(1);   // '#FFFFFF;
 * 
 * ```
 * 
 * Instead of something like this with the interpolate function
 * 
 * ```
 * utils.color.interpolate(black, white, 0); // `#000000`
 * utils.color.interpolate(black, white, 0.5); // `#808080`
 * utils.color.interpolate(black, white, 1); // `#FFFFFF`
 * ```
 * 
 * @param {string|array|object} fromColor -the color to interpolate from
 * @param {string|array|object} toColor - the color to interpolate to
 * @param {Function} [interpolationFn = ColorUtils.interpolationStrategy] - function of
 *  signature (fromVal:Number[0-255], toVal:Number[0-255], pct:Number[0-1]):Number[0-255]
 * @param {String} [formatType = ColorUtils.defaultFormat] - the format to convert the result to 
 * @returns {Function} - of signature: (Number) => {string|array|object}
 * @see {@link module:color.interpolate|color.interpolate} - as this is a curried version of that function.
 * @see {@link module:format.mapArrayDomain|format.mapArrayDomain}
 */
module.exports.interpolator = function interpolator(
  fromColor,
  toColor,
  interpolationFn = ColorUtils.interpolationStrategy,
  formatType = ColorUtils.defaultFormat
) {
  return function interpolatorImpl(pct) {
    return ColorUtils.interpolate(fromColor, toColor, pct, interpolationFn, formatType);
  };
};

/**
 * Generates a sequential array of colors interpolating fromColor to toColor, 
 * 
 * ```
 * black = `#000000`;
 * white = `#FFFFFF`;
 * 
 * categoricalColors = utils.color.generateSequence(black, white, 5);
 * // [' #000000' ,' #404040' ,' #808080' ,' #bfbfbf' ,' #ffffff' ]
 * ```
 * 
 * @param {string|array|object} fromColor -the color to interpolate from
 * @param {string|array|object} toColor - the color to interpolate to
 * @param {Number} lengthOfSequence - how many steps in the sequence to generate
 * @param {Function} [interpolationFn = ColorUtils.interpolationStrategy] - function of
 *  signature (fromVal:Number[0-255], toVal:Number[0-255], pct:Number[0-1]):Number[0-255]
 * @param {String} [formatType = ColorUtils.defaultFormat] - the format to convert the result to 
 * @returns {Function} - of signature: (Number) => {string|array|object}
 * @see {@link module:color.interpolate|color.interpolate} - as this is a curried version of that function.
 */
module.exports.generateSequence = function generateSequence(
  fromColor,
  toColor,
  lengthOfSequence,
  interpolationFn = ColorUtils.interpolationStrategy,
  formatType = ColorUtils.defaultFormat
) {
  if (lengthOfSequence <= 0) return [];
  const cleanLengthOSequence = Math.floor(lengthOfSequence);
  const maxIndex = cleanLengthOSequence - 1;
  const result = new Array(lengthOfSequence).fill(0)
    .map((_, index) => index / maxIndex)
    .map((pct) => ColorUtils.interpolate(fromColor, toColor, pct, interpolationFn, formatType));
  return result;
};

/**
 * Simple sequence of colors to use when plotting categorical values.
 * 
 * Used based on the Tableau color scheme.
 * 
 * For example:
 *
 * ```
 * utils.color.SEQUENCE[0]
 */
ColorUtils.SEQUENCE = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
