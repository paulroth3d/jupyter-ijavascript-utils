/**
 * tests just for testing the html script
 **/

/* eslint-disable quotes */

const IJSUtils = require('../ijs');

// const FileUtils = require('../file');

const removeIJSContext = () => {
  delete global.$$;
};

const createNewDisplay = (name) => {
  const valueFn = (value) => `display:${name}:${(value)}`;
  const newDisplay = ({
    async: () => {},
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

global.describe('codeBlockHelper', () => {
  // const ORIGINAL_CONSOLE = global.console;

  global.beforeEach(() => {
    prepareIJSContext();
  });
  global.afterEach(() => {
    removeIJSContext();
  });
  global.afterAll(() => {
    prepareIJSContext();
  });
  
  global.describe('htmlScript', () => {
    global.it('expect we are in the ijs context', () => {
      const context = IJSUtils.detectContext();
      global.expect(context).toBeTruthy();
    });

    //-- #     #     #     #     #     #     #     #     #
    //-- code check
    //-- #     #     #     #     #     #     #     #     #

    global.it('can render with a happy path couple scripts', () => {
      const options = {
        scripts: [
          'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
          'https://unpkg.com/leaflet-providers@1.1.0/leaflet-providers.js'
        ],
        css: [
          'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css'
        ],
        width: 600,
        height: 700,
        debug: true,
        console: true,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('startupScript');`
      };

      const results = IJSUtils.htmlScript(options);

      const expected = `<html><body>
  <div uuid="7e1e94f5-934e-49e9-8769-43989c877b43" style="width:600px; height: 700px"></div>
  <div scriptUUID="7e1e94f5-934e-49e9-8769-43989c877b43" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('7e1e94f5-934e-49e9-8769-43989c877b43', {
      scriptIndex: -1,
      scriptsToLoad: ["https://unpkg.com/leaflet@1.6.0/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.1.0/leaflet-providers.js"],
      onReady: (rootUUID) => {
        console.log('IJSUtils.htmlScript:' + rootUUID + ' starting render');

        debugger;

        const rootEl = document.querySelector('div[uuid="7e1e94f5-934e-49e9-8769-43989c877b43"]');

        const options = {
          uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
          width: '600px',
          height: '700px',
          scripts: ["https://unpkg.com/leaflet@1.6.0/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.1.0/leaflet-providers.js"],
          css: ["https://unpkg.com/leaflet@1.6.0/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.1.0/leaflet-providers.js"],
        };

        const animate = function (requestAnimationFrameTarget) {
          requestAnimationFrame((...passThroughArgs) => {
            if (!document.contains(rootEl)) {
              console.log('old animation stopping. rootEl has been removed from DOM');
              return;
            }
            requestAnimationFrameTarget.apply(globalThis, passThroughArgs);
          })
        }

        //-- ijsUtils.htmlScipt options.data
        const data = undefined;

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};

        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        console.log('startupScript');
        //-- ijsUtils.htmlScript options.onRender end

        console.log('IJSUtils.htmlScript:' + rootUUID + ' ending render');
      }
    });

    //-- script tags created dynamically have race conditions, load sequentially
    function externalScriptLoaded(rootUUID) {
      const result = globalThis.uuidCountdown.get(rootUUID);
      result.scriptIndex += 1;
      if (result.scriptIndex >= result.scriptsToLoad.length) {
        result.onReady(rootUUID);
        globalThis.uuidCountdown.delete(rootUUID);
      } else {
        const newScript = document.createElement('script');
        newScript.src = result.scriptsToLoad[result.scriptIndex];
        newScript.crossorigin='';
        newScript.uuid=rootUUID;
        newScript.onload = () => externalScriptLoaded(rootUUID);

        const scriptRoot = document.querySelector('div[scriptUUID="' + rootUUID + '"]');
        scriptRoot.append(newScript);
      }
    }

    externalScriptLoaded('7e1e94f5-934e-49e9-8769-43989c877b43');
  </script>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  crossorigin=""
  uuid="7e1e94f5-934e-49e9-8769-43989c877b43"
/>
</body></html>
`;

      // FileUtils.writeFileStd('./tmp/tmp', results);

      global.expect(results).toStrictEqual(expected);
    });

    global.it('can width and height set explicitly through strings', () => {
      const options = {
        scripts: [
          'https://unpkg.com/leaflet@1.6.0/dist/leaflet.js',
          'https://unpkg.com/leaflet-providers@1.1.0/leaflet-providers.js'
        ],
        css: [
          'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css'
        ],
        width: "100%",
        height: "100%",
        debug: true,
        console: true,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('startupScript');`
      };

      const results = IJSUtils.htmlScript(options);

      const expected = `<html><body>
  <div uuid="7e1e94f5-934e-49e9-8769-43989c877b43" style="width:100%; height: 100%"></div>
  <div scriptUUID="7e1e94f5-934e-49e9-8769-43989c877b43" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('7e1e94f5-934e-49e9-8769-43989c877b43', {
      scriptIndex: -1,
      scriptsToLoad: ["https://unpkg.com/leaflet@1.6.0/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.1.0/leaflet-providers.js"],
      onReady: (rootUUID) => {
        console.log('IJSUtils.htmlScript:' + rootUUID + ' starting render');

        debugger;

        const rootEl = document.querySelector('div[uuid="7e1e94f5-934e-49e9-8769-43989c877b43"]');

        const options = {
          uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
          width: '100%',
          height: '100%',
          scripts: ["https://unpkg.com/leaflet@1.6.0/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.1.0/leaflet-providers.js"],
          css: ["https://unpkg.com/leaflet@1.6.0/dist/leaflet.js","https://unpkg.com/leaflet-providers@1.1.0/leaflet-providers.js"],
        };

        const animate = function (requestAnimationFrameTarget) {
          requestAnimationFrame((...passThroughArgs) => {
            if (!document.contains(rootEl)) {
              console.log('old animation stopping. rootEl has been removed from DOM');
              return;
            }
            requestAnimationFrameTarget.apply(globalThis, passThroughArgs);
          })
        }

        //-- ijsUtils.htmlScipt options.data
        const data = undefined;

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};

        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        console.log('startupScript');
        //-- ijsUtils.htmlScript options.onRender end

        console.log('IJSUtils.htmlScript:' + rootUUID + ' ending render');
      }
    });

    //-- script tags created dynamically have race conditions, load sequentially
    function externalScriptLoaded(rootUUID) {
      const result = globalThis.uuidCountdown.get(rootUUID);
      result.scriptIndex += 1;
      if (result.scriptIndex >= result.scriptsToLoad.length) {
        result.onReady(rootUUID);
        globalThis.uuidCountdown.delete(rootUUID);
      } else {
        const newScript = document.createElement('script');
        newScript.src = result.scriptsToLoad[result.scriptIndex];
        newScript.crossorigin='';
        newScript.uuid=rootUUID;
        newScript.onload = () => externalScriptLoaded(rootUUID);

        const scriptRoot = document.querySelector('div[scriptUUID="' + rootUUID + '"]');
        scriptRoot.append(newScript);
      }
    }

    externalScriptLoaded('7e1e94f5-934e-49e9-8769-43989c877b43');
  </script>

<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  crossorigin=""
  uuid="7e1e94f5-934e-49e9-8769-43989c877b43"
/>
</body></html>
`;

      // FileUtils.writeFileStd('./tmp/tmp', results);

      global.expect(results).toStrictEqual(expected);
    });

    global.it('can include a single script and CSS', () => {
      const options = {
        scripts: [
          'https://www.google.com/testScript1'
        ],
        css: [
          'https://www.google.com/testCSS1'
        ],
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('startupScript');`
      };

      const results = IJSUtils.htmlScript(options);

      const expected = `<html><body>
  <div uuid="7e1e94f5-934e-49e9-8769-43989c877b43" style="width:600px; height: 700px"></div>
  <div scriptUUID="7e1e94f5-934e-49e9-8769-43989c877b43" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('7e1e94f5-934e-49e9-8769-43989c877b43', {
      scriptIndex: -1,
      scriptsToLoad: ["https://www.google.com/testScript1"],
      onReady: (rootUUID) => {

        const rootEl = document.querySelector('div[uuid="7e1e94f5-934e-49e9-8769-43989c877b43"]');

        const options = {
          uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
          width: '600px',
          height: '700px',
          scripts: ["https://www.google.com/testScript1"],
          css: ["https://www.google.com/testScript1"],
        };

        const animate = function (requestAnimationFrameTarget) {
          requestAnimationFrame((...passThroughArgs) => {
            if (!document.contains(rootEl)) {
              console.log('old animation stopping. rootEl has been removed from DOM');
              return;
            }
            requestAnimationFrameTarget.apply(globalThis, passThroughArgs);
          })
        }

        //-- ijsUtils.htmlScipt options.data
        const data = undefined;

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};

        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        console.log('startupScript');
        //-- ijsUtils.htmlScript options.onRender end

      }
    });

    //-- script tags created dynamically have race conditions, load sequentially
    function externalScriptLoaded(rootUUID) {
      const result = globalThis.uuidCountdown.get(rootUUID);
      result.scriptIndex += 1;
      if (result.scriptIndex >= result.scriptsToLoad.length) {
        result.onReady(rootUUID);
        globalThis.uuidCountdown.delete(rootUUID);
      } else {
        const newScript = document.createElement('script');
        newScript.src = result.scriptsToLoad[result.scriptIndex];
        newScript.crossorigin='';
        newScript.uuid=rootUUID;
        newScript.onload = () => externalScriptLoaded(rootUUID);

        const scriptRoot = document.querySelector('div[scriptUUID="' + rootUUID + '"]');
        scriptRoot.append(newScript);
      }
    }

    externalScriptLoaded('7e1e94f5-934e-49e9-8769-43989c877b43');
  </script>

<link
  rel="stylesheet"
  href="https://www.google.com/testCSS1"
  crossorigin=""
  uuid="7e1e94f5-934e-49e9-8769-43989c877b43"
/>
</body></html>
`;

      // FileUtils.writeFileStd('./tmp/tmp', results);

      global.expect(results).toStrictEqual(expected);
    });

    global.it('can include multiple scripts and CSSs', () => {
      const options = {
        scripts: [
          'https://www.google.com/testScript1',
          'https://www.google.com/testScript2'
        ],
        css: [
          'https://www.google.com/testCSS1',
          'https://www.google.com/testCSS2'
        ],
        onReady: `console.log('startupScript');`,
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43'
      };

      const results = IJSUtils.htmlScript(options);

      const expected = `<html><body>
  <div uuid="7e1e94f5-934e-49e9-8769-43989c877b43" style="width:600px; height: 700px"></div>
  <div scriptUUID="7e1e94f5-934e-49e9-8769-43989c877b43" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('7e1e94f5-934e-49e9-8769-43989c877b43', {
      scriptIndex: -1,
      scriptsToLoad: ["https://www.google.com/testScript1","https://www.google.com/testScript2"],
      onReady: (rootUUID) => {

        const rootEl = document.querySelector('div[uuid="7e1e94f5-934e-49e9-8769-43989c877b43"]');

        const options = {
          uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
          width: '600px',
          height: '700px',
          scripts: ["https://www.google.com/testScript1","https://www.google.com/testScript2"],
          css: ["https://www.google.com/testScript1","https://www.google.com/testScript2"],
        };

        const animate = function (requestAnimationFrameTarget) {
          requestAnimationFrame((...passThroughArgs) => {
            if (!document.contains(rootEl)) {
              console.log('old animation stopping. rootEl has been removed from DOM');
              return;
            }
            requestAnimationFrameTarget.apply(globalThis, passThroughArgs);
          })
        }

        //-- ijsUtils.htmlScipt options.data
        const data = undefined;

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};

        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        console.log('startupScript');
        //-- ijsUtils.htmlScript options.onRender end

      }
    });

    //-- script tags created dynamically have race conditions, load sequentially
    function externalScriptLoaded(rootUUID) {
      const result = globalThis.uuidCountdown.get(rootUUID);
      result.scriptIndex += 1;
      if (result.scriptIndex >= result.scriptsToLoad.length) {
        result.onReady(rootUUID);
        globalThis.uuidCountdown.delete(rootUUID);
      } else {
        const newScript = document.createElement('script');
        newScript.src = result.scriptsToLoad[result.scriptIndex];
        newScript.crossorigin='';
        newScript.uuid=rootUUID;
        newScript.onload = () => externalScriptLoaded(rootUUID);

        const scriptRoot = document.querySelector('div[scriptUUID="' + rootUUID + '"]');
        scriptRoot.append(newScript);
      }
    }

    externalScriptLoaded('7e1e94f5-934e-49e9-8769-43989c877b43');
  </script>

<link
  rel="stylesheet"
  href="https://www.google.com/testCSS1"
  crossorigin=""
  uuid="7e1e94f5-934e-49e9-8769-43989c877b43"
/>

<link
  rel="stylesheet"
  href="https://www.google.com/testCSS2"
  crossorigin=""
  uuid="7e1e94f5-934e-49e9-8769-43989c877b43"
/>
</body></html>
`;

      // FileUtils.writeFileStd('./tmp/tmp', results);

      global.expect(results).toStrictEqual(expected);
    });

    global.it('can include html', () => {
      const options = {
        html: '<svg />',
        onReady: `console.log('startupScript');`,
        width: 500,
        height: 500,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43'
      };

      const results = IJSUtils.htmlScript(options);

      const expected = `<html><body>
  <div uuid="7e1e94f5-934e-49e9-8769-43989c877b43" style="width:500px; height: 500px"><svg /></div>
  <div scriptUUID="7e1e94f5-934e-49e9-8769-43989c877b43" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('7e1e94f5-934e-49e9-8769-43989c877b43', {
      scriptIndex: -1,
      scriptsToLoad: [],
      onReady: (rootUUID) => {

        const rootEl = document.querySelector('div[uuid="7e1e94f5-934e-49e9-8769-43989c877b43"]');

        const options = {
          uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
          width: '500px',
          height: '500px',
          scripts: [],
          css: [],
        };

        const animate = function (requestAnimationFrameTarget) {
          requestAnimationFrame((...passThroughArgs) => {
            if (!document.contains(rootEl)) {
              console.log('old animation stopping. rootEl has been removed from DOM');
              return;
            }
            requestAnimationFrameTarget.apply(globalThis, passThroughArgs);
          })
        }

        //-- ijsUtils.htmlScipt options.data
        const data = undefined;

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};

        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        console.log('startupScript');
        //-- ijsUtils.htmlScript options.onRender end

      }
    });

    //-- script tags created dynamically have race conditions, load sequentially
    function externalScriptLoaded(rootUUID) {
      const result = globalThis.uuidCountdown.get(rootUUID);
      result.scriptIndex += 1;
      if (result.scriptIndex >= result.scriptsToLoad.length) {
        result.onReady(rootUUID);
        globalThis.uuidCountdown.delete(rootUUID);
      } else {
        const newScript = document.createElement('script');
        newScript.src = result.scriptsToLoad[result.scriptIndex];
        newScript.crossorigin='';
        newScript.uuid=rootUUID;
        newScript.onload = () => externalScriptLoaded(rootUUID);

        const scriptRoot = document.querySelector('div[scriptUUID="' + rootUUID + '"]');
        scriptRoot.append(newScript);
      }
    }

    externalScriptLoaded('7e1e94f5-934e-49e9-8769-43989c877b43');
  </script>

</body></html>
`;

      // FileUtils.writeFileStd('./tmp/tmp', results);

      global.expect(results).toStrictEqual(expected);
    });

    global.it('can include a startup function', () => {
      const options = {
        scripts: ['testScript1'],
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        utilityFunctions: null,
        onReady: (obj) => {
          console.log('loaded');
        }
      };

      const results = IJSUtils.htmlScript(options);
      const expected = `<html><body>
  <div uuid="7e1e94f5-934e-49e9-8769-43989c877b43" style="width:600px; height: 700px"></div>
  <div scriptUUID="7e1e94f5-934e-49e9-8769-43989c877b43" ></div>
  <script>
    if (typeof globalThis.uuidCountdown === 'undefined') {
      globalThis.uuidCountdown = new Map();
    }

    globalThis.uuidCountdown.set('7e1e94f5-934e-49e9-8769-43989c877b43', {
      scriptIndex: -1,
      scriptsToLoad: ["testScript1"],
      onReady: (rootUUID) => {

        const rootEl = document.querySelector('div[uuid="7e1e94f5-934e-49e9-8769-43989c877b43"]');

        const options = {
          uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
          width: '600px',
          height: '700px',
          scripts: ["testScript1"],
          css: ["testScript1"],
        };

        const animate = function (requestAnimationFrameTarget) {
          requestAnimationFrame((...passThroughArgs) => {
            if (!document.contains(rootEl)) {
              console.log('old animation stopping. rootEl has been removed from DOM');
              return;
            }
            requestAnimationFrameTarget.apply(globalThis, passThroughArgs);
          })
        }

        //-- ijsUtils.htmlScipt options.data
        const data = undefined;

        //-- ijsUtils.htmlScript options.utilityFunctions start
        const utilityFunctions = {};

        //-- ijsUtils.htmlScript options.utiiltyFunctions end

        //-- ijsUtils.htmlScript options.onRender start
        (obj => {
          console.log('loaded');
        })({rootEl, data, utilityFunctions, options, animate})
        //-- ijsUtils.htmlScript options.onRender end

      }
    });

    //-- script tags created dynamically have race conditions, load sequentially
    function externalScriptLoaded(rootUUID) {
      const result = globalThis.uuidCountdown.get(rootUUID);
      result.scriptIndex += 1;
      if (result.scriptIndex >= result.scriptsToLoad.length) {
        result.onReady(rootUUID);
        globalThis.uuidCountdown.delete(rootUUID);
      } else {
        const newScript = document.createElement('script');
        newScript.src = result.scriptsToLoad[result.scriptIndex];
        newScript.crossorigin='';
        newScript.uuid=rootUUID;
        newScript.onload = () => externalScriptLoaded(rootUUID);

        const scriptRoot = document.querySelector('div[scriptUUID="' + rootUUID + '"]');
        scriptRoot.append(newScript);
      }
    }

    externalScriptLoaded('7e1e94f5-934e-49e9-8769-43989c877b43');
  </script>

</body></html>
`;

      // FileUtils.writeFileStd('./tmp/tmp', results);

      global.expect(results).toStrictEqual(expected);
    });

    global.it('can include a startup function', () => {
      const options = {
        scripts: ['testScript1'],
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        utilityFunctions: {
          add: function add(a, b) { return a + b; },
          subtract: function subtract(a, b) { return a - b; }
        },
        onReady: (obj) => {
          console.log('loaded');
        }
      };

      const results = IJSUtils.htmlScript(options);

      // FileUtils.writeFileStd('./tmp/tmp', results);

      // global.expect(results).toStrictEqual(expected);
      global.expect(results).toContain(`const utilityFunctions = {};`);
      global.expect(results).toContain(`utilityFunctions.add = function add(a, b)`);
      global.expect(results).toContain(`return a + b;`);
      global.expect(results).toContain(`utilityFunctions.subtract = function subtract(a, b)`);
      global.expect(results).toContain(`return a - b;`);
    });

    //-- #     #     #     #     #     #     #     #     #
    //-- section checks
    //-- #     #     #     #     #     #     #     #     #

    global.it('can include a debugger string', () => {
      const options = {
        scripts: ['testScript1'],
        onReady: `console.log('testDebugger');`,
        width: 600,
        height: 700,
        debug: true,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43'
      };

      const results = IJSUtils.htmlScript(options);

      global.expect(results).toContain('debugger;');
      global.expect(results).not.toContain(`console.log('IJSUtils.htmlScript:`);

      // FileUtils.writeFileStd('./tmp/tmp', results);
    });
    global.it('can include a console string', () => {
      const options = {
        scripts: ['testScript1'],
        onReady: `console.log('startupScript');`,
        width: 600,
        height: 700,
        debug: false,
        console: true,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43'
      };

      const results = IJSUtils.htmlScript(options);

      global.expect(results).not.toContain('debugger;');
      global.expect(results).toContain(`console.log('IJSUtils.htmlScript:`);
      
      // FileUtils.writeFileStd('./tmp/tmp', results);
    });
    global.it('can include a startup script', () => {
      const options = {
        scripts: ['testScript1'],
        onReady: `console.log('test startup script')`,
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43'
      };

      const results = IJSUtils.htmlScript(options);

      global.expect(results).not.toContain('debugger;');
      global.expect(results).not.toContain(`console.log('IJSUtils.htmlScript:`);
      global.expect(results).toContain(`console.log('test startup script')`);

      // FileUtils.writeFileStd('./tmp/tmp', results);
    });

    //-- #     #     #     #     #     #     #     #     #
    //-- failure checks
    //-- #     #     #     #     #     #     #     #     #

    global.it('can run without error if there is no uuid sent', () => {
      const options = {
        scripts: ['testScript'],
        onReady: `console.log('startupScript');`
      };

      const results = IJSUtils.htmlScript(options);

      global.expect(results).toBeTruthy();
    });

    global.it('works fine with these settings', () => {
      const options = {
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('test startup script')`
      };

      global.expect(
        () => IJSUtils.htmlScript(options)
      ).not.toThrow();
    });

    global.it('throws an error if not in ijs context', () => {
      removeIJSContext();

      const options = {
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('test startup script')`
      };

      const expectedError = 'ijsUtils.htmlScript: Must be in iJavaScript context to render html';

      global.expect(
        () => IJSUtils.htmlScript(options)
      ).toThrow(expectedError);
    });
    
    global.it('throws an error if on ready is not a function or a string', () => {
      const options = {
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: true
      };

      const expectedError = 'ijsUtils.htmlScript: onReadyCode must be a string or function';

      global.expect(
        () => IJSUtils.htmlScript(options)
      ).toThrow(expectedError);
    });

    global.it('throws an error if no external scripts are requested', () => {
      const options = null;

      const expectedError = 'ijsUtils.htmlScript: onReadyCode is required';

      global.expect(
        () => IJSUtils.htmlScript(options)
      ).toThrow(expectedError);
    });

    global.it('throws an error if no external scripts are requested', () => {
      const options = {
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        scripts: ['https://www.google.com/testScript1'],
        onReady: null
      };
      const expectedError = 'ijsUtils.htmlScript: onReadyCode is required';

      global.expect(
        () => IJSUtils.htmlScript(options)
      ).toThrow(expectedError);
    });

    global.it('throws an error options sent are not accepted', () => {
      const options = {
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('test startup script')`,
        js: ['https://www.google.com/testScript1']
      };
      const expectedError = 'ijsUtils.htmlScript: invalid options:'
        + ' js, must be within: debug, console, width, height, uuid, scripts, css, html, data, onReady, utilityFunctions';

      global.expect(() => IJSUtils.htmlScript(options)).toThrow(expectedError);
    });

    global.it('throws an if utility functions are not passed as an object', () => {
      const options = {
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('test startup script')`,
        utilityFunctions: () => {}
      };

      const expectedError = 'ijsUtils.htmlScript: utilityFunctions is an object that has only functions';

      global.expect(
        () => IJSUtils.htmlScript(options)
      ).toThrow(expectedError);
    });

    global.it('does not throw an if utility functions are passed as an empty object', () => {
      const options = {
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('test startup script')`,
        utilityFunctions: {}
      };

      global.expect(
        () => IJSUtils.htmlScript(options)
      ).not.toThrow();
    });

    global.it('throws an if utility functions are not null', () => {
      const options = {
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('test startup script')`,
        utilityFunctions: undefined
      };

      global.expect(
        () => IJSUtils.htmlScript(options)
      ).not.toThrow();
    });

    global.it('throws an if utility functions are not passed as an object with functions', () => {
      const options = {
        width: 600,
        height: 700,
        debug: false,
        console: false,
        uuid: '7e1e94f5-934e-49e9-8769-43989c877b43',
        onReady: `console.log('test startup script')`,
        utilityFunctions: {
          first: 'john'
        }
      };

      const expectedError = 'ijsUtils.htmlScript: utilityFunctions must have only functions:first';

      global.expect(
        () => IJSUtils.htmlScript(options)
      ).toThrow(expectedError);
    });
  });
});
