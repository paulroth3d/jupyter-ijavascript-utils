/**
 * 
 * @module graphics
 */
class Vector2d {
  /**
   * x-coordinate
   * @type {Number}
   */
  x;

  /**
   * y-coordinate
   * @type {Number}
   */
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  initialize(x, y) {
    this.x = x;
    this.y = y;
  }

  magnitude() {
    return Math.sqrt(
      this.x * this.x
      + this.y * this.y
    );
  }

  /**
   * 
   * @returns {Point2d} - new normalized point
   */
  normalize() {
    const mag = this.magnitude();
    return new Vector2d(
      this.x / mag,
      this.y / mag
    );
  }

  toString() {
    return (`{x: ${this.x}, y: ${this.y}`);
  }
}
module.exports.Vector2d = Vector2d;
