const nodeFetch = require('node-fetch');

const PlantUML = require('../plantuml');
const IJSUtils = require('../ijs');

const {
  removeIJSContext,
  prepareIJSContext,
  mockConsole,
  removeConsoleMock
} = require('../__testHelper__/ijsContext');

global.describe('PlantUML', () => {
  global.beforeEach(() => {
    PlantUML.reset();
  });

  global.describe('defaults', () => {
    global.it('has default format', () => {
      global.expect(PlantUML.getDefaultFormat()).toBe('svg');
    });
    global.it('has default prootocol', () => {
      global.expect(PlantUML.protocol).toBe('http://');
    });
    global.it('has default host', () => {
      global.expect(PlantUML.host).toBe('localhost:8080');
    });

    global.it('can set the default format to png', () => {
      const newFormat = 'png';
      PlantUML.setDefaultFormat(newFormat);
      const result = PlantUML.getDefaultFormat();
      global.expect(result).toBe(newFormat);
    });
    global.it('can set the default format to png', () => {
      const newFormat = 'svg';
      PlantUML.setDefaultFormat(newFormat);
      const result = PlantUML.getDefaultFormat();
      global.expect(result).toBe(newFormat);
    });
    global.it('can change the default format', () => {
      const initialFormat = PlantUML.getDefaultFormat();
      const newFormat = 'png';
      
      global.expect(newFormat).not.toBe(initialFormat);

      PlantUML.setDefaultFormat(newFormat);

      const result = PlantUML.getDefaultFormat();

      global.expect(result).not.toBe(initialFormat);
    });
    global.it('fails to set default format if invalid', () => {
      const error = 'Unexpected PlantUML format:vitamin. Expected are: svg, png';
      const invalid = 'vitamin';
      global.expect(
        () => PlantUML.setDefaultFormat(invalid)
      ).toThrow(error);
    });
  });

  global.describe('can generate a URL', () => {
    global.it('with options', () => {
      const plantUMLText = 'Some Plant UML Text';
      const options = {
        format: 'png'
      };
      PlantUML.setDefaultFormat('svg');
      PlantUML.protocol = 'https://';
      PlantUML.host = 'www.plantumlServer.com';
      const expected = 'https://www.plantumlServer.com/plantuml/png/2yxFJLK8o4dCAr48zVLH24cjA040';
      const result = PlantUML.generateURL(plantUMLText, options);
      global.expect(result).toBe(expected);
    });

    global.it('with png', () => {
      const plantUMLText = 'Some Plant UML Text';
      const options = {
        format: 'png'
      };
      const expected = 'http://localhost:8080/plantuml/png/2yxFJLK8o4dCAr48zVLH24cjA040';
      const result = PlantUML.generateURL(plantUMLText, options);
      global.expect(result).toBe(expected);
    });
    global.it('with svg', () => {
      const plantUMLText = 'Some Plant UML Text';
      const options = {
        format: 'svg'
      };
      const expected = 'http://localhost:8080/plantuml/svg/2yxFJLK8o4dCAr48zVLH24cjA040';
      const result = PlantUML.generateURL(plantUMLText, options);
      global.expect(result).toBe(expected);
    });
    global.it('but throw an error with an invalid format', () => {
      const plantUMLText = 'Some Plant UML Text';
      const options = {
        format: 'vitamin'
      };
      PlantUML.setDefaultFormat('svg');
      PlantUML.protocol = 'https://';
      PlantUML.host = 'www.plantumlServer.com';

      const error = 'Unexpected PlantUML format:vitamin. Expected are: svg, png';
      global.expect(
        () => PlantUML.generateURL(plantUMLText, options)
      ).toThrow(error);
    });

    global.it('without options', () => {
      const plantUMLText = 'Some Plant UML Text';
      PlantUML.setDefaultFormat('svg');
      PlantUML.protocol = 'https://';
      PlantUML.host = 'www.plantumlServer.com';
      const expected = 'https://www.plantumlServer.com/plantuml/svg/2yxFJLK8o4dCAr48zVLH24cjA040';
      const result = PlantUML.generateURL(plantUMLText);
      global.expect(result).toBe(expected);
    });
    global.it('does not throw an error with empty plantuml text', () => {
      global.expect(
        () => PlantUML.generateURL()
      ).not.toThrow();
    });
  });

  global.describe('can render an image', () => {
    global.beforeEach(() => {
      prepareIJSContext();
      mockConsole();

      global.fetch = nodeFetch;
      nodeFetch.responseMock.reset();

      IJSUtils.await = jest.fn().mockImplementation(
        (fn) => fn(global.$$, global.console)
      );
    });
    global.afterAll(() => {
      removeIJSContext();
      removeConsoleMock();
    });
    global.it('is in ijs context by default', () => {
      global.expect(global.$$).toBeTruthy();
    });
    global.it('can be not in ijs context', () => {
      removeIJSContext();
      global.expect(global.$$).toBeUndefined();
    });
    global.it('can mock the console', () => {
      console.log('test');
      global.expect(global.console.log).toHaveBeenCalled();
    });
    global.it('as svg with options', (done) => {
      const plantUMLText = 'Some PlantUML Text';
      const options = {
        format: 'svg'
      };
      PlantUML.setDefaultFormat('svg');
      PlantUML.protocol = 'https://';
      PlantUML.host = 'www.plantumlServer.com';

      PlantUML.render(plantUMLText, options);

      //-- don't have access to the promise
      //-- need further thought here.
      // global.expect(global.$$.svg).toHaveBeenCalled();

      done();
    });
    global.it('as png with options', (done) => {
      const plantUMLText = 'Some PlantUML Text';
      const options = {
        format: 'png'
      };
      PlantUML.setDefaultFormat('svg');
      PlantUML.protocol = 'https://';
      PlantUML.host = 'www.plantumlServer.com';

      PlantUML.render(plantUMLText, options);

      //-- don't have access to the promise
      //-- need further thought here.
      // global.expect(global.$$.png).toHaveBeenCalled();

      done();
    });
    global.it('without options', (done) => {
      const plantUMLText = 'Some PlantUML Text';
      PlantUML.setDefaultFormat('svg');
      PlantUML.protocol = 'https://';
      PlantUML.host = 'www.plantumlServer.com';

      PlantUML.render(plantUMLText);

      //-- don't have access to the promise
      //-- need further thought here.
      // global.expect(global.$$.svg).toHaveBeenCalled();

      done();
    });

    global.it('sends console if using showURL', (done) => {
      const plantUMLText = 'Some PlantUML Text';
      const options = {
        format: 'svg',
        showURL: true
      };
      PlantUML.setDefaultFormat('svg');
      PlantUML.protocol = 'https://';
      PlantUML.host = 'www.plantumlServer.com';

      PlantUML.render(plantUMLText, options);

      //-- don't have access to the promise
      //-- need further thought here.
      // global.expect(global.$$.svg).toHaveBeenCalled();

      done();
    });
    global.it('sends console if using showURL', (done) => {
      const plantUMLText = 'Some PlantUML Text';
      const options = {
        format: 'svg',
        debug: true
      };
      PlantUML.setDefaultFormat('svg');
      PlantUML.protocol = 'https://';
      PlantUML.host = 'www.plantumlServer.com';

      PlantUML.render(plantUMLText, options);

      //-- don't have access to the promise
      //-- need further thought here.
      // global.expect(global.$$.svg).toHaveBeenCalled();

      done();
    });
  });
});
