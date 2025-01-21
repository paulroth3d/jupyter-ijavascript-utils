const { Point2d } = require('./graphics_Point2d');

/**
 * 3d Point
 * @module graphics
 */
class Point3d extends Point2d {
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
    return new Point2d(
      this.x / mag,
      this.y / mag,
      this.z / mag
    );
  }

  toString() {
    return (`{x: ${this.x}, y: ${this.y}, z: ${this.z}}`);
  }
}
module.exports.Point3d = Point3d;
