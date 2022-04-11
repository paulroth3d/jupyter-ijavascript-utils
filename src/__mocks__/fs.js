const mockFS = ({
  resetMock: () => {
    mockFS.doSomething = jest.fn();
    mockFS.writeFileSync = jest.fn();
  },
  doSomething: jest.fn(),
  writeFileSync: jest.fn()
});

module.exports = mockFS;
