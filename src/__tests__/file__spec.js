/* eslint-disable prefer-destructuring */
jest.mock('fs');

const fs = require('fs');
const fsExtra = require('fs-extra');
const pino = require('pino');
const pathLib = require('path');

const FileMock = require('../__testHelper__/FileMock');

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
    global.describe('writes text', () => {
      global.it('writes text', () => {
        const path = './tmp/sampleFile';
        const message = { message: 'success' };
        const expected = JSON.stringify(message, null, 2);

        fsExtra.writeFileSync.mockReturnValue(true);

        FileUtil.writeJSON(path, message);

        const result = fsExtra.writeFileSync.mock.calls[0][1];
        global.expect(result).toBe(expected);
      });
      global.it('appends if appends is true', () => {
        const path = './tmp/sampleFile';
        const message = { message: 'success' };
        const expected = '{\n  "message": "success"\n}';
        const args = { append: true };

        fsExtra.writeFileSync.mockReturnValue(true);

        FileUtil.writeJSON(path, message, args);

        global.expect(fsExtra.writeFileSync).not.toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalledTimes(1);

        const result = fsExtra.appendFileSync.mock.calls[0][1];
        global.expect(result).toBe(expected);
      });
      global.it('appends with a prefix', () => {
        const path = './tmp/sampleFile';
        const message = { message: 'success' };
        const expected = '[{\n  "message": "success"\n}';
        const args = { append: true, prefix: '[' };

        fsExtra.writeFileSync.mockReturnValue(true);

        FileUtil.writeJSON(path, message, args);

        global.expect(fsExtra.writeFileSync).not.toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalledTimes(1);

        const result = fsExtra.appendFileSync.mock.calls[0][1];
        global.expect(result).toBe(expected);
      });
      global.it('appends with a suffix', () => {
        const path = './tmp/sampleFile';
        const message = { message: 'success' };
        const expected = '{\n  "message": "success"\n}]';
        const args = { append: true, suffix: ']' };

        fsExtra.writeFileSync.mockReturnValue(true);

        FileUtil.writeJSON(path, message, args);

        global.expect(fsExtra.writeFileSync).not.toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalledTimes(1);

        const result = fsExtra.appendFileSync.mock.calls[0][1];
        global.expect(result).toBe(expected);
      });
      global.it('appends with a prefix and a suffix', () => {
        const path = './tmp/sampleFile';
        const message = { message: 'success' };
        const expected = '[{\n  "message": "success"\n}]';
        const args = { append: true, prefix: '[', suffix: ']' };

        fsExtra.writeFileSync.mockReturnValue(true);

        FileUtil.writeJSON(path, message, args);

        global.expect(fsExtra.writeFileSync).not.toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalledTimes(1);

        const result = fsExtra.appendFileSync.mock.calls[0][1];
        global.expect(result).toBe(expected);
      });
    });
    global.describe('fails', () => {
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
  });

  global.describe('writeFile', () => {
    global.describe('writes text', () => {
      global.it('synchronously', () => {
        const path = './tmp/sampleFile';
        const message = 'Success';
        const expected = message;

        fsExtra.writeFileSync.mockReturnValue(true);

        FileUtil.writeFile(path, message);

        const result = fsExtra.writeFileSync.mock.calls[0][1];
        global.expect(result).toBe(expected);
      });
      global.it('appends text', () => {
        const path = './tmp/sampleFile';
        const message = 'Success';
        const expected = message;
        const options = { append: true };

        fsExtra.writeFileSync.mockReturnValue(true);

        FileUtil.writeFile(path, message, options);

        global.expect(fsExtra.writeFileSync).not.toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalled();
        global.expect(fsExtra.appendFileSync).toHaveBeenCalledTimes(1);

        const result = fsExtra.appendFileSync.mock.calls[0][1];
        global.expect(result).toBe(expected);
      });
    });
    global.describe('fails', () => {
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
    global.it('can accept a listdir argument', () => {
      const path = './tmp';
      const expectedArgs = 'expectedArgs';

      fsExtra.existsSync.mockReturnValue(true);
      fsExtra.ensureDirSync.mockReturnValue(false);
      fsExtra.readdirSync.mockImplementationOnce((filePath, args) => args);

      FileUtil.listFiles(path, expectedArgs);

      global.expect(fsExtra.readdirSync.mock.calls[0][1]).toBe(expectedArgs);
    });
  });

  global.describe('matchFiles', () => {
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
    global.describe('can match files', () => {
      global.it('with the full path', () => {
        const path = './tmp';
        const resultList = ['a', 'b', 'c', 'd']
          .map((str) => new FileMock(str));
        const expected = ['a', 'b']
          .map((str) => pathLib.resolve(path, str));
        
        fsExtra.existsSync.mockReturnValue(true);
        fsExtra.ensureDirSync.mockReturnValue(false);
        fsExtra.readdirSync.mockImplementation(() => resultList);
  
        const evenFn = (val) => val === 'a' || val === 'b';
        const results = FileUtil.matchFiles(path, evenFn);
  
        global.expect(results).toEqual(expected);
      });
      global.it('without the full path', () => {
        const path = './tmp';
        const resultList = ['a', 'b', 'c', 'd']
          .map((str) => new FileMock(str));
        const expected = ['a', 'b'];
        
        fsExtra.existsSync.mockReturnValue(true);
        fsExtra.ensureDirSync.mockReturnValue(false);
        fsExtra.readdirSync.mockImplementation(() => resultList);
  
        const evenFn = (val) => val === 'a' || val === 'b';
        const results = FileUtil.matchFiles(path, evenFn, false);
  
        global.expect(results).toEqual(expected);
      });
    });

    global.describe('does not fail', () => {
      global.it('if no results are found', () => {
        const path = './tmp';
        const resultList = []
          .map((str) => new FileMock(str));
        const expected = [];
        
        fsExtra.existsSync.mockReturnValue(true);
        fsExtra.ensureDirSync.mockReturnValue(false);
        fsExtra.readdirSync.mockImplementation(() => resultList);
  
        const evenFn = (val) => val === 'a' || val === 'b';
        const results = FileUtil.matchFiles(path, evenFn, false);
  
        global.expect(results).toEqual(expected);
      });
      global.it('if matcher says no matches found', () => {
        const path = './tmp';
        const resultList = ['a', 'b', 'c']
          .map((str) => new FileMock(str));
        const expected = [];
        
        fsExtra.existsSync.mockReturnValue(true);
        fsExtra.ensureDirSync.mockReturnValue(false);
        fsExtra.readdirSync.mockImplementation(() => resultList);
  
        //-- always return false
        const noFn = (val) => false;
        const results = FileUtil.matchFiles(path, noFn, false);
  
        global.expect(results).toEqual(expected);
      });
    });
  });

  global.describe('checkFiles', () => {
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
    global.describe('with no files passed', () => {
      global.it('fails if null is passed', () => {
        global.expect(() => FileUtil.checkFile(null)).toThrow();
      });
      global.it('fails if null is passed with other valid arguments', () => {
        fsExtra.existsSync.mockReturnValue(true);
        global.expect(() => FileUtil.checkFile('./testFile', null)).toThrow();
      });
      global.it('returns null if no arguments passed', () => {
        const expected = null;
        const results = FileUtil.checkFile();
        global.expect(results).toBe(expected);
      });
      global.it('returns null if empty array passed in first argument', () => {
        const expected = null;
        const results = FileUtil.checkFile([]);
        global.expect(results).toBe(expected);
      });
    });
    global.describe('with one file', () => {
      global.it('and file exists', () => {
        const expected = null;

        fsExtra.existsSync.mockReturnValue(true);
  
        const results = FileUtil.checkFile(
          './file1'
        );
        global.expect(results).toBe(expected);

        //-- we are not actually calling file, but the mock
        global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(1);

        const call = fsExtra.existsSync.mock.calls[0][0];
        global.expect(call).toContain('file1');
      });

      global.it('and file does not exist', () => {
        //-- use actual path.resolve to make life easier
        //-- but makes expected hard to use
        // const expected = null;
        fsExtra.existsSync.mockReturnValue(false);
  
        const results = FileUtil.checkFile(
          './file1'
        );
        global.expect(results).toBeTruthy();
        global.expect(Array.isArray(results)).toBe(true);
        global.expect(results.length).toBe(1);
        global.expect(results[0]).toContain('file1');
        
        //-- we are not actually calling file, but the mock
        global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(1);

        const call = fsExtra.existsSync.mock.calls[0][0];
        global.expect(call).toContain('file1');
      });
    });
    global.describe('with file array', () => {
      global.it('and file exists', () => {
        const expected = null;

        fsExtra.existsSync.mockReturnValue(true);
  
        const results = FileUtil.checkFile(
          ['./file1']
        );
        global.expect(results).toBe(expected);

        //-- we are not actually calling file, but the mock
        global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(1);

        const call = fsExtra.existsSync.mock.calls[0][0];
        global.expect(call).toContain('file1');
      });

      global.it('and file does not exist', () => {
        //-- use actual path.resolve to make life easier
        //-- but makes expected hard to use
        // const expected = null;
        fsExtra.existsSync.mockReturnValue(false);
  
        const results = FileUtil.checkFile(
          ['./file1']
        );
        global.expect(results).toBeTruthy();
        global.expect(Array.isArray(results)).toBe(true);
        global.expect(results.length).toBe(1);
        global.expect(results[0]).toContain('file1');
        
        //-- we are not actually calling file, but the mock
        global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(1);

        const call = fsExtra.existsSync.mock.calls[0][0];
        global.expect(call).toContain('file1');
      });
    });
    global.describe('with multiple arguments', () => {
      global.describe('and file exists', () => {
        global.it('with separate arguments', () => {
          //-- use actual path.resolve to make life easier
          //-- but makes expected hard to use
          // const expected = null;
  
          fsExtra.existsSync
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true);
    
          const results = FileUtil.checkFile(
            './file1',
            './file2'
          );
          global.expect(results).toBe(null);

          global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(2);

          let call;
          call = fsExtra.existsSync.mock.calls[0][0];
          global.expect(call).toContain('/file1');
          call = fsExtra.existsSync.mock.calls[1][0];
          global.expect(call).toContain('/file2');
        });
        global.it('with array', () => {
          //-- use actual path.resolve to make life easier
          //-- but makes expected hard to use
          // const expected = null;
  
          fsExtra.existsSync
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true);
    
          const results = FileUtil.checkFile([
            './file1',
            './file2'
          ]);
          global.expect(results).toBe(null);

          global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(2);

          let call;
          call = fsExtra.existsSync.mock.calls[0][0];
          global.expect(call).toContain('/file1');
          call = fsExtra.existsSync.mock.calls[1][0];
          global.expect(call).toContain('/file2');
        });
      });

      global.describe('and file does not exist', () => {
        global.it('with separate arguments', () => {
          //-- use actual path.resolve to make life easier
          //-- but makes expected hard to use
          // const expected = null;
  
          fsExtra.existsSync
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false);
    
          const results = FileUtil.checkFile(
            './file1',
            './file2'
          );
  
          global.expect(results).toBeTruthy();
          global.expect(Array.isArray(results)).toBe(true);
          global.expect(results.length).toBe(2);
  
          // global.expect(results[0]).toBe(null);
          global.expect(results[0]).toBeFalsy();
          global.expect(results[1]).toContain('/file2');
  
          //-- check existsSync
          global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(2);
          global.expect(fsExtra.existsSync.mock.calls[0][0]).toContain('/file1');
          global.expect(fsExtra.existsSync.mock.calls[1][0]).toContain('/file2');
        });
        global.it('as array of arguments', () => {
          //-- use actual path.resolve to make life easier
          //-- but makes expected hard to use
          // const expected = null;
  
          fsExtra.existsSync
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false);
    
          const results = FileUtil.checkFile([
            './file1',
            './file2'
          ]);
  
          global.expect(results).toBeTruthy();
          global.expect(Array.isArray(results)).toBe(true);
          global.expect(results.length).toBe(2);
  
          // global.expect(results[0]).toBe(null);
          global.expect(results[0]).toBeFalsy();
          global.expect(results[1]).toContain('/file2');
  
          //-- check existsSync
          global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(2);
          global.expect(fsExtra.existsSync.mock.calls[0][0]).toContain('/file1');
          global.expect(fsExtra.existsSync.mock.calls[1][0]).toContain('/file2');
        });
      });
    });
  });

  global.describe('checkFiles', () => {
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
    global.describe('with no files passed', () => {
      global.it('fails if null is passed', () => {
        global.expect(() => FileUtil.checkFile(null)).toThrow();
      });
      global.it('fails if null is passed with other valid arguments', () => {
        fsExtra.existsSync.mockReturnValue(true);
        global.expect(() => FileUtil.checkFile('./testFile', null)).toThrow();
      });
      global.it('returns null if no arguments passed', () => {
        const expected = null;
        const results = FileUtil.checkFile();
        global.expect(results).toBe(expected);
      });
      global.it('returns null if empty array passed in first argument', () => {
        const expected = null;
        const results = FileUtil.checkFile([]);
        global.expect(results).toBe(expected);
      });
    });
    global.it('and file exists', () => {
      const expected = true;

      fsExtra.existsSync.mockReturnValue(true);

      const results = FileUtil.fileExists(
        './file1'
      );
      global.expect(results).toBe(expected);

      //-- we are not actually calling file, but the mock
      global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(1);

      const call = fsExtra.existsSync.mock.calls[0][0];
      global.expect(call).toContain('file1');
    });

    global.it('and file does not exist', () => {
      //-- use actual path.resolve to make life easier
      //-- but makes expected hard to use
      // const expected = null;
      fsExtra.existsSync.mockReturnValue(false);

      const expected = false;

      const results = FileUtil.fileExists(
        './file1'
      );
      global.expect(results).toBe(expected);
      
      //-- we are not actually calling file, but the mock
      global.expect(fsExtra.existsSync).toHaveBeenCalledTimes(1);

      const call = fsExtra.existsSync.mock.calls[0][0];
      global.expect(call).toContain('file1');
    });
  });

  global.describe('cacheSerialize deserialize', () => {
    global.it('can serialize an object with a date', () => {
      const numberValue = 25;
      const strValue = 'cuca';
      const dateValue = new Date('2025-01-01T00:00:00.000Z');
      const data = ({
        date: dateValue,
        dateButNot: dateValue,
        value: numberValue,
        str: strValue
      });
      const jsonStr = JSON.stringify(data, null, 0);
      
      //const parsed = JSON.parse(jsonStr);
      const parsed = JSON.parse(jsonStr, FileUtil.cacheDeserializer);

      global.expect(typeof parsed.date).toBe('object');
      global.expect(typeof parsed.dateButNot).toBe('string');

      global.expect(parsed.date).toStrictEqual(dateValue);
      global.expect(parsed.dateButNot).toStrictEqual(dateValue.toISOString());

      global.expect(parsed.value).toStrictEqual(numberValue);
      global.expect(parsed.str).toStrictEqual(strValue);
    });
  });

  global.describe('useCache', () => {
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
        const shouldWrite = false;
        const cachePath = './tmp';
        const cacheFile = 'sampleFile';
        const expensiveFn = jest.fn(() => '{ "success": true }');
        
        fsExtra.existsSync.mockReturnValue(true);
        fsExtra.readJsonSync.mockReturnValue({ success: true });
  
        const expected = { success: true };
        const results = FileUtil.useCache(shouldWrite, cachePath, cacheFile, expensiveFn);
  
        global.expect(results).toStrictEqual(expected);
      });
      global.it('reads a json a date in it', () => {
        const shouldWrite = false;
        const cachePath = './tmp';
        const cacheFile = 'sampleFile';
        const expensiveFn = jest.fn(() => '{ "success": true }');

        const dateValue = new Date('2025-01-01T00:00:00.000Z');
        const data = ({
          date: dateValue,
          series: 'a'
        });
        const dataJSON = JSON.stringify(data, null, 0);
        const parsedJSON = JSON.parse(dataJSON, FileUtil.cacheDeserializer);
        
        fsExtra.existsSync.mockReturnValue(true);
        fsExtra.readJsonSync.mockReturnValue(parsedJSON);
  
        const expected = data;
        const results = FileUtil.useCache(shouldWrite, cachePath, cacheFile, expensiveFn);
  
        global.expect(results).toStrictEqual(expected);
      });
    });
    global.describe('writeJSON', () => {
      global.it('writes to the cache', () => {
        const shouldWrite = true;
        const cachePath = './tmp';
        const cacheFile = 'sampleFile';

        const dateValue = new Date('2025-01-01T00:00:00.000Z');
        const expensiveResults = { success: true, date: dateValue };
        const expensiveResultsStr = JSON.stringify(expensiveResults, null, 2);
        const expensiveFn = jest.fn(() => expensiveResults);

        fsExtra.writeFileSync.mockReturnValue(true);

        const cacheResults = FileUtil.useCache(shouldWrite, cachePath, cacheFile, expensiveFn);
        // FileUtil.writeJSON(path, message);

        global.expect(cacheResults).toStrictEqual(expensiveResults);

        const result = fsExtra.writeFileSync.mock.calls[0][1];
        global.expect(result).toBe(expensiveResultsStr);
      });
      global.it('writes to the cache without a trailing slash', () => {
        const shouldWrite = true;
        const cachePath = './tmp';
        const cacheFile = 'sampleFile';

        const dateValue = new Date('2025-01-01T00:00:00.000Z');
        const expensiveResults = { success: true, date: dateValue };
        const expensiveResultsStr = JSON.stringify(expensiveResults, null, 2);
        const expensiveFn = jest.fn(() => expensiveResults);

        fsExtra.writeFileSync.mockReturnValue(true);

        const cacheResults = FileUtil.useCache(shouldWrite, cachePath, cacheFile, expensiveFn);
        // FileUtil.writeJSON(path, message);

        global.expect(cacheResults).toStrictEqual(expensiveResults);

        const result = fsExtra.writeFileSync.mock.calls[0][1];
        global.expect(result).toBe(expensiveResultsStr);
      });
      global.it('writes to the cache with a trailing slash', () => {
        const shouldWrite = true;
        const cachePath = './tmp/';
        const cacheFile = 'sampleFile';

        const dateValue = new Date('2025-01-01T00:00:00.000Z');
        const expensiveResults = { success: true, date: dateValue };
        const expensiveResultsStr = JSON.stringify(expensiveResults, null, 2);
        const expensiveFn = jest.fn(() => expensiveResults);

        fsExtra.writeFileSync.mockReturnValue(true);

        const cacheResults = FileUtil.useCache(shouldWrite, cachePath, cacheFile, expensiveFn);
        // FileUtil.writeJSON(path, message);

        global.expect(cacheResults).toStrictEqual(expensiveResults);

        const result = fsExtra.writeFileSync.mock.calls[0][1];
        global.expect(result).toBe(expensiveResultsStr);
      });
    });
  });
});
