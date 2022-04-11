const Base64Utils = require('../base64');

global.describe('base64', () => {
  global.it('can convert a string to base64', () => {
    const value = 'Hello';
    const expected = 'SGVsbG8=';
    const result = Base64Utils.toBase64(value);
    global.expect(result).toBe(expected);
  });
  global.it('return a string from base64', () => {
    const value = 'SGVsbG8=';
    const expected = 'Hello';
    const result = Base64Utils.fromBase64(value);
    global.expect(result).toBe(expected);
  });
});
