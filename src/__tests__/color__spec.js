const ColorUtils = require('../color');

global.describe('ColorUtil', () => {
  function ColorInfo(name, hex, hexa, hex3, hex3a, rgb, rgba, arr, obj) {
    this.name = name;
    this.hex = hex;
    this.hexa = hexa;
    this.hex3 = hex3;
    this.hex3a = hex3a;
    this.rgb = rgb;
    this.rgba = rgba;
    this.arr = arr;
    this.obj = obj;
    return this;
  }

  const OPAQUE_COLOR = new ColorInfo(
    'opaqueColor',
    '#4499bb',
    '#4499bbff',
    '#49b',
    '#49bf',
    'rgb( 68, 153, 187)',
    'rgba(68, 153, 187, 1)',
    [68, 153, 187, 1],
    { r: 68, g: 153, b: 187, a: 1 }
  );
  const CLEAR_COLOR = new ColorInfo(
    'clearColor',
    '#4499BB',
    '#4499BB00',
    '#49B',
    '#49B0',
    'rgb( 68, 153, 187)',
    'rgb(68, 153, 187, 0)',
    [68, 153, 187, 0],
    { r: 68, g: 153, b: 187, a: 0 }
  );
  const OPAQUE_WHITE = new ColorInfo(
    'opaqueWhite',
    '#FFFFFF',
    '#FFFFFFFF',
    '#FFF',
    '#FFFF',
    'rgb( 255, 255, 255)',
    'rgb(255, 255, 255, 1)',
    [255, 255, 255, 1],
    { r: 255, g: 255, b: 255, a: 1 }
  );
  const OPAQUE_BLACK = new ColorInfo(
    'opaqueBlack',
    '#000000',
    '#000000FF',
    '#000',
    '#000F',
    'rgb( 0, 0, 0)',
    'rgb(0, 0, 0, 1)',
    [0, 0, 0, 1],
    { r: 0, g: 0, b: 0, a: 1 }
  );
  const SEMI_OPAQUE_BLACK = new ColorInfo(
    'opaqueBlack',
    '#000000',
    '#00000088',
    '#000',
    '#0008',
    'rgb( 0, 0, 0)',
    'rgba(0, 0, 0, 0.700)',
    [0, 0, 0, 0.7],
    { r: 0, g: 0, b: 0, a: 0.7 }
  );

  /*
  const TRANS_WHITE = new ColorInfo(
    'transWhite',
    '#FFFFFF',
    '#FFFFFF88',
    '#FFF',
    '#FFF8',
    'rgb( 255, 255, 128',
    'rgb(255, 255, 255, 0.5)',
    [255, 255, 255, 0.5],
    { r: 255, g: 255, b: 255, a: 0.5 }
  );

  const OPAQUE_BLACK = new ColorInfo(
    'opaqueBlack',
    '#000000',
    '#000000FF',
    '#000',
    '#000F',
    'rgb( 0, 0, 0)',
    'rgb(0, 0, 0, 1)',
    [0, 0, 0, 1],
    { r: 0, g: 0, b: 0, a: 1 }
  );
  const TRANS_BLACK = new ColorInfo(
    'transBlack',
    '#000000',
    '#00000088',
    '#000',
    '#000F',
    'rgb( 0, 0, 0)',
    'rgb(0, 0, 0, 0.5)',
    [0, 0, 0, 0.5],
    { r: 0, g: 0, b: 0, a: 0.5 }
  );

  const OPAQUE_GREY = new ColorInfo(
    'opaqueGREY',
    '#888888',
    '#888888FF',
    '#888',
    '#888F',
    'rgb( 128, 128, 128)',
    'rgb(128, 128, 128, 1)',
    [128, 128, 128, 1],
    { r: 128, g: 128, b: 128, a: 1 }
  );
  const TRANS_GREY = new ColorInfo(
    'transGREY',
    '#888888',
    '#88888800',
    '#888',
    '#8880',
    'rgb( 128, 128, 128)',
    'rgb(128, 128, 128, 0)',
    [128, 128, 128, 0],
    { r: 128, g: 128, b: 128, a: 0 }
  );

  const OPAQUE_COLOR = new ColorInfo(
    'opaqueColor',
    '#4499BB',
    '#4499BBFF',
    '#49B',
    '#49BF',
    'rgb( 68, 153, 187)',
    'rgb(68, 153, 187, 1)',
    [68, 153, 187, 1],
    { r: 68, g: 153, b: 187, a: 1 }
  );
  const TRANS_COLOR = new ColorInfo(
    'transColor',
    '#4499BB',
    '#4499BB88',
    '#49B',
    '#49B8',
    'rgb( 68, 153, 187)',
    'rgb(68, 153, 187, 0.5)',
    [68, 153, 187, 0.5],
    { r: 68, g: 153, b: 187, a: 0.5 }
  );
  const CLEAR_COLOR = new ColorInfo(
    'clearColor',
    '#4499BB',
    '#4499BB00',
    '#49B',
    '#49B0',
    'rgb( 68, 153, 187)',
    'rgb(68, 153, 187, 0)',
    [68, 153, 187, 0],
    { r: 68, g: 153, b: 187, a: 0 }
  );
  */

  global.describe('Validation', () => {
    global.describe('simple', () => {
      global.it('can detect hex', () => {
        const test = 'isHex';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = true;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hexa;
        expected = true;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hex3;
        expected = true;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = true;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.rgb;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.rgba;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.arr;
        // global.expect(value).toBe('cuca');
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.obj;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);
      });
      global.it('can detect rgb', () => {
        const test = 'isRGB';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hexa;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hex3;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.rgb;
        expected = true;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.rgba;
        expected = true;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.arr;
        // global.expect(value).toBe('cuca');
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.obj;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);
      });
      global.it('can detect array', () => {
        const test = 'isColorArray';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hexa;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hex3;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.rgb;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.rgba;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.arr;
        // global.expect(value).toBe('cuca');
        expected = true;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.obj;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);
      });
      global.it('can detect object', () => {
        const test = 'isColorObject';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hexa;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hex3;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.rgb;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.rgba;
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.arr;
        // global.expect(value).toBe('cuca');
        expected = false;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);

        value = OPAQUE_COLOR.obj;
        expected = true;
        global.expect(ColorUtils.COLOR_VALIDATION[test](value)).toBe(expected);
      });
    });
  });

  global.describe('parse', () => {
    global.describe('simple', () => {
      global.it('can parse hex', () => {
        const test = 'parseHex3';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can parse hex', () => {
        const test = 'parseHex';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can parse rgb', () => {
        const test = 'parseRGB';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can parse rgbA', () => {
        const test = 'parseRGBA';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can parse rgba with alphas', () => {
        const test = 'parseRGB';
        let value;
        let expected;

        value = 'rgba(255, 255, 255, 1)';
        expected = [255, 255, 255, 1];
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = 'rgba(255, 255, 255, 0.5)';
        expected = [255, 255, 255, 0.5];
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = 'rgba(255, 255, 255, 0)';
        expected = [255, 255, 255, 0];
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = 'rgba(249.9, 255, 255, 0)';
        expected = [249, 255, 255, 0];
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can parse color arrays', () => {
        const test = 'parseColorArray';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can parse color arrays with default alpha', () => {
        const test = 'parseColorArray';

        const value = [100, 90, 80];
        const alpha = 0.5;
        const expected = [100, 90, 80, 0.5];
        global.expect(ColorUtils[test](value, alpha)).toStrictEqual(expected);
      });
      global.it('can parse objects', () => {
        const test = 'parseColorObject';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = undefined;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can parse color arrays with default alpha', () => {
        const test = 'parseColorObject';

        const value = ({ r: 100, g: 90, b: 80 });
        const alpha = 0.5;
        const expected = [100, 90, 80, 0.5];
        global.expect(ColorUtils[test](value, alpha)).toStrictEqual(expected);
      });
      global.it('can parse', () => {
        const test = 'parse';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
    });
  });

  global.describe('convert', () => {
    global.describe('simple', () => {
      global.it('can convert hex', () => {
        const test = 'toHex';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.hex;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.hex;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.hex;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.hex;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.hex;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.hex;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = OPAQUE_COLOR.hex;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = OPAQUE_COLOR.hex;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can convert hexA', () => {
        const test = 'toHexA';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });

      global.it('can convert hexA with explicit alpha', () => {
        const test = 'toHexA';
        const value = OPAQUE_COLOR.hex;
        const expected = '#4499bb80';
        const alpha = 0.5;
        global.expect(ColorUtils[test](value, alpha)).toStrictEqual(expected);
      });
      global.it('can convert rgb', () => {
        const test = 'toRGB';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.rgb;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.rgb;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.rgb;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.rgb;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.rgb;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.rgb;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = OPAQUE_COLOR.rgb;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = OPAQUE_COLOR.rgb;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can convert rgba', () => {
        const test = 'toRGBA';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.rgba;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.rgba;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.rgba;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.rgba;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.rgba;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.rgba;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = OPAQUE_COLOR.rgba;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = OPAQUE_COLOR.rgba;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = SEMI_OPAQUE_BLACK.rgba;
        expected = SEMI_OPAQUE_BLACK.rgba;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can convert color array', () => {
        const test = 'toColorArray';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can convert color object', () => {
        const test = 'toColorObject';
        let value;
        let expected;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.obj;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.obj;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.obj;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.obj;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.obj;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.obj;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = OPAQUE_COLOR.obj;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = OPAQUE_COLOR.obj;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can parse color arrays with default alpha', () => {
        const test = 'toColorObject';

        const value = ({ r: 100, g: 90, b: 80 });
        const alpha = 0.5;
        const expected = ({ r: 100, g: 90, b: 80, a: 0.5 });
        global.expect(ColorUtils[test](value, alpha)).toStrictEqual(expected);
      });
      global.it('can convert using default type array', () => {
        const test = 'convert';
        let value;
        let expected;

        ColorUtils.defaultFormat = ColorUtils.FORMATS.ARRAY;

        value = OPAQUE_COLOR.hex;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hexa;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.hex3a;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgb;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.rgba;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.arr;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);

        value = OPAQUE_COLOR.obj;
        expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
      global.it('can convert using explicit type hex', () => {
        const test = 'convert';

        const format = ColorUtils.FORMATS.HEX;

        const value = OPAQUE_COLOR.arr;
        const expected = OPAQUE_COLOR.hex;
        global.expect(ColorUtils[test](value, format)).toStrictEqual(expected);
      });
      global.it('can convert using explicit type HEXA', () => {
        const test = 'convert';

        const format = ColorUtils.FORMATS.HEXA;

        const value = OPAQUE_COLOR.arr;
        const expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value, format)).toStrictEqual(expected);
      });
      global.it('can convert using explicit type RGB', () => {
        const test = 'convert';

        const format = ColorUtils.FORMATS.RGB;

        const value = OPAQUE_COLOR.arr;
        const expected = OPAQUE_COLOR.rgb;
        global.expect(ColorUtils[test](value, format)).toStrictEqual(expected);
      });
      global.it('can convert using explicit type RGBA', () => {
        const test = 'convert';

        const format = ColorUtils.FORMATS.RGBA;

        const value = OPAQUE_COLOR.arr;
        const expected = OPAQUE_COLOR.rgba;
        global.expect(ColorUtils[test](value, format)).toStrictEqual(expected);
      });
      global.it('can convert using explicit type array', () => {
        const test = 'convert';

        const format = ColorUtils.FORMATS.ARRAY;

        const value = OPAQUE_COLOR.arr;
        const expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value, format)).toStrictEqual(expected);
      });
      global.it('can convert using explicit type object', () => {
        const test = 'convert';

        const format = ColorUtils.FORMATS.OBJECT;

        const value = OPAQUE_COLOR.arr;
        const expected = OPAQUE_COLOR.obj;
        global.expect(ColorUtils[test](value, format)).toStrictEqual(expected);
      });
      global.it('can convert with an unknown value', () => {
        const test = 'convert';

        const format = 'blah';

        const value = OPAQUE_COLOR.arr;
        const expected = OPAQUE_COLOR.arr;
        global.expect(ColorUtils[test](value, format)).toStrictEqual(expected);
      });
      global.it('can convert with the default value', () => {
        const test = 'convert';

        ColorUtils.defaultFormat = ColorUtils.FORMATS.HEXA;

        const value = OPAQUE_COLOR.arr;
        const expected = OPAQUE_COLOR.hexa;
        global.expect(ColorUtils[test](value)).toStrictEqual(expected);
      });
    });
  });
  global.describe('interpolate', () => {
    global.describe('complex', () => {
      global.it('can interpolate at 0 to white', () => {
        const fromColor = OPAQUE_COLOR.arr;
        const toColor = OPAQUE_WHITE.arr;
        const amount = 0;
        const expected = [68, 153, 187, 1];
        const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
        const results = ColorUtils.interpolate(fromColor, toColor, amount, interpolationFn, ColorUtils.FORMATS.ARRAY);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can interpolate at 0 to white', () => {
        const fromColor = OPAQUE_COLOR.arr;
        const toColor = OPAQUE_WHITE.arr;
        const amount = 1;
        const expected = [255, 255, 255, 1];
        const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
        const results = ColorUtils.interpolate(fromColor, toColor, amount, interpolationFn, ColorUtils.FORMATS.ARRAY);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can interpolate at 0.5 to white', () => {
        const fromColor = OPAQUE_COLOR.arr;
        const toColor = OPAQUE_WHITE.arr;
        const amount = 0.5;
        const expected = [162, 204, 221, 1];
        const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
        const results = ColorUtils.interpolate(fromColor, toColor, amount, interpolationFn, ColorUtils.FORMATS.ARRAY);
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('simple', () => {
      global.it('can interpolate at default', () => {
        const fromColor = CLEAR_COLOR.arr;
        const toColor = OPAQUE_COLOR.arr;
        const expected = '#4499bb00';
        const results = ColorUtils.interpolate(fromColor, toColor);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('stops at -1', () => {
        const fromColor = OPAQUE_COLOR.arr;
        const toColor = CLEAR_COLOR.arr;
        const amount = -1;
        const expected = [68, 153, 187, 1];
        const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
        const results = ColorUtils.interpolate(fromColor, toColor, amount, interpolationFn, ColorUtils.FORMATS.ARRAY);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can interpolate at 0', () => {
        const fromColor = OPAQUE_COLOR.arr;
        const toColor = CLEAR_COLOR.arr;
        const amount = 0;
        const expected = [68, 153, 187, 1];
        const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
        const results = ColorUtils.interpolate(fromColor, toColor, amount, interpolationFn, ColorUtils.FORMATS.ARRAY);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can interpolate at 0.5', () => {
        const fromColor = OPAQUE_COLOR.arr;
        const toColor = CLEAR_COLOR.arr;
        const amount = 0.5;
        const expected = [68, 153, 187, 0.5];
        const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
        const results = ColorUtils.interpolate(fromColor, toColor, amount, interpolationFn, ColorUtils.FORMATS.ARRAY);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('can interpolate at 1', () => {
        const fromColor = OPAQUE_COLOR.arr;
        const toColor = CLEAR_COLOR.arr;
        const amount = 1;
        const expected = [68, 153, 187, 0];
        const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
        const results = ColorUtils.interpolate(fromColor, toColor, amount, interpolationFn, ColorUtils.FORMATS.ARRAY);
        global.expect(results).toStrictEqual(expected);
      });
      global.it('stops at 2', () => {
        const fromColor = OPAQUE_COLOR.arr;
        const toColor = CLEAR_COLOR.arr;
        const amount = 2;
        const expected = [68, 153, 187, 0];
        const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
        const results = ColorUtils.interpolate(fromColor, toColor, amount, interpolationFn, ColorUtils.FORMATS.ARRAY);
        global.expect(results).toStrictEqual(expected);
      });
    });

    global.describe('linear', () => {
      global.it('can interpolate at 0', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0;
        const expected = 0;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.linear(fromColor, toColor, percent);
        global.expect(results).toBe(expected);
      });
      global.it('can interpolate at 0.25', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.25;
        const expected = 63.75 * 1;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.linear(fromColor, toColor, percent);
        global.expect(results).toBe(expected);
      });
      global.it('can interpolate at 0.5', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.5;
        const expected = 127.5;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.linear(fromColor, toColor, percent);
        global.expect(results).toBe(expected);
      });
      global.it('can interpolate at 0.75', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.75;
        const expected = 63.75 * 3;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.linear(fromColor, toColor, percent);
        global.expect(results).toBe(expected);
      });
      global.it('can interpolate at 1', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 1;
        const expected = 255;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.linear(fromColor, toColor, percent);
        global.expect(results).toBe(expected);
      });
    });
    global.describe('ease-in-out', () => {
      global.it('can interpolate at 0', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0;
        const expected = 0;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeInOut(fromColor, toColor, percent);
        global.expect(results).toBe(expected);
      });
      global.it('can interpolate at 0.25', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.25;
        const expected = 37.344;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeInOut(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 0.5', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.5;
        const expected = 127.5;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeInOut(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 0.75', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.75;
        const expected = 217.656;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeInOut(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 1', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 1;
        const expected = 255;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeInOut(fromColor, toColor, percent);
        global.expect(results).toBe(expected);
      });
    });
    global.describe('ease-in', () => {
      global.it('can interpolate at 0', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0;
        const expected = 0;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeIn(fromColor, toColor, percent);
        global.expect(results).toBe(expected);
      });
      global.it('can interpolate at 0.25', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.25;
        const expected = 19.4107;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeIn(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 0.5', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.5;
        const expected = 74.6878;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeIn(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 0.75', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.75;
        const expected = 157.4157;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeIn(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 1', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 1;
        const expected = 255;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeIn(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
    });
    global.describe('ease-out', () => {
      global.it('can interpolate at 0', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0;
        const expected = 0;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeOut(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 0.25', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.25;
        const expected = 97.5843;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeOut(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 0.5', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.5;
        const expected = 180.3122;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeOut(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 0.75', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 0.75;
        const expected = 235.5893;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeOut(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
      global.it('can interpolate at 1', () => {
        const fromColor = 0;
        const toColor = 255;
        const percent = 1;
        const expected = 255;
        const results = ColorUtils.INTERPOLATION_STRATEGIES.easeOut(fromColor, toColor, percent);
        global.expect(results).toBeCloseTo(expected);
      });
    });
  });

  global.describe('interpolator', () => {
    global.it('can interpolate from one color to another', () => {
      const fromColor = OPAQUE_BLACK.arr;
      const toColor = OPAQUE_WHITE.arr;
      const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
      const formatType = ColorUtils.FORMATS.ARRAY;

      const targetFn = ColorUtils.interpolator(fromColor, toColor, interpolationFn, formatType);

      global.expect(typeof targetFn).toBe('function');

      const expected = [128, 128, 128, 1];
      const results = targetFn(0.5);

      global.expect(results).toStrictEqual(expected);
    });
    global.it('can interpolate from one color to another', () => {
      const fromColor = OPAQUE_BLACK.arr;
      const toColor = OPAQUE_WHITE.arr;
      // const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
      // const formatType = ColorUtils.FORMATS.ARRAY;

      const targetFn = ColorUtils.interpolator(fromColor, toColor);

      global.expect(typeof targetFn).toBe('function');

      const expected = '#808080ff';
      const results = targetFn(0.5);

      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('generateSequence', () => {
    global.it('can generate a sequence', () => {
      const fromColor = OPAQUE_BLACK.arr;
      const toColor = OPAQUE_WHITE.arr;
      const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
      const formatType = ColorUtils.FORMATS.ARRAY;

      global.expect(typeof interpolationFn).toBe('function');

      const expected = [
        [0, 0, 0, 1],
        [85, 85, 85, 1],
        [170, 170, 170, 1],
        [255, 255, 255, 1],
      ];
      const results = ColorUtils.generateSequence(
        fromColor,
        toColor,
        4,
        interpolationFn,
        formatType
      );

      global.expect(results).toStrictEqual(expected);
    });
    global.it('can generate a sequence', () => {
      const fromColor = OPAQUE_BLACK.arr;
      const toColor = OPAQUE_WHITE.arr;
      // const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
      // const formatType = ColorUtils.FORMATS.ARRAY;

      const expected = [
        '#000000ff',
        '#555555ff',
        '#aaaaaaff',
        '#ffffffff'
      ];
      const results = ColorUtils.generateSequence(
        fromColor,
        toColor,
        4
      );

      global.expect(results).toStrictEqual(expected);
    });
    global.it('can generate a sequence', () => {
      const fromColor = OPAQUE_BLACK.arr;
      const toColor = OPAQUE_WHITE.arr;
      const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
      const formatType = ColorUtils.FORMATS.ARRAY;

      global.expect(typeof interpolationFn).toBe('function');

      const expected = [
      ];
      const results = ColorUtils.generateSequence(
        fromColor,
        toColor,
        0,
        interpolationFn,
        formatType
      );

      global.expect(results).toStrictEqual(expected);
    });
    global.it('can generate a sequence from docs', () => {
      const fromColor = OPAQUE_BLACK.arr;
      const toColor = OPAQUE_WHITE.arr;
      const interpolationFn = ColorUtils.INTERPOLATION_STRATEGIES.linear;
      const formatType = ColorUtils.FORMATS.HEX;

      global.expect(typeof interpolationFn).toBe('function');

      const expected = [
        '#000000',
        '#808080',
        '#ffffff'
      ];
      const results = ColorUtils.generateSequence(
        fromColor,
        toColor,
        3,
        interpolationFn,
        formatType
      );

      global.expect(results).toStrictEqual(expected);
    });
  });
});
