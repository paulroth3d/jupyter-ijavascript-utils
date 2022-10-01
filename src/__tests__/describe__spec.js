const DescribeUtil = require('../describe');

global.describe('DescribeUtil', () => {
  global.it('example test', () => {
    const value = 24;
    const expected = 24;
    const results = DescribeUtil.doSomething(value);
    global.expect(results).toBe(expected);
  });
});
