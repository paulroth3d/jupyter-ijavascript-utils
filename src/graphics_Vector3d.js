const { Vector2d } = require('./graphics_Vector2d');

/**
 * 3d Point
 * @module graphics
 */
class Vector3d extends Vector2d {
  /**
   * z-coordinate
   * @type {Number}
   */
  z;

  constructor(x, y, z) {
    super(x, y);
    this.z = z;
  }

  initialize(x, y, z) {
    super.initialize(x, y);
    this.z = z;
  }

  /**
   * Magnitude of the 
   * @returns {Number} - [0:infinity)
   */
  magnitude() {
    return Math.sqrt(
      this.x * this.x
      + this.y * this.y
      + this.z * this.z
    );
  }

  /**
   * 
   * @returns {Point2d} - new normalized point
   */
  normalize() {
    const mag = this.magnitude();
    return new Vector3d(
      this.x / mag,
      this.y / mag,
      this.z / mag
    );
  }

  toString() {
    return (`{x: ${this.x}, y: ${this.y}, z: ${this.z}}`);
  }

  /*
  interpolateTo(vector2d) => (pct) => Vector2d
  add(vector2d) => vector2d
  transform(matrix) => vector2d
  */
}
module.exports.Vector3d = Vector3d;
