const { Vector3d } = require('../graphics_Vector3d');

global.describe('graphics.Vector3d', () => {
  global.describe('constructor', () => {
    global.it('simple', () => {
      const x = 10;
      const y = 10;
      const z = 10;
      const result = new Vector3d(x, y, z);
      
      global.expect(result.x).toBe(x);
      global.expect(result.y).toBe(y);
      global.expect(result.z).toBe(z);
    });
  });
  global.describe('initialize', () => {
    global.it('simple constructor', () => {
      const x = 10;
      const y = 10;
      const z = 10;
      const result = new Vector3d(x, y, z);
      
      global.expect(result.x).toBe(x);
      global.expect(result.y).toBe(y);
      global.expect(result.z).toBe(z);
    });
    global.it('simple reinitialize', () => {
      let x = 10;
      let y = 10;
      let z = 10;
      const result = new Vector3d(x, y, z);
      
      global.expect(result.x).toBe(x);
      global.expect(result.y).toBe(y);
      global.expect(result.z).toBe(z);

      x = 100;
      y = 100;
      z = 100;
      result.initialize(x, y, z);
      global.expect(result.x).toBe(x);
      global.expect(result.y).toBe(y);
      global.expect(result.z).toBe(z);
    });
  });
  global.describe('magnitude', () => {
    global.it('simple', () => {
      const x = 10;
      const y = 10;
      const z = 10;
      const point = new Vector3d(x, y, z);
      const expected = Math.sqrt(300);
      const result = point.magnitude();

      global.expect(result).toBe(expected);
    });
  });
  global.describe('normalize', () => {
    global.it('creates a new point', () => {
      const x = 10;
      const y = 10;
      const z = 10;
      const point = new Vector3d(x, y, z);
      const expected = Math.sqrt(300);
      global.expect(point !== expected).toBe(true);
    });
    global.it('aligns with a known value', () => {
      const x = 20;
      const y = 30;
      const z = 40;
      const point = new Vector3d(x, y, z);
      const normie = point.normalize();
      const expected = {
        x: 0.37139,
        y: 0.55709,
        z: 0.74278
      };
      // global.expect(normie.toString()).toBe('cuca');
      global.expect(normie.x).toBeCloseTo(expected.x);
      global.expect(normie.y).toBeCloseTo(expected.y);
      global.expect(normie.z).toBeCloseTo(expected.z);
    });
    global.it('creates a magnitude of 1', () => {
      const x = 20;
      const y = 30;
      const z = 40;
      const point = new Vector3d(x, y, z);
      const normie = point.normalize();
      const expected = 1;
      const results = normie.magnitude();
      global.expect(results).toBeCloseTo(expected);
    });
  });
});
