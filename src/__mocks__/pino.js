const pinoMock = ({
  resetMock: () => {
    pinoMock.log.mockReset();
    pinoMock.warn.mockReset();
    pinoMock.error.mockReset();
  },
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
});

const pinoFn = jest.fn(() => pinoMock);
pinoFn.mockInstance = pinoMock;

module.exports = pinoFn;
