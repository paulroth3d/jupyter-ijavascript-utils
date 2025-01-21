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
    this.initialize(x, y);
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

  toArray() {
    return [this.x, this.y, this.z];
  }

  /*
  interpolateTo(vector2d) => (pct) => Vector2d
  add(vector2d) => vector2d
  transform(matrix) => vector2d
  */
}
module.exports.Vector2d = Vector2d;
