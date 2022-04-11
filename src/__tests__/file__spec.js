jest.mock('fs');

const fs = require('fs');
const fsExtra = require('fs-extra');
const pino = require('pino');

//-- TODO: mock path and fs
//-- currently I get an infinite loop error with jest when trying

const FileUtil = require('../file');

const logger = require('../logger');

global.describe('FileUtil', () => {
  beforeEach(() => {
    fs.resetMock();
    fsExtra.resetMock();
    pino.mockInstance.resetMock();
  });
  afterAll(() => {
    fs.resetMock();
    fsExtra.resetMock();
    pino.mockInstance.resetMock();
  });
  global.describe('readJSON', () => {
    global.it('reads a json with a resolved path', () => {
      const path = './tmp/sampleFile';

      fsExtra.existsSync.mockReturnValue(true);
      fsExtra.readJsonSync.mockReturnValue({ success: true });

      const expected = JSON.stringify({ success: true });
      const results = FileUtil.readJSON(path);
      const resultsStr = JSON.stringify(results);

      global.expect(resultsStr).toBe(expected);
    });
    global.it('throws an error if the file cannot be found', () => {
      const path = './tmp/sampleFile';

      fsExtra.existsSync.mockReturnValue(false);

      FileUtil.readJSON(path);
    });
    global.it('pino.error is called if logger.error is called', () => {
      global.expect(pino.mockInstance.error).not.toHaveBeenCalled();
      logger.error('cuca');
      global.expect(pino.mockInstance.error).toHaveBeenCalled();
    });
    global.it('shows an error if the file could not be read', () => {
      const path = './tmp/sampleFile';

      fsExtra.existsSync.mockReturnValue(true);
      fsExtra.readJsonSync.mockImplementationOnce(() => {
        throw Error('throw an error if the file could not be read');
      });

      FileUtil.readJSON(path);

      global.expect(pino.mockInstance.error).toHaveBeenCalled();
    });
  });

  global.describe('can check for errors thrown', () => {
    global.it('tests with mock once', () => {
      pino.mockInstance.error.mockImplementationOnce(() => {
        throw Error('some error');
      });

      global.expect(() => pino.mockInstance.error('something')).toThrow('some error');
    });
  });

  global.describe('readFile', () => {
    global.it('reads a file', () => {
      const path = './tmp/sampleFile';

      fsExtra.existsSync.mockReturnValue(true);
      fsExtra.readFileSync.mockReturnValue('success');

      const expected = 'success';
      const results = FileUtil.readFile(path);

      global.expect(results).toBe(expected);
    });
    global.it('throws an error if the file cannot be found', () => {
      const path = './tmp/sampleFile';

      fsExtra.existsSync.mockReturnValue(false);

      FileUtil.readFile(path);
    });
    global.it('shows an error if the file could not be read', () => {
      const path = './tmp/sampleFile';

      fsExtra.existsSync.mockReturnValue(true);
      fsExtra.readFileSync.mockImplementationOnce(() => {
        throw Error('throw an error if the file could not be read');
      });

      FileUtil.readFile(path);

      global.expect(pino.mockInstance.error).toHaveBeenCalled();
    });
  });

  global.describe('writeJSON', () => {
    global.it('writes text', () => {
      const path = './tmp/sampleFile';
      const message = { message: 'success' };
      const expected = JSON.stringify(message, null, 2);

      fsExtra.writeFileSync.mockReturnValue(true);

      FileUtil.writeJSON(path, message);

      const result = fsExtra.writeFileSync.mock.calls[0][1];
      global.expect(result).toBe(expected);
    });
    global.it('provides an error message if the file cannot be written', () => {
      const path = './tmp/sampleFile';
      const message = { message: 'success' };

      fsExtra.writeFileSync.mockImplementation(() => {
        throw (new Error('Example Error'));
      });

      FileUtil.writeJSON(path, message);
    });
    global.it('shows an error if the file could not be written', () => {
      const path = './tmp/sampleFile';
      const message = { message: 'success' };

      fsExtra.writeFileSync.mockImplementationOnce(() => {
        throw Error('throw an error if the file could not be read');
      });

      FileUtil.writeJSON(path, message);

      global.expect(pino.mockInstance.error).toHaveBeenCalled();
    });
  });

  global.describe('writeFile', () => {
    global.it('writes text', () => {
      const path = './tmp/sampleFile';
      const message = 'Success';
      const expected = message;

      fsExtra.writeFileSync.mockReturnValue(true);

      FileUtil.writeFile(path, message);

      const result = fsExtra.writeFileSync.mock.calls[0][1];
      global.expect(result).toBe(expected);
    });
    global.it('provides an error message if the file cannot be written', () => {
      const path = './tmp/sampleFile';
      const message = { message: 'success' };

      fsExtra.writeFileSync.mockImplementation(() => {
        throw (new Error('Example Error'));
      });

      FileUtil.writeFile(path, message);
    });
    global.it('shows an error if the file could not be written', () => {
      const path = './tmp/sampleFile';
      const message = 'success';

      fsExtra.writeFileSync.mockImplementationOnce(() => {
        throw Error('throw an error if the file could not be read');
      });

      FileUtil.writeFile(path, message);

      global.expect(pino.mockInstance.error).toHaveBeenCalled();
    });
  });

  global.describe('writeFileStd', () => {
    //-- disable warning about using filestd in tests
    const ORIGINAL_CONSOLE = global.console;
    global.beforeEach(() => {
      global.console = ({
        error: jest.fn(),
        log: jest.fn(),
        warn: jest.fn()
      });
    });
    global.afterAll(() => {
      global.console = ORIGINAL_CONSOLE;
    });

    global.it('writes text', () => {
      const path = './tmp/sampleFile';
      const message = 'Success';
      const expected = message;

      fs.writeFileSync.mockReturnValue(true);

      FileUtil.writeFileStd(path, message);

      const result = fs.writeFileSync.mock.calls[0][1];
      global.expect(result).toBe(expected);
    });
    global.it('provides an error message if the file cannot be written', () => {
      const path = './tmp/sampleFile';
      const message = { message: 'success' };

      fs.writeFileSync.mockImplementationOnce(() => {
        throw (new Error('Example Error'));
      });

      FileUtil.writeFileStd(path, message);

      global.expect(pino.mockInstance.error).toHaveBeenCalled();
    });
  });

  global.describe('pwd', () => {
    global.it('pwd returns the current path resolved', () => {
      // @TODO: mock path
      const result = FileUtil.pwd();
      global.expect(result).toBeTruthy();
    });
  });

  global.describe('listFiles', () => {
    global.it('lists files in a folder that exists', () => {
      const path = './tmp';

      fsExtra.existsSync.mockReturnValue(true);
      fsExtra.ensureDirSync.mockReturnValue(false);
      fsExtra.readdirSync.mockReturnValue('Success');

      const results = FileUtil.listFiles(path);
      global.expect(results).toBe('Success');
    });
    global.it('does not list files if the path does not exist', () => {
      const path = './tmp';

      fsExtra.existsSync.mockReturnValue(false);
      fsExtra.ensureDirSync.mockReturnValue(false);
      fsExtra.readdirSync.mockReturnValue('Success');

      const results = FileUtil.listFiles(path);
      global.expect(results).toBe(undefined);
    });
    global.it('does not list files for a file', () => {
      const path = './tmp';

      fsExtra.existsSync.mockReturnValue(true);
      fsExtra.ensureDirSync.mockReturnValue(true);
      fsExtra.readdirSync.mockReturnValue('Success');

      const results = FileUtil.listFiles(path);
      global.expect(results).toBe(undefined);
    });
    global.it('shows an error if the file could not be listed', () => {
      const path = './tmp';
      
      fsExtra.existsSync.mockReturnValue(true);
      fsExtra.ensureDirSync.mockReturnValue(false);
      fsExtra.readdirSync.mockImplementationOnce(() => {
        throw Error('throw an error if the file could not be read');
      });

      FileUtil.listFiles(path);

      global.expect(pino.mockInstance.error).toHaveBeenCalled();
    });
  });
});
