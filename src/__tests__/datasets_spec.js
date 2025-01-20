const datasets = require('vega-datasets');
const nodeFetch = require('node-fetch');

const DatasetUtils = require('../datasets');

global.describe('datasets', () => {
  global.beforeEach(() => {
    global.fetch = nodeFetch;
    datasets.reset();
    nodeFetch.responseMock.reset();
  });
  global.afterAll(() => {
  });
  global.describe('fetch', () => {
    global.it('can polyfill fetch', () => {
      delete global.fetch;
      global.expect(global.fetch).toBeUndefined();

      DatasetUtils.polyfillFetch();

      global.expect(global.fetch).toBeTruthy();
    });
    global.it('can ignore polyfill if fetch is found', () => {
      const beforeFetch = global.fetch;
      global.expect(global.fetch).toBeTruthy();

      DatasetUtils.polyfillFetch();

      global.expect(global.fetch).toBeTruthy();
      global.expect(global.fetch).toBe(beforeFetch);
    });
  });

  global.describe('list', () => {
    global.it('can find vega lite dataset', () => {
      const expected = ['movies.json'];
      const results = DatasetUtils.list();
      global.expect(results).toStrictEqual(expected);
    });
  });

  global.describe('fetch', () => {
    global.it('can fetch items in the list', () => {
      DatasetUtils.fetch('movies.json');
      
      global.expect(datasets['movies.json']).toHaveBeenCalled();
    });
    global.it('throws an error if the fetched item is not available', () => {
      try {
        DatasetUtils.fetch('somethingElse');
        global.jest.fail('Exception should be thrown, only movies.json is available in the mock');
      } catch (err) {
        //-- do nothing
      }
    });
  });

  global.describe('fetchJSON', () => {
    global.it('can fetch json', () => {
      const expected = { json: 'response' };
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      nodeFetch.responseMock.ok = true;
      nodeFetch.responseMock.json.mockReturnValue(expected);

      const results = DatasetUtils.fetchJSON(callURL, callOptions);

      global.expect(nodeFetch).toHaveBeenCalled();
      global.expect(nodeFetch.mock.calls[0][0]).toBe(callURL);
      global.expect(nodeFetch.mock.calls[0][1]).toBe(callOptions);

      global.expect(results).resolves.toStrictEqual(expected);
    });
    global.it('fetches and returns json', () => {
      const expected = { json: 'response' };
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      nodeFetch.responseMock.ok = true;
      nodeFetch.responseMock.json.mockReturnValue(expected);

      const results = DatasetUtils.fetchJSON(callURL, callOptions);

      global.expect(results).resolves.toStrictEqual(expected);
    });
    global.it('fetches and passes the target address and options along', () => {
      const expected = { json: 'response' };
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      nodeFetch.responseMock.ok = true;
      nodeFetch.responseMock.json.mockReturnValue(expected);

      DatasetUtils.fetchJSON(callURL, callOptions);

      global.expect(nodeFetch).toHaveBeenCalled();
      global.expect(nodeFetch.mock.calls[0][0]).toBe(callURL);
      global.expect(nodeFetch.mock.calls[0][1]).toStrictEqual(callOptions);
    });
    global.it('sends an empty options if options are not provided', () => {
      const expected = { json: 'response' };
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      nodeFetch.responseMock.ok = true;
      nodeFetch.responseMock.json.mockReturnValue(expected);

      DatasetUtils.fetchJSON(callURL);

      global.expect(nodeFetch).toHaveBeenCalled();
      global.expect(nodeFetch.mock.calls[0][0]).toBe(callURL);
      global.expect(nodeFetch.mock.calls[0][1]).toStrictEqual(callOptions);
    });
    global.it('throws an error if the response is not okay', async () => {
      const expected = { json: 'response' };
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      const expectedStatus = 'failure';
      nodeFetch.responseMock.ok = false;
      nodeFetch.responseMock.statusText = expectedStatus;
      nodeFetch.responseMock.json.mockReturnValue(expected);

      try {
        await global.expect(DatasetUtils.fetchJSON(callURL, callOptions)).rejects.toEqual(expectedStatus);
        global.jest.fail('exception should be thrown');
      } catch (err) {
        // do nothing
      }
    });
  });

  global.describe('fetchText', () => {
    global.it('can fetch text', () => {
      const expected = 'expected text';
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      nodeFetch.responseMock.ok = true;
      nodeFetch.responseMock.text.mockReturnValue(expected);

      const results = DatasetUtils.fetchText(callURL, callOptions);

      global.expect(nodeFetch).toHaveBeenCalled();
      global.expect(nodeFetch.mock.calls[0][0]).toBe(callURL);
      global.expect(nodeFetch.mock.calls[0][1]).toStrictEqual(callOptions);

      global.expect(results).resolves.toStrictEqual(expected);
    });
    global.it('fetches and returns json', () => {
      const expected = 'expected text';
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      nodeFetch.responseMock.ok = true;
      nodeFetch.responseMock.text.mockReturnValue(expected);

      const results = DatasetUtils.fetchText(callURL, callOptions);

      global.expect(results).resolves.toStrictEqual(expected);
    });
    global.it('fetches and passes the target address and options along', () => {
      const expected = 'expected text';
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      nodeFetch.responseMock.ok = true;
      nodeFetch.responseMock.json.mockReturnValue(expected);

      DatasetUtils.fetchText(callURL, callOptions);

      global.expect(nodeFetch).toHaveBeenCalled();
      global.expect(nodeFetch.mock.calls[0][0]).toBe(callURL);
      global.expect(nodeFetch.mock.calls[0][1]).toStrictEqual(callOptions);
    });
    global.it('defaults options if options are not passed', () => {
      const expected = 'expected text';
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      nodeFetch.responseMock.ok = true;
      nodeFetch.responseMock.json.mockReturnValue(expected);

      DatasetUtils.fetchText(callURL);

      global.expect(nodeFetch).toHaveBeenCalled();
      global.expect(nodeFetch.mock.calls[0][0]).toBe(callURL);
      global.expect(nodeFetch.mock.calls[0][1]).toStrictEqual(callOptions);
    });
    global.it('throws an error if the response is not okay', async () => {
      const expected = 'expected text';
      const callURL = 'https://www.google.com';
      const callOptions = { options: true };
      const expectedStatus = 'failure';
      nodeFetch.responseMock.ok = false;
      nodeFetch.responseMock.statusText = expectedStatus;
      nodeFetch.responseMock.json.mockReturnValue(expected);

      try {
        await global.expect(DatasetUtils.fetchText(callURL, callOptions)).rejects.toEqual(expectedStatus);
        global.jest.fail('exception should be thrown');
      } catch (err) {
        // do nothing
      }
    });
  });
});
