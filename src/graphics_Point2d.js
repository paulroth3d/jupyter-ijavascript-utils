/**
 * 2d Point
 * @module graphics
 */
class Point2d {
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
    return new Point2d(
      this.x / mag,
      this.y / mag
    );
  }

  toString() {
    return (`{x: ${this.x}, y: ${this.y}`);
  }
}
module.exports.Point2d = Point2d;
