jest.mock('fs');

const fs = require('fs');

global.describe('fs', () => {
  beforeEach(() => {
    fs.resetMock();
  });
  afterAll(() => {

  });

  global.it('can find fs.resetMocks', () => {
    global.expect(typeof fs.resetMock).toBe('function');
  });
});
