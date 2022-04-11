/* eslint-disable */

const writeStreamMock = {
  isOpen: jest.fn(),
  getFilePath: jest.fn(),
  path: 'cuca',
  readFileSync: jest.fn(),
  write: jest.fn(),
  close: jest.fn()
};

const fsMock = ({
  resetMock: () => {
    writeStreamMock.isOpen.mockReset();
    writeStreamMock.getFilePath.mockReset();
    writeStreamMock.write.mockReset();
    writeStreamMock.close.mockReset();
    fsMock.readFileSync.mockReset();
    fsMock.existsSync.mockReset();
    fsMock.readJsonSync.mockReset();
    fsMock.writeFileSync.mockReset();
    fsMock.ensureDirSync.mockReset();
    fsMock.readdirSync.mockReset();
  },
  readdirSync: jest.fn(),
  ensureDirSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
  readJsonSync: jest.fn(),
  writeStreamMock,
  readFileSync:  jest.fn(),
  createWriteStream: jest.fn().mockImplementation((targetPath) => writeStreamMock)
});

module.exports = fsMock;
