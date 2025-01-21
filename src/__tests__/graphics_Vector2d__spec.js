const { Vector2d } = require('../graphics_Vector2d');

global.describe('graphics.Vector2d', () => {
  global.describe('constructor', () => {
    global.it('simple create', () => {
      const x = 10;
      const y = 10;
      const result = new Vector2d(x, y);
      
      global.expect(result.x).toBe(x);
      global.expect(result.y).toBe(y);
    });
  });
  global.describe('initialize', () => {
    global.it('simple constructor', () => {
      const x = 10;
      const y = 10;
      const result = new Vector2d(x, y);
      
      global.expect(result.x).toBe(x);
      global.expect(result.y).toBe(y);
    });
    global.it('simple reinitialize', () => {
      let x = 10;
      let y = 10;
      const result = new Vector2d(x, y);
      
      global.expect(result.x).toBe(x);
      global.expect(result.y).toBe(y);

      x = 100;
      y = 100;
      result.initialize(x, y);
      global.expect(result.x).toBe(x);
      global.expect(result.y).toBe(y);
    });
  });
  global.describe('magnitude', () => {
    global.it('simple', () => {
      const x = 10;
      const y = 10;
      const point = new Vector2d(x, y);
      const expected = Math.sqrt(200);
      const result = point.magnitude();

      global.expect(result).toBe(expected);
    });
  });
  global.describe('normalize', () => {
    global.it('creates a new point', () => {
      const x = 10;
      const y = 10;
      const point = new Vector2d(x, y);
      const expected = Math.sqrt(200);
      global.expect(point !== expected).toBe(true);
    });
    global.it('creates a magnitude of 1', () => {
      const x = 10;
      const y = 10;
      const point = new Vector2d(x, y);
      const normie = point.normalize();
      const expected = 1;
      const results = normie.magnitude();
      global.expect(results).toBeCloseTo(expected);
    });
  });
});
