const HelpUtil = require('../help');

global.describe('help', () => {
  global.describe('show', () => {
    global.it('must match', () => {
      const expected = 'https://jupyter-ijavascript-utils.onrender.com/';
      const results = HelpUtil.show();
      global.expect(results).toStrictEqual(expected);
    });
  });
});
