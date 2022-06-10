/**
 * Helper for classes that need to mock being within the iJavaScript context
 */

const removeIJSContext = () => {
  delete global.$$;
};

const createNewDisplay = (name) => {
  const valueFn = jest.fn((value) => `display:${name}:${(value)}`);
  const newDisplay = ({
    async: valueFn,
    text: valueFn,
    png: valueFn,
    svg: valueFn,
    html: valueFn,
    jpg: valueFn,
    mime: valueFn,
    sendResults: valueFn
  });
  return newDisplay;
};

const prepareIJSContext = () => {
  const newContext = ({
    ...createNewDisplay(),
    createDisplay: createNewDisplay,
    sendResult: () => {}
  });
  global.$$ = newContext;

  // global.console = ({
  //   error: jest.fn(),
  //   log: jest.fn(),
  //   warn: jest.fn()
  // });
};

const originalConsole = global.console;
const mockConsole = () => {
  const consoleMock = ({
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    trace: jest.fn()
  });
  global.console = consoleMock;
};
const removeConsoleMock = () => {
  global.console = originalConsole;
};

module.exports = {
  removeIJSContext,
  createNewDisplay,
  prepareIJSContext,
  mockConsole,
  removeConsoleMock
};
